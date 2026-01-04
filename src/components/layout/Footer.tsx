import { Link } from "react-router-dom";

interface FooterProps {
  variant?: "minimal" | "full";
}

export function Footer({ variant = "minimal" }: FooterProps) {
  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 group">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" fill="currentColor">
              <circle cx="12" cy="8" r="2" />
              <circle cx="8" cy="14" r="2" />
              <circle cx="16" cy="14" r="2" />
              <circle cx="12" cy="12" r="1" />
            </svg>
            <span className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
              © 2024 Social Common-Ground Finder
            </span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link 
              to="#" 
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 story-link"
            >
              Privacy
            </Link>
            <Link 
              to="#" 
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 story-link"
            >
              Terms
            </Link>
            <Link 
              to="#" 
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 story-link"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
