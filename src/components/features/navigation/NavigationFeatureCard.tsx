import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import Link from "next/link";


type NavigationMenuFeaturedCardProps = {
    href: string;
    title: string;
    description: string;
};

export function NavigationMenuFeaturedCard({ href, title, description }: NavigationMenuFeaturedCardProps) {
    return (
        <NavigationMenuLink asChild>
            <Link
                href={href}
                className="flex h-full w-full select-none flex-col justify-end rounded-md 
                     bg-gradient-to-b from-muted/50 to-muted p-6 no-underline 
                     outline-none focus:shadow-md"
            >
                <div className="mb-2 mt-4 text-lg font-medium">{title}</div>
                <p className="text-sm leading-tight text-muted-foreground">{description}</p>
            </Link>
        </NavigationMenuLink>
    );
}
