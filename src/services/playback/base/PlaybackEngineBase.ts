import { DEFAULT_TARGET_LANGUAGE } from "@/constants/general";
import { CustomPlayBackState } from "@/enums/custom-playback-states";
import { LanguageCode } from "@/enums/language-codes";
import HighlightService from "@/services/highlight/HighlightService";

/**
 * Abstract base for all playback engines (web and cloud).
 * Adapted from PlaybackService.ts in Voicen AI project
 *
 * Responsibilities:
 * - Hold common state (text, language, voice, DOM reference, highlighter)
 * - Provide lifecycle helpers (reset, cleanup, finished highlighting)
 * - Define the playback contract to be implemented by engines
 *
 * Contract expectations for implementers:
 * - Respect play/pause/resume/stop semantics
 * - Implement seekForward/seekPrevious if supported (or throw a clear error)
 * - Keep event listeners balanced and released in cleanup()
 * - Update voice/rate/pitch synchronously with engine capabilities
 */
export default abstract class PlaybackEngineBase {

    protected text: string = "";
    protected textDiv: Element | null = null;
    protected voiceId: string | null = null;
    protected language: LanguageCode = DEFAULT_TARGET_LANGUAGE;
    protected highlightService: HighlightService;
    /** Listeners subscribed to playback state changes */
    private playbackStateListeners: Set<(state: CustomPlayBackState, meta?: Record<string, unknown>) => void> = new Set();

    /**
     * Initializes a new instance of the PlaybackEngineBase class.
     * Sets the highlight service to be used for highlighting words in the text.
     */
    constructor() {
        this.highlightService = HighlightService.getInstance();
    }

    /**
     * Set the text to be played back.
     * @param text the text to be played back
     */
    protected setText(text: string) {
        this.text = text;
    }

    /**
     * Gets the currently set text.
     * @returns {string} The currently set text.
     */
    protected getText(): string {
        return this.text;
    }

    /**
     * Sets the text div element that will be used for text playback for highlight and playback.
     * If no text div is provided, the currently set text div will be unset.
     * @param {Element | null} textDiv - The text div element to set, or null to unset the current text div.
     * @returns {void} - A promise that resolves when the text div has been set.
     */
    public setTextDiv(textDiv: Element | null): void {
        this.textDiv = textDiv;
        // Set the text from the textDiv, or empty string if textDiv is null
        this.text = textDiv ? textDiv.textContent || "" : "";
    }


    /**
     * Gets the current text container used for highlighting and playback.
     * @returns {Element | null} The element containing the text, or null if none set.
     */
    protected getTextDiv(): Element | null {
        return this.textDiv;
    }

    /**
     * Sets the target language for playback/highlighting.
     * Engines may use this to choose voices or apply locale-specific logic.
     * Public so services/UI can change language.
     */
    public setLanguage(lang: LanguageCode) {
        this.language = lang;
    }

    /**
     * Gets the currently configured language.
     */
    public getLanguage(): LanguageCode {
        return this.language;
    }


    /**
     * Clears the current text and DOM references.
     * Implementations should call this when resetting engine state.
     */
    protected reset() {
        this.text = "";
        this.textDiv = null;
    }

    /**
     * Cleans up resources.
     * Default: clears text and DOM references and calls stop().
     * Implementations should override to detach listeners and release resources,
     * then call super.cleanup() at the end.
     */
    public async cleanup() {
        this.text = "";
        this.textDiv = null;
        await this.stop();
    }

    /**
     * Called when a sentence finishes playing; removes any active highlights.
     * Implementations may call this from their engine-specific end/boundary events.
     */
    protected async handleSentenceFinished() {
        this.highlightService.removeHighlights();
    }

    /**
     * Returns the currently selected voice identifier, if any.
     */
    public getVoice(): string | null {
        return this.voiceId
    }

    /**
     * Subscribe to playback state changes emitted by the engine.
     * Returns an unsubscribe function.
     */
    public onPlaybackStateChange(
        listener: (state: CustomPlayBackState, meta?: Record<string, unknown>) => void
    ): () => void {
        this.playbackStateListeners.add(listener);
        return () => this.playbackStateListeners.delete(listener);
    }

    /**
     * Emit a playback state update to all subscribers.
     * Engines should call this whenever their internal state changes.
     */
    protected emitPlaybackState(state: CustomPlayBackState, meta?: Record<string, unknown>): void {
        for (const cb of this.playbackStateListeners) {
            try {
                cb(state, meta);
            } catch (_e) {
                // Swallow listener errors to avoid breaking engine flow
                console.error("PEBEPSCE01: Error in playback state listener callback: ", cb.name, _e);
            }
        }
    }

    /**
     * Emits an app-level playback state to subscribers.
     * Useful when the current item has finished but the next item is still preparing/downloading,
     * so the UI can reflect a BUFFERING state between tracks.
     * Consumers subscribe via {@link onPlaybackStateChange}.
     *
     * @param state - Next playback state to emit (e.g., CustomPlayBackState.PLAYING | PAUSED | BUFFERING | STOPPED).
     */
    protected setAppPlaybackState(state: CustomPlayBackState) {
        console.log(state);
        // Emit event so services/stores can subscribe.
        this.emitPlaybackState(state);
    }
    /**
     * Begin playback from the current position/text.
     */
    abstract play(): Promise<void>;
    /**
     * Pause playback if supported; should be a no-op if not supported.
     */
    abstract pause(): Promise<void>;
    /**
     * Resume playback if previously paused; no-op if unsupported.
     */
    abstract resume(): Promise<void>;
    /**
     * Stop playback and reset any in-progress highlighting/state.
     */
    abstract stop(): Promise<void>;
    /**
     * Skip forward (e.g., to next sentence/segment) if supported.
     */
    abstract seekForward(): Promise<void>;
    /**
     * Skip backward (e.g., to previous sentence/segment) if supported.
     */
    abstract seekPrevious(): Promise<void>;
    /**
     * Refresh the list of available voices for the current language.
     */
    abstract getVoices(): void;
    /**
     * Set speech speed/rate (engine decides supported range/behavior).
     */
    abstract setSpeechRate(rate: number): Promise<void>;
    /**
     * Set speech pitch (engine decides supported range/behavior).
     */
    abstract setPitch(value: number): Promise<void>;
    /**
     * Select a voice by identifier (name or engine-specific id).
     */
    abstract setVoice(voiceId: string): Promise<void>;
}