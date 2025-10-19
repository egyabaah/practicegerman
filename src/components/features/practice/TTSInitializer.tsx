"use client";

import { useEffect } from "react";
import { PlaybackService } from "@/services/playback/PlaybackService";
import { PlaybackEngineType } from "@/enums/playback-engines";

/**
 * TTSInitializer
 *
 * A tiny, invisible component that pre-initializes the Web Speech engine as
 * soon as the Practice page mounts. This helps avoid the first-load window
 * where voices are not yet populated and the UI would show a temporary note.
 */
export default function TTSInitializer() {
    useEffect(() => {
        // Start the playback service (singleton) to construct the engine and attach listeners and populate voices
        PlaybackService.getInstance(PlaybackEngineType.TTS);
    }, []);

    return null;
}
