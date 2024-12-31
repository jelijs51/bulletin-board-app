import { useState } from "react";
import "../css/Tailwind.css";
import { useEffect } from "react";
import axios from "axios";
import AddPostButton from "../component/AddPostButton";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastPostId, setLastPostId] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  const addPost = (newPost) => {
    setData([...data, newPost]);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/post", {
        params: { lastPostId: lastPostId },
      });
      if (response.data.length > 0) {
        setData((prevData) => [...prevData, ...response.data]);
        setLastPostId(response.data[response.data.length - 1].postId);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setError("Error occurred while fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const onPostClick = (id) => {
    navigate(`/post/${id}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLoadMore = () => {
    fetchData();
  };

  return (
    <>
      {loading && (
        <p key="loading" className="text-center text-xl text-gray-600">
          Loading...
        </p>
      )}
      {error && (
        <p key="error" className="text-center text-xl text-red-500">
          Error: Failed to get post data
        </p>
      )}

      {!loading && !error && (
        <div className="px-96 pb-10">
          <div className="text-center text-4xl font-semibold text-blue-600 mt-10 mb-5">
            Bulletin Board
          </div>
          <div className="mx-14 p-10">
            <AddPostButton addPost={addPost} fetchData={fetchData} />
          </div>
          <div className="border rounded-lg mx-24 px-8 bg-yellow-50">
            {data.map((post, idx) => (
              <div
                key={idx}
                className="bg-white shadow-lg rounded-lg border border-gray-200 p-5 m-5 hover:shadow-xl transition-shadow duration-300 ease-in-out"
                onClick={() => onPostClick(post?.postId)}
              >
                <h3 className="text-2xl font-semibold text-gray-800 hover:text-blue-500 cursor-pointer transition-colors duration-300">
                  {post?.title}
                </h3>
                <small className="text-sm text-gray-500">
                  Author: {post?.author} | Created on{" "}
                  {new Date(post?.creationDate).toLocaleString()}
                </small>
                <p className="mt-2 text-gray-700">Views: {post?.views}</p>
              </div>
            ))}
            {hasMore && (
              <div
                className="mx-auto max-w-max my-5"
                onClick={() => handleLoadMore()}
              >
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Homepage;
