import React,{useState, useEffect} from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
import Avatar from "react-avatar";
import { useSelector,useDispatch } from "react-redux";
import useGetProfile from '../hooks/useGetProfile';
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast"
import { followingUpdate } from '../redux/userSlice';
import { getRefresh } from '../redux/tweetSlice';
import { firebase } from "./firebase"; // Adjust the path if needed
const Profile = () => {
    const { user, profile } = useSelector(store => store.user);
    const { id } =  useParams();
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState("");
    useGetProfile(id);
    const dispatch = useDispatch();
    const handleImageChange = (event) => {
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
    
    const followAndUnfollowHandler = async () => {
        if(user.following.includes(id)){
            // unfollow
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`, {id:user?._id});
                console.log(res);
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data.message);
            } catch (error) {
                toast.error(error.response.data.message);
                console.log(error);
            }
            
        }else{
            // follow
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, {id:user?._id});
                console.log(res);
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data.message);
            } catch (error) {
                toast.error(error.response.data.message);
                console.log(error);
            }
        }
    }
    console.log("user",user)
const uploadImage = async (file) => {
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

const submitHandler = async (e) => {
    
     
    let imageUrl = ""; 
    try {
        if (image) {
            imageUrl = await uploadImage(image);
        }
        
     

        const res = await axios.post(`${USER_API_END_POINT}/uploadProfileImage/${id}`, {
            imageUrl
        });
        
     
        if (res.data.success) {
            toast.success("image  created successfully.");
       
            setImage(null);
            setImageURL("");
            dispatch(getRefresh());
        } else {
            throw new Error(res.data.message);
        }
    } catch (error) {
        toast.error(error.response?.data.message || "An error occurred .");
        console.error("Error in submitHandler:", error);
    }
};
const defaultProfileImageUrl = 'https://i.pinimg.com/564x/63/cf/71/63cf712306660342b65226e3fa2f257e.jpg';


return (
    <div className='w-[50%] border-l border-r border-gray-200'>
    <div>
        <div className='flex items-center py-2'>
            <Link to="/" className='p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer'>
                <IoMdArrowBack size="24px" />
            </Link>
            <div className='ml-2'>
                <h1 className='font-bold text-lg'>{profile?.name}</h1>
                <p className='text-gray-500 text-sm'>10 post</p>
            </div>
        </div>
        <img src="https://pbs.twimg.com/profile_banners/1581707412922200067/1693248932/1080x360" alt="banner" />
        <div className='absolute top-52 ml-2 border-4 border-white rounded-full'>
            <Avatar src={profile?.profileImage || defaultProfileImageUrl} size="120" round={true} />
        </div>
        <div className='text-right m-4'>
            {
                profile?._id === user?._id ? (
                    <button className='px-4 py-1 hover:bg-gray-200 rounded-full border border-gray-400'>Edit Profile</button>

                ) : (
                    <button onClick={followAndUnfollowHandler} className='px-4 py-1 bg-black text-white rounded-full'>{user.following.includes(id) ? "Following" : "Follow"}</button>
                )
            }
        </div>
        <div className='m-4'>
            <h1 className='font-bold text-xl'>{profile?.name}</h1>
            <p>{`@${profile?.username}`}</p>
        </div>
        <div className='m-4 text-sm'>
            <p>🌐 Exploring the web's endless possibilities with MERN Stack 🚀 | Problem solver by day, coder by night 🌙 | Coffee lover ☕ | Join me on this coding journey!</p>
        </div>
        <input type='file' onChange={handleImageChange}></input>
        {imageURL && <img src={imageURL} alt="Selected" />}
        <button onClick={submitHandler} type='submit'>Submit</button>
    </div>
</div>
);
};


export default Profile