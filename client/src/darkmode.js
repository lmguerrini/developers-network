import { useState, useEffect } from "react";
import DarkModeToggle from "react-toggle";
//mport { CgDarkMode } from "react-icons/cg";
import { useMediaQuery } from "react-responsive";
// => like CSS media query: value automatically update whenever the query result changes

const CLASS_DARK = "darkMode";

export const DarkMode = () => {
    //const [isDark, setIsDark] = useState(true);
    const handleDarkChange = ({ target }) => {
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
        } else {
            document.documentElement.classList.remove(CLASS_DARK);
            document.getElementById("darkModeContainer").scrollTop = 0;
        }
    }, [isDark]);

    return (
        <DarkModeToggle
            /* id="darkMode" */
            checked={isDark}
            onChange={handleDarkChange}
            icons={{ checked: "☯" }}
        />
    );
};
