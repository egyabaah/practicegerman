import { LanguageCode } from "@/enums/language-codes";
import { CustomPlayBackState } from "@/enums/custom-playback-states";
import PlaybackEngineBase from "../base/PlaybackEngineBase";

/**
 * WASpeechSynthesis
 *
 * Web Speech API–based playback engine for local, on-device text-to-speech.
 * Implements the PlaybackEngineBase contract and integrates with the
 * highlight service for per-word and per-sentence highlighting via
 * `boundary` and `start` events.
 *
 * Capabilities
 * - play/pause/resume/stop
 * - voice selection (best-effort by language; preserves current voice when possible)
 * - rate and pitch control (engine/browser dependent)
 * - word and sentence highlighting
 *
 * Limitations
 * - Seeking is not supported by the Web Speech API (methods throw or no-op) and  not really needed currently
 * - Voices availability is browser/OS dependent and populated asynchronously
 *
 * SSR and environment safety
 * - Lazily initializes Web Speech objects only when `window` is available;
 *   otherwise methods short-circuit gracefully.
 * - Instantiate this engine only in client-only paths in Next.js.
 *
 * Lifecycle
 * - Binds event listeners in the constructor (client-only)
 * - Provides `cleanup()` to remove listeners and cancel ongoing speech
 *
 * Usage
 * - Set a text container via `setTextDiv()`; engine will read textContent.
 * - Optionally call `setLanguage()` prior to `play()` to bias voice selection.
 * - Use `getAvailableVoices()` to present a user-facing voice picker.
 */
