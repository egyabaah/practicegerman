import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LabeledSelect } from "./LabeledSelect";

describe("LabeledSelect", () => {
  it("renders label and trigger", () => {
    render(
      <LabeledSelect
        label="Target Language"
        value=""
        onValueChange={() => { }}
        options={[
          { value: "Deutsch", label: "Deutsch" },
          { value: "English", label: "English" },
        ]}
        id="labeled-select-test"
        testId="labeled-select"
        placeholder="Select language"
      />
    );
    expect(screen.getByLabelText(/Target Language/i)).toBeDefined();
    expect(screen.getByTestId("labeled-select")).toBeDefined();
  });

  it("calls onValueChange when selecting option", () => {
    const handleChange = vi.fn();
    render(
      <LabeledSelect
        label="Level"
        value="A1"
        onValueChange={handleChange}
        options={[
          { value: "A1", label: "A1" },
          { value: "B2", label: "B2" },
        ]}
        id="level-select"
        testId="level-select"
      />
    );
    const trigger = screen.getByTestId("level-select");
    fireEvent.click(trigger);
    const option = screen.getByRole("option", { name: /B2/i });
    fireEvent.click(option);
    expect(handleChange).toHaveBeenCalledWith("B2");
  });
});


