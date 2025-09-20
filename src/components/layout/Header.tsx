import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { LearnMenu } from "../features/navigation/LearnMenu";
import { ThemeToggleButton } from "../features/buttons/ThemeTogglerButton";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 items-center">
      <div className="p-10 flex h-14  items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">
              PracticeGerman
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <LearnMenu />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className="nav-link-btn nav-link-interactive">
                  <Link href="/about">
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link className="mr-6 flex items-center space-x-2 md:hidden" href="/">
              <span className="font-bold">Practice German</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggleButton/>
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm">
              Get Started
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
