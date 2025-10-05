import { TClientPracticeRequest, TPracticeFeedbackResult } from "@/types/types";
import { generatePracticeFeedback } from "./generatePracticeFeedback";
import { NextRequest } from "next/server";
import { LanguageLevel } from "@/enums/language-levels";
import { LanguageCode } from "@/enums/language-codes";

export async function POST(request: NextRequest) {
    try {
        // Parse resquest body
        const res: TClientPracticeRequest = await request.json();
        // Extract values
        const {
            targetSentence: learnerSentence,
            nativeSentence: learnerSentenceNativeMeaning,
            targetLanguage,
            userLanguageLevel,
            userNativeLanguage,
        } = res;
        // Ensure only valid languages and levels are selected by user
        if (!Object.values(LanguageCode).includes(targetLanguage) 
            || !Object.values(LanguageCode).includes(userNativeLanguage)
            || !Object.values(LanguageLevel).includes(userLanguageLevel)
        ) {
            throw new Error("Invalid parameters, please check your selection and try again.")
        }
        // Call backend to generate feedback
        const response = await generatePracticeFeedback({
            learnerSentence, 
            learnerSentenceNativeMeaning, 
            targetLanguage, 
            userLanguageLevel, 
            userNativeLanguage
        });
        // Send response to client
        return Response.json(response);
    } catch (error: unknown) {
        // Initialize response to send to client
        const response: TPracticeFeedbackResult = { 
            data: null, 
            error: (error instanceof Error) ? error.message : "Oops, Something went wrong processing your request. Please try again"
        };
        // Send error response to client
        return Response.json(response, { status: 500 });
    }
}