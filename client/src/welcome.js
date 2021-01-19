//import React from 'react'; // since vers.17 we don't need to import it anymore
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./resetpsw";

export default function Welcome() {
    return (
        <>
            <header className="headerWelcome">
                {/* <h1>Welcome -L-</h1> */}
                {/* <h1>Welcome to The Social Network!</h1> */}
                <div className="animationConatiner">
                    <h1>Welcome to The Developers Network! \n</h1>
                    {/* <h2>made by developers, for developers</h2> */}
                </div>
                <div className="slider-wrapper">
                    {/* I can write */}
                    <div className="slider">
                        <div className="slider-text1">made by developers,</div>
                        <div className="slider-text2">for developers.</div>
                    </div>
                </div>

                {/* <img
                    className="theSocialNetworkLogoBig"
                    src="/img/theSocialNetworkLogo.png"
                    alt="header-App Logo"
                /> */}
            </header>
            <section className="matrixCodeContainer">
                <img
                    className="matrixCode"
                    src="/img/matrixCode.jpg"
                    alt="matrix code"
                />
            </section>
            <HashRouter>
                <section className="sectionR-L-RP_Container">
                    <div className="sectionR-L-RP">
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                        <Route
                            path="/reset-password"
                            component={ResetPassword}
                        />
                    </div>
                </section>
            </HashRouter>
            {/* <footer>Copyright © 2021 Neo, Inc. All rights reserved</footer> */}
        </>
    );
}

/*
NB: In the HashRouter, for Registration, we use "exact path" and not just "path",
since "/login" contains "/" as well,
therefore, without exact, React can't really understand what we meant 
(just the "/" path).
*/
