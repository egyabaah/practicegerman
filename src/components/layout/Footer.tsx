import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t bg-footer-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Emmanuel Gyabaah. Built with Next.js and shadcn/ui. Practice German and master the language.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <div className="flex items-center space-x-4">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Contact
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="https://github.com/egyabaah/practicegerman" target="_blank" rel="noopener noreferrer">
                GitHub
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="https://www.linkedin.com/in/egyabaah/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
