import { useDispatch, useSelector } from "react-redux";
import useStatefulFields from "./customhooks/use-stateful-fields";
import { useState, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import {
    getWallPosts,
    postWallPost,
    getWallPostComments,
    postWallPostComment,
    deleteComment,
} from "./actions";

export default function Wall({ id, myWall, name }) {
    const userWallId = id;
    const userWallName = name;
    const dispatch = useDispatch();
    const [fields, handleChange] = useStatefulFields(); // => customhooks
    const [fileLabel, setFileLabel] = useState("Choose an image (< 2mb): ");
    const [file, setFile] = useState();
    //const [error, setError] = useState(false);
    const generalError = useSelector((state) => state && state.error);
    const newWallPostCommentError = useSelector(
        (state) => state && state.newWallPostCommentError
    );
    const wallPosts = useSelector((state) => state && state.wallPosts);
    const wallPostComments = useSelector(
        (state) => state && state.wallPostComments
    );

    let neWallPosts = [];
    if (wallPosts) {
        neWallPosts = wallPosts.map((obj) => ({
            ...obj,
            comments: [],
        }));
        if (wallPostComments && wallPostComments.length > 0) {
            for (let i in neWallPosts) {
                for (let e in wallPostComments) {
                    if (
                        neWallPosts[i].id == wallPostComments[e].commentPostId
                    ) {
                        neWallPosts[i].comments.push(wallPostComments[e]);
                    }
                }
            }
        }
    }

    useEffect(() => {
        dispatch(getWallPosts(userWallId));
        dispatch(getWallPostComments(userWallId));
    }, [id]);

    const handlePostWallPost = (e) => {
        e.preventDefault();
        // Create a FormData instance and append the relevant fields
        const formData = new FormData();
        formData.append("image", file);
        formData.append("description", fields.description);
        dispatch(postWallPost(formData));
    };

    const handleFileChange = ({ target }) => {
        setFile(target.files[0]);
        setFileLabel(target.files[0].name); // name file to upload
    };

    let newComment = "";
    const handlekeyDown = (e) => {
        //e.preventDefault();
        if (e.key !== "Enter" && e.key !== "Shift" && e.key !== "Backspace") {
            newComment += e.key;
        } else if (e.key === "Backspace") {
            newComment = newComment.slice(0, -1);
            //newComment = newComment.substring(0, newComment.length - 1);
        }
    };

    /* if (!wallPosts || !wallPosts.length) {
        //return null;
        return (
            <div className="opsNoFriendsNorRequestsFirstWrap">
                <div className="opsNoFriendsNorRequestsSecondtWrap">
                    <h1>Ops, it seems you don&#39;t have any posts yet..</h1>
                </div>
            </div>
        );
    } */

    return (
        <div className="wallWrapper">
            <div className="wallContainer">
                {/* <h1>Wall</h1> */}

                <div className="cardWallWrapper">
                    <div className="cardWallWrapperZindex">
                        <div className="sectionWrapper">
                            <div className="cardWallContainer">
                                <div className="cardWall">
                                    {/* <OnlineUsers></OnlineUsers> */}

                                    {/* {wallPosts == "undefined" && (
                                        <p id="noPostsYet">It seems you haven't post anything yet</p>
                                    )} */}

                                    {myWall ? (
                                        <div className="wallPostsGlassOverlayWrap">
                                            <div className="wallPostsGlassOverlay">
                                                {/* <h1>Wall posts</h1> */}
                                                <div>
                                                    {/* <p id="noPostsYet">No posts yet</p> */}
                                                    <p id="wallTitle">
                                                        Here you can upload
                                                        something on your wall_
                                                    </p>
                                                    <form
                                                        id="wallForm"
                                                        method="POST"
                                                        action="/upload"
                                                        autoComplete="off"
                                                        encType="multipart/form-data"
                                                    >
                                                        <label
                                                            id="labelImage"
                                                            htmlFor="image"
                                                        >
                                                            {fileLabel}
                                                        </label>
                                                        <input
                                                            name="image"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={
                                                                handleFileChange
                                                            }
                                                        />

                                                        <input
                                                            id="inputTitle"
                                                            name="description"
                                                            placeholder="Add a title here.."
                                                            type="text"
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                        <button
                                                            id="postWallBtn"
                                                            onClick={
                                                                handlePostWallPost
                                                            }
                                                        >
                                                            Post
                                                        </button>
                                                        <div className="registrationError">
                                                            {generalError && (
                                                                <span>
                                                                    Ops,
                                                                    something
                                                                    went wrong!
                                                                </span>
                                                            )}
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="wallPostsGlassOverlayWrap">
                                            <div className="wallPostsGlassOverlay">
                                                <div>
                                                    <p
                                                        id="wallTitle"
                                                        className="onHoverNoCursor"
                                                        style={{
                                                            fontSize: "1.7em",
                                                            marginTop: "21px",
                                                            //color: "lime",
                                                        }}
                                                    >
                                                        {userWallName}&apos;s
                                                        wall_
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="wallHistoryContainer">
                                        {neWallPosts &&
                                            neWallPosts != undefined &&
                                            neWallPosts.map((post, index) => (
                                                <div
                                                    id="wallHistoryElements"
                                                    key={index}
                                                >
                                                    <div>
                                                        <div className="wallPostsPicContainer">
                                                            <img
                                                                src={post.image}
                                                            />
                                                        </div>
                                                        <div
                                                            className="bioEditor"
                                                            id="titleTimestampWrap"
                                                        >
                                                            <p>
                                                                <b id="messageName">
                                                                    {post.title ==
                                                                    "undefined"
                                                                        ? null
                                                                        : post.title}
                                                                </b>{" "}
                                                            </p>
                                                            <p>
                                                                <small id="uploaderSigns">
                                                                    ❮
                                                                </small>
                                                                &nbsp; posted{" "}
                                                                {post.timestamp}
                                                                &nbsp;&nbsp;
                                                                <small id="uploaderSigns">
                                                                    ❯
                                                                </small>
                                                            </p>
                                                            <p>
                                                                {/* {post.comment ? (
                                                                    <>
                                                                        See{" "}
                                                                        Comments{" "}
                                                                        <small id="uploaderSigns">
                                                                            ||
                                                                        </small>
                                                                        &nbsp;
                                                                        Add a
                                                                        Comment
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        Add a
                                                                        Comment
                                                                    </>
                                                                )} */}
                                                                {/* {post.comments ? (
                                                                    <>
                                                                        See{" "}
                                                                        Comments{" "}
                                                                        <small id="uploaderSigns">
                                                                            ||
                                                                        </small>
                                                                        &nbsp;
                                                                        Add a
                                                                        Comment
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        Add a
                                                                        Comment
                                                                    </>
                                                                )} */}
                                                            </p>
                                                            <div className="commentWrap">
                                                                {post.id}
                                                                <p>
                                                                    {post
                                                                        .comments
                                                                        .length >
                                                                    0
                                                                        ? "COMMENTS ("
                                                                        : "This post has no comments yet. Be the first to leave a comment!"}
                                                                    {post
                                                                        .comments
                                                                        .length >
                                                                        0 &&
                                                                        post
                                                                            .comments
                                                                            .length}
                                                                    {post
                                                                        .comments
                                                                        .length >
                                                                        0 &&
                                                                        "):"}
                                                                </p>
                                                                {post.comments
                                                                    .length >
                                                                    0 &&
                                                                    post.comments.map(
                                                                        (
                                                                            comments,
                                                                            index
                                                                        ) => (
                                                                            <div
                                                                                className="commentConteiner"
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                <p id="commentNameDateTime">
                                                                                    <small id="uploaderSigns">
                                                                                        ❮
                                                                                    </small>
                                                                                    &nbsp;&nbsp;
                                                                                    {
                                                                                        comments.commentAuthorName
                                                                                    }{" "}
                                                                                    {
                                                                                        comments.commentTimeStamp
                                                                                    }{" "}
                                                                                    wrote:
                                                                                    &nbsp;&nbsp;
                                                                                    <small id="uploaderSigns">
                                                                                        ❯
                                                                                    </small>
                                                                                </p>
                                                                                <p id="comment">
                                                                                    <small id="uploaderSigns">
                                                                                        ≪
                                                                                    </small>
                                                                                    &nbsp;
                                                                                    {
                                                                                        comments.comment
                                                                                    }
                                                                                    &nbsp;
                                                                                    <small id="uploaderSigns">
                                                                                        ≫
                                                                                    </small>
                                                                                </p>
                                                                                {/* <span
                                                                                    onClick={() =>
                                                                                        dispatch(
                                                                                            deleteComment(
                                                                                                comments.commentId
                                                                                            )
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Delete
                                                                                    comment
                                                                                </span> */}
                                                                                <RiDeleteBinLine
                                                                                    id="commentDelete"
                                                                                    onClick={() =>
                                                                                        dispatch(
                                                                                            deleteComment(
                                                                                                comments.commentId
                                                                                            )
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        )
                                                                    )}
                                                            </div>
                                                            <div className="chatTextareaContainer">
                                                                <textarea
                                                                    id="chatTextarea"
                                                                    rows="1"
                                                                    cols="80"
                                                                    placeholder="Enter your comment here.."
                                                                    onKeyDown={
                                                                        handlekeyDown
                                                                    }
                                                                />
                                                            </div>
                                                            <div
                                                                className="registrationError"
                                                                id="commentAddError"
                                                            >
                                                                {newWallPostCommentError && (
                                                                    <span>
                                                                        Ops, it
                                                                        seems
                                                                        you
                                                                        haven&apos;t
                                                                        entered
                                                                        any
                                                                        comment
                                                                        yet!
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div id="commentButtonWrap">
                                                                <button
                                                                    /* onClick={
                                                                            handleClickDown
                                                                        } */
                                                                    onClick={() =>
                                                                        dispatch(
                                                                            postWallPostComment(
                                                                                newComment,
                                                                                id,
                                                                                post.id
                                                                            )
                                                                        )
                                                                    }
                                                                >
                                                                    Add comment
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
