import React from "react";
import { RenderResult, waitFor , render, screen } from "@testing-library/react";
import  userEvent from "@testing-library/user-event";
import Profile from "./Profile";
import "@testing-library/jest-dom/extend-expect";
import '@testing-library/jest-dom'


describe("SignIn", () => {
  let renderedComponent: RenderResult;
  let OldPwdTextField: HTMLInputElement;
  let NewEmailTextField: HTMLInputElement;
  let NewPwdTextField: HTMLInputElement;
  let EditButton: HTMLElement;
  let LogOutButton: HTMLElement;
  let DeleteAccountButton: HTMLElement;

  
  beforeEach(() => {
    renderedComponent = render(<Profile />);
    NewEmailTextField = renderedComponent.getByRole("textbox", {name : "New Email"}
    ) as HTMLInputElement;
    OldPwdTextField = renderedComponent.getByRole("textbox", {name : "Old Password"}
    ) as HTMLInputElement;
    NewPwdTextField = renderedComponent.getByRole("textbox", {name : "New Password"}
    ) as HTMLInputElement;
    EditButton = renderedComponent.getByRole("button", {name: "Edit"}); 
    LogOutButton = renderedComponent.getByRole("button", {name: "Log Out"}); 
    DeleteAccountButton = renderedComponent.getByRole("button", {name: "Delete Account"});
  });


  it('renders the landing page', () => {
    expect(screen.getByRole("heading")).toHaveTextContent("CoveyTown");
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("Pops out the edit form with 3 textfields when click the Edit button", async () => {
    userEvent.click(EditButton);
    await waitFor(() => {
      expect(screen.getByTestId("errmsg")).toHaveTextContent("Login Failed");
      expect(screen.getByText("Old Password")).toBeInTheDocument();
      expect(screen.getByText("New Paasword")).toBeInTheDocument();
      expect(screen.getByText("New Email")).toBeInTheDocument();
    })
  });

  it("User inputs can be shown in text fields", async() => {
    const oldPassword = "testA123!";
    userEvent.type(OldPwdTextField, oldPassword);
    expect(screen.getByDisplayValue(oldPassword)).toBeInTheDocument();
  });

})
