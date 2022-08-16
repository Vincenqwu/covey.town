import "./NavBar.css";
import React from 'react';
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

export function handleLogout() {
  localStorage.setItem("username", '');
  localStorage.setItem("x-access-token", '');
}


const NavBar = () => (
      <div className="bannerContainer">
        <div className="bannerLeft">
            <span aria-label="Logo click to home page" className="logo">CoveyTown</span>
        </div>
        <div className="bannerRight">
          <div className="bannerLoginLogout">
            <a href= './signin'>
              <button className="btn-logout" type="submit" onClick = {handleLogout}>Log Out</button>
            </a>
            <a href= './profile'>
            <button className="btn-profile" type="submit">My profile </button>
          </a>   
          </div>
        </div>
      </div>
  );

export default NavBar;