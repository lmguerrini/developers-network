import { useState } from "react";
import { BiCode } from "react-icons/bi";
import { CgEditFlipH } from "react-icons/cg";
import { BiCodeAlt } from "react-icons/bi";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export const ProfileMoreBtnFront = () => {
    const [profileMoreBtn /* , setProfileMoreBtn */] = useState(true);
    const frontBackCards = document.getElementsByClassName(
        "frontBackCardsWrap"
    );
    const frontCard = document.getElementsByClassName("front");
    const frontBtn = document.getElementsByClassName("profileMoreBtnTrue");
    const bioeditBtn = document.getElementById("bioeditBtn");
    const backCard = document.getElementsByClassName("back375");
    const sectionProfile = document.getElementsByClassName("sectionProfile");
    const mediaQuery1550px = useMediaQuery("(max-width:1550px)");
    const mediaQuery375px = useMediaQuery("(max-device-width:375px)");

    const handleClick = () => {
        if (profileMoreBtn) {
            if (mediaQuery375px) {
                for (let a = 0; a < backCard.length; a++) {
                    backCard[a].classList.add("side375");
                }
                for (let z = 0; z < sectionProfile.length; z++) {
                    sectionProfile[z].classList.add("marginBottomProfileCards");
                }
                for (let b = 0; b < frontBackCards.length; b++) {
                    frontBackCards[b].classList.add("front-back375");
                }
                for (let c = 0; c < frontBtn.length; c++) {
                    frontBtn[c].classList.add("invisible");
                }
                for (let d = 0; d < backCard.length; d++) {
                    backCard[d].classList.remove("displayNone");
                }
                //setProfileMoreBtn(false);
            } else if (!mediaQuery1550px) {
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
            if (mediaQuery375px) {
                for (let a = 0; a < frontBackCards.length; a++) {
                    frontBackCards[a].classList.remove("front-back375");
                }
                //setProfileMoreBtn(false);
            } else if (!mediaQuery1550px) {
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
                    {!mediaQuery375px ? (
                        !mediaQuery1550px ? (
                            <BiCode />
                        ) : (
                            <CgEditFlipH />
                        )
                    ) : (
                        <MdExpandMore className="showMoreBtn" />
                    )}
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
    const backCard = document.getElementsByClassName("back375");
    const sectionProfile = document.getElementsByClassName("sectionProfile");
    const mediaQuery1550px = useMediaQuery("(max-width:1550px)");
    const mediaQuery375px = useMediaQuery("(max-device-width:375px)");

    const handleClick = () => {
        if (mediaQuery375px) {
            for (let a = 0; a < backCard.length; a++) {
                backCard[a].classList.remove("side375");
            }
            for (let z = 0; z < sectionProfile.length; z++) {
                sectionProfile[z].classList.remove("marginBottomProfileCards");
            }
            for (let b = 0; b < frontBackCards.length; b++) {
                frontBackCards[b].classList.remove("front-back375");
            }
            for (let c = 0; c < frontBtn.length; c++) {
                frontBtn[c].classList.remove("invisible");
            }
            for (let d = 0; d < backCard.length; d++) {
                backCard[d].classList.add("displayNone");
            }
        } else if (!mediaQuery1550px) {
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
                    {!mediaQuery375px ? (
                        !mediaQuery1550px ? (
                            <BiCodeAlt />
                        ) : (
                            <CgEditFlipH />
                        )
                    ) : (
                        <MdExpandLess className="showMoreBtn" />
                    )}
                </div>
            </button>
        </>
    );
};
