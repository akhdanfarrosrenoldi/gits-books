import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";

const EditAuthor = () => {
  const [name, setName] = React.useState("");
  const [bio, setBio] = React.useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getAuthorById = async () => {
      const response = await axiosInstance.get(`/authors/${id}`);
      setName(response.data.name);
      setBio(response.data.bio);
    };
    getAuthorById();
  }, [id]);

  const updateAuthor = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`/authors/${id}`, {
        name: name,
        bio: bio,
      });
      navigate("/authors");
    } catch (error) {
      console.error(
        "Failed to add Author:",
        error.response?.data || error.message
      );
      alert("Failed to add Author");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <form onSubmit={updateAuthor}>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Author Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter Author name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="address"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Bio
          </label>
          <input
            type="text"
            id="bio"
            placeholder="Enter Author bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditAuthor;
