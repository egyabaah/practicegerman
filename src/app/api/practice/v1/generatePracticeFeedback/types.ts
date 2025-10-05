import { LanguageCode } from "@/enums/language-codes";
import { LanguageLevel } from "@/enums/language-levels";
import z from "zod";

/**
* Input object for generating language practice feedback.
*/
export type TPracticeRequest = {
    /** The sentence written by the learner in the target language */
    learnerSentence: string;

    /** 
     * Optional: the learner's intended meaning in their native language
     */
    learnerSentenceNativeMeaning?: string;

    /**
     *  The BCR-47 code of the language the learner is trying to practice (e.g., "de") 
     */
    targetLanguage: LanguageCode;

    /** Learner's CEFR proficiency level (e.g., "A1", "B2") */
    userLanguageLevel: LanguageLevel;

    /** The BCR-47 code of learner's native language (used for explanations) */
    userNativeLanguage: LanguageCode;
};

/** Verb conjugation for a single pronoun */
export const VerbConjugationItem = z.object({
    pronoun: z.string(),
    form: z.string(),
    /** Whether the learner used this pronoun correctly in their sentence */
    correct_pronoun_for_sentence: z.boolean(),
});

/** Full conjugation table for a single verb */
export const VerbConjugationTable = z.object({
    verb: z.string(), // e.g. "heißen"
    conjugation: z.array(VerbConjugationItem),
});

/** Array of one or more full verb conjugation tables (for multiple verbs) */
export const VerbConjugations = z.array(VerbConjugationTable);

/** Useful vocabulary with meanings in the learner’s language */
export const VocabularyItem = z.object({
    word: z.string().optional().default(""),
    meaning: z.string().optional().default("")
});

/** Array of useful vocabulary with meanings in the learner’s language */
export const VocabularyTable = z.array(VocabularyItem);

/** Response from the practice API containing corrections, explanations, and conjugations */
export const PracticeResponse = z.object({
    /** Corrected version of the learner’s sentence */
    corrected_sentences: z.string().optional().default(""),

    /** Natural phrasing by a native speaker */
    native_way_of_saying_it: z.string().optional().default(""),

    /** Short explanation of mistakes, beginner-friendly */
    explanation_of_error: z.string().optional().default(""),

    /** Useful vocabulary with meanings in the learner’s language */
    vocabulary_and_their_meaning_in_user_language: VocabularyTable.optional().default([]),

    /** Short grammar rule explanation */
    grammar: z.string().optional().default(""),

    /** Conjugation tables for each verb in the sentence */
    conjugations: VerbConjugations.optional().default([]),
});

