import React, { useState } from 'react';
import { CiSearch } from "react-icons/ci";
import Avatar from "react-avatar";
import { Link } from 'react-router-dom';

const RightSidebar = ({ otherUsers }) => {
  // State to hold the search term
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered list of users based on search term
  const filteredUsers = searchTerm.length === 0
    ? otherUsers
    : otherUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className='w-[25%]'>
      <div className='flex items-center p-2 bg-gray-100 rounded-full outline-none w-full'>
        <CiSearch size="20px" />
        <input
          type="text"
          className='bg-transparent outline-none px-2'
          placeholder='Search'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on change
        />
      </div>
      <div className='p-4 bg-gray-100 rounded-2xl my-4'>
        <h1 className='font-bold text-lg'>Who to follow</h1>
        {filteredUsers.map((user) => (
          <div key={user?._id} className='flex items-center justify-between my-3'>
            <div className='flex'>
              <div>
                <Avatar src={user?.profileImage || "https://i.pinimg.com/564x/63/cf/71/63cf712306660342b65226e3fa2f257e.jpg"} size="40" round={true} />
              </div>
              <div className='ml-2'>
                <h1 className='font-bold'>{user?.name}</h1>
                <p className='text-sm'>{`@${user?.username}`}</p>
              </div>
            </div>
            <div>
              <Link to={`/profile/${user?._id}`}>
                <button className='px-4 py-1 bg-black text-white rounded-full'>Profile</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RightSidebar;
