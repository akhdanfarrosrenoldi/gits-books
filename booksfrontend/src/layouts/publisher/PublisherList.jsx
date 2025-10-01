import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";

const PublisherList = () => {
  const { mutate } = useSWRConfig();
  const fetcher = async () => {
    const response = await axios.get("http://localhost:5000/publishers");
    return response.data;
  };

  const { data } = useSWR("publishers", fetcher);
  if (!data) return <h2>Login terlebih dahulu</h2>;

  const deletePublisher = async (publisherId) => {
    await axios.delete(`http://localhost:5000/publishers/${publisherId}`);
    mutate("publishers");
  };

  return (
    <div className="relative overflow-x-auto  sm:rounded-lg">
      <Link
        to="/publishers/add"
        className="inline-block text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
      >
        Add Publisher
      </Link>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Address
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((publisher) => (
            <tr
              className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
              key={publisher.id}
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {publisher.name}
              </th>
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
    </div>
  );
};

export default PublisherList;
