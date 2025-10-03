import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import useSWR, { useSWRConfig } from "swr";

const PublisherList = () => {
  const { mutate } = useSWRConfig();
  const [page, setPage] = useState(1);
  const limit = 5;

  const fetcher = async (url) => {
    const response = await axiosInstance.get(url);
    return response.data;
  };

  const { data } = useSWR(`/publishers?page=${page}&limit=${limit}`, fetcher);

  if (!data) return <h2>Loading...</h2>;

  const publishers = data.data;
  const totalPages = data.pagination.totalPages;

  const deletePublisher = async (publisherId) => {
    await axiosInstance.delete(`/publishers/${publisherId}`);
    mutate(`/publishers?page=${page}&limit=${limit}`);
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <Link
        to="/publishers/add"
        className="inline-block text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
      >
        Add Publisher
      </Link>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Address</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {publishers.map((publisher) => (
            <tr
              className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
              key={publisher.id}
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {publisher.name}
              </td>
              <td className="px-6 py-4">{publisher.address}</td>
              <td className="px-6 py-4">
                <Link
                  to={`/publishers/edit/${publisher.id}`}
                  className="font-medium bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded mr-1"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deletePublisher(publisher.id)}
                  className="font-medium bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded mr-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default PublisherList;
