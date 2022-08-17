import React from "react";
import { RenderResult, waitFor , render, screen } from "@testing-library/react";
import  userEvent from "@testing-library/user-event";
import Profile from "./Profile";
import Navbar from "./Profile";
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';
import "@testing-library/jest-dom/extend-expect";
import '@testing-library/jest-dom'
import ReactDOM from "react-dom";


describe("Profile", () => {
  let renderedComponent: RenderResult;
//   let userNameTextField: HTMLInputElement;
//   let passWordTextField: HTMLInputElement;
  let editButton: HTMLElement;
  let logoutButton: HTMLElement;
  let deleteAcountButton: HTMLElement;

  
  beforeEach(() => {

    // userNameTextField = renderedComponent.getByRole("textbox", {name : "Username"}
    // ) as HTMLInputElement;
    // passWordTextField = renderedComponent.getByTitle("password"
    // ) as HTMLInputElement;
    editButton = renderedComponent.getByRole("button", {name: "Edit"}); 
  });

//   it('renders the landing page', () => {
//     expect(screen.getByRole("heading")).toHaveTextContent("Sign in");
//     expect(screen.getByText("Username")).toBeInTheDocument();
//     expect(screen.getByText("Password")).toBeInTheDocument();
//     expect(screen.getByText("Don't have an account? Sign Up")).toBeInTheDocument();
//   });

//   it("Popping error message when user can not log in due to unknown error", async () => {
//     userEvent.click(signInButton);
//     await waitFor(() => {
//       expect(screen.getByTestId("errmsg")).toHaveTextContent("Login Failed");
//     })
//   });

//   it("User inputs can be shown in text fields", async() => {
//     const username = "1225";
//     userEvent.type(userNameTextField, username);
//     expect(screen.getByDisplayValue(username)).toBeInTheDocument();
//   });

    it("test", ()=>{
      const number = 3;
      expect(number).toBe(3);
    })

    it("renders without crashing", () => {
      const div = document.createElement("div");
      ReactDOM.render(
        <BrowserRouter>
          <Profile />
        </BrowserRouter>,
    div
      );
      ReactDOM.unmountComponentAtNode(div);
    })
})
