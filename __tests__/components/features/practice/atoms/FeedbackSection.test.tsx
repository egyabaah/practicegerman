import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";



vi.mock("@/services/playback/PlaybackService", () => ({
    PlaybackService: {
        getInstance: vi.fn(() => mockedPlaybackService),
    },
}));

import FeedbackSection from "@/components/features/practice/atoms/FeedbackSection";
import { mockedPlaybackService } from "../../../../commons/MockedPlaybackService";

describe("FeedbackSection", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders title and icon", async () => {
        mockedPlaybackService.getAvailableVoices.mockResolvedValueOnce([]);
        render(
            <FeedbackSection title="Corrected Sentence" icon="✅" enableAudio>
                <p>Hallo Welt</p>
            </FeedbackSection>
        );
        await waitFor(() => {
            expect(screen.getByText(/✅ Corrected Sentence/i)).toBeInTheDocument();
            expect(screen.getByText(/✅/i)).toBeInTheDocument();
        });
    });

    it("disables read-aloud and shows guidance when no voices", async () => {
        mockedPlaybackService.getAvailableVoices.mockResolvedValueOnce([]);
        render(
            <FeedbackSection title="Section" enableAudio>
                <p>Hallo Welt</p>
            </FeedbackSection>
        );
        // Wait for effect to resolve voices
        await waitFor(() => {
            expect(
                screen.getByText(/Audio unavailable\. No voice found/i)
            ).toBeInTheDocument();
        });
        const button = screen.getByRole("button", { name: /read this section aloud/i });
        expect(button).toBeDisabled();
    });

    it("calls setTextDiv and play when voices are available and button clicked", async () => {
        mockedPlaybackService.getAvailableVoices.mockResolvedValueOnce([{} as any]);
        render(
            <FeedbackSection title="Section" enableAudio>
                <p>Hallo Welt</p>
            </FeedbackSection>
        );
        const button = await screen.findByRole("button", { name: /read this section aloud/i });
        expect(button).not.toBeDisabled();
        await userEvent.click(button);
        await waitFor(() => {
            expect(mockedPlaybackService.setTextDiv).toHaveBeenCalledTimes(1);
            expect(mockedPlaybackService.play).toHaveBeenCalledTimes(1);
        });
    });
});
