// Polyfill for requestSubmit in JSDOM
if (!HTMLFormElement.prototype.requestSubmit) {
    HTMLFormElement.prototype.requestSubmit = function () {
        this.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    };
}
