import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { LabeledTextarea } from "@/components/features/io/LabeledTextarea";
import { describe, it, expect, vi } from "vitest";


describe("LabeledTextarea", () => {
  it("renders label and textarea", () => {
    render(
      <LabeledTextarea 
        label="German" 
        value="" 
        onChange={() => {}} 
        id="test-textarea"
      />
    );
    expect(screen.getByLabelText("German")).toBeDefined();
  });

  it("shows error message", () => {
    render(
      <LabeledTextarea 
        label="German" 
        value="" 
        id="test-textarea"
        onChange={() => {}}
        error="Invalid" 
      />
    );
    expect(screen.getByText("Invalid")).toBeDefined();
  });

  it("calls onChange", async() => {
    const user = userEvent.setup();
    const handleChange = vi.fn((e: React.ChangeEvent<HTMLTextAreaElement>) => {});
    render(
      <LabeledTextarea
        label="German Sentence"
        value=""
        id="test-textarea"
        onChange={handleChange}
      />
    );
    const textarea = screen.getByLabelText(/German Sentence/i);
    await user.type(textarea, "Hallo");

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledTimes(5); // called once per character typed
  });
});
