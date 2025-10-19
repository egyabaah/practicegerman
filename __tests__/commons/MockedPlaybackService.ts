// Mock PlaybackService singleton
export const mockedPlaybackService = {
    getAvailableVoices: vi.fn().mockResolvedValue([] as any[]),
    setTextDiv: vi.fn().mockResolvedValue(undefined),
    play: vi.fn().mockResolvedValue(undefined),
};