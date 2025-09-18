import "@testing-library/dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// cleanup DOM after each test to prevent "Found multiple elements by" error
afterEach(() => {
    cleanup();
});
