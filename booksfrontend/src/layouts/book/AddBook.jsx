import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [publishedYear, setPublishedYear] = React.useState("");
  const [authorId, setAuthorId] = React.useState("");
  const [publisherId, setPublisherId] = React.useState("");
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const navigate = useNavigate();

  // Fetch authors dari API
  useEffect(() => {
    // fetch authors
    axios
      .get("http://localhost:5000/authors")
      .then((res) => setAuthors(res.data))
      .catch((err) => console.error(err));

    // fetch publishers
    axios
      .get("http://localhost:5000/publishers")
      .then((res) => setPublishers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const saveBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/books", {
        title: name,
        description,
        publishedYear: Number(publishedYear),
        authorId: Number(authorId),
        publisherId: Number(publisherId),
      });
      navigate("/");
    } catch (error) {
      console.error(
        "Failed to add book:",
        error.response?.data || error.message
      );
      alert("Failed to add book");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <form onSubmit={saveBook}>
        {/* Book Name */}
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Book Name
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter book title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            placeholder="Enter book description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        {/* Published Year */}
        <div className="mb-6">
          <label
            htmlFor="publishedYear"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Published Year
          </label>
          <input
            type="number"
            id="publishedYear"
            placeholder="Enter published year"
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        {/* Author */}
        <div className="mb-6">
          <label
            htmlFor="author"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Author
          </label>
          <select
            id="author"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Select author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        {/* Publisher */}
        <div className="mb-6">
          <label
            htmlFor="publisher"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Publisher
          </label>
          <select
            id="publisher"
            value={publisherId}
            onChange={(e) => setPublisherId(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Select Publisher</option>
            {publishers.map((publisher) => (
              <option key={publisher.id} value={publisher.id}>
                {publisher.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
