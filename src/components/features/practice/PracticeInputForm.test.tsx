import { render, screen, fireEvent, within } from "@testing-library/react";
import { PracticeInputForm } from "@/components/features/practice/PracticeInputForm";
import { describe, it, expect, vi } from "vitest";

describe("PracticeInputForm", () => {
  it("renders inputs", () => {
    render(
      <PracticeInputForm
        targetSentence=""
        nativeSentence=""
        loading={false}
        onTargetSentenceChange={() => {}}
        onNativeSentenceChange={() => {}}
        onSubmit={() => {}}
      />
    );
    expect(screen.getByLabelText(/Your German Sentence/i)).toBeDefined();
    expect(screen.getByLabelText(/Intended Meaning/i)).toBeDefined();
  });

  it("calls onSubmit when form is submitted", () => {
    const onSubmit = vi.fn();
    render(
      <PracticeInputForm
        targetSentence="Hallo Welt"
        nativeSentence="Hello world"
        loading={false}
        onTargetSentenceChange={() => {}}
        onNativeSentenceChange={() => {}}
        onSubmit={onSubmit}
      />
    );
    const form = screen.getByTestId("form-practice-input");
    const submitButton = within(form).getByRole("button", { name: /Check Sentence/i });
    fireEvent.click(submitButton);
    expect(onSubmit).toHaveBeenCalled();
  });

  it("disables button when loading", () => {
    const onSubmit = vi.fn();
    render(
      <PracticeInputForm
        targetSentence=""
        nativeSentence=""
        loading={true}
        onTargetSentenceChange={() => {}}
        onNativeSentenceChange={() => {}}
        onSubmit={onSubmit}
      />
    );
    expect(screen.getByRole("button", { name: /checking/i })).toBeDefined();
  });
});