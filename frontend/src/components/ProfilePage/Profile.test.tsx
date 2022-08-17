import React from "react";
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from "react-dom";
import Profile from "./Profile";


describe("Profile", () => {

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
