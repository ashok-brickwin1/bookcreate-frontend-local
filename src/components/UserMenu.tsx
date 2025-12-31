import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { User, LogOut, BookOpen, Settings, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsDialog } from "./SettingsDialog";

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  console.log("UserMenu render, user =", user);


  if (!user) {
    return (
      <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
        Sign In
      </Button>
    );
  }

  const displayName = user.email || "User";

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/60 hover:bg-card transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground hidden sm:block">
            {displayName}
          </span>
          <ChevronDown className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )} />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl shadow-elevated z-50 overflow-hidden animate-scale-in">
              <div className="p-3 border-b border-border">
                <p className="text-sm font-medium text-foreground hidden">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              
              <div className="p-2 hidden">
                <button
                  onClick={() => {
                    navigate("/");
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  My Books
                </button>
                <button
                  onClick={() => {
                    setSettingsOpen(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              </div>

              <div className="p-2 border-t border-border">
                <button
                  onClick={async () => {
                    await signOut();
                    setIsOpen(false);
                    navigate("/");
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <SettingsDialog 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen}
      />
    </>
  );
};