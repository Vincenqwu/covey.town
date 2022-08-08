import React from 'react'
import { Switch, Route } from "react-router-dom";
import App from "./App";
import Profile from './components/ProfilePage/PersonalInfor';
// import Login from "./components/Login/Login";
import SignIn from "./components/Welcome/SignIn";
import SignUp from "./components/Welcome/SignUp";

export default function Routers(){
    return (
        <Switch>
            <Route exact path="/" component={SignIn} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/login" component={App} />
            <Route path="/profile" component={Profile} />
        </Switch>
    )
}