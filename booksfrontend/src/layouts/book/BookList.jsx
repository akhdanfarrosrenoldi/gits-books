import React from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import useSWR, { useSWRConfig } from "swr";

const BookList = () => {
  const { mutate } = useSWRConfig();
  const fetcher = async () => {
    const response = await axiosInstance.get("/books");
    return response.data;
  };

  const { data } = useSWR("books", fetcher);
  if (!data) return <h2>Loading...</h2>;

  const deleteBook = async (bookId) => {
    await axiosInstance.delete(`/books/${bookId}`);
    mutate("books");
  };

  return (
    <div className="relative overflow-x-auto  sm:rounded-lg">
      <Link
        to="/add"
        className="inline-block text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
      >
        Add Book
      </Link>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Book Name
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Published Year
            </th>
            <th scope="col" className="px-6 py-3">
              Author
            </th>
            <th scope="col" className="px-6 py-3">
              Publisher
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((book) => (
            <tr
              className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
              key={book.id}
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {book.title}
              </th>
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
    </div>
  );
};

export default BookList;
