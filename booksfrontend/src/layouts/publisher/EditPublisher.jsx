import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Publisher name is required")
    .min(3, "Publisher name must be at least 3 characters")
    .max(100, "Publisher name must not exceed 100 characters"),
  address: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must not exceed 200 characters"),
});

const EditPublisher = () => {
  const [initialValues, setInitialValues] = useState({ name: "", address: "" });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getPublisherById = async () => {
      try {
        const response = await axiosInstance.get(`/publishers/${id}`);
        setInitialValues({
          name: response.data.name,
          address: response.data.address,
        });
      } catch (error) {
        navigate("/publishers");
      } finally {
        setIsLoading(false);
      }
    };
    getPublisherById();
  }, [id, navigate]);

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await axiosInstance.patch(`/publishers/${id}`, values);
      navigate("/publishers");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update publisher";
      setStatus({ error: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-lg mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
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
                Publisher Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                placeholder="Enter publisher name"
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
                htmlFor="address"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Address
              </label>
              <Field
                type="text"
                id="address"
                name="address"
                placeholder="Enter publisher address"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              <ErrorMessage
                name="address"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update publisher"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditPublisher;
