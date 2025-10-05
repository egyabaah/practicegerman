"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PracticeInputForm } from "@/components/features/practice/PracticeInputForm";
import { FeedbackCard } from "@/components/features/practice/FeedbackCard";
import { TPracticeFeedbackResult, TPracticeResponse } from "@/types/types";
import { LanguageCode } from "@/enums/language-codes";
import { LanguageLevel } from "@/enums/language-levels";


export default function PracticePage() {
    // States
    const [targetSentence, setTargetSentence] = useState("");
    const [nativeSentence, setNativeSentence] = useState("");
    const [targetLanguage, setTargetLanguage] = useState<LanguageCode>(LanguageCode.DE);
    const [userNativeLanguage, setUserNativeLanguage] = useState<LanguageCode>(LanguageCode.EN);
    const [userLanguageLevel, setUserLanguageLevel] = useState<LanguageLevel>(LanguageLevel.A1);
    const [loading, setLoading] = useState(false);
    const [targetSentenceError, setTargetSentenceError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<TPracticeResponse | string | null>(null);

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
        setFeedback(null);
        try {

            // Call api
            const response = await fetch("/api/practice/v1/generatePracticeFeedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetSentence: targetSentence,
                    nativeSentence: nativeSentence,
                    targetLanguage: targetLanguage,
                    userLanguageLevel: userLanguageLevel,
                    userNativeLanguage: userNativeLanguage,
                }),
            });
            // console.log(response)

            // Parse api response
            const parsedResponse: TPracticeFeedbackResult = await response.json();
            const {data: apiResponse, error: apiError} = parsedResponse;

            // Handle error returned by api
            if (apiError) {
                setFeedback(apiError);
                setLoading(false)
                return;
            }
            // Handle api sucess response
            setFeedback(apiResponse);
            setLoading(false);
            return;

        } catch (error: unknown) {
            // Handle non-api related error
            console.error(error);
            setFeedback("An error happened while processing your request. Please try again.");
            setLoading(false);
        }

    }
    
    // const handleReset = () => {
    //     setTargetSentence("");
    //     setNativeSentence("");
    //     setFeedback(null);
    // }
    
    const handleTargetSentenceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // Get rid of any error text displayed in FeedbackCard
        setFeedback(null);
        setTargetSentence(e.target.value);
    }
    const handleNativeSentenceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNativeSentence(e.target.value);
    }
    const handleTargetLanguageChange = (value: LanguageCode) => {
        setTargetLanguage(value);
    }
    const handleUserNativeLanguageChange = (value: LanguageCode) => {
        setUserNativeLanguage(value);
    }
    const handleUserLanguageLevelChange = (value: LanguageLevel) => {
        setUserLanguageLevel(value);
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
                        targetLanguage={targetLanguage}
                        userNativeLanguage={userNativeLanguage}
                        userLanguageLevel={userLanguageLevel}
                        onTargetLanguageChange={handleTargetLanguageChange}
                        onUserNativeLanguageChange={handleUserNativeLanguageChange}
                        onUserLanguageLevelChange={handleUserLanguageLevelChange}
                        onSubmit={handleSubmit}
                    />
                    {/* Right side: feedback */}
                    <div className="flex flex-col lg:flex-row">
                        {/* Horizontal for small screens */}
                        <Separator className="block mb-0 lg:hidden " orientation="horizontal" />
                        {/* Vertical for large screens */}
                        <Separator className="hidden lg:block mr-6 h-full" orientation="vertical" />
                        <div className="flex flex-col py-6 w-full">
                            <label className="font-medium mb-2">Feedback</label>
                            <FeedbackCard feedback={feedback} />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}