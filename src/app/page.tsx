"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Trophy, Users } from "lucide-react";
import { FeatureItem } from "@/components/features/FeatureItem";
import Image from "next/image";
import { FeatureCard } from "@/components/features/FeatureCard";

export default function Home() {
    return (
        <div id="home-container">
            <section id="hero">
                <div id="grid-container" className="flex items-center justify-center lg:p-5 mb-12">
                {/* Main Grid - 2 columns on large screens, 2 rows on small screens*/}
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-dvh">
                        {/* Left Column / First Row */}
                        <div className="text-center flex justify-center items-center w-full min-h-screen lg:h-full">
                            <div className="p-5 md:p-0">
                                <h1 className="text-4xl text-main-text font-bold tracking-tight sm:text-6xl mb-4">
                                    Master German with{" "}
                                    <span className="text-primary">PracticeGerman</span>
                                </h1>
                                <p className="text-xl text-main-text max-w-2xl mx-auto mb-8">
                                    Learn German vocabulary, grammar, and conversation skills through interactive exercises and personalized learning paths.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button size="lg" className="text-lg px-8 py-6">
                                        Start Learning
                                    </Button>
                                    <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                                        View Lessons
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column / Second Row */} 
                        <div className="bg-background-brand text-center flex justify-center items-center w-full min-h-screen lg:h-full rounded-xl">
                            <div className="relative w-full h-full overflow-hidden shadow animate-wiggle lg:rounded-xl">
                <Image
                                    src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1600&auto=format&fit=crop"
                                    alt="Learn German with interactive lessons"
                                    fill
                    priority
                                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                                    sizes="(min-width: 1000px) 50vw, 100vw"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 1x2 grid features card */}
            <section id="features-cards-grid">
                {/* Small Grid - 2 columns on large screens, 2 rows on small screens */}
                <div className="grid mt-20 grid-cols-1 p-5 lg:grid-cols-2 gap-8 mb-12">
                    {/* Left Column / First Row */}
                    <div className="space-y-8">
                        <FeatureCard
                            icon={BookOpen}
                            title="Vocabulary Builder"
                            description="Expand your German vocabulary with our comprehensive word lists and flashcards"
                            ctaText="Start Learning"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">Basic Words</span>
                                <div className="flex-1 min-w-0 bg-secondary rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full w-0"></div>
                                </div>
                                <span className="text-sm font-medium">0/500</span>
                            </div>
                        </FeatureCard>
                    </div>

                    {/* Right Column / Second Row */}
                    <div className="space-y-8">
                        <FeatureCard
                            icon={Brain}
                            title="Grammar Practice"
                            description="Master German grammar with interactive exercises and detailed explanations"
                            ctaText="Practice Now"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-primary">12</div>
                                    <div className="text-sm text-muted-foreground">Topics</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-primary">48</div>
                                    <div className="text-sm text-muted-foreground">Exercises</div>
                                </div>
                            </div>
                        </FeatureCard>
                    </div>
                </div>
            </section>


            {/* 1x3 grid Additional Features Section */}
            <section id="feature-item-grid">
                <div className="text-center items-center justify-center bg-background-brand py-12">
                    <h2 className="text-3xl font-bold mb-4">Why Choose <span className="text-primary">PracticeGerman</span>?</h2>
                    <div className="grid items-center justify-center  grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <FeatureItem
                            icon={BookOpen}
                            title="Comprehensive Learning"
                            description="Cover all aspects of German language learning from basics to advanced topics."
                        />
                        <FeatureItem
                            icon={Brain}
                            title="Adaptive Learning"
                            description="Our AI-powered system adapts to your learning pace and style."
                        />
                        <FeatureItem
                            icon={Trophy}
                            title="Gamified Experience"
                            description="Stay motivated with achievements, streaks, and progress tracking."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
