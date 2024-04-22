import React, { useState } from 'react';
import Avatar from "react-avatar";
import { CiImageOn } from "react-icons/ci";
import axios from "axios";
import { TWEET_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { getRefresh } from '../redux/tweetSlice';
import { firebase } from "./firebase"; // Adjust the path if needed

const CreatePost = () => {
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState("");
    const { user } = useSelector(store => store.user);
    const dispatch = useDispatch();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageURL(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadProfileImage = async (file) => {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`images/${file.name}`);
        try {
            await fileRef.put(file);
            const url = await fileRef.getDownloadURL();
            console.log("Image URL:", url); // Log the URL to check if it's obtained successfully
            return url;
        } catch (error) {
            console.error("Error uploading file to Firebase:", error);
            toast.error("Failed to upload image.");
            return null; // Return null if there is an error
        }
    };
    

    const submitHandler = async () => {
        if (!description.trim() || !user) {
            toast.error("Description and user information are required.");
            return;
        }

        let imageUrl = "";
        try {
            if (image) {
                imageUrl = await uploadProfileImage(image);
            }

            const res = await axios.post(`${TWEET_API_END_POINT}/create`, {
                description,
                id: user._id,
                imageUrl
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success("Tweet created successfully.");
                setDescription("");
                setImage(null);
                setImageURL("");
                dispatch(getRefresh());
            } else {
                throw new Error(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data.message || "An error occurred while creating the post.");
            console.error("Error in submitHandler:", error);
        }
    };

    return (
        <div className='w-[100%]'>
            <div className='flex items-center p-4'>
                <Avatar src={user?.profileImage || "https://i.pinimg.com/564x/63/cf/71/63cf712306660342b65226e3fa2f257e.jpg"} size="40" round={true} />
                <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='w-full outline-none border-none text-xl ml-2'
                    placeholder='What is happening?!'
                />
            </div>
            <div className='flex items-center justify-between p-4'>
                <div>
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => document.getElementById('fileInput').click()}>
                        <CiImageOn size="34px" />
                    </button>
                    <input
                        type="file"
                        id="fileInput"
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {imageURL && <img src={imageURL} alt="Preview" style={{ width: 100, height: 100 }} />}
                </div>
                <button onClick={submitHandler} className='bg-[#1D9BF0] px-4 py-1 text-lg text-white border-none rounded-full'>Post</button>
            </div>
        </div>
    );
}

export default CreatePost;