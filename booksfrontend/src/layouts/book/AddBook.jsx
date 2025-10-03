import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Book title is required")
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  publishedYear: Yup.number()
    .required("Published year is required")
    .min(1800, "Year must be 1800 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  authorId: Yup.number()
    .required("Author is required")
    .positive("Please select an author"),
  publisherId: Yup.number()
    .required("Publisher is required")
    .positive("Please select a publisher"),
});

const AddBook = () => {
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorsResponse, publishersResponse] = await Promise.all([
          axiosInstance.get("/authors"),
          axiosInstance.get("/publishers"),
        ]);
        setAuthors(authorsResponse.data.data);
        setPublishers(publishersResponse.data.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await axiosInstance.post("/books", {
        ...values,
        publishedYear: Number(values.publishedYear),
        authorId: Number(values.authorId),
        publisherId: Number(values.publisherId),
      });
      navigate("/books");
    } catch (error) {
      setStatus({ error: error.message || "Failed to add book" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <Formik
        initialValues={{
          title: "",
          description: "",
          publishedYear: "",
          authorId: "",
          publisherId: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form>
            {status && status.error && (
              <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                {status.error}
              </div>
            )}

            <div className="mb-6">
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Book Name
              </label>
              <Field
                type="text"
                id="title"
                name="title"
                placeholder="Enter book title"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              <ErrorMessage
                name="title"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Description
              </label>
              <Field
                type="text"
                id="description"
                name="description"
                placeholder="Enter book description"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              <ErrorMessage
                name="description"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="publishedYear"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Published Year
              </label>
              <Field
                type="number"
                id="publishedYear"
                name="publishedYear"
                placeholder="Enter published year"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              <ErrorMessage
                name="publishedYear"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="authorId"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Author
              </label>
              <Field
                as="select"
                id="authorId"
                name="authorId"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Select author</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="authorId"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="publisherId"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Publisher
              </label>
              <Field
                as="select"
                id="publisherId"
                name="publisherId"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Select Publisher</option>
                {publishers.map((publisher) => (
                  <option key={publisher.id} value={publisher.id}>
                    {publisher.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="publisherId"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Book"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddBook;
