import React from "react";
import { RenderResult, waitFor , render, screen } from "@testing-library/react";
import  userEvent from "@testing-library/user-event";
import SignIn from "./SignIn";
import "@testing-library/jest-dom/extend-expect";
import '@testing-library/jest-dom'


describe("SignIn", () => {
  let renderedComponent: RenderResult;
  let userNameTextField: HTMLInputElement;
  let passWordTextField: HTMLInputElement;
  let signInButton: HTMLElement;

  
  beforeEach(() => {
    renderedComponent = render(<SignIn />);
    userNameTextField = renderedComponent.getByRole("textbox", {name : "Username"}
    ) as HTMLInputElement;
    passWordTextField = renderedComponent.getByTitle("password"
    ) as HTMLInputElement;
    signInButton = renderedComponent.getByRole("button", {name: "Sign In"}); 
  });

  it('renders the landing page', () => {
    expect(screen.getByRole("heading")).toHaveTextContent("Sign in");
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Don't have an account? Sign Up")).toBeInTheDocument();
  });

  it("Popping error message when user can not log in due to unknown error", async () => {
    userEvent.click(signInButton);
    await waitFor(() => {
      expect(screen.getByTestId("errmsg")).toHaveTextContent("Login Failed");
    })
  });

  it("User inputs can be shown in text fields", async() => {
    const username = "1225";
    userEvent.type(userNameTextField, username);
    expect(screen.getByDisplayValue(username)).toBeInTheDocument();
  });

})
