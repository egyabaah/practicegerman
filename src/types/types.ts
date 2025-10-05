import z from "zod";
import { 
    VerbConjugationItem, 
    VerbConjugationTable, 
    VerbConjugations, 
    PracticeResponse, 
    VocabularyItem, 
    VocabularyTable 
} from "@/app/api/practice/v1/generatePracticeFeedback/types";
import { LanguageCode, TextDirection } from "@/enums/language-codes";

/** Verb conjugation for a single pronoun */
export type TVerbConjugationItem = z.infer<typeof VerbConjugationItem>;

/** Full verb conjugation table for all pronouns of a single verb  */
export type TVerbConjugationTable = z.infer<typeof VerbConjugationTable>;

/** Array of one or more full verb conjugation tables (for multiple verbs)  */
export type TVerbConjugations = z.infer<typeof VerbConjugations>;

/** Structured response returned by the practice API */
export type TPracticeResponse = z.infer<typeof PracticeResponse>;

/** Useful vocabulary with meanings in the learner’s language */
export type TVocabularyItem = z.infer<typeof VocabularyItem>;

/** Array of useful vocabulary with meanings in the learner’s language */
export type TVocabularyTable = z.infer<typeof VocabularyTable>;


/** 
 * Wrapper for practice feedback result
 * Inspired by Supabase-js client error handler
*/
export type TPracticeFeedbackResult = {
    /** The structured practice response, null if an error occurred */
    data: TPracticeResponse | null;
    /** Error message if something went wrong, otherwise null */
    error: string | null;
};

/**
 * Client-side shape for submitting practice sentences.
 * 
 * NB: This type is for frontend use only — not the API contract. 
 * This is used as interim security to prevent using from firing a request to the API 
 * using Postman.
 */
export type TClientPracticeRequest = {
    /** The sentence written by the learner in the target language */
    targetSentence: string;

    /**
     * Optional: the learner's intended meaning in their native language */
    nativeSentence?: string;

    /**
     * The language the learner is trying to practice (e.g., "Deutsch").
     * TODO: Convert to BCP-47 codes
     */
    targetLanguage: string;

    /** Learner's proficiency level (e.g., "A1", "B2") */
    userLanguageLevel: string;

    /** 
     * Learner's native language
     * TODO: Convert to BCP-47 codes
     */
    userNativeLanguage: string;
};

export type TLearnerLanguageMetadata = {
    code: LanguageCode;
    displayName: string;
    nativeName: string;
    direction: TextDirection;
};