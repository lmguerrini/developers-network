//import React from 'react'; // since vers.17 we don't need to import it anymore
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./resetpsw";
import ParticlesWelcome from "../public/anim/Welcome[p]/particlesWelcome";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export default function Welcome() {
    //const mediaQuery1024px = useMediaQuery("(min-width:1024px)");
    const mediaQuery1024px = useMediaQuery("(max-width:1024px)");
    return (
        <>
            <div className="parentContainer">
                <div
                    className={
                        !mediaQuery1024px
                            ? "childrenContainer"
                            : "childrenContainer1024"
                    }
                >
                    <header
                        className={
                            !mediaQuery1024px
                                ? "headerWelcome"
                                : "headerWelcome1024"
                        }
                    >
                        {/* <h1>Welcome -L-</h1> */}
                        {/* <h1>Welcome to The Social Network!</h1> */}
                        {!mediaQuery1024px ? (
                            <div className="animationConatiner">
                                <h1>
                                    Welcome to{" "}
                                    {/* <span>
                                        <small>❮</small>b<small>❯</small>
                                    </span> */}
                                    <b
                                        className="glitchMainTitle"
                                        data-text="The Developers Network!"
                                    >
                                        The Developers Network!
                                    </b>
                                    {/* <div>The Developers Network!</div> */}
                                    {/* <span>
                                        <small>❮</small>/b<small>❯</small>
                                    </span>{" "} */}
                                    &nbsp;\n
                                </h1>
                                {/* <h2>made by developers, for developers</h2> */}
                            </div>
                        ) : (
                            <div className="WelcometoDN1024Wrap">
                                <h1 className="Welcometo1024">Welcome to </h1>
                                <div className="animationConatiner">
                                    <h1>
                                        <b
                                            className={
                                                !mediaQuery1024px
                                                    ? "glitchMainTitle"
                                                    : "glitchMainTitle glitchMainTitle1024"
                                            }
                                            data-text="The Developers Network!"
                                        >
                                            The Developers Network!
                                        </b>
                                        &nbsp;\n
                                    </h1>
                                </div>
                            </div>
                        )}
                        <div
                            className={
                                !mediaQuery1024px
                                    ? "slider-wrapper"
                                    : "slider-wrapper1024"
                            }
                        >
                            {/* I can write */}
                            <div className="slider">
                                <div className="slider-text1">
                                    <p>
                                        <span>
                                            <small>❮</small> p <small>❯</small>
                                        </span>
                                        &nbsp;made{" "}
                                        <em id="by">
                                            {/* <span>
                                                <small>❮</small>em
                                                <small>❯ </small>
                                            </span> */}
                                            by
                                            {/* <span>
                                                <small> ❮</small>/em
                                                <small>❯</small>
                                            </span> */}
                                        </em>{" "}
                                        developers_&nbsp;
                                        <span>
                                            <small>❮</small> br <small>❯</small>
                                        </span>
                                    </p>
                                </div>
                                <div className="slider-text2">
                                    <p>
                                        <em id="by">
                                            {/* <span>
                                                <small>❮</small>em
                                                <small>❯ </small>
                                            </span> */}
                                            for
                                            {/* <span>
                                                <small> ❮</small>/em
                                                <small>❯</small>
                                            </span> */}
                                        </em>{" "}
                                        developers_&nbsp;
                                        <span>
                                            <small>❮</small> /p <small>❯</small>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* <img
                            className="theSocialNetworkLogoBig"
                            src="/img/theSocialNetworkLogo.png"
                            alt="header-App Logo"
                        /> */}
                    </header>
                    <section
                        className={
                            !mediaQuery1024px
                                ? "matrixCodeContainer matrixCode"
                                : "matrixCodeContainer1024 matrixCode"
                        }
                        id="particles-js"
                    >
                        {/* <img
                            className="matrixCode"
                            src="/img/matrixCode.jpg"
                            alt="matrix code"
                        /> */}
                        <ParticlesWelcome />
                    </section>
                    <HashRouter>
                        {/* <section className="sectionR-L-RP_Container">
                    <div className="sectionR-L-RP"> */}
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                        <Route
                            path="/reset-password"
                            component={ResetPassword}
                        />
                        {/* </div>
                </section> */}
                    </HashRouter>
                </div>

                <footer
                    id="footerWelcome"
                    className={
                        !mediaQuery1024px
                            ? "glitchFooter"
                            : "glitchFooter glitchFooter1024"
                    }
                    data-text="Copyright © 2021 DN, Inc. All rights reserved."
                >
                    Copyright © 2021 DN, Inc. All rights reserved.
                </footer>
            </div>
        </>
    );
}

/*
NB: In the HashRouter, for Registration, we use "exact path" and not just "path",
since "/login" contains "/" as well,
therefore, without exact, React can't really understand what we meant 
(just the "/" path).
*/
