import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import { useAuth } from "@/contexts/AuthContext";

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

test("shows error message on invalid login", async () => {
  const mockLogin = jest
    .fn()
    .mockRejectedValue(new Error("Invalid email or password"));
  (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });

  render(<LoginPage />);
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "password" },
  });
  fireEvent.click(screen.getByText(/login/i));

  expect(
    await screen.findByText(/invalid email or password/i),
  ).toBeInTheDocument();
});
