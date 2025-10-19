"use client";

import { PlaybackEngineType } from "@/enums/playback-engines";
import { PlaybackService } from "@/services/playback/PlaybackService";
import React, { useEffect, useRef, useState } from "react";


interface FeedbackSectionProps {
    /** Title shown at the top of the section */
    title: string;
    /** Optional icon or emoji to render to the left of the title */
    icon?: string;
    /**
     * When true, shows a button to read the section aloud using the selected TTS engine.
     * When false, the audio button is hidden, but the guidance note may still appear
     * if no voices are available (to explain why audio might not work on this device).
     */
    enableAudio?: boolean;
    /**
     * Content of the section. For best results, pass a single Element wrapper
     * that contains the text to be read aloud.
     */
    children: React.ReactNode;
}

/**
 * FeedbackSection
 *
 * Renders a titled section of feedback with optional text-to-speech playback.
 * On mount, it subscribes to the Web Speech API's `voiceschanged` event to
 * detect when voices are available. If no compatible voices are found, a small
 * guidance note is displayed to help the user install voices.
 *
 * Notes
 * - The PlaybackService singleton is used to drive TTS.
 * - The first Element child under this component is used as the text container
 *   for reading aloud. Provide a single Element wrapper for predictable results.
 * - This is a client-only component and guards for SSR/runtime where the Web
 *   Speech API may not be present.
 */
const FeedbackSection = ({
    title,
    icon,
    enableAudio,
    children,
}: FeedbackSectionProps): React.JSX.Element => {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const playbackService = useRef<PlaybackService>(PlaybackService.getInstance(PlaybackEngineType.TTS));
    const [hasVoices, setHasVoices] = useState<boolean | null>(null); // Unknown at first to avoid flicker

    useEffect(() => {
        let isMounted = true;
        // Check whether voices are currently available from the engine
        const updateHasVoices = async () => {
            try {
                const voices = await playbackService.current.getAvailableVoices();
                if (!isMounted) return;
                const available = Array.isArray(voices) && voices.length > 0;
                setHasVoices(available);
            } catch {
                if (!isMounted) return;
                setHasVoices(false);
            }
        };

        // Attach event listener first to catch early, and subsequent voice population
        const handler = () => updateHasVoices();
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.addEventListener("voiceschanged", handler);
        }

        updateHasVoices();

        return () => {
            isMounted = false;
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.removeEventListener("voiceschanged", handler);
            }
        };
    }, []);
    
    /**
     * Reads the section content aloud using the PlaybackService.
     * Uses the first Element child of the content wrapper as the text container.
     * Silently no-ops if the child is not present or not an Element.
     */
    const handleSpeak = async () => {
        if (!contentRef.current || !(contentRef.current.firstChild instanceof Element)) return;

        try {
        await playbackService.current.setTextDiv(contentRef.current.firstChild);
            await playbackService.current.play();
        } catch (error) {
        console.error("Speech synthesis error:", error);
        }
    };
    return (
        <section>
            <h3 className="font-semibold">
                {icon ? `${icon} ${title}` : title}
            </h3>
            {/* Optional audio button */}
            {enableAudio && <button
            type="button"
            onClick={handleSpeak}
            className="text-gray-500 hover:text-primary transition"
            title="Read aloud"
            aria-label="Read this section aloud"
            disabled={hasVoices === false}
            >
            🔊
            </button>}
            {/* Show guidance when voices are unavailable */}
            {!hasVoices && (
                <p className="mt-2 text-sm text-muted-foreground">
                    Audio unavailable. No voice found for your target language. You may need to install a language pack with Text-to-Speech on your device. See:
                    {" "}
                    <a
                        href="https://learn.microsoft.com/en-us/answers/questions/4111106/how-to-install-a-language-pack-with-text-to-speech"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="underline"
                    >
                        how to install a language pack with TTS
                    </a>
                    .
                </p>
            )}
            <div ref={contentRef}>{children}</div>
        </section>
)};

export default FeedbackSection;
