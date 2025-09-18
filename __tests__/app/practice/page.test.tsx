import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PracticePage from "@/app/practice/page";
import { describe, it, expect } from "vitest";

describe("PracticePage", () => {
  it("flows from input to feedback", async () => {
    render(<PracticePage />);

    fireEvent.change(screen.getByLabelText(/Your German Sentence/i), {
      target: { value: "Hallo Welt" },
    });
    fireEvent.change(screen.getByLabelText(/Intended Meaning/i), {
      target: { value: "Hello world" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Check Sentence/i }));  

    await waitFor(() => {
      expect(screen.getByText(/Corrected Sentence: Ich gehe morgen zur Schule./i)).toBeDefined();
    }, { timeout: 400 });
  });
});
