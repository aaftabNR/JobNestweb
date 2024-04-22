import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axios from "axios";
import Tweet from "./Tweet";

const Bookmark = () => {
  const { user } = useSelector(store => store.user);
  const [bookmarkedTweets, setBookmarkedTweets] = useState([]);

  useEffect(() => {
    if (user) {
      // Fetch bookmarked tweets
      const fetchBookmarkedTweets = async () => {
        try {
          const response = await axios.get(`/api/bookmarks/${user._id}`);
          setBookmarkedTweets(response.data.bookmarkedTweets);
        } catch (error) {
          console.error("Error fetching bookmarked tweets:", error);
        }
      };
      fetchBookmarkedTweets();
    }
  }, [user]);

  return (
    <div>
      <h2>Bookmarked Tweets</h2>
      {bookmarkedTweets.map(tweet => (
        <Tweet key={tweet._id} tweet={tweet} />
      ))}
    </div>
  );
};

export default Bookmark;