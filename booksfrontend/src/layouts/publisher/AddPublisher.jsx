import React from "react";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";

const AddPublisher = () => {
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");

  const navigate = useNavigate();

  const savePublisher = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/publishers", {
        name: name,
        address: address,
      });
      navigate("/publishers");
    } catch (error) {
      console.error(
        "Failed to add publisher:",
        error.response?.data || error.message
      );
      alert("Failed to add publisher");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <form onSubmit={savePublisher}>
        {/* publisher Name */}
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Publisher Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter publisher name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="address"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            placeholder="Enter publisher address"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
        >
          Add publisher
        </button>
      </form>
    </div>
  );
};

export default AddPublisher;
