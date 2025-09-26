import { TPracticeResponse } from "@/types/types";

/**
 * Determines whether a user's submitted sentence is already completely correct.
 * 
 * This function assumes that if all other feedback fields are empty (`""` or `[]`),
 * then the `corrected_sentences` field is the only non-empty value, meaning the
 * sentence required no corrections.
 *
 * @param feedback - The feedback object returned from the API (`TPracticeResponse`).
 * @returns `true` if the sentence is already correct (no other corrections), `false` otherwise.
 */
export const isUserPracticeSentenceCorrect = (feedback: TPracticeResponse) => {
    return (
        !!feedback.corrected_sentences &&
        !feedback.native_way_of_saying_it &&
        !feedback.explanation_of_error &&
        !(feedback.vocabulary_and_their_meaning_in_user_language?.length) &&
        !feedback.grammar &&
        !(feedback.conjugations?.length)
    );
};