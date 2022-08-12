import "./NavBar.css";
import React from 'react';
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";


const NavBar = () => (
      <div className="bannerContainer">
        <div className="bannerLeft">
          <Link to="/welcome" style={{ textDecoration: "none" }}>
            <span aria-label="Instabook Logo click to home page" className="logo">CoveyTown</span>
          </Link>
        {/* <div className="row">
          <div className="col-md-5">
            <div className="logo">
              {/* <img src="../img/smileyFace.jpg" alt = " "/> */}
              {/* <a href="/welcome">Welcome to Covey Town </a>
            </div>
         </div>
          <div className="auth-btns col-md-7">
            <Button className="btn-cancel-account" type="submit">Cancel Account</Button> 
             <Button className="btn-update" type="submit">Update Profile</Button>
           </div>
        </div> */}
        </div>
        <div className="bannerRight">
          <div className="bannerLoginLogout">
            {/* <a href={`${process.env.REACT_APP_TOWNS_SERVICE_URL}/signin`}> */}
            <a href= 'http://localhost:3000/signin'>
            <button className="btn-delete-account" type="submit">Delete Account</button> 
            <button className="btn-loginout" type="submit">Log Out</button>
          </a>   
          </div>
        </div>
      </div>
  );

export default NavBar;