export default class WASpeechSynthesis extends PlaybackEngineBase {
    private isPlaying: boolean = false;
    private position: number = 0;
    private isReady: boolean = false;
    private currentWordStart: number = -1;
    private currentWordEnd: number = -1;
    private currentUtteranceId: number | string = -1;
    private speechSynthesis: SpeechSynthesis | null = null;
    private speechSynthesisUtterance: SpeechSynthesisUtterance | null = null;
    private voices: SpeechSynthesisVoice[] = [];
    // Keep bound handler references for add/removeEventListener symmetry
    private handleVoicesChanged = this.getVoices.bind(this);
    private onTtsStart = this.handleTtsStart.bind(this);
    private onTtsBoundary = this.handleTtsProgress.bind(this);
    private onTtsEnd = this.handleTtsFinish.bind(this);
    private onTtsError = this.handleTtsError.bind(this);
    /**
     * Initializes a new instance of the WASpeechSynthesis class.
     * This is only run on the client-side to avoid SSR errors.
     * If the speech synthesis API is not available (e.g., in SSR or unsupported environments),
     * all methods will return gracefully.
     */
    constructor() {
        super()
        // Initialize only on client to avoid SSR errors
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            this.speechSynthesis = window.speechSynthesis;
            this.speechSynthesisUtterance = new window.SpeechSynthesisUtterance();
            // Listen for voice changes BEFORE initial fetch to catch early-populated events
            // Some browsers populate voices asynchronously and may fire the event very quickly
            this.speechSynthesis.addEventListener("voiceschanged", this.handleVoicesChanged);
            // Initial fetch (may return empty on first load until voiceschanged fires)
            this.getVoices();
            this.speechSynthesisUtterance.addEventListener("start", this.onTtsStart);
            this.speechSynthesisUtterance.addEventListener("boundary", this.onTtsBoundary);
            this.speechSynthesisUtterance.addEventListener("end", this.onTtsEnd);
            this.speechSynthesisUtterance.addEventListener("error", this.onTtsError);
        } else {
            console.warn("WASS-ENV01: Window not available; speech synthesis not initialized (SSR or unsupported environment)")
            // In SSR or unsupported environments, leave synthesis null
            // Callers should handle this gracefully via guards below
        }
    }

    /**
     * Retrieves the available voices for the current language.
     * Filters voices to include only local voices matching the language.
     * If no voices are found, an alert is displayed with instructions to add voices.
     */
    getVoices() {
        if (typeof window === "undefined" || !this.speechSynthesis || !this.speechSynthesisUtterance) {
            this.voices = [];
            return;
        }
        // Get all available voices
        const availableVoices = this.speechSynthesis.getVoices() || [];
        const langPrefix = (this.language || "").slice(0, 2);

        // Prefer local voices matching language, then any voices matching language
        let filteredVoices = availableVoices.filter(v => v.lang?.slice(0, 2) === langPrefix && (v.localService ?? true));
        if (filteredVoices.length === 0) {
            filteredVoices = availableVoices.filter(v => v.lang?.slice(0, 2) === langPrefix);
        }
        // Set voices to filtered list
        this.voices = filteredVoices;

        if (this.voices.length > 0) {
            // Keep current voice if still available, else default to first
            const currentVoiceName = this.voiceId?.trim();
            const chosenVoice = (currentVoiceName && this.voices.find(v => v.name?.trim() === currentVoiceName)) || this.voices[0];
            if (chosenVoice?.name) {
                this.setVoice(chosenVoice.name);
            }
            if (chosenVoice?.lang && this.speechSynthesisUtterance) {
                // Fallback for chrome on android since there are no names provided for the voices
                this.speechSynthesisUtterance.lang = chosenVoice.lang;
            }
        } else {
            // TODO: Add event emitter in future for production and rn environments and better UX

        }

    }




    /**
     * Sets a custom voice by its ID (name for WebSpeechAPI).
     * @param {string} voiceId - The name of the voice to set.
     * @throws {Error} If the specified voice is not found.
     */
    async setVoice(voiceId: string): Promise<void> {
        this.voiceId = voiceId;
        const voice = this.voices.find(voice => voice.name.trim() === this.voiceId?.trim());
        if (!voice) {
            throw new Error(`Voice ${this.voiceId} not found`);
        }
        if (!this.speechSynthesisUtterance) {
            console.warn("WASS-SV01: Cannot set voice; speech synthesis not initialized (SSR or unsupported environment)");
            return;
        }
        this.speechSynthesisUtterance.voice = voice;
    }

    /**
     * Retrieves a list of available voices for the current language.
     * @returns {Promise<SpeechSynthesisVoice[]>} - A promise that resolves to an array of available voices.
     */
    async getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
        return this.voices;
    }

    /**
     * Sets the language for speech synthesis and refreshes voice list.
     * Also updates the base engine's language state for consistency.
     * @param {LanguageCode} language - The language code to set (e.g., "en-US").
     */
    setLanguage(language: LanguageCode): void {
        super.setLanguage(language);
        if (this.speechSynthesisUtterance) {
            this.speechSynthesisUtterance.lang = language;
        }
        this.getVoices();
    }

    // Set the default engine for the speech synthesis eg: browser engine or local engine
    /**
     * Sets the default engine for the speech synthesis.
     * Note: This method is not applicable for the Web Speech API.
     * It is primarily intended for Android TTS engines to select between options like Google, Samsung, etc.
     * @param {string} engine - The name of the engine to set.
     */
    async setDefaultEngine(engine: string) {
        // Not applicable for Web Speech API, mainly for android tts engines
        // to choose google, samsung, etc. Log to prevent no unused variable linting
        console.warn("WASS-SDE01: setDefaultEngine is not applicable for Web Speech API.", engine);
    }

    /**
     * Handles the progress of text-to-speech playback.
     * Highlights the current word being spoken in the text div.
     * @param {SpeechSynthesisEvent} event - The speech synthesis event containing the character index.
     */
    async handleTtsProgress(event: SpeechSynthesisEvent) {
        try {
            if (!this.textDiv) {
                return;
            }
            // Highlight the current word being spoken
            this.highlightService.highlightWord(this.textDiv, event.charIndex)
        } catch (error) {
            console.error("WASS-HTP01: Error handling TTS progress: ", error, event.charIndex);
        }
    }
    /**
     * Handles the start of text-to-speech playback.
     * Highlights the current sentence being spoken in the text div.
     * @param {SpeechSynthesisEvent} event - The speech synthesis event.
     */
    async handleTtsStart(event: SpeechSynthesisEvent) {
        try {
            if (!this.textDiv) {
                return;
            }
            this.highlightService.highlightSentence(this.textDiv);
            this.currentWordStart = -1;
            this.currentWordEnd = -1;
            // Emit playing when utterance actually starts
            this.setAppPlaybackState(CustomPlayBackState.PLAYING);
        } catch (error) {
            console.error("WASS-HTS01: Error handling TTS start: ", error, event.charIndex);
        }
    }
    /**
     * Handles the completion of text-to-speech playback.
     * Calls the parent class method to handle sentence completion.
     * @param {SpeechSynthesisEvent} event - The speech synthesis event.
     */
    async handleTtsFinish(event: SpeechSynthesisEvent) {
        try {
            await super.handleSentenceFinished();
            // Consider STOPPED when the utterance ends fully
            this.setAppPlaybackState(CustomPlayBackState.STOPPED);

        } catch (error) {
            console.error("WASS-HTF01: Error handling TTS finish: ", error, event.charIndex);
        }
    }
    /**
     * Handles errors during text-to-speech playback.
     * Logs the error and displays an alert with the error details.
     * @param {SpeechSynthesisErrorEvent} event - The speech synthesis error event.
     */
    async handleTtsError(event: SpeechSynthesisErrorEvent) {
        console.error("WASS-ERR01: Speech Synthesis Error:", event.error, "at index", event.charIndex);
        // Consider emitting an event via an application-level event emitter for UI surfaces.
        // Avoid using alert() to prevent blocking UI and to keep tests non-interactive.
    }
    /**
     * Seeks forward in the playback by a predefined amount of time.
     * Stops the current playback before seeking.
     * @returns {Promise<void>} - A promise that resolves when the seek operation is completed.
     */
    async seekForward(): Promise<void> {
        await this.stop();
        throw new Error('Method not implemented.');
    }
    /**
     * Seeks backward in the playback by a predefined amount of time.
     * Stops the current playback before seeking.
     * @returns {Promise<void>} - A promise that resolves when the seek operation is completed.
     */
    async seekPrevious(): Promise<void> {
        this.stop();
        throw new Error('Method not implemented.');
    }
    /**
     * Sets the speech rate for the speech synthesis.
     * The rate is a float where 1.0 is the default rate, 0.5 is half the default rate, and 2.0 is double the default rate.
     * @param {number} rate - The speech rate to set.
     * @returns {Promise<void>} - A promise that resolves when the speech rate has been set.
     * @note If the speech synthesis is currently playing, it will be stopped and restarted with the new rate.
     * @note Min is 0.1 and max is 10 according to spec but actual min and max might vary between browsers.
     * @link https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/rate#value
     */
    async setSpeechRate(rate: number): Promise<void> {
        if (!this.speechSynthesisUtterance) {
            console.warn("WASS-SSR01: Cannot set rate; speech synthesis not initialized");
            return;
        }
        // Set the rate on the utterance
        this.speechSynthesisUtterance.rate = rate;
        // Restart playback if currently playing
        if (this.isPlaying) {
            await this.stop();
            await this.play();
        }
    }

    /**
     * Sets the pitch for the speech synthesis.
     * @param {number} value - The pitch value to set (0 is lowest, 2 is highest).
     * @returns {Promise<void>} - A promise that resolves when the pitch has been set.
     * @note If the speech synthesis is currently playing, it will be stopped and restarted with the new pitch.
     * @note Min and max might vary between browsers but the spec does not export any min and max values.
     * @link https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/pitch#value
     */
    async setPitch(value: number): Promise<void> {
        if (!this.speechSynthesisUtterance) {
            console.warn("WASS-SP01: Cannot set pitch; speech synthesis not initialized");
            return;
        }
        // Set the pitch on the utterance
        this.speechSynthesisUtterance.pitch = value;
        // Restart playback if currently playing
        if (this.isPlaying) {
            await this.stop();
            await this.play();
        }
    }


    /**
     * Starts playback of the current text.
     * Stops any existing playback before starting.
     * @returns {Promise<void>} - A promise that resolves when playback starts.
     */
    async play(): Promise<void> {
        await this.stop(); // Stop any existing playing speechSynthesis
        // Exit if no textDiv or text is set or text is empty
        if (!this.textDiv || !this.text.trim()) {
            return;
        }
        if (!this.speechSynthesis || !this.speechSynthesisUtterance) {
            console.warn("WASS-PLAY01: Speech synthesis not initialized (SSR or unsupported environment)");
            return;
        }
        // Set the text to be spoken
        this.speechSynthesisUtterance.text = this.text;
        // Start speaking
        this.speechSynthesis.speak(this.speechSynthesisUtterance);
        this.isPlaying = true;
    }



    /**
     * Pauses the current playback.
     * @returns {Promise<void>} - A promise that resolves when playback is paused.
     */
    async pause(): Promise<void> {
        this.isPlaying = false;
        this.speechSynthesis?.pause();  // Note: Pausing might need custom handling
        this.setAppPlaybackState(CustomPlayBackState.PAUSED);
    }

    /**
     * Resumes playback after a pause.
     * Note: Web Speech API resumes from the current position only if paused; otherwise no-op.
     */
    async resume(): Promise<void> {
        this.speechSynthesis?.resume();
        this.isPlaying = true;
        this.setAppPlaybackState(CustomPlayBackState.PLAYING);
    }

    /**
     * Stops the current playback.
     * Cancels any ongoing speech synthesis and resets the playback state.
     * @returns {Promise<void>} - A promise that resolves when playback is stopped.
     */
    async stop(): Promise<void> {
        this.isPlaying = false;
        await super.handleSentenceFinished();
        this.speechSynthesis?.cancel();
        this.setAppPlaybackState(CustomPlayBackState.STOPPED);
    }

    /**
     * Cleanup listeners and cancel any ongoing synthesis.
     * Should be called when switching engines or disposing this engine instance.
     */
    public async cleanup(): Promise<void> {
        try {
            // Remove event listeners
            this.speechSynthesis?.removeEventListener("voiceschanged", this.handleVoicesChanged);
            this.speechSynthesisUtterance?.removeEventListener("start", this.onTtsStart);
            this.speechSynthesisUtterance?.removeEventListener("boundary", this.onTtsBoundary);
            this.speechSynthesisUtterance?.removeEventListener("end", this.onTtsEnd);
            this.speechSynthesisUtterance?.removeEventListener("error", this.onTtsError);
        } catch {
            // Ignore if already removed or not available
        }
        try {
            // Remove all utterances from utterance queue
            this.speechSynthesis?.cancel();
        } catch {
            // Do nothing
        }
        this.speechSynthesis = null;
        this.speechSynthesisUtterance = null;
        // Call parent cleanup
        await super.cleanup();
    }
}