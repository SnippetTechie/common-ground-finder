import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Check, Calendar, MapPin, Users, HelpCircle, ArrowLeft } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [groupName, setGroupName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;

    const fetchData = async () => {
      try {
        // Fetch latest result
        const resSnap = await getDoc(doc(db, "groups", groupId, "results", "latest"));
        if (resSnap.exists()) {
          setResult(resSnap.data());
        }

        // Fetch group details
        const groupSnap = await getDoc(doc(db, "groups", groupId));
        if (groupSnap.exists()) {
          setGroupName(groupSnap.data().name || "Group Event");
        }
      } catch (error) {
        console.error("Error fetching confirmation data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Loading final details...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-destructive">Error loading confirmation details.</p>
      </div>
    );
  }

  const { bestOption } = result;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header variant="app" />

      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-2xl mx-auto px-4">

          {/* 1. Header & Status */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-6">
              <Check className="h-8 w-8" />
            </div>
            <h1 className="heading-display text-4xl mb-3">Decision Confirmed</h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              This plan has been finalized for <span className="text-foreground font-medium">{groupName}</span>.
            </p>
          </div>

          {/* 3. Finalized Plan Summary */}
          <div className="card-elevated p-8 mb-8 animate-slide-up bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Final Outcome</span>
            </div>

            <h2 className="font-serif text-3xl mb-6">{bestOption?.title}</h2>

            <div className="grid sm:grid-cols-2 gap-6 pb-6 border-b border-border/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wider font-medium">Date & Time</span>
                </div>
                <p className="font-medium text-lg">{bestOption?.day} {bestOption?.time} ({bestOption?.timeSlot})</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wider font-medium">Location</span>
                </div>
                <p className="font-medium text-lg">{bestOption?.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Fairness Score</p>
                <p className="text-xl font-serif text-primary">{bestOption?.fairnessScore} / 100</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Est. Attendance</p>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg font-medium">{bestOption?.attendees?.length || "High"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Explanation Section (Reused) */}
          <div className="mb-10 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-3 p-5 rounded-lg bg-muted/30 border border-border">
              <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-2">Why this was chosen</h3>
                {result?.explanation ? (
                  <>
                    <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-3 py-1 mb-2">
                      "{result.explanation}"
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 opacity-75">
                      <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400" />
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">AI-assisted explanation</span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    This option maximizes group overlap and balances location preferences effectively.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 5 & 6. Confirmation Statement & Actions */}
          <div className="text-center animate-slide-up" style={{ animationDelay: "200ms" }}>
            <p className="text-muted-foreground mb-8">
              The planning process for this group is now complete.
            </p>
            <Button variant="outline" size="lg" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Confirmation;
