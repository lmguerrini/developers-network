import { useState } from "react";
import { BiCode } from "react-icons/bi";
import { BiCodeAlt } from "react-icons/bi";

export const ProfileMoreBtnFront = () => {
    const [profileMoreBtn /* , setProfileMoreBtn */] = useState(true);
    const frontBackCards = document.getElementsByClassName(
        "frontBackCardsWrap"
    );
    const frontBtn = document.getElementsByClassName("profileMoreBtnTrue");

    const handleClick = () => {
        if (profileMoreBtn) {
            for (let a = 0; a < frontBackCards.length; a++) {
                frontBackCards[a].classList.add("front-back");
            }
            for (let c = 0; c < frontBtn.length; c++) {
                frontBtn[c].classList.add("invisible");
            }
            //setProfileMoreBtn(false);
        } else {
            for (let b = 0; b < frontBackCards.length; b++) {
                frontBackCards[b].classList.remove("front-back");
            }
            //setProfileMoreBtn(true);
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
                <div>
                    <BiCode />
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
    const frontBtn = document.getElementsByClassName("profileMoreBtnTrue");

    const handleClick = () => {
        for (let b = 0; b < frontBackCards.length; b++) {
            frontBackCards[b].classList.remove("front-back");
        }
        for (let c = 0; c < frontBtn.length; c++) {
            frontBtn[c].classList.remove("invisible");
        }
    };

    return (
        <>
            <button className="profileMoreBtnFalse" onClick={handleClick}>
                {" "}
                <div>
                    <BiCodeAlt />
                </div>
            </button>
        </>
    );
};
