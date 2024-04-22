import React, { useState } from 'react';
import Avatar from "react-avatar";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiHeart, CiBookmark } from "react-icons/ci";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { getRefresh } from '../redux/tweetSlice';
import { TWEET_API_END_POINT, timeSince } from "../utils/constant";
import CommentText from './CommentText';

const Tweet = ({ tweet }) => {
    const { user } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const [commentVisible, setCommentVisible] = useState(false);
    const [comment, setComment] = useState("");

    const likeOrDislikeHandler = async (id) => {
        try {
            const res = await axios.put(`${TWEET_API_END_POINT}/like/${id}`, { id: user?._id }, {
                withCredentials: true
            });
            dispatch(getRefresh());
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const deleteTweetHandler = async (id) => {
        try {
            const res = await axios.delete(`${TWEET_API_END_POINT}/delete/${id}`);
            dispatch(getRefresh());
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const sendComment = async (postId, commentText) => {
    try {
      // Send comment to server
      const response = await axios.post(
        `http://192.168.1.10:3000/tweet/${postId}/comment`,
        { comments: { user: user, text: commentText } }
      );
      console.log("hilo", commentText);
      console.log("Comment sent successfully:", response.data);
      // Refresh posts to reflect the new comment
    } catch (error) {
      console.log("Error sending comment:", error);
    }
  };
    console.log("titi",tweet)
    return (
        <div className='border-b border-gray-200'>
            <div className='flex p-4'>
                <Avatar src={tweet?.userId?.profileImage || "https://i.pinimg.com/564x/63/cf/71/63cf712306660342b65226e3fa2f257e.jpg"} size="40" round={true} />
                <div className='ml-2 w-full'>
                    <div className='flex items-center'>
                        <h1 className='font-bold'>{tweet?.userDetails[0]?.name}</h1>
                        <p className='text-gray-500 text-sm ml-1'>{`@${tweet?.userDetails[0]?.username} · ${timeSince(tweet?.createdAt)}`}</p>
                    </div>
                    <div>
                        <p>{tweet?.description}</p>
                        {tweet?.imageUrl && <img src={tweet.imageUrl} alt="Tweet" />}
                    </div>
                    <div className='flex justify-between my-3'>
                        <div className='flex items-center'>
                            <div className='p-2 hover:bg-green-200 rounded-full cursor-pointer'>
                                <FaRegComment size="50px" />
                            </div>
                         
                        </div>
                       <CommentText postId={tweet._id} sendComment={sendComment}/>
                       {console.log(tweet._id)};
                        <div className='flex items-center' onClick={() => likeOrDislikeHandler(tweet?._id)}>
                            <div className='p-2 hover:bg-pink-200 rounded-full cursor-pointer'>
                                <CiHeart size="24px" />
                            </div>
                            <p>{tweet?.like?.length || 0}</p>
                        </div>
                        <div className='p-2 hover:bg-yellow-200 rounded-full cursor-pointer'>
                            <CiBookmark size="24px" />
                            <p>0</p>
                        </div>
                        {user?._id === tweet?.userId && (
                            <div onClick={() => deleteTweetHandler(tweet?._id)} className='flex items-center'>
                                <div className='p-2 hover:bg-red-300 rounded-full cursor-pointer'>
                                    <MdOutlineDeleteOutline size="24px" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tweet;
