/**
 * HighlightService
 *
 * A tiny DOM helper used by playback engines to visually highlight the
 * currently spoken sentence and word during text-to-speech.
 *
 * Design
 * - Implemented as a simple singleton to avoid creating multiple DOM helpers.
 * - Works directly with DOM nodes; callers pass the Element that contains the
 *   text that is currently being spoken.
 * - Uses CSS classes rather than inline styles so that themes can control the
 *   presentation in `styles/animations.css` or `styles/components.css`.
 *
 * Contract
 * - `highlightSentence(element)` marks the entire container as active.
 * - `highlightWord(element, charIndex)` wraps the current word in a span
 *    with class `activeWord` based on a character index (from TTS boundary).
 * - `removeHighlights()` removes both sentence and word highlighting.
 *
 * Notes
 * - The word highlight logic assumes the container's firstChild is a text node
 *   and the content is plain text (no nested elements around words). This is
 *   how we render feedback paragraphs today. If richer markup is introduced,
 *   this helper may need to be adapted.
 */
export default class HighlightService {
    static instance: HighlightService | null = null;
    private constructor() {
    }

    public static getInstance(): HighlightService {
        if (HighlightService.instance === null) {
            HighlightService.instance = new HighlightService();
        }
        return HighlightService.instance;
    }

    /**
     * Highlight entire sentence container.
     * Adds the `activeSentence` class to the provided element after removing
     * any previous sentence highlight.
     */
    public highlightSentence(textDiv: Element){
        try {
            this.removeHighlightFromSentence()
            // Add the active class without clobbering existing classes
            textDiv.classList.add("activeSentence");
            // Ensure the active sentence is visible to the user
            this.scrollIntoViewIfNeeded(textDiv);

        } catch (error) {
            console.warn("Failed to highlight sentence", error);
        }
    }

    /**
     * Highlight the word that begins at the specified character index.
     *
     * Parameters
     * - textDiv: Element that contains the full sentence as a single text node
     *   (expected as its first child).
     * - wordStart: The character index (from SpeechSynthesis boundary events)
     *   marking the beginning of the spoken word.
     *
     * Behavior
     * - Removes any prior word highlight spans to avoid nested spans.
     * - Calculates the end of the word by finding the next space; if none,
     *   uses the end of the text content.
     * - Wraps the substring [wordStart, wordEnd) in a <span.activeWord>.
     */
    public highlightWord(textDiv: Element, wordStart: number) {
        // Ensure we have a text div and a text node
        if (!textDiv) return;
        // Remove previous highlights NB: Must always be called before getting firstChild
        // because first child may be different after removal
        this.removeHighlightFromWord();
        const firstChild = textDiv.firstChild;
        if (!firstChild || firstChild.nodeType !== Node.TEXT_NODE) return;
        const text = (firstChild.textContent ?? "");
        if (!text || wordStart < 0 || wordStart >= text.length) return;
        // Find end of word by scanning until whitespace
        let i = wordStart;
        while (i < text.length && !/\s/.test(text[i])) i++;
        const wordEnd = i;
        const range = document.createRange();
        range.setStart(firstChild, wordStart);
        range.setEnd(firstChild, wordEnd);
        // Wrap the selected text in a span
        const highlightSpan = document.createElement("span");
        highlightSpan.className = "activeWord";
        range.surroundContents(highlightSpan);
        // Gently bring the active word into view if it's out of viewport
        this.scrollIntoViewIfNeeded(highlightSpan);
        
    }
    /**
     * Scroll the given element into view if it's outside the current viewport.
     * Uses a minimal, browser-native approach and is guarded for non-DOM/test envs.
     */
    private scrollIntoViewIfNeeded(el: Element) {
        try {
            const hasScrollIntoView = typeof el.scrollIntoView === "function";
            if (!hasScrollIntoView) return;
            // 'nearest' attempts to scroll only the minimal amount if needed
            el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        } catch {
            // Ignore in environments where scrolling isn't supported (e.g., jsdom)
        }
    }
    /**
     * Replace a span wrapper with its textual contents.
     * Useful to undo a previous surroundContents without disrupting the
     * surrounding text nodes. Calls parent.normalize() to merge adjacent
     * text nodes after replacement.
     */
    private replaceSpanWithInnerHTML(span: Element) {
        const textContent = span.textContent ?? "";
        const textNode = document.createTextNode(textContent);
        const parent = span.parentNode;
        parent?.replaceChild(textNode, span); // Replace span with the text node
        // Merge consecutive text nodes in the parent
        parent?.normalize(); 
    }
    /** Remove both word and sentence highlights, if present. */
    public removeHighlights() {
        this.removeHighlightFromWord();
        this.removeHighlightFromSentence();
    }
    /**
     * Remove any existing word highlight spans by unwrapping them back into
     * plain text nodes.
     */
    private removeHighlightFromWord() {
        document.querySelectorAll(".activeWord").forEach(span => {
            this.replaceSpanWithInnerHTML(span);
        });
    }
    /** Remove the sentence-level highlight class from the previous container. */
    private removeHighlightFromSentence() {
        const oldSpan = document.querySelector(".activeSentence");
        oldSpan?.classList.remove("activeSentence");
    }
}