import "./NavBar.css";
import React from 'react';
import Button from "@material-ui/core/Button";


const NavBar = () => (
      <div className="bannerContainer">
        <div className="row">
          <div className="col-md-5">
            <div className="logo">
              {/* <img src="../img/smileyFace.jpg" alt = " "/> */}
              <a href="/welcome">Welcome to Covey Town </a>
            </div>
         </div>
          <div className="auth-btns col-md-7">
            <Button className="btn-cancel-account" type="submit">Cancel Account</Button>
            {/* <Button className="btn-update" type="submit">Update Profile</Button> */}
          </div>
        </div>
      </div>
  );

export default NavBar;