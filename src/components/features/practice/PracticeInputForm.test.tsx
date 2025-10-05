import { render, screen, fireEvent, within } from "@testing-library/react";
import { PracticeInputForm } from "@/components/features/practice/PracticeInputForm";
import { describe, it, expect, vi } from "vitest";
import { LanguageCode } from "@/enums/language-codes";
import { LanguageLevel } from "@/enums/language-levels";

// Fix fail due to shadcn(radix's) implementation of select
Element.prototype.scrollIntoView = vi.fn();

describe("PracticeInputForm", () => {
  it("renders inputs", () => {
    render(
      <PracticeInputForm
        targetSentence=""
        nativeSentence=""
        loading={false}
        targetLanguage={LanguageCode.DE}
        userNativeLanguage={LanguageCode.EN}
        userLanguageLevel={LanguageLevel.A1}
        onTargetSentenceChange={() => {}}
        onNativeSentenceChange={() => {}}
        onTargetLanguageChange={() => {}}
        onUserNativeLanguageChange={() => {}}
        onUserLanguageLevelChange={() => {}}
        onSubmit={() => {}}
      />
    );
    expect(screen.getByText(/Your .* Sentences\*/i)).toBeDefined();
    expect(screen.getByText(/Optional: Intended Meaning/i)).toBeDefined();
    expect(screen.getByTestId("select-target-language")).toBeDefined();
    expect(screen.getByTestId("select-level")).toBeDefined();
    expect(screen.getByTestId("select-native-language")).toBeDefined();
  });

  it("calls onSubmit when form is submitted", () => {
    const onSubmit = vi.fn();
    render(
      <PracticeInputForm
        targetSentence="Hallo Welt"
        nativeSentence="Hello world"
        loading={false}
        targetLanguage={LanguageCode.DE}
        userNativeLanguage={LanguageCode.EN}
        userLanguageLevel={LanguageLevel.A1}
        onTargetSentenceChange={() => {}}
        onNativeSentenceChange={() => {}}
        onTargetLanguageChange={() => {}}
        onUserNativeLanguageChange={() => {}}
        onUserLanguageLevelChange={() => {}}
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
        targetLanguage={LanguageCode.DE}
        userNativeLanguage={LanguageCode.EN}
        userLanguageLevel={LanguageLevel.A1}
        onTargetSentenceChange={() => {}}
        onNativeSentenceChange={() => {}}
        onTargetLanguageChange={() => {}}
        onUserNativeLanguageChange={() => {}}
        onUserLanguageLevelChange={() => {}}
        onSubmit={onSubmit}
      />
    );
    expect(screen.getByRole("button", { name: /checking/i })).toBeDefined();
  });

  it("calls select change handlers when selecting values", async () => {
    const onTargetLanguageChange = vi.fn<(value: LanguageCode) => void>();
    const onUserLanguageLevelChange = vi.fn<(value: LanguageLevel) => void>();
    const onUserNativeLanguageChange = vi.fn<(value: LanguageCode) => void>();
    render(
      <PracticeInputForm
        targetSentence=""
        nativeSentence=""
        loading={false}
        targetLanguage={LanguageCode.DE}
        userNativeLanguage={LanguageCode.EN}
        userLanguageLevel={LanguageLevel.A1}
        onTargetSentenceChange={() => {}}
        onNativeSentenceChange={() => {}}
        onTargetLanguageChange={onTargetLanguageChange}
        onUserNativeLanguageChange={onUserNativeLanguageChange}
        onUserLanguageLevelChange={onUserLanguageLevelChange}
        onSubmit={() => {}}
      />
    );
    // open and select different values by firing onValueChange via trigger + item click
    const openAndSelect = async (triggerTestId: string, optionName: RegExp) => {
      const trigger = screen.getByTestId(triggerTestId);
      fireEvent.click(trigger);
      // log the DOM
      screen.debug();
      const option = await screen.findByRole("option", { name: optionName});
      fireEvent.click(option);
    };

    
    await openAndSelect("select-target-language", /Hrvatski/i);
    await openAndSelect("select-level", /A2/i);
    await openAndSelect("select-native-language", /Deutsch/i);

    expect(onTargetLanguageChange).toHaveBeenCalled();
    expect(onUserLanguageLevelChange).toHaveBeenCalled();
    expect(onUserNativeLanguageChange).toHaveBeenCalled();
  }, 10000);
});