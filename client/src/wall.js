import { useDispatch, useSelector } from "react-redux";
import useStatefulFields from "./customhooks/use-stateful-fields";
import { useState, useEffect } from "react";
import { BiShowAlt } from "react-icons/bi";
import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";
import { BsFillReplyFill } from "react-icons/bs";
import { RiDeleteBinLine, RiSdCardFill } from "react-icons/ri";
import {
    getWallPosts,
    postWallPost,
    deletePost,
    getWallPostComments,
    postWallPostComment,
    deleteComment,
    getWallPostCommentsReplies,
    postWallPostCommentReply,
    deleteCommentReply,
    getActiveUserInfos,
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
    const newWallPostCommentReplyError = useSelector(
        (state) => state && state.newWallPostCommentReplyError
    );
    const activeUserInfos = useSelector(
        (state) => state && state.activeUserInfos
    );
    let activeUserName;
    if (activeUserInfos) {
        activeUserName =
            activeUserInfos[0].first + " " + activeUserInfos[0].last;
    }

    const wallPosts = useSelector((state) => state && state.wallPosts);
    const wallPostCommentsNoReplies = useSelector(
        (state) => state && state.wallPostComments
    );
    const wallPostCommentsReplies = useSelector(
        (state) => state && state.wallPostCommentsReplies
    );

    let neWallPosts = [];
    let wallPostComments = [];
    if (
        wallPostCommentsNoReplies &&
        wallPostCommentsNoReplies != undefined &&
        Array.isArray(wallPostCommentsNoReplies) &&
        wallPostCommentsNoReplies.length > 0 &&
        wallPostCommentsReplies &&
        wallPostCommentsReplies != undefined &&
        wallPostCommentsReplies.length > 0
    ) {
        wallPostComments = wallPostCommentsNoReplies.map((obj) => ({
            ...obj,
            replies: [],
        }));

        for (let c in wallPostComments) {
            for (let r in wallPostCommentsReplies) {
                if (
                    wallPostComments[c].commentId ==
                    wallPostCommentsReplies[r].replyCommentId
                ) {
                    wallPostComments[c].replies.push(
                        wallPostCommentsReplies[r]
                    );
                }
            }
        }
        //console.log("----- A: ", wallPostComments);
    }
    if (wallPosts) {
        //console.log("----------: ", wallPosts);
        neWallPosts = wallPosts.map((obj) => ({
            ...obj,
            comments: [],
        }));
        if (
            wallPostComments &&
            wallPostComments != undefined &&
            wallPostComments.length > 0
        ) {
            for (let i in neWallPosts) {
                for (let e in wallPostComments) {
                    if (
                        neWallPosts[i].id == wallPostComments[e].commentPostId
                    ) {
                        neWallPosts[i].comments.push(wallPostComments[e]);
                    }
                }
            }
            console.log("neWallPosts: ", neWallPosts);
        }
    }

    useEffect(() => {
        dispatch(getActiveUserInfos());
        dispatch(getWallPosts(userWallId));
        dispatch(getWallPostComments(userWallId));
        dispatch(getWallPostCommentsReplies(userWallId));
    }, [userWallId]);

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

    // Post new post's comment
    let newComment = "";
    let newCommentPostId = "";
    const handlekeyDownComment = (e, postId) => {
        //console.log("e: ", e.target.value, postId);
        newCommentPostId = postId;

        if (e.key === "Enter") {
            e.preventDefault();
            dispatch(postWallPostComment(e.target.value, userWallId, postId));
            e.target.value = "";
        } else if (e.key != "Backspace") {
            newComment = e.target.value + e.key;
        } else if (e.key == "Backspace") {
            newComment = newComment.slice(0, -1);
        }
    };
    const postNewCommentBtn = () => {
        dispatch(postWallPostComment(newComment, userWallId, newCommentPostId));
    };

    // Post new comment's reply
    let newReply = "";
    let newReplyPostId = "";
    let newReplyCommentId = "";
    const handlekeyDownReply = (e, postId, commentId) => {
        //console.log("e: ", e.target.value, postId, commentId);
        newReplyPostId = postId;
        newReplyCommentId = commentId;

        if (e.key === "Enter") {
            e.preventDefault();
            dispatch(postWallPostComment(e.target.value, userWallId, postId));
            dispatch(
                postWallPostCommentReply(
                    e.target.value,
                    userWallId,
                    postId,
                    commentId
                )
            );
            e.target.value = "";
        } else if (e.key != "Backspace") {
            newReply = e.target.value + e.key;
        } else if (e.key == "Backspace") {
            newReply = newReply.slice(0, -1);
        }
    };
    const postNewReplyBtn = () => {
        dispatch(
            postWallPostCommentReply(
                newReply,
                userWallId,
                newReplyPostId,
                newReplyCommentId
            )
        );
    };

    const [showHideComments, setShowHideComments] = useState(false);
    const onClickShowHideComments = () => {
        setShowHideComments(!showHideComments);
    };

    /* const [showHideReplies, setShowHideReplies] = useState(false);
    setShowHideReplies(!showHideReplies); */

    /* if (!wallPosts || !wallPosts.length) {
        //return null;
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
                                                    <p id="wallTitle" style={{ fontSize: '1.6em'}}>
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
                                                            {myWall && (
                                                                <p
                                                                    className="deleteWallPostBtn"
                                                                    title="Delete Post"
                                                                    onClick={() =>
                                                                        dispatch(
                                                                            deletePost(
                                                                                post.id
                                                                            )
                                                                        )
                                                                    }
                                                                >
                                                                    X
                                                                </p>
                                                            )}
                                                            <p>
                                                                <b>
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
                                                                {!showHideComments ? (
                                                                    <MdExpandMore
                                                                        /* style={{
                                                                        color:
                                                                            "lime",
                                                                    }} */
                                                                        className="showCommentBtn"
                                                                        //id="commentDelete"
                                                                        title="Show Comments"
                                                                        onClick={
                                                                            onClickShowHideComments
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <MdExpandLess
                                                                        className="showCommentBtn"
                                                                        id="showLessCommentBtn"
                                                                        title="Hide Comments"
                                                                        onClick={
                                                                            onClickShowHideComments
                                                                        }
                                                                    />
                                                                )}
                                                            </p>
                                                            {showHideComments && (
                                                                <div className="commentsWrap">
                                                                    {/* {post.id} */}
                                                                    <p id="commentsOrNoComments">
                                                                        {post
                                                                            .comments
                                                                            .length >
                                                                        0
                                                                            ? "Comments ("
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
                                                                    {post.comments !=
                                                                        undefined &&
                                                                        post
                                                                            .comments
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
                                                                                        <img
                                                                                            //className="profile_pic"
                                                                                            className="commentProfPic"
                                                                                            src={
                                                                                                comments.commentAuthorProfile_pic
                                                                                            }
                                                                                            alt={
                                                                                                comments.commentAuthorName
                                                                                            }
                                                                                        />
                                                                                        <b>
                                                                                            {
                                                                                                comments.commentAuthorName
                                                                                            }{" "}
                                                                                        </b>
                                                                                        {
                                                                                            comments.commentTimeStamp
                                                                                        }{" "}
                                                                                        commented:
                                                                                        &nbsp;&nbsp;
                                                                                        <small id="uploaderSigns">
                                                                                            ❯
                                                                                        </small>
                                                                                    </p>
                                                                                    <p id="comment">
                                                                                        <small
                                                                                            id="uploaderSigns"
                                                                                            className="commentReplySignsSx"
                                                                                        >
                                                                                            ≪
                                                                                        </small>
                                                                                        &nbsp;
                                                                                        {
                                                                                            comments.comment
                                                                                        }
                                                                                        &nbsp;
                                                                                        <small
                                                                                            id="uploaderSigns"
                                                                                            className="commentReplySignsDx"
                                                                                        >
                                                                                            ≫
                                                                                        </small>
                                                                                    </p>
                                                                                    {myWall ? (
                                                                                        <RiDeleteBinLine
                                                                                            id="commentDelete"
                                                                                            title="Delete Comment"
                                                                                            onClick={() =>
                                                                                                dispatch(
                                                                                                    deleteComment(
                                                                                                        comments.commentId
                                                                                                    )
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    ) : (
                                                                                        activeUserName !=
                                                                                            undefined &&
                                                                                        activeUserName ==
                                                                                            comments.commentAuthorName && (
                                                                                            <RiDeleteBinLine
                                                                                                id="commentDelete"
                                                                                                title="Delete Comment"
                                                                                                onClick={() =>
                                                                                                    dispatch(
                                                                                                        deleteComment(
                                                                                                            comments.commentId
                                                                                                        )
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        )
                                                                                    )}
                                                                                    {/* <div>
                                                                                        <BsFillReplyFill
                                                                                            id="commentReply"
                                                                                            title="Reply"
                                                                                            onClick={() =>
                                                                                                onClickShowHideReplies(
                                                                                                    comments.commentPostId,
                                                                                                    comments.commentId
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                        &nbsp;
                                                                                    </div> */}

                                                                                    {/* {comments.replies &&
                                                                                        comments
                                                                                            .replies
                                                                                            .length >
                                                                                            0 && (
                                                                                            <BiShowAlt
                                                                                                id="commentReply"
                                                                                                className="showMore"
                                                                                                title="Show Replies"
                                                                                                onClick={
                                                                                                onClickShowHideReplies
                                                                                            }
                                                                                            />
                                                                                        )}
                                                                                    {comments.replies &&
                                                                                        comments
                                                                                            .replies
                                                                                            .length >
                                                                                            0 &&
                                                                                        "Replies ("}
                                                                                    {comments.replies &&
                                                                                        comments
                                                                                            .replies
                                                                                            .length >
                                                                                            0 &&
                                                                                        comments
                                                                                            .replies
                                                                                            .length}
                                                                                    {comments.replies &&
                                                                                        comments
                                                                                            .replies
                                                                                            .length >
                                                                                            0 &&
                                                                                        ") "} */}

                                                                                    {
                                                                                        /* showHideReplies && */
                                                                                        comments.replies &&
                                                                                            comments
                                                                                                .replies
                                                                                                .length >
                                                                                                0 &&
                                                                                            comments.replies.map(
                                                                                                (
                                                                                                    commentReply,
                                                                                                    index
                                                                                                ) => (
                                                                                                    <div
                                                                                                        className="replyConteiner"
                                                                                                        key={
                                                                                                            index
                                                                                                        }
                                                                                                    >
                                                                                                        <p id="replyNameDateTime">
                                                                                                            <small id="uploaderSigns">
                                                                                                                ❮
                                                                                                            </small>
                                                                                                            &nbsp;&nbsp;
                                                                                                            <img
                                                                                                                //className="profile_pic"
                                                                                                                className="commentReplyProfPic"
                                                                                                                src={
                                                                                                                    commentReply.replyAuthorProfile_pic
                                                                                                                }
                                                                                                                alt={
                                                                                                                    commentReply.replyAuthorName
                                                                                                                }
                                                                                                            />
                                                                                                            {
                                                                                                                commentReply.replyAuthorName
                                                                                                            }{" "}
                                                                                                            {/* {
                                                                                                                commentReply.replyTimeStamp
                                                                                                            }{" "} */}
                                                                                                            {
                                                                                                                commentReply.createdAtFromNow
                                                                                                            }{" "}
                                                                                                            replied:
                                                                                                            &nbsp;&nbsp;
                                                                                                            <small id="uploaderSigns">
                                                                                                                ❯
                                                                                                            </small>
                                                                                                        </p>
                                                                                                        <p id="reply">
                                                                                                            {/* <BsFillReplyFill
                                                                                                                id="commentReply"
                                                                                                                title="Reply to Comment"
                                                                                                            /> */}
                                                                                                            <small
                                                                                                                id="uploaderSigns"
                                                                                                                className="commentReplySignsSx"
                                                                                                            >
                                                                                                                ≪
                                                                                                            </small>
                                                                                                            &nbsp;
                                                                                                            {
                                                                                                                commentReply.reply
                                                                                                            }
                                                                                                            &nbsp;
                                                                                                            <small
                                                                                                                id="uploaderSigns"
                                                                                                                className="commentReplySignsDx"
                                                                                                            >
                                                                                                                ≫
                                                                                                            </small>
                                                                                                        </p>
                                                                                                        {myWall ? (
                                                                                                            <RiDeleteBinLine
                                                                                                                id="commentDelete"
                                                                                                                className="replyDelete"
                                                                                                                title="Delete Reply"
                                                                                                                onClick={() =>
                                                                                                                    dispatch(
                                                                                                                        deleteCommentReply(
                                                                                                                            commentReply.replyId
                                                                                                                        )
                                                                                                                    )
                                                                                                                }
                                                                                                            />
                                                                                                        ) : (
                                                                                                            activeUserName !=
                                                                                                                undefined &&
                                                                                                            activeUserName ==
                                                                                                                commentReply.replyAuthorName && (
                                                                                                                <RiDeleteBinLine
                                                                                                                    id="commentDelete"
                                                                                                                    className="replyDelete"
                                                                                                                    title="Delete Reply"
                                                                                                                    onClick={() =>
                                                                                                                        dispatch(
                                                                                                                            deleteCommentReply(
                                                                                                                                commentReply.replyId
                                                                                                                            )
                                                                                                                        )
                                                                                                                    }
                                                                                                                />
                                                                                                            )
                                                                                                        )}
                                                                                                    </div>
                                                                                                )
                                                                                            )
                                                                                    }

                                                                                    <div className="replyTextareaContainer">
                                                                                        <textarea
                                                                                            /* id="chatTextarea" */
                                                                                            className="replyTextArea"
                                                                                            rows="1"
                                                                                            cols="70"
                                                                                            placeholder="Enter your reply here.."
                                                                                            /* onKeyDown={
                                                                                                handlekeyDownReply
                                                                                            } */
                                                                                            onKeyDown={(
                                                                                                e
                                                                                            ) =>
                                                                                                handlekeyDownReply(
                                                                                                    e,
                                                                                                    post.id,
                                                                                                    comments.commentId
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                    <div
                                                                                        className="registrationError"
                                                                                        id="commentAddError"
                                                                                    >
                                                                                        {newWallPostCommentReplyError && (
                                                                                            <span>
                                                                                                Ops,
                                                                                                it
                                                                                                seems
                                                                                                you
                                                                                                haven&apos;t
                                                                                                entered
                                                                                                any
                                                                                                comment
                                                                                                reply
                                                                                                yet!
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                    {/* <div id="commentButtonWrap">
                                                                                        <button
                                                                                            onClick={
                                                                                                postNewReplyBtn
                                                                                            }
                                                                                        >
                                                                                            Add
                                                                                            reply
                                                                                        </button>
                                                                                    </div> */}
                                                                                </div>
                                                                            )
                                                                        )}
                                                                </div>
                                                            )}
                                                            {showHideComments && (
                                                                <>
                                                                    <div className="chatTextareaContainer">
                                                                        <textarea
                                                                            id="chatTextarea"
                                                                            rows="1"
                                                                            cols="80"
                                                                            placeholder="Enter your comment here.."
                                                                            /* onKeyDown={
                                                                                handlekeyDownComment
                                                                            } */
                                                                            onKeyDown={(
                                                                                e
                                                                            ) =>
                                                                                handlekeyDownComment(
                                                                                    e,
                                                                                    post.id
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        className="registrationError"
                                                                        id="commentAddError"
                                                                    >
                                                                        {newWallPostCommentError && (
                                                                            <span>
                                                                                Ops,
                                                                                it
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
                                                                            onClick={
                                                                                postNewCommentBtn
                                                                            }
                                                                        >
                                                                            Add
                                                                            comment
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        {neWallPosts && neWallPosts.length > 0 && (
                                            <div>
                                                <h1
                                                    id="endWall"
                                                    className="glitchMainTitle"
                                                    data-text="end Wall_"
                                                >
                                                    end Wall_
                                                </h1>
                                            </div>
                                        )}
                                        {neWallPosts != undefined &&
                                            neWallPosts.length == 0 &&
                                            (myWall ? (
                                                <h1
                                                    id="noPostOnWall"
                                                    className="glitchMainTitle"
                                                    data-text="It seems you
                                                    haven't uploaded any Wall™️
                                                    posts yet"
                                                >
                                                    It seems you haven&#39;t
                                                    uploaded any Wall™️ posts
                                                    yet
                                                </h1>
                                            ) : (
                                                <h1
                                                    id="noPostOnWall"
                                                    className="glitchMainTitle"
                                                    data-text={`It seems ${name} hasn't
                                                    uploaded any posts yet..`}
                                                >
                                                    It seems {name} hasn&#39;t
                                                    uploaded any posts yet..
                                                </h1>
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
