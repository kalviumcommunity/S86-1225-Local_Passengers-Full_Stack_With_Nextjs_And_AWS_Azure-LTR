/** @jest-environment jsdom */

import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import Button from "../Button";

describe("<Button />", () => {
  it("renders the label", () => {
    render(<Button label="Click Me" />);
    expect(
      screen.getByRole("button", { name: "Click Me" })
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = jest.fn();
    render(<Button label="Click Me" onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Click Me" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("sets aria-pressed based on variant", () => {
    const { rerender } = render(<Button label="Primary" variant="primary" />);
    expect(screen.getByRole("button", { name: "Primary" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    rerender(<Button label="Secondary" variant="secondary" />);
    expect(screen.getByRole("button", { name: "Secondary" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });
});
