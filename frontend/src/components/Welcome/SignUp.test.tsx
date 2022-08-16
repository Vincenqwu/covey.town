import React from "react";
import { RenderResult, waitFor , render, screen } from "@testing-library/react";
import { nanoid } from "nanoid";
import  userEvent from "@testing-library/user-event";
import SignUp from "./SignUp";
import "@testing-library/jest-dom/extend-expect";
import '@testing-library/jest-dom'



describe("SignUp", () => {
  let renderedComponent: RenderResult;
  let userNameTextField: HTMLInputElement;
  let emailTextField: HTMLInputElement;
  let passWordTextField: HTMLInputElement;
  let signUpButton: HTMLElement;

  
  beforeEach(() => {
    renderedComponent = render(<SignUp />);
    userNameTextField = renderedComponent.getByRole("textbox", {name : "Username"}
    ) as HTMLInputElement;
    // emailTextField = renderedComponent.getByTitle("email"
    // ) as HTMLInputElement;
    emailTextField = renderedComponent.getByRole("textbox", {name : "Email Address"}
    ) as HTMLInputElement;
    passWordTextField = renderedComponent.getByTitle("password"
    ) as HTMLInputElement;
    signUpButton = renderedComponent.getByRole("button", {name: "Sign Up"}); 
  });

  it('renders the landing page', () => {
    expect(screen.getByRole("heading")).toHaveTextContent("Sign up");
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Email Address")).toBeInTheDocument();
    expect(screen.getByText("Already have an account? Sign in")).toBeInTheDocument();
  });

  it("User inputs can be shown in text fields and error message would occur if the input is invalid", async() => {
    const username = "1225";
    userEvent.type(userNameTextField, username);
    expect(screen.getByDisplayValue(username)).toBeInTheDocument();
    expect(screen.getByTestId("errmsg_username")).toHaveTextContent("4 to 24 characters.");
  });

  it("Popping error message when user can not sign up due to invalid input", async () => {
    const username = "1225";
    const password = nanoid();
    const email = nanoid();
    userEvent.type(userNameTextField, username);
    userEvent.type(passWordTextField, password);
    userEvent.type(emailTextField, email);
    userEvent.click(signUpButton);

    await waitFor(() => {
        expect(screen.getByTestId("errmsg")).toHaveTextContent("Invalid Entry");
    })
   });

  it("Sign up button should on the page", async() => {
    expect(signUpButton).toBeInTheDocument();
  });

  it("Sign up button should on the page", async() => {
    expect(signUpButton).toBeInTheDocument();
  });

  it("User email inputs can be shown in text fields and error message would occur if the input is invalid", async() => {
    const email = "1225";
    userEvent.type(emailTextField, email);
    expect(screen.getByDisplayValue(email)).toBeInTheDocument();
    expect(screen.getByTestId("errmsg_email")).toHaveTextContent("Need a valid email.");
  });

})
