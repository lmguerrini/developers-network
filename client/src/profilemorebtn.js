import { useState } from "react";
import { BiCode } from "react-icons/bi";
import { CgEditFlipH } from "react-icons/cg";
import { BiCodeAlt } from "react-icons/bi";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export const ProfileMoreBtnFront = () => {
    const [profileMoreBtn /* , setProfileMoreBtn */] = useState(true);
    const frontBackCards = document.getElementsByClassName(
        "frontBackCardsWrap"
    );
    const frontCard = document.getElementsByClassName("front");
    const frontBtn = document.getElementsByClassName("profileMoreBtnTrue");
    const bioeditBtn = document.getElementById("bioeditBtn");
    const mediaQuery1550px = useMediaQuery("(max-width:1550px)");

    const handleClick = () => {
        if (profileMoreBtn) {
            if (!mediaQuery1550px) {
                for (let a = 0; a < frontBackCards.length; a++) {
                    frontBackCards[a].classList.add("front-back");
                }
                for (let c = 0; c < frontBtn.length; c++) {
                    frontBtn[c].classList.add("invisible");
                }
                //setProfileMoreBtn(false);
            } else if (mediaQuery1550px) {
                for (let a = 0; a < frontBackCards.length; a++) {
                    frontBackCards[a].classList.add("front-back1550");
                }
                setTimeout(() => {
                    for (let c = 0; c < frontBtn.length; c++) {
                        frontBtn[c].classList.add("invisible");
                    }
                    bioeditBtn.classList.add("invisible");
                }, 725);
                setTimeout(() => {
                    for (let d = 0; d < frontCard.length; d++) {
                        frontCard[d].classList.add("invisible");
                    }
                }, 800);
            }
        } else {
            if (!mediaQuery1550px) {
                for (let b = 0; b < frontBackCards.length; b++) {
                    frontBackCards[b].classList.remove("front-back");
                }
                //setProfileMoreBtn(true);
            } else if (mediaQuery1550px) {
                for (let b = 0; b < frontBackCards.length; b++) {
                    frontBackCards[b].classList.remove("front-back1550");
                }
            }
        }
    };

    return (
        <>
            <button
                className={
                    profileMoreBtn
                        ? "profileMoreBtnTrue"
                        : "profileMoreBtnFalse"
                }
                onClick={handleClick}
            >
                {" "}
                <div title="Show More">
                    {/* <BiCode /> */}
                    {!mediaQuery1550px ? <BiCode /> : <CgEditFlipH />}
                </div>
            </button>
            {/* {profileMoreBtn ? (
                <button
                    className={
                        profileMoreBtn
                            ? "profileMoreBtnTrue"
                            : "profileMoreBtnFalse"
                    }
                    onClick={handleClick}
                >
                    {" "}
                    <div>
                        <BiCode />
                    </div>
                </button>
            ) : (
                <button
                    className={
                        profileMoreBtn
                            ? "profileMoreBtnTrue"
                            : "profileMoreBtnFalse"
                    }
                    onClick={handleClick}
                >
                    {" "}
                    <div>
                        <BiCodeAlt />
                    </div>
                </button>
            )} */}
        </>
    );
};

export const ProfileLessBtnBack = () => {
    const frontBackCards = document.getElementsByClassName(
        "frontBackCardsWrap"
    );
    const frontCard = document.getElementsByClassName("front");
    const frontBtn = document.getElementsByClassName("profileMoreBtnTrue");
    const bioeditBtn = document.getElementById("bioeditBtn");
    const mediaQuery1550px = useMediaQuery("(max-width:1550px)");

    const handleClick = () => {
        if (!mediaQuery1550px) {
            for (let b = 0; b < frontBackCards.length; b++) {
                frontBackCards[b].classList.remove("front-back");
            }
            for (let c = 0; c < frontBtn.length; c++) {
                frontBtn[c].classList.remove("invisible");
            }
        } else if (mediaQuery1550px) {
            for (let b = 0; b < frontBackCards.length; b++) {
                frontBackCards[b].classList.remove("front-back1550");
            }
            setTimeout(() => {
                for (let d = 0; d < frontCard.length; d++) {
                    frontCard[d].classList.remove("invisible");
                }
            }, 750);
            setTimeout(() => {
                for (let c = 0; c < frontBtn.length; c++) {
                    frontBtn[c].classList.remove("invisible");
                }
                bioeditBtn.classList.remove("invisible");
            }, 725);
        }
    };

    return (
        <>
            <button className="profileMoreBtnFalse" onClick={handleClick}>
                {" "}
                <div title="Hide">
                    {/* <BiCodeAlt /> */}
                    {!mediaQuery1550px ? <BiCodeAlt /> : <CgEditFlipH />}
                </div>
            </button>
        </>
    );
};
