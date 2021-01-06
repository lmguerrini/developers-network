//import React from 'react'; // since vers.17 we don't need to import it anymore
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./resetpsw";

export default function Welcome() {
    return (
        <div>
            <h1>Welcome to The Social Network!</h1>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset-password" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}

/*
NB: In the HashRouter, for Registration, we use "exact path" and not just "path",
since "/login" contains "/" as well,
therefore, without exact, React can't really understand what we meant 
(just the "/" path).
*/
