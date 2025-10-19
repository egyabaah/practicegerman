import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";

// Mock PlaybackService singleton
const getInstance = vi.hoisted(() => {
    return vi.fn();
})
vi.mock("@/services/playback/PlaybackService", () => ({
  PlaybackService: { getInstance },
}));

import TTSInitializer from "@/components/features/practice/TTSInitializer";

describe("TTSInitializer", () => {
  it("initializes playback service on mount", () => {
    render(<TTSInitializer />);
    expect(getInstance).toHaveBeenCalled();
  });
});
