import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";

const AuthorList = () => {
  const { mutate } = useSWRConfig();
  const fetcher = async () => {
    const response = await axios.get("http://localhost:5000/authors");
    return response.data;
  };

  const { data } = useSWR("authors", fetcher);
  if (!data) return <h2>Loading...</h2>;

  const deleteAuthor = async (authorId) => {
    await axios.delete(`http://localhost:5000/authors/${authorId}`);
    mutate("authors");
  };

  return (
    <div className="relative overflow-x-auto  sm:rounded-lg">
      <Link
        to="/authors/add"
        className="inline-block text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
      >
        Add Author
      </Link>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Bio
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((author) => (
            <tr
              className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
              key={author.id}
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {author.name}
              </th>
              <td className="px-6 py-4">{author.bio}</td>

              <td className="px-6 py-4">
                <Link
                  to={`/authors/edit/${author.id}`}
                  className="font-medium bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded mr-1"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteAuthor(author.id)}
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

export default AuthorList;
