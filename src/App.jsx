import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import axios from "axios";
import AddPostButton from "./component/AddPostButton";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addPost = (newPost) => {
    setData([...data, newPost]);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/post");
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
  {loading && <p key="loading" className="text-center text-xl text-gray-600">Loading...</p>}
  {error && <p key="error" className="text-center text-xl text-red-500">Error: {error?.message}</p>}
  
  {!loading && !error && (
    <>
      <div className="text-center text-4xl font-semibold text-blue-600 mt-10 mb-5">
        Bulletin Board
      </div>
      <div className="p-5">
        <AddPostButton addPost={addPost} fetchData={fetchData}/>
      </div>
      
      {data.map((post,idx) => (
        <div
          key={idx}
          className="bg-white shadow-lg rounded-lg border border-gray-200 p-5 m-5 hover:shadow-xl transition-shadow duration-300 ease-in-out"
        >
          <h3 className="text-2xl font-semibold text-gray-800 hover:text-blue-500 cursor-pointer transition-colors duration-300">
            {post.title}
          </h3>
          <small className="text-sm text-gray-500">
            Author: {post.author} | Created on{" "}
            {new Date(post.creationDate).toLocaleString()}
          </small>
          <p className="mt-2 text-gray-700">Views: {post.views}</p>
        </div>
      ))}
    </>
  )}
</>

  );
}

export default App;
