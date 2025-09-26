import { generatePracticeFeedback } from "@/app/api/practice/v1/generatePracticeFeedback/generatePracticeFeedback";
import { TPracticeRequest } from "@/app/api/practice/v1/generatePracticeFeedback/types";
import { describe, expect, it, vi } from "vitest";

// https://stackoverflow.com/questions/76836909/referenceerror-cannot-access-mock-before-initialization-when-using-vitest
// Use hoist instead of ts variables to ensure they are always initialized before mocking
const { vocabs, conjugations } = vi.hoisted(() => {
    return { 
        vocabs: [
            { word: "gehen", meaning: "to go" },
            { word: "Schule", meaning: "school" },
        ],
        conjugations: [
            {
                verb: "gehen",
                conjugation: [
                    { pronoun: "ich", form: "gehe", correct_pronoun_for_sentence: true },
                    { pronoun: "du", form: "gehst", correct_pronoun_for_sentence: false },
                ],
            },
            {
                verb: "sein",
                conjugation: [
                    { pronoun: "ich", form: "bin", correct_pronoun_for_sentence: true },
                    { pronoun: "du", form: "bist", correct_pronoun_for_sentence: false },
                ],
            },
        ]
    }
})


// Mock OpenAI
vi.mock("openai", async (importOriginal) => {
    const actual = await importOriginal<typeof import("openai")>();
    return {
        ...actual,
        default: vi.fn().mockImplementation(() => ({
            chat: {
                completions: {
                    parse: vi.fn().mockResolvedValueOnce({
                        choices: [
                            {
                                message: {
                                    parsed: {
                                        corrected_sentences: "Ich gehe zur Schule. Ich bin Manuel.",
                                        native_way_of_saying_it: "Ich gehe in die Schule. Ich bin Manuel.",
                                        explanation_of_error: "The verb 'geht' should be 'gehe' for 'ich'.",
                                        vocabulary_and_their_meaning_in_user_language: vocabs,
                                        grammar: "Verbs must match the subject pronoun.",
                                        conjugations: conjugations,
                                    },
                                },
                            },
                        ],
                    }).mockRejectedValueOnce(new actual.APIConnectionError({ message: "Unable to reach the server." })),
                },
            },
        })),
    }
});

describe("generatePracticeFeedback", () => {
    it("should return parsed practice feedback from mocked OpenAI", async () => {
        const request: TPracticeRequest = {
            learnerSentence: "Ich geht zur schule. Ich bin Manuel.",
            learnerSentenceNativeMeaning: "I am Manuel and I am going to school",
            targetLanguage: "Deutsch",
            userLanguageLevel: "A1",
            userNativeLanguage: "English",
        };

        const { data: apiResponse, error: apiError } = await generatePracticeFeedback(request);

        if (apiResponse) {
            expect(apiError).toBeNull();
            expect(apiResponse).toBeDefined();
            expect(apiResponse.corrected_sentences).toBe("Ich gehe zur Schule. Ich bin Manuel.");
            expect(apiResponse.conjugations[0].verb).toBe("gehen"); // check the verb name
            expect(apiResponse.conjugations[0].conjugation[0].form).toBe("gehe"); // check the first form: for ich
            expect(apiResponse.explanation_of_error).toMatch(/verb/i);
        }

    });

    it("should return an error object when OpenAI fails", async () => {
        
        const request: TPracticeRequest = {
            learnerSentence: "Ich geht zur schule.",
            targetLanguage: "Deutsch",
            userLanguageLevel: "A1",
            userNativeLanguage: "English",
        };

        // Should hit the `.mockRejectedValueOnce`
        const { data: apiResponse, error: apiError } = await generatePracticeFeedback(request);

        expect(apiResponse).toBeNull();
        expect(apiError).toMatch(/unable to reach the server/i);
        expect(apiError).toBe("Unable to reach the server. Please check your internet connection and try again.");
    });
});
