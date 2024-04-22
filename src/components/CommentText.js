import React, { useState } from "react";
import { FiSend } from 'react-icons/fi'; // Corrected import

const CommentText = ({ postId, sendComment }) => {
  const [commentText, setCommentText] = useState("");

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleSendComment = () => {
    if (commentText.trim() !== "") {
      sendComment(postId, commentText);
      setCommentText("");
    }
  };
  console.log(postId);

  return (
    <>
      <input
        type="text"
        placeholder="Comment"
        value={commentText}
        onChange={handleCommentChange}
      />
      <button onClick={handleSendComment}>
        <FiSend size={20} color="black" />
      </button>
    </>
  );
};

export default CommentText;
