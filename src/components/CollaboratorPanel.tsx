import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Users, Mail, UserPlus, X, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Collaborator {
  id: string;
  email: string;
  role: "contributor" | "editor" | "viewer";
  invited_at: string;
  accepted_at: string | null;
}

interface CollaboratorPanelProps {
  bookId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CollaboratorPanel = ({ bookId, isOpen, onClose }: CollaboratorPanelProps) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"contributor" | "editor" | "viewer">("contributor");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCollaborators = async () => {
    const { data, error } = await supabase
      .from("book_collaborators")
      .select("*")
      .eq("book_id", bookId)
      .order("invited_at", { ascending: false });

    if (!error && data) {
      setCollaborators(data as Collaborator[]);
    }
  };

  useEffect(() => {
    if (isOpen && bookId) {
      fetchCollaborators();
    }
  }, [isOpen, bookId]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);

    const { error } = await supabase
      .from("book_collaborators")
      .insert({
        book_id: bookId,
        email: email.toLowerCase(),
        role,
      });

    if (error) {
      if (error.message.includes("duplicate")) {
        toast({
          variant: "destructive",
          title: "Already invited",
          description: "This person has already been invited to collaborate.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    } else {
      toast({
        title: "Invitation sent!",
        description: `${email} has been invited as a ${role}.`,
      });
      setEmail("");
      fetchCollaborators();
    }

    setLoading(false);
  };

  const handleRemove = async (collaboratorId: string) => {
    const { error } = await supabase
      .from("book_collaborators")
      .delete()
      .eq("id", collaboratorId);

    if (!error) {
      setCollaborators((prev) => prev.filter((c) => c.id !== collaboratorId));
      toast({
        title: "Collaborator removed",
        description: "They will no longer have access to this book.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative glass-card rounded-3xl p-8 w-full max-w-lg shadow-elevated animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-display font-medium text-foreground">
              Invite Collaborators
            </h2>
            <p className="text-sm text-muted-foreground">
              Share memories and stories together
            </p>
          </div>
        </div>

        <form onSubmit={handleInvite} className="space-y-4 mb-8">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@example.com"
                className="h-12 rounded-xl"
              />
              <Button type="submit" variant="warm" disabled={loading || !email.trim()}>
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            {(["contributor", "editor", "viewer"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                  role === r
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            <strong>Contributor:</strong> Can add memories • <strong>Editor:</strong> Can edit answers • <strong>Viewer:</strong> Read only
          </p>
        </form>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">
            Invited ({collaborators.length})
          </h3>
          
          {collaborators.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No collaborators yet. Invite family or friends to contribute!
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {collaborators.map((collab) => (
                <div
                  key={collab.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{collab.email}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">{collab.role}</span>
                        {collab.accepted_at ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <Check className="h-3 w-3" /> Joined
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-600">
                            <Clock className="h-3 w-3" /> Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(collab.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};