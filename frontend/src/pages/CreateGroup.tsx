import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/layout/Header";
import { Copy, Check, ArrowRight, X, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [subtopics, setSubtopics] = useState<string[]>([]);
  const [newSubtopic, setNewSubtopic] = useState("");

  const [isCreated, setIsCreated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [groupId, setGroupId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Protect route
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        toast.error("You must be logged in to create a group");
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    if (!domain.trim()) {
      toast.error("Please define a primary domain");
      return;
    }
    if (subtopics.length === 0) {
      toast.error("Please add at least one subtopic/option");
      return;
    }

    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");

      const docRef = await addDoc(collection(db, "groups"), {
        title: groupName,
        description: description,
        domain: domain,
        subtopics: subtopics.map(t => ({ text: t, original: true })),
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        status: "open" // open, voting, locked
      });

      setGroupId(docRef.id);
      const link = `${window.location.origin}/join/${docRef.id}`;
      setInviteLink(link);
      setIsCreated(true);
      toast.success("Group created!");
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to create group");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addSubtopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtopic.trim() && !subtopics.includes(newSubtopic.trim())) {
      setSubtopics([...subtopics, newSubtopic.trim()]);
      setNewSubtopic("");
    }
  };

  const removeSubtopic = (topic: string) => {
    setSubtopics(subtopics.filter(t => t !== topic));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header variant="app" />

      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-xl">
          <div className="text-center mb-10 animate-fade-in">
            <div className="w-12 h-0.5 bg-foreground mx-auto mb-6" />
            <h1 className="heading-display text-4xl md:text-5xl mb-3">
              <span className="heading-display-italic">Create</span> Group
            </h1>
            <p className="text-muted-foreground">
              Set up a private decision space. You'll invite others after defining the topic.
            </p>
          </div>

          <div className="card-elevated p-8 animate-slide-up">
            {!isCreated ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="label-uppercase text-foreground">
                    Group Name
                  </label>
                  <Input
                    placeholder="e.g., Next GDG Workshop Topic, Team Hackathon Focus"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="label-uppercase text-foreground">
                      Description
                    </label>
                    <span className="text-xs text-muted-foreground">Optional</span>
                  </div>
                  <Textarea
                    placeholder="Briefly describe the goals and context..."
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    className="min-h-[60px] resize-none overflow-hidden"
                  />
                </div>

                {/* Decision Scope Section */}
                <div className="pt-6 border-t border-border space-y-6">
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg">Define What the Group Will Decide On</h3>
                    <p className="text-sm text-muted-foreground">The creator defines the menu, participants choose from it.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="label-uppercase text-foreground">
                      Primary Domain
                    </label>
                    <Input
                      placeholder="e.g., Data Structures & Algorithms, Weekend Trip, Lunch Place"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">This appears as "Preferences for {domain || '...'}"</p>
                  </div>

                  <div className="space-y-2">
                    <label className="label-uppercase text-foreground">
                      Subtopics / Options
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add an option (e.g., Arrays, Linked Lists)"
                        value={newSubtopic}
                        onChange={(e) => setNewSubtopic(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSubtopic(e);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addSubtopic}
                        className="shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {subtopics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 p-3 bg-accent/20 rounded-lg border border-border/50">
                        {subtopics.map((topic) => (
                          <div
                            key={topic}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background border border-border text-sm font-medium animate-fade-in"
                          >
                            {topic}
                            <button
                              type="button"
                              onClick={() => removeSubtopic(topic)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" variant="hero" size="xl" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Group"}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </Button>
                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground">
                    A unique link will be generated. You'll add your preferences next.
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 uppercase tracking-widest pt-2">
                    This step only sets up the decision space
                  </p>
                </div>
              </form>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="font-serif text-2xl mb-2">Decision Space Ready</h2>
                  <p className="text-muted-foreground text-sm">
                    Your private group is open. Collecting input is the next step.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="label-uppercase text-muted-foreground">
                    Invite Link
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={inviteLink}
                      readOnly
                      className="bg-muted/50 font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Anyone with this link can submit preferences. Inputs remain private.
                  </p>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <Button variant="hero" size="lg" className="w-full gap-2" asChild>
                    <Link to={`/preferences?groupId=${groupId}`}>
                      Add Your Preferences
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center -mt-1 mb-3">
                    You are also a participant. Your vote counts equally.
                  </p>
                  <Button variant="ghost" size="lg" className="w-full" asChild>
                    <Link to={`/results?groupId=${groupId}`}>
                      View Results Dashboard
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center -mt-1">
                    Results update as people participate.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateGroup;
