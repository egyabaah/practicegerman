import { render, screen } from "@testing-library/react";
import { FeedbackCard } from "./FeedbackCard";
import { describe, expect, it } from "vitest";

describe("FeedbackCard", () => {
  it("renders placeholder", () => {
    render(<FeedbackCard feedback={null} />);
    expect(screen.getByText(/Corrections and suggestions/i)).toBeDefined();
  });

  it("renders result", () => {
    render(<FeedbackCard feedback="✅ Corrected Sentence" />);
    expect(screen.getByText(/Corrected Sentence/i)).toBeDefined();
  });
});
