import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Tailwind.css";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/post/${id}`);
      setPost(response.data);
    } catch (error) {
      setError("Error fetching post details.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleEditSave = async () => {
    try {
      await axios.put(`http://localhost:8080/post/${id}`, {
        password: password,
        content: editContent,
      });
      fetchPost();
      setShowEditModal(false);
      setPassword("");
    } catch (error) {
      window.alert("Error saving the post. Incorrect password?");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log(`this is password: ${password}`);
      await axios.delete(`http://localhost:8080/post/${id}`, {
        data: {
          password: password,
        },
      });
      window.alert("Post deleted successfully!");
      setPassword("");
      navigate("/");
    } catch (error) {
      window.alert("Error deleting the post. Incorrect password?");
    }
  };

  if (!post) {
    return (
      <p className="text-center mt-10 text-lg text-gray-500">Loading...</p>
    );
  }

  return (
    <div className="px-96">
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-5 m-5 hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <h1 className="font-bold text-2xl">{post?.title}</h1>
        <small>by: {post?.author}</small>
        <div className="bg-orange-100 rounded-lg border p-5 my-5">
          {post?.content}
        </div>
        <div className="flex flex-col">
          <small>creation date: {post?.creationDate}</small>
          {post?.creationDate !== post?.modificationDate ? (
            <small>Modified date: {post?.modificationDate}</small>
          ) : null}
          <small>views: {post?.views}</small>
        </div>
        <div className="mt-6 flex space-x-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Post</h3>
            <textarea
              className="w-full border border-gray-300 rounded p-2 mb-4"
              rows="5"
              value={editContent || post.content}
              onChange={(e) => setEditContent(e.target.value)}
            ></textarea>
            <input
              type="password"
              className="w-full border border-gray-300 rounded p-2 mb-4"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleEditSave}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this post?
            </h3>
            <input
              type="password"
              className="w-full border border-gray-300 rounded p-2 mb-4"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleDeleteConfirm}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostDetail;
