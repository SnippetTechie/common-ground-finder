import { Participant, Result, Option } from './types';

export function solve(participants: Participant[]): Result {
    if (participants.length === 0) {
        throw new Error("No participants");
    }

    // 1. Calculate Topic Popularity
    const topicCounts: Record<string, number> = {};
    participants.forEach(p => {
        p.topics.forEach(t => {
            topicCounts[t] = (topicCounts[t] || 0) + 1;
        });
    });
    const sortedTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);
    const topTopic = sortedTopics.length > 0 ? sortedTopics[0][0] : "General Meetup";

    // 2. Calculate Availability Overlap
    // We check every slot (Mon AM, Mon PM, etc.)
    const slots = ["MON", "TUE", "WED", "THU", "FRI"];
    const periods = ["am", "pm"];

    let bestSlot = { day: "MON", period: "pm", count: -1, attendees: [] as string[] };
    const allOptions: Option[] = [];

    slots.forEach(day => {
        periods.forEach(period => {
            const attendees = participants.filter(p =>
                p.availability[day] && p.availability[day][period as "am" | "pm"]
            ).map(p => p.userId);

            const score = Math.round((attendees.length / participants.length) * 100);

            // Simple logic: Location is just the most common location of attendees
            // In a real app, we'd calculate centroid.
            const locCounts: Record<string, number> = {};
            attendees.forEach(uid => {
                const p = participants.find(x => x.userId === uid);
                if (p) locCounts[p.location] = (locCounts[p.location] || 0) + 1;
            });
            const topLoc = Object.entries(locCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Online";

            const option: Option = {
                title: `${topTopic} Session`,
                description: `A session focused on ${topTopic}, maximizing attendance.`,
                day,
                time: period.toUpperCase(),
                location: topLoc,
                score,
                fairnessScore: 90, // Placeholder for complex fairness math
                attendees,
                pros: [`${attendees.length}/${participants.length} Available`],
                cons: []
            };

            allOptions.push(option);

            if (attendees.length > bestSlot.count) {
                bestSlot = { day, period, count: attendees.length, attendees };
            }
        });
    });

    // Sort options by score
    allOptions.sort((a, b) => b.score - a.score);

    const bestOption = allOptions[0];
    const alternatives = allOptions.slice(1, 4);

    return {
        bestOption,
        alternatives,
        computedAt: new Date(),
        fairnessScore: bestOption.fairnessScore
    };
}
