import React from "react";
import { Button } from "@/components/ui/button";
import { LabeledTextarea } from "../io/LabeledTextarea";

interface PracticeInputFormProps {
    targetSentence: string;
    nativeSentence: string;
    loading: boolean;
    targetSentenceError?: string;
    onTargetSentenceChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onNativeSentenceChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}



export const PracticeInputForm = ({
    targetSentence,
    nativeSentence,
    loading,
    targetSentenceError,
    onTargetSentenceChange,
    onNativeSentenceChange,
    onSubmit
}: PracticeInputFormProps) => {
    return (
        <form 
            onSubmit={onSubmit} 
            className="flex flex-col gap-y-2 py-6 lg:pr-6"
            data-testid="form-practice-input"
        >
            <LabeledTextarea
                label="Your German Sentence"
                value={targetSentence}
                onChange={onTargetSentenceChange}
                placeholder="Schreibe deinen Satz auf Deutsch..."
                error={targetSentenceError || undefined}
                id="target-sentence"
                className="h-32"
                required={true}
                testId="textarea-target"
            />
            <LabeledTextarea
                label="Intended Meaning (Native Language)"
                value={nativeSentence}
                onChange={onNativeSentenceChange}
                placeholder="Write what you mean in your native language..."
                id="native-sentence"
                className="h-24"
                testId="textarea-native"
            />

            <Button 
                disabled={loading} 
                id="submit-button"
                data-testid="btn-submit"
                type="submit"
            >
                {loading ? "Checking..." : "Check Sentence"}
            </Button>
        </form>
    )
}