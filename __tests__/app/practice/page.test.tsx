import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PracticePage from "@/app/practice/page";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TPracticeFeedbackResult } from "@/types/types";

// Mock fetch response after correction
const mockResponse = {
    data: {
        corrected_sentences: "Hallo Welt!",
        native_way_of_saying_it: "Hello world!",
        explanation_of_error: "This is just a test",
        vocabulary_and_their_meaning_in_user_language: [{ word: "hallo", meaning: "hello" }],
        grammar: "Testing",
        conjugations: [
            {
                verb: "no_verb",
                conjugation: [
                    {
                        pronoun: "ich",
                        form: "bin",
                        correct_pronoun_for_sentence: true
                    }
                ]
            }
        ],
    },
    error: null,
};
// Mock fetch response if user sentence is already correct
const mockCorrectSentenceResponse = {
    data: {
        corrected_sentences: "Hallo Welt!",
        native_way_of_saying_it: "",
        explanation_of_error: "",
        vocabulary_and_their_meaning_in_user_language: [],
        grammar: "",
        conjugations: [],
    },
    error: null,
};
// Mock fetch error
const mockFetchReject = {
    data: null,
    error: "Couldn't reach our servers please try again",
};

/**
 * Mock global fetch with expected response from api
 * @param response `TPracticeFeedbackResult`
 */
const mockGlobalFetch = (response: TPracticeFeedbackResult) => {
    vi.spyOn(global, "fetch").mockResolvedValue({
        json: async () => response,
    } as any);
};

const fetchTimeout = 10000; // 1000ms

/**
 * Fill and submit form in practice page
 * @param sentence sentence in language to be learned
 * @param meaning sentence in users native language
 */
const fillAndSubmitForm = async (sentence: string, meaning?: string) => {
    fireEvent.change(screen.getByLabelText(/Your German Sentence/i), {
        target: { value: sentence },
    });
    fireEvent.change(screen.getByLabelText(/Intended Meaning/i), {
        target: { value: meaning },
    });
    fireEvent.click(screen.getByRole("button", { name: /Check Sentence/i }));
};

describe("PracticePage", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("should display error if target sentence < 5", async () => {
        render(<PracticePage />);

        await fillAndSubmitForm("hi");
        
        await waitFor(() => {
            expect(screen.getByText(/Please enter a sentence with at least 5 characters/i)).toBeDefined();
        }, { timeout: fetchTimeout });
    })

    it("flows from input to feedback", async () => {
        mockGlobalFetch(mockResponse);
        render(<PracticePage />);

        await fillAndSubmitForm("Hallo Welt", "Hello world");

        await waitFor(() => {
            expect(screen.getByText(/✅ Corrected Sentence/i)).toBeDefined();
            expect(screen.getByText(/⚠️ Explanation of Error/i)).toBeDefined();

        }, { timeout: fetchTimeout });
    }, fetchTimeout+2000);

    it("flows from input to correct sentence by user", async () => {
        mockGlobalFetch(mockCorrectSentenceResponse);

        render(<PracticePage />);

        await fillAndSubmitForm("Hallo Welt", "Hello world");

        await waitFor(() => {
            expect(screen.getByText(/✅ Corrected Sentence/i)).toBeDefined();
            // NB: `getByText` will throw error if text doesnot exist so use `queryByText`
            expect(screen.queryByText(/⚠️ Explanation of Error/i)).toBeNull();
        }, { timeout: fetchTimeout });
    }, fetchTimeout+2000)

    it("flows from input to fetch error", async () => {
        mockGlobalFetch(mockFetchReject);

        render(<PracticePage />);

        await fillAndSubmitForm("Hallo Welt", "Hello world");

        await waitFor(() => {
            expect(screen.getByText(/Couldn't reach our servers/i)).toBeDefined();
            expect(screen.queryByText(/⚠️ Explanation of Error/i)).toBeNull();
        }, { timeout: fetchTimeout });
    })
});
