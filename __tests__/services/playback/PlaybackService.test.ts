import { describe, it, expect, vi, beforeEach } from "vitest";
import { PlaybackService } from "@/services/playback/PlaybackService";
import { PlaybackEngineType } from "@/enums/playback-engines";
import { DEFAULT_TARGET_LANGUAGE } from "@/constants/general";

class FakeEngine {
  public setLanguage = vi.fn();
  public getLanguage = vi.fn();
  public getVoices = vi.fn();
}

vi.mock("@/services/playback/engines/WASpeechSynthesis", () => {
  return {
    default: vi.fn().mockImplementation(() => new FakeEngine()),
  };
});



describe("PlaybackService", () => {
  beforeEach(() => {
    // Reset the singleton for isolation between tests
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (PlaybackService as any).instance = null;
  });

  it("refreshVoices calls to engine.getVoices", async () => {
    const playbackService = PlaybackService.getInstance(PlaybackEngineType.TTS);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const engine = (playbackService as any).engine as FakeEngine;
    playbackService.refreshVoices();
    expect(engine.getVoices).toHaveBeenCalled();
  });

  it("setLanguage calls to engine.setLanguage and refreshes voices", async () => {
    const playbackService = PlaybackService.getInstance(PlaybackEngineType.TTS);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const engine = (playbackService as any).engine as FakeEngine;
    playbackService.setLanguage(DEFAULT_TARGET_LANGUAGE);
    expect(engine.setLanguage).toHaveBeenCalledWith(DEFAULT_TARGET_LANGUAGE);
    expect(engine.getVoices).toHaveBeenCalled();
  });
});
