import React from "react";
import { RenderResult, waitFor , render, screen } from "@testing-library/react";
import  userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import '@testing-library/jest-dom'
import Profile from "./Profile";
import Navbar from "./Profile";
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from "react-dom";


describe("Profile", () => {
  let renderedComponent: RenderResult;
//   let userNameTextField: HTMLInputElement;
//   let passWordTextField: HTMLInputElement;
  let editButton: HTMLElement;
  let logoutButton: HTMLElement;
  let deleteAcountButton: HTMLElement;

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
