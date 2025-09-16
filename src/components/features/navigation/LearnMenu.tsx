"use client";

import {
    NavigationMenuContent,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { NavigationMenuFeaturedCard } from "./NavigationFeatureCard";
import { NavigationMenuCard } from "./NavigationMenuCard";

const learnMenuItems = [
    {
        href: "/vocabulary",
        title: "Vocabulary",
        description: "Build your German vocabulary with flashcards and exercises.",
    },
    {
        href: "/grammar",
        title: "Grammar",
        description: "Learn German grammar rules and practice with exercises.",
    },
    {
        href: "/practice",
        title: "Practice",
        description: "Test your knowledge with quizzes and interactive exercises.",
    },
];

export function LearnMenu() {
    return (
        <>
            <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
            <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                        <NavigationMenuFeaturedCard
                            href="/"
                            title="German Learning Hub"
                            description="Master German with interactive lessons, vocabulary practice, and grammar exercises."
                        />
                    </li>
                    {learnMenuItems.map((item) => (
                        <li key={item.href}>
                            <NavigationMenuCard {...item} />
                        </li>
                    ))}
                </ul>
            </NavigationMenuContent>
        </>
    );
}
