import { useState } from "react";
import { BiCode } from "react-icons/bi";
import { CgEditFlipH } from "react-icons/cg";
import { BiCodeAlt } from "react-icons/bi";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export const ProfileMoreBtnFront = ({ otherProfilePage }) => {
    const [profileMoreBtn /* , setProfileMoreBtn */] = useState(true);
    const frontBackCards =
        document.getElementsByClassName("frontBackCardsWrap");
    const frontCard = document.getElementsByClassName("front");
    const frontBtn = document.getElementsByClassName("profileMoreBtnTrue");
    //const bioeditBtn = document.getElementById("bioeditBtn");
    const bioeditBtn = document.getElementsByClassName("bioeditBtn");
    const sideCard1550 = document.getElementsByClassName("side1550");
    //const mirrorCard = document.getElementsByClassName("mirror");
    const backCard = document.getElementsByClassName("back");
    const backCard1550 = document.getElementsByClassName("back1550");
    const backCard375 = document.getElementsByClassName("back375");
    const sectionProfile = document.getElementsByClassName("sectionProfile");
    const footerApp = document.getElementsByClassName("glitchFooterApp");
    const mediaQuery1550px = useMediaQuery("(max-width:1550px)");
    // const mediaQuery375px = useMediaQuery("(max-device-width:375px)");
    const mediaQuery375px = useMediaQuery("(max-device-width:430px)");

    const handleClick = () => {
        if (profileMoreBtn) {
            if (mediaQuery375px) {
                if (otherProfilePage) {
                    for (let a = 0; a < backCard375.length; a++) {
                        backCard375[a].classList.add("side375op");
                    }
                    for (let b = 0; b < frontBackCards.length; b++) {
                        frontBackCards[b].classList.add("front-back375op");
                    }
                    for (let f = 0; f < frontCard.length; f++) {
                        frontCard[f].classList.add("zIndex-1");
                    }
                } else {
                    for (let a = 0; a < backCard375.length; a++) {
                        backCard375[a].classList.add("side375");
                    }
                    for (let b = 0; b < frontBackCards.length; b++) {
                        frontBackCards[b].classList.add("front-back375");
                    }
                }
                for (let z = 0; z < sectionProfile.length; z++) {
                    sectionProfile[z].classList.add("marginBottomProfileCards");
                }

                for (let c = 0; c < frontBtn.length; c++) {
                    frontBtn[c].classList.add("invisible");
                }
                for (let d = 0; d < backCard375.length; d++) {
                    backCard375[d].classList.remove("displayNone");
                }
                for (let i = 0; i < footerApp.length; i++) {
                    footerApp[i].classList.add("displayNone");
                }
                //setProfileMoreBtn(false);
            } else if (!mediaQuery1550px) {
                for (let e = 0; e < backCard.length; e++) {
                    backCard[e].classList.remove("invisible");
                }
                setTimeout(() => {
                    for (let a = 0; a < frontBackCards.length; a++) {
                        frontBackCards[a].classList.add("front-back");
                    }
                    for (let b = 0; b < backCard.length; b++) {
                        backCard[b].classList.remove("opacityClass");
                    }
                }, 500);
                setTimeout(() => {
                    for (let c = 0; c < frontBtn.length; c++) {
                        frontBtn[c].classList.add("invisible");
                    }
                }, 1500);

                //setProfileMoreBtn(false);
            } else if (mediaQuery1550px) {
                for (let a = 0; a < frontBackCards.length; a++) {
                    frontBackCards[a].classList.add("front-back1550");
                }
                for (let h = 0; h < backCard.length; h++) {
                    backCard[h].classList.remove("invisible");
                }
                if (otherProfilePage) {
                    for (let i = 0; i < backCard1550.length; i++) {
                        backCard1550[i].classList.add("left5vw");
                    }
                    // setTimeout(() => {
                    //     for (let g = 0; g < backCard.length; g++) {
                    //         backCard[g].classList.add("marginLeft-150");
                    //         backCard[g].classList.remove("paddingRight60");
                    //         backCard[g].classList.remove("zoomInus");
                    //     }
                    // }, 725);
                    setTimeout(() => {
                        for (let d = 0; d < frontCard.length; d++) {
                            frontCard[d].classList.add("invisible");
                        }
                        for (let g = 0; g < backCard.length; g++) {
                            backCard[g].classList.remove("opacityClass");
                        }
                    }, 700);
                } else {
                    setTimeout(() => {
                        for (let d = 0; d < frontCard.length; d++) {
                            frontCard[d].classList.add("invisible");
                        }
                        for (let g = 0; g < backCard.length; g++) {
                            // backCard[g].classList.add("mirror");
                            // backCard[g].classList.add("marginLeft-150");
                            backCard[g].classList.remove("opacityClass");
                        }
                    }, 800);
                }
                setTimeout(() => {
                    for (let e = 0; e < sideCard1550.length; e++) {
                        sideCard1550[e].classList.remove("invisible");
                    }
                    for (let c = 0; c < frontBtn.length; c++) {
                        frontBtn[c].classList.add("invisible");
                    }
                    for (let f = 0; f < bioeditBtn.length; f++) {
                        bioeditBtn[f].classList.add("invisible");
                    }
                    //bioeditBtn.classList.add("invisible");
                }, 725);
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

export const ProfileLessBtnBack = ({ otherProfilePage }) => {
    const frontBackCards =
        document.getElementsByClassName("frontBackCardsWrap");
    const frontBackCardsWrapOp = document.getElementsByClassName(
        "frontBackCardsWrapOp"
    );
    const frontCard = document.getElementsByClassName("front");
    const frontBtn = document.getElementsByClassName("profileMoreBtnTrue");
    //const bioeditBtn = document.getElementById("bioeditBtn");
    const bioeditBtn = document.getElementsByClassName("bioeditBtn");
    const sideCard1550 = document.getElementsByClassName("side1550");
    const backCard = document.getElementsByClassName("back");
    const backCard1550 = document.getElementsByClassName("back1550");
    const backCard375 = document.getElementsByClassName("back375");
    const sectionProfile = document.getElementsByClassName("sectionProfile");
    const mediaQuery1550px = useMediaQuery("(max-width:1550px)");
    // const mediaQuery375px = useMediaQuery("(max-device-width:375px)");
    const mediaQuery375px = useMediaQuery("(max-device-width:430px)");

    const handleClick = () => {
        if (mediaQuery375px) {
            if (otherProfilePage) {
                for (let a = 0; a < backCard375.length; a++) {
                    backCard375[a].classList.remove("side375op");
                }
                for (let b = 0; b < frontBackCards.length; b++) {
                    frontBackCards[b].classList.remove("front-back375op");
                }
                for (let f = 0; f < frontCard.length; f++) {
                    frontCard[f].classList.remove("zIndex-1");
                }
            } else {
                for (let a = 0; a < backCard375.length; a++) {
                    backCard375[a].classList.remove("side375");
                }
                for (let b = 0; b < frontBackCards.length; b++) {
                    frontBackCards[b].classList.remove("front-back375");
                }
            }
            // for (let a = 0; a < backCard375.length; a++) {
            //     backCard375[a].classList.remove("side375");
            // }
            for (let z = 0; z < sectionProfile.length; z++) {
                sectionProfile[z].classList.remove("marginBottomProfileCards");
            }
            // for (let b = 0; b < frontBackCards.length; b++) {
            //     frontBackCards[b].classList.remove("front-back375");
            // }
            for (let c = 0; c < frontBtn.length; c++) {
                frontBtn[c].classList.remove("invisible");
            }
            for (let d = 0; d < backCard375.length; d++) {
                backCard375[d].classList.add("displayNone");
            }
        } else if (!mediaQuery1550px) {
            for (let b = 0; b < frontBackCards.length; b++) {
                frontBackCards[b].classList.remove("front-back");
            }
            for (let c = 0; c < frontBtn.length; c++) {
                frontBtn[c].classList.remove("invisible");
            }
            for (let e = 0; e < backCard.length; e++) {
                backCard[e].classList.add("opacityClass");
            }
            setTimeout(() => {
                for (let e = 0; e < backCard.length; e++) {
                    backCard[e].classList.add("invisible");
                }
            }, 1725);
        } else if (mediaQuery1550px) {
            for (let b = 0; b < frontBackCards.length; b++) {
                frontBackCards[b].classList.remove("front-back1550");
                // frontBackCards[b].classList.add("paddingRight60");
            }
            // for (let a = 0; a < frontBackCards.length; a++) {
            //     frontBackCards[a].classList.add("flipCard180-animation");
            // }
            for (let i = 0; i < frontBackCardsWrapOp.length; i++) {
                // frontBackCards[i].classList.add("paddingRight60");
            }
            if (otherProfilePage) {
                for (let i = 0; i < backCard1550.length; i++) {
                    backCard1550[i].classList.remove("left5vw");
                }
                // setTimeout(() => {
                //     for (let g = 0; g < backCard.length; g++) {
                //         backCard[g].classList.remove("marginLeft-150");
                //         backCard[g].classList.add("paddingRight60");
                //         backCard[g].classList.add("zoomInus");
                //     }
                // }, 725);
            }
            // setTimeout(() => {
            //     for (let e = 0; e < frontBackCards.length; e++) {
            //         frontBackCards[e].classList.add("flipCard180-animation2");
            //     }
            // }, 300);
            setTimeout(() => {
                for (let e = 0; e < sideCard1550.length; e++) {
                    sideCard1550[e].classList.add("invisible");
                }
                for (let d = 0; d < frontCard.length; d++) {
                    frontCard[d].classList.remove("invisible");
                }
            }, 750);
            setTimeout(() => {
                for (let c = 0; c < frontBtn.length; c++) {
                    frontBtn[c].classList.remove("invisible");
                }
                for (let f = 0; f < bioeditBtn.length; f++) {
                    bioeditBtn[f].classList.remove("invisible");
                }
                //bioeditBtn.classList.remove("invisible");
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
