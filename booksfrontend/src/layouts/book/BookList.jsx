import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import useSWR, { useSWRConfig } from "swr";

const BookList = () => {
  const { mutate } = useSWRConfig();
  const [page, setPage] = useState(1);
  const limit = 10;
  const fetcher = async (url) => {
    const response = await axiosInstance.get(url);
    return response.data;
  };

  const { data } = useSWR(`/books?page=${page}&limit=${limit}`, fetcher);

  if (!data) return <h2>Loading...</h2>;

  const books = data.data;
  const totalPages = data.totalPages;

  const deleteBook = async (bookId) => {
    await axiosInstance.delete(`/books/${bookId}`);
    mutate(`/books?page=${page}&limit=${limit}`);
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <Link
        to="/add"
        className="inline-block text-gray-900 bg-white border border-gray-300 focus:outline-none 
          hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
      >
        Add Book
      </Link>

      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th className="px-6 py-3">Book Name</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">Published Year</th>
            <th className="px-6 py-3">Author</th>
            <th className="px-6 py-3">Publisher</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr
              className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
              key={book.id}
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {book.title}
              </td>
              <td className="px-6 py-4">{book.description}</td>
              <td className="px-6 py-4">{book.publishedYear}</td>
              <td className="px-6 py-4">{book.author.name}</td>
              <td className="px-6 py-4">{book.publisher.name}</td>
              <td className="px-6 py-4">
                <Link
                  to={`/edit/${book.id}`}
                  className="font-medium bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded mr-1"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteBook(book.id)}
                  className="font-medium bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded mr-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav aria-label="Page navigation" className="mt-4">
        <ul className="inline-flex -space-x-px text-sm">
          <li>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg 
                hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i}>
              <button
                onClick={() => setPage(i + 1)}
                className={`px-3 h-8 leading-tight border border-gray-300 ${
                  page === i + 1
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            </li>
          ))}

          <li>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg 
                hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default BookList;
