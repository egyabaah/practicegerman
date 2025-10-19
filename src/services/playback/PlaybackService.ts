import { PlaybackEngineType } from "@/enums/playback-engines";
import PlaybackEngineBase from "./base/PlaybackEngineBase";
import { LanguageCode } from "@/enums/language-codes";
import WASpeechSynthesis from "./engines/WASpeechSynthesis";


/**
 * Singleton Playback Service to handle playback of text
 * Architecture inspired by the PlaybackService/Engine pattern used in my react native app: Voicen AI.
 * This implementation is a simplified/independent adaptation for web (Next.js).
 */
export class PlaybackService {
    private engine!: PlaybackEngineBase;
    private textDiv: Element | null = null;

    static instance: PlaybackService | null = null;

    private constructor(engineType?: PlaybackEngineType) {
        if (engineType) {
            this.setEngine(engineType)
        }
    }

    public static getInstance(engineType: PlaybackEngineType = PlaybackEngineType.TTS): PlaybackService {
        if (PlaybackService.instance === null) {
            PlaybackService.instance = new PlaybackService(engineType)
        }

        return PlaybackService.instance

    }

    /**
     * Sets the playback engine to be used for text playback.
     * If the current engine exists, it will be stopped and cleaned up before the new engine is set.
     * @param {PlaybackEngineType} engineType - The type of playback engine to set.
     * @returns {Promise<void>} - A promise that resolves when the engine has been set.
     */
    async setEngine(engineType: PlaybackEngineType): Promise<void> {
        // Stop and cleanup current engine if it exists
        if (this.engine) {
            await this.engine.cleanup();
        }
        if (engineType === PlaybackEngineType.TRACKPLAYER) {
            // TODO: Implement TrackPlayerEngine and replace the line below
            this.engine = new WASpeechSynthesis();
        } else {
            this.engine = new WASpeechSynthesis();
        }
    }

    /**
     * Sets the text div element that will be used for text playback for highlight and playback.
     * If no text div is provided, the current text div will be unset.
     * @param {Element | null} textDiv - The text div element to set, or null to unset the current text div.
     * @returns {Promise<void>} - A promise that resolves when the text div has been set.
     */
    async setTextDiv(textDiv: Element | null): Promise<void> {
        this.textDiv = textDiv;
        await this.engine?.setTextDiv(textDiv);
    }
    /**
     * Gets the currently set text div element.
     * @returns {Element | null} The currently set text div element, or null if no text div is set.
     */
    getTextDiv(): Element | null {
        return this.textDiv;
    }

    /**
     * Plays the currently set text div element using the playback engine.
     * Any current playback will be stopped before starting the new playback.
     * @returns {Promise<void>} - A promise that resolves when the playback has started.
     */
    async play(): Promise<void> {
        await this.engine?.play();
    }

    /**
     * Pauses the currently playing text div element.
     * If no text div is currently playing, this method does nothing.
     * @returns {Promise<void>} - A promise that resolves when the playback has been paused.
     */
    async pause(): Promise<void> {
        await this.engine?.pause();
    }

    /**
     * Stops the currently playing text div element.
     * If no text div is currently playing, this method does nothing.
     * @returns {Promise<void>} - A promise that resolves when the playback has been stopped.
     */
    async stop(): Promise<void> {
        await this.engine?.stop();
    }

    /**
     * Seeks forward in the currently set text div element by a predefined amount of time.
     * If no text div is currently set, this method does nothing.
     * @returns {Promise<void>} - A promise that resolves when the seek operation has completed.
     */
    async seekForward(): Promise<void> {
        await this.engine?.seekForward();
    }
    /**
     * Seeks backward in the currently set text div element by a predefined amount of time.
     * If no text div is currently set, this method does nothing.
     * @returns {Promise<void>} - A promise that resolves when the seek operation has completed.
     */
    async seekPrevious(): Promise<void> {
        await this.engine?.seekPrevious();
    }


    /**
     * Sets the voice to be used for text playback.
     * If the voiceId is not a number, it will be used to set the voice for the TTS engine.
     * If the voiceId is a number, it will be used to set the voice for the TrackPlayer engine.
     * @param {string} voiceId - The id of the voice to set.
     * @returns {Promise<void>} - A promise that resolves when the voice has been set.
     */
    async setVoice(voiceId: string): Promise<void> {
        try {
            const voiceIdInt = parseInt(voiceId);
            if (isNaN(voiceIdInt)) {
                // If voiceId is not a number, use TTS engine
                if (!(this.engine instanceof WASpeechSynthesis)) {
                    await this.setEngine(PlaybackEngineType.TTS);
                }
            } else {
                // If voiceId is a number, use TrackPlayer engine
                // if (!(this.engine instanceof TrackPlayerEngine)) {
                //     await this.setEngine("tp");
                // }
                throw (new Error("Trackplayer unimplemented yet."))
            }
            await this.engine?.setVoice(voiceId);
        } catch (error) {
            console.error("PSSV01: Error in setVoice:", error);
        }
    }
    /**
     * Gets the current voice used for text playback.
     * If no voice is currently set, this method returns null.
     * @returns {string | null} - The current voice used for text playback, or null if no voice is set.
     */
    getCurrentVoice(): string | null {
        return this.engine?.getVoice() || null;
    }

    /**
     * Returns a list of available voices for the currently set playback engine.
     * If the currently set playback engine is not a TTS engine, this method will throw an error.
     * @returns {Promise<SpeechSynthesisVoice[]>} - A promise that resolves with a list of available voices.
     */
    async getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
        if (this.engine instanceof WASpeechSynthesis) {
            return await this.engine.getAvailableVoices();
        } else {
            throw new Error('PSGAV01: getAvailableVoices is only available for TTS playback');
        }
    }

    /**
     * Explicitly refresh the list of available voices on the engine.
     * Helpful for browsers that require an initial getVoices() call to trigger population.
     */
    refreshVoices(): void {
        this.engine?.getVoices();
    }

    /**
     * Set the target language on the current engine and refresh any language-dependent resources.
     */
    setLanguage(lang: LanguageCode): void {
        this.engine?.setLanguage(lang);
        // After language changes, refresh engine voices to reflect new locale
        this.engine?.getVoices();
    }

    /**
     * Get the currently configured language from the engine.
     */
    getLanguage(): LanguageCode | undefined {
        return this.engine?.getLanguage();
    }

    /**
     * Sets the speech rate of the currently set playback engine.
     * If the currently set playback engine does not support speech rate, this method does nothing.
     * @param {number} rate - The speech rate to set, where 1.0 is the default rate, 0.5 is half the default rate, and 2.0 is double the default rate.
     * @returns {Promise<void>} - A promise that resolves when the speech rate has been set.
     */
    async setRate(rate: number): Promise<void> {
        await this.engine?.setSpeechRate(rate);
    }
    /**
     * Sets the pitch of the currently set playback engine.
     * If the currently set playback engine does not support pitch, this method does nothing.
     * @param {number} pitch - The pitch to set, where 1.0 is the default pitch, 0.5 is half the default pitch, and 2.0 is double the default pitch.
     * @returns {Promise<void>} - A promise that resolves when the pitch has been set.
     */
    async setPitch(pitch: number): Promise<void> {
        await this.engine?.setPitch(pitch);
    }

    // async updateBookProgress(pageIndex: number, sentenceIndex: number){
    //   await BookService.updateBook(this.bookId, { lastReadPage: pageIndex, lastReadSentence: sentenceIndex });
    // }

}
