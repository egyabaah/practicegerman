import { render, screen } from "@testing-library/react";
import { FeedbackCard } from "./FeedbackCard";
import { describe, expect, it } from "vitest";

describe("FeedbackCard", () => {
  it("renders placeholder", () => {
    render(<FeedbackCard result={null} />);
    expect(screen.getByText(/Corrections and suggestions/i)).toBeDefined();
  });

  it("renders result", () => {
    render(<FeedbackCard result="✅ Corrected Sentence" />);
    expect(screen.getByText(/Corrected Sentence/i)).toBeDefined();
  });
});
