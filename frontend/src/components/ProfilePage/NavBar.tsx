import "./NavBar.css";
import React from 'react';
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import axios from "../Welcome/api/axios";
import { handleLogout } from "../../NavBar";



async function handleDelete() {
  const DELETE_URL = '/users/:username/';
  const userName = localStorage.getItem("username");
  const token = localStorage.getItem("x-access-token");

  try{
    const response = await axios.delete(
      DELETE_URL,
      {
        headers: { 'Content-Type': 'application/json',
      'x-access-token' : token},
      }
    );
    console.log(response.data);
  } 
  catch (err) {
    console.log(err);
  }
}

const deleteConfirm = () =>{
  if(window.confirm('Are you sure you want to delete this account? \nYou will lose all the information on your account, and it is not retrievable.')){
    console.log('sure')
    handleDelete();
  }
  console.log('cancel')
  return false
}




const NavBar = () => (
      <div className="bannerContainer">
        <div className="bannerLeft">
          <Link to="/welcome" style={{ textDecoration: "none" }}>
            <span aria-label="Instabook Logo click to home page" className="logo">CoveyTown</span>
          </Link>
        </div>
        <div className="bannerRight">
          <div className="bannerLoginLogout">
            {/* <a href={`${process.env.REACT_APP_TOWNS_SERVICE_URL}/signin`}> */}
            <button className="btn-delete-account" type="submit" onClick = {deleteConfirm}>Delete Account</button> 
            <a href= './signin'>
              <button className="btn-loginout" type="submit" onClick = {handleLogout}>Log Out</button>
            </a>  
          </div>
        </div>
      </div>
  );

export default NavBar;