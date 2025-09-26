"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PracticeInputForm } from "@/components/features/practice/PracticeInputForm";
import { FeedbackCard } from "@/components/features/practice/FeedbackCard";


export default function PracticePage() {
    // States
    const [targetSentence, setTargetSentence] = useState("");
    const [nativeSentence, setNativeSentence] = useState("");
    const [loading, setLoading] = useState(false);
    const [targetSentenceError, setTargetSentenceError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    // Form submission handler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Validate input
        if (!targetSentence.trim() || targetSentence.length < 5) {
            setTargetSentenceError("Please enter a sentence with at least 5 characters");
            return;
        }
        setTargetSentenceError(null);
        setLoading(true);
        setResult(null);
    
        // TODO: Replace with API call
        setTimeout(() => {
            setResult(`
                Corrected Sentence: Ich gehe morgen zur Schule. \n
                German Native would say: Morgen gehe ich zur Schule. \n
                Video Resource: Easy German – Cases (YouTube). \n
                Explanation: The correct form of the verb 'gehen' is 'gehe' for 1st person singular.
            `);
            setLoading(false);
        }, 200)
    }
    
    // const handleReset = () => {
    //     setTargetSentence("");
    //     setNativeSentence("");
    //     setFeedback(null);
    // }
    
    const handleTargetSentenceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTargetSentence(e.target.value);
    }
    const handleNativeSentenceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNativeSentence(e.target.value);
    }

    return (
        <div className="w-full px-4 py-6">
            <Card className="w-full max-w-7xl mx-auto p-6 gap-0">
                <div className="flex items-center gap-2 ">
                    <h1 className="text-xl font-bold text-primary">PracticeGerman</h1>
                </div>
                <Separator orientation="horizontal" />
                {/* Responsive Grid: 1 col on < 1024px, 2 cols on lg */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mt-0 ">
                    {/* Left side: input */}
                    <PracticeInputForm
                        targetSentence={targetSentence}
                        nativeSentence={nativeSentence}
                        loading={loading}
                        targetSentenceError={targetSentenceError || undefined}
                        onTargetSentenceChange={handleTargetSentenceChange}
                        onNativeSentenceChange={handleNativeSentenceChange}
                        onSubmit={handleSubmit}
                    />
                    {/* Right side: feedback */}
                    <div className="flex flex-col lg:flex-row">
                        {/* Horizontal for small screens */}
                        <Separator className="block mb-0 lg:hidden " orientation="horizontal" />
                        {/* Vertical for large screens */}
                        <Separator className="hidden lg:block mr-6 h-full" orientation="vertical" />
                        <div className="flex flex-col py-6">
                            <label className="font-medium mb-2">Feedback</label>
                            <FeedbackCard result={result} />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}