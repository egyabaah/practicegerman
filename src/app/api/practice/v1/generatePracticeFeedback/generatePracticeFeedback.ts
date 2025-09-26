import { TPracticeFeedbackResult, TPracticeResponse } from "@/types/types";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { getPracticeInstruction } from "./prompt";
import { PracticeResponse, TPracticeRequest } from "./types";
import { mapOpenAIError } from "@/lib/errors/openAIErrorHandler";

// Initialize OpenAI client with API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generates practice feedback for a learner’s sentence using OpenAI Completion API.
 * @param practiceRequest - - Input containing learner sentence, optional native meaning,
 *   target language, learner level, and native language.
 * @returns A structured {@link TPracticeResponse} object, or `null` on error.
 */
export async function generatePracticeFeedback(practiceRequest: TPracticeRequest): Promise<TPracticeFeedbackResult> {
    try {
        const { 
            learnerSentence,
            learnerSentenceNativeMeaning,
            targetLanguage,
            userLanguageLevel,
            userNativeLanguage,
        } = practiceRequest;

        // Generate system instruction for the prompt
        const instruction = getPracticeInstruction({targetLanguage, userLanguageLevel, userNativeLanguage});
        // Call OpenAI chat completion api with zod parsing for type safety
        const completion = await openai.chat.completions.parse({
            model: "gpt-5-mini",
            messages: [
                { role: "system", content: instruction},
                { role: "user", content: learnerSentence },
                { role: "user", content: learnerSentenceNativeMeaning || "" },
            ],
            // Ensures response is structured data
            response_format: zodResponseFormat(PracticeResponse, "practice_response")
        });
        
        // Extract the parsed response
        const response: TPracticeResponse | null = completion.choices[0].message.parsed;
        // Handle error if response is null
        if (!response) {
            // console.error("No response");
            return { data: null, error: "Sorry, we couldn't process your request. Please check your input and try again." };
        }
        // console.log(response);
        return {data: response, error: null};
    } catch (error: unknown) {
        // TODO: Save internal error details to DB
        // await db.insert("errors", {
        //     message: error.message,
        //     stack: error.stack,
        //     context: { learnerSentence, userId },
        //     createdAt: new Date(),
        // });

        // Map known OpenAI error types or fallback to generic message
        return { data: null, error: mapOpenAIError(error) };
    }
}