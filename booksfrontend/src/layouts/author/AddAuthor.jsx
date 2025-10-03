import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Author name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  bio: Yup.string()
    .required("Bio is required")
    .min(10, "Bio must be at least 10 characters")
    .max(1000, "Bio must not exceed 1000 characters"),
});

const AddAuthor = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await axiosInstance.post("/authors", values);
      navigate("/authors");
    } catch (error) {
      setStatus({ error: error.message || "Failed to add author" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <Formik
        initialValues={{ name: "", bio: "" }}
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
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Author Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                placeholder="Enter Author name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              <ErrorMessage
                name="name"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="bio"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Bio
              </label>
              <Field
                type="text"
                id="bio"
                name="bio"
                placeholder="Enter Author bio"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              <ErrorMessage
                name="bio"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Author"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddAuthor;
