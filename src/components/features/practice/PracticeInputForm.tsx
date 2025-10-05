import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { LabeledTextarea } from "../io/LabeledTextarea";
import { LabeledSelect } from "../io/LabeledSelect";
import { LANGUAGE_METADATA } from "@/data/languages";
import { LanguageLevel } from "@/enums/language-levels";
import { LanguageCode } from "@/enums/language-codes";

interface PracticeInputFormProps {
    targetSentence: string;
    nativeSentence: string;
    loading: boolean;
    targetSentenceError?: string;
    onTargetSentenceChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onNativeSentenceChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    targetLanguage: LanguageCode;
    userNativeLanguage: LanguageCode;
    userLanguageLevel: LanguageLevel;
    onTargetLanguageChange: (value: LanguageCode) => void;
    onUserNativeLanguageChange: (value: LanguageCode) => void;
    onUserLanguageLevelChange: (value: LanguageLevel) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}



export const PracticeInputForm = ({
    targetSentence,
    nativeSentence,
    loading,
    targetSentenceError,
    onTargetSentenceChange,
    onNativeSentenceChange,
    targetLanguage,
    userNativeLanguage,
    userLanguageLevel,
    onTargetLanguageChange,
    onUserNativeLanguageChange,
    onUserLanguageLevelChange,
    onSubmit
}: PracticeInputFormProps) => {
    const targetLangDisplayName = LANGUAGE_METADATA[targetLanguage]?.displayName || "Target Language";
    const nativeLangDisplayName = LANGUAGE_METADATA[userNativeLanguage]?.displayName || "Native Language"
    const languageOptions = useMemo(() => {
        return Object.values(LANGUAGE_METADATA)
            .map((language) => ({
                value: language.code,
                label: `${language.nativeName} (${language.displayName})`,
                displayName: language.displayName,
            }))
            .sort((a, b) => a.displayName.localeCompare(b.displayName))
            .map(({ value, label }) => ({ value, label }));
    }, []);
    const levelOptions = useMemo(() =>
        Object.values(LanguageLevel).map((level) => ({ value: level, label: level })),
        []
    );
    return (
        <form 
            onSubmit={onSubmit} 
            className="flex flex-col gap-y-2 py-6 lg:pr-6"
            data-testid="form-practice-input"
        >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <LabeledSelect
                    label="Target Language"
                    value={targetLanguage}
                    onValueChange={onTargetLanguageChange}
                    options={languageOptions}
                    placeholder="Select language"
                    id="select-target-language"
                    testId="select-target-language"
                />
                <LabeledSelect
                    label="Your Level"
                    value={userLanguageLevel}
                    onValueChange={onUserLanguageLevelChange}
                    options={levelOptions}
                    placeholder="Select level"
                    id="select-level"
                    testId="select-level"
                />
                <LabeledSelect
                    label="Your Native Language"
                    value={userNativeLanguage}
                    onValueChange={onUserNativeLanguageChange}
                    options={languageOptions}
                    placeholder="Select language"
                    id="select-native-language"
                    testId="select-native-language"
                />
            </div>
            <LabeledTextarea
                label={`Your ${targetLangDisplayName} Sentences*`}
                value={targetSentence}
                onChange={onTargetSentenceChange}
                placeholder={`Write your sentence(s) in ${targetLangDisplayName}... Example: Describe your day in ${targetLangDisplayName}`}
                error={targetSentenceError || undefined}
                id="target-sentence"
                className="h-32"
                required={true}
                testId="textarea-target"
            />
            <LabeledTextarea
                label="Optional: Intended Meaning in Native Language"
                value={nativeSentence}
                onChange={onNativeSentenceChange}
                placeholder={`Write what you mean in your native language (${nativeLangDisplayName})...`}
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