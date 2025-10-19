import React from "react";
import { Card } from "@/components/ui/card";
import { TPracticeResponse } from "@/types/types";
import { ConjugationTable } from "./atoms/ConjugationTable";
import { isUserPracticeSentenceCorrect } from "@/utils/feedback";
import FeedbackSection from "./atoms/FeedbackSection";

interface FeedbackCardProps {
    /**
     * {@link TPracticeResponse} when api returns data.
     * string when Api returns error.
     * null when user have not called Api yet.
     */
    feedback: TPracticeResponse | string | null;
}

export const FeedbackCard = ({ feedback }: FeedbackCardProps) => {
    // Display generic text if user has not click on submit
    if (!feedback) {
        return (
            <Card className="flex-1 p-3 bg-muted min-h-[200px]">
                Corrections and suggestions will appear here after you check your sentence.
            </Card>
        )
    } else if (typeof feedback === "string") {
        // Display error message if error was encountered when Api was called
        return (
            <Card className="flex-1 p-3 bg-muted text-red-500 min-h-[200px]">
                {feedback}
            </Card>
        )
    }

    const isUserSentenceCorrect = isUserPracticeSentenceCorrect(feedback)

    return (
        <Card className="flex-1 p-4 bg-muted space-y-4 w-full min-h-[200px]">
            {feedback.corrected_sentences && (
                <FeedbackSection 
                    title="Corrected Sentence" 
                    icon="✅"
                    enableAudio={true}
                >
                    <p>{feedback.corrected_sentences}</p>
                    {isUserSentenceCorrect && (
                        <p className="text-primary font-semibold">
                            No corrections needed🎉!
                        </p>
                    )}
                </FeedbackSection>
            )}

            {feedback.native_way_of_saying_it && (
                <FeedbackSection 
                    title="Native Way of Saying It" 
                    icon="🗣"
                    enableAudio={true}
                >
                    <p>{feedback.native_way_of_saying_it}</p>
                </FeedbackSection>
            )}

            {feedback.explanation_of_error && (
                <FeedbackSection title="Explanation of Error" icon="⚠️">
                    <p>{feedback.explanation_of_error}</p>
                </FeedbackSection>
            )}

            {feedback.vocabulary_and_their_meaning_in_user_language?.length > 0 && (
                <FeedbackSection title="Vocabulary" icon="📖">
                    <ul className="list-disc list-inside">
                        {feedback.vocabulary_and_their_meaning_in_user_language.map(
                            (item, i) => (
                                <li key={i}>
                                    <strong>{item.word}</strong> — {item.meaning}
                                </li>
                            )
                        )}
                    </ul>
                </FeedbackSection>
            )}

            {feedback.grammar && (
                <FeedbackSection title="Grammar Notes" icon="📘">
                    <p>{feedback.grammar}</p>
                </FeedbackSection>
            )}



            {feedback.conjugations?.length > 0 && (
                <ConjugationTable
                    verbConjugations={feedback.conjugations}
                />
            )}
        </Card>
    )
};