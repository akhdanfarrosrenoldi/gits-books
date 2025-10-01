import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditPublisher = () => {
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getPublisherById = async () => {
      const response = await axios.get(
        `http://localhost:5000/publishers/${id}`
      );
      setName(response.data.name);
      setAddress(response.data.address);
    };
    getPublisherById();
  }, [id]);

  const updatePublisher = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/publishers/${id}`, {
        title: name,
        address: address,
      });
      navigate("/publishers");
    } catch (error) {
      console.error(
        "Failed to add Publisher:",
        error.response?.data || error.message
      );
      alert("Failed to add Publisher");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <form onSubmit={updatePublisher}>
        {/* Publisher Name */}
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Publisher Name
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter Publisher title"
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
            Description
          </label>
          <input
            type="text"
            id="address"
            placeholder="Enter Publisher Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        {/* Submit Button */}
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

export default EditPublisher;
