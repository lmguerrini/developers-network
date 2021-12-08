import { useState, useEffect } from "react";
import DarkModeToggle from "react-toggle";
//mport { CgDarkMode } from "react-icons/cg";
import { useMediaQuery } from "react-responsive";
// => like CSS media query: value automatically update whenever the query result changes

const CLASS_DARK = "darkMode";

export const DarkMode = () => {
    //const [isDark, setIsDark] = useState(true);
    const matrixCodeAnimation1550 =
        document.getElementsByClassName("ParticlesApp1550");
    // const matrixCodeAnimation375 =
    //     document.getElementsByClassName("ParticlesApp375");
    const handleDarkChange = ({ target }) => {
        // console.log(target);
        setIsDark(target.checked);
    };

    const systemPrefersDark = useMediaQuery(
        {
            query: "(prefers-color-scheme: dark)",
        },
        undefined,
        (prefersDark) => {
            setIsDark(prefersDark);
        } // 3rd arg =  function to call whenever the result of the media query changes
    ); // => update isDark state whenever the media query changes

    const [isDark, setIsDark] = useState(systemPrefersDark);

    useEffect(() => {
        // whatever we put here will run whenever `isDark` changes
        if (isDark) {
            document.documentElement.classList.add(CLASS_DARK);
            document.getElementById("darkModeContainer").scrollTop = 0;
            setTimeout(function () {
                for (let a = 0; a < matrixCodeAnimation1550.length; a++) {
                    matrixCodeAnimation1550[a].classList.add(
                        "ParticlesApp1550h"
                    );
                }
            }, 700);
            // setTimeout(function () {
            //     for (let a = 0; a < matrixCodeAnimation375.length; a++) {
            //         matrixCodeAnimation375[a].classList.add("ParticlesApp375h");
            //     }
            // }, 700);
        } else {
            document.documentElement.classList.remove(CLASS_DARK);
            document.getElementById("darkModeContainer").scrollTop = 0;
            setTimeout(function () {
                for (let a = 0; a < matrixCodeAnimation1550.length; a++) {
                    matrixCodeAnimation1550[a].classList.remove(
                        "ParticlesApp1550h"
                    );
                }
            }, 700);
            // setTimeout(function () {
            //     for (let a = 0; a < matrixCodeAnimation375.length; a++) {
            //         matrixCodeAnimation375[a].classList.remove(
            //             "ParticlesApp375h"
            //         );
            //     }
            // }, 700);
        }
    }, [isDark]);

    return (
        <DarkModeToggle
            id="darkMode"
            // className="darkMode375"
            className={isDark ? "darkMode375isDark" : null}
            checked={isDark}
            onChange={handleDarkChange}
            /* icons={{ checked: "☯" }} */
            icons={{ checked: "◐", unchecked: null }}
            // icons={isDark? {checked: "◐"} : {checked: "◑"}}
            // className={isDark? "darkModeTablet" : "darkModeTablet9"}
        />
    );
};
