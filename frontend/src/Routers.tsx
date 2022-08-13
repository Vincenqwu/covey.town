import React from 'react'
import { Switch, Route } from "react-router-dom";
import App from "./App";
import SignIn from "./components/Welcome/SignIn";
import SignUp from "./components/Welcome/SignUp";
import PersonalInfor from "./components/ProfilePage/PersonalInfor";

export default function Routers(){
    return (
        <Switch>
            <Route exact path="/" component={SignIn} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/welcome" component={App} />
            <Route path="/profile" component={PersonalInfor} />


        </Switch>
    )
}