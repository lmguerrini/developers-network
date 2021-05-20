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
    const mediaQuery375px = useMediaQuery("(max-device-width:375px)");
    return (
        <>
            <div className="welcomeParentWrapper">
                <div className="parentContainer">
                    <div
                        className={
                            !mediaQuery1024px
                                ? "childrenContainer"
                                : "childrenContainer1024"
                        }
                    >
                        {mediaQuery375px && (
                            <section
                                className="matrixCodeContainer375  matrixCode375 particles1"
                                id="particles-js"
                            >
                                <ParticlesWelcome />
                            </section>
                        )}
                        {mediaQuery375px && (
                            <section
                                className="matrixCodeContainer375  matrixCode375 particles2"
                                id="particles-js"
                            >
                                <ParticlesWelcome />
                            </section>
                        )}
                        <header
                            className={
                                !mediaQuery1024px
                                    ? "headerWelcome"
                                    : "headerWelcome1024"
                            }
                        >
                            {!mediaQuery375px ? (
                                !mediaQuery1024px ? (
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
                                        <h1 className="Welcometo1024">
                                            Welcome to{" "}
                                        </h1>
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
                                )
                            ) : (
                                <div
                                    /* className="WelcometoDN1024Wrap" */ className="mobile-typingIntro"
                                >
                                    <p className="Welcometo375">Welcome to </p>
                                    <p
                                        className="glitchMainTitle"
                                        data-text="The"
                                    >
                                        The
                                    </p>
                                    <p
                                        className="glitchMainTitle"
                                        data-text="Developers"
                                    >
                                        Developers
                                    </p>
                                    <p
                                        className="glitchMainTitle"
                                        data-text="Network!"
                                    >
                                        Network!
                                    </p>
                                    <p>\n</p>
                                </div>
                            )}
                            <div
                                className={
                                    !mediaQuery375px
                                        ? !mediaQuery1024px
                                            ? "slider-wrapper"
                                            : "slider-wrapper1024"
                                        : "slider-wrapper375"
                                }
                            >
                                {!mediaQuery375px ? (
                                    <div className="slider">
                                        <div className="slider-text1">
                                            <p>
                                                <span>
                                                    <small>❮</small> p{" "}
                                                    <small>❯</small>
                                                </span>
                                                &nbsp;made <em id="by">by</em>{" "}
                                                <b>developers_&nbsp;</b>
                                                <span>
                                                    <small>❮</small> br{" "}
                                                    <small>❯</small>
                                                </span>
                                            </p>
                                        </div>
                                        <div className="slider-text2">
                                            <p>
                                                <em id="by">for</em>{" "}
                                                <b>developers_&nbsp;</b>
                                                <span>
                                                    <small>❮</small> /p{" "}
                                                    <small>❯</small>
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="slider">
                                        <div className="slider-text1-mobile">
                                            <p>
                                                &nbsp;made <em id="by">by</em>{" "}
                                                developers_&nbsp;
                                            </p>
                                        </div>
                                        <div className="slider-text2-mobile">
                                            <p>
                                                <em id="by">for</em>{" "}
                                                developers_&nbsp;
                                                <span></span>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* <img
                            className="theSocialNetworkLogoBig"
                            src="/img/theSocialNetworkLogo.png"
                            alt="header-App Logo"
                        /> */}
                        </header>
                        {!mediaQuery375px && (
                            <section
                                className={
                                    !mediaQuery1024px
                                        ? "matrixCodeContainer matrixCode"
                                        : "matrixCodeContainer1024 matrixCode"
                                }
                                id="particles-js"
                            >
                                <ParticlesWelcome />
                            </section>
                        )}
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
                            !mediaQuery375px
                                ? !mediaQuery1024px
                                    ? "glitchFooter"
                                    : "glitchFooter glitchFooter1024"
                                : "glitchFooter glitchFooter375"
                        }
                        data-text="Copyright © 2021 DN, Inc. All rights reserved."
                    >
                        Copyright © 2021 DN, Inc. All rights reserved.
                    </footer>
                </div>
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
