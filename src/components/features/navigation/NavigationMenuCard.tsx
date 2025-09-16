import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import Link from "next/link";

type NavigationMenuCardProps = {
    href: string;
    title: string;
    description: string;
};

export function NavigationMenuCard({ href, title, description }: NavigationMenuCardProps) {
    return (
        <NavigationMenuLink asChild>
            <Link
                href={href}
                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none 
                   transition-colors hover:bg-accent hover:text-accent-foreground 
                   focus:bg-accent focus:text-accent-foreground"
            >
                <div className="text-sm font-medium leading-none">{title}</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {description}
                </p>
            </Link>
        </NavigationMenuLink>
    );
}
