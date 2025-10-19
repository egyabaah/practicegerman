"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PracticeInputForm } from "@/components/features/practice/PracticeInputForm";
import { FeedbackCard } from "@/components/features/practice/FeedbackCard";
import { TPracticeFeedbackResult, TPracticeResponse } from "@/types/types";
import TTSInitializer from "@/components/features/practice/TTSInitializer";
import { LanguageCode } from "@/enums/language-codes";
import { LanguageLevel } from "@/enums/language-levels";
import { PlaybackService } from "@/services/playback/PlaybackService";
import { DEFAULT_LANGUAGE_LEVEL, DEFAULT_NATIVE_LANGUAGE, DEFAULT_TARGET_LANGUAGE } from "@/constants/general";


export default function PracticePage() {
    // States
    const [targetSentence, setTargetSentence] = useState("");
    const [nativeSentence, setNativeSentence] = useState("");
    const [targetLanguage, setTargetLanguage] = useState<LanguageCode>(DEFAULT_TARGET_LANGUAGE);
    const [userNativeLanguage, setUserNativeLanguage] = useState<LanguageCode>(DEFAULT_NATIVE_LANGUAGE);
    const [userLanguageLevel, setUserLanguageLevel] = useState<LanguageLevel>(DEFAULT_LANGUAGE_LEVEL);
    const [loading, setLoading] = useState(false);
    const [targetSentenceError, setTargetSentenceError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<TPracticeResponse | string | null>(null);
    const [lastFeedbackParams, setLastFeedbackParams] = useState<{
        targetLanguage: LanguageCode;
        userNativeLanguage: LanguageCode;
        userLanguageLevel: LanguageLevel;
    } | null>(null);

    // Keep TTS engine language aligned with the content being displayed.
    // If we have prior feedback, use its language; otherwise use the current selected targetLanguage.
    useEffect(() => {
        const effectiveLang = lastFeedbackParams?.targetLanguage ?? targetLanguage;
        PlaybackService.getInstance().setLanguage(effectiveLang);
    }, [targetLanguage, lastFeedbackParams]);

    // Derived memoized value to avoid re-renders for inline comparisons
    const isFeedbackStale = useMemo(() => {
        if (!lastFeedbackParams) return false;
        // Destructure lastFeedbackParams
        const { 
            targetLanguage: lastLang, 
            userNativeLanguage: lastNative, 
            userLanguageLevel: lastLevel 
        } = lastFeedbackParams;
        // Return whether any param has changed
        return (
            lastLang !== targetLanguage ||
            lastNative !== userNativeLanguage ||
            lastLevel !== userLanguageLevel
        );
    }, [lastFeedbackParams, targetLanguage, userNativeLanguage, userLanguageLevel]);

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
            // Ensure response is json before parsing body. Some test mocks may not provide headers; guard access.
            const contentType = (response as Response)?.headers?.get?.("content-type");
            if (typeof contentType === "string" && !contentType.includes("application/json")) {
                throw new Error("Unexpected response from server");
            }

            // Parse api response
            const parsedResponse: TPracticeFeedbackResult = await response.json();
            const {data: apiResponse, error: apiError} = parsedResponse;

            // Handle error returned by api
            if (apiError) {
                setFeedback(apiError);
                return;
            }
            // Handle api success response
            setFeedback(apiResponse);
            // Snapshot the params used for this feedback so we can mark staleness later
            setLastFeedbackParams({ targetLanguage, userNativeLanguage, userLanguageLevel });
            return;

        } catch (error: unknown) {
            // Handle non-api related error
            console.error(error);
            setFeedback("An error happened while processing your request. Please try again.");
        } finally {
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
            <TTSInitializer />
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
                            {isFeedbackStale && (
                                <p className="mb-2 text-sm text-muted-foreground">
                                    This feedback reflects your previous settings. Submit again to refresh.
                                </p>
                            )}
                            <FeedbackCard feedback={feedback} />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}