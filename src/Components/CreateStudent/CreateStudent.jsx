import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../constants/env.constants";

const CreateStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    place: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  const createStudentMutation = useMutation({
    mutationFn: (studentData) => {
      return fetch(`${baseUrl}/crud_opt/plans/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      }).then((res) => {
        if (!res.ok) throw res.json();
        return res.json();
      });
    },
    onSuccess: () => {
      toast.success("Student created successfully!");
      navigate("/");
    },
    onError: (error) => {
      error
        .then((errData) => {
          const formattedErrors = {};
          for (const [field, messages] of Object.entries(errData)) {
            formattedErrors[field] = Array.isArray(messages)
              ? messages.join(" ")
              : messages;
          }
          setErrors(formattedErrors);
          toast.error("Failed to create student");
        })
        .catch(() => {
          toast.error("An error occurred while creating student");
        });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.place.trim()) newErrors.place = "Location is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    const requestData = {
      name: formData.name,
      place: formData.place,
      phone: formData.phone,
      email: formData.email,
    };

    createStudentMutation.mutate(requestData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
          <div className="w-8"></div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="place"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location *
                </label>
                <input
                  type="text"
                  id="place"
                  name="place"
                  value={formData.place}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.place ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                  placeholder="Enter location"
                />
                {errors.place && (
                  <p className="mt-1 text-sm text-red-600">{errors.place}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={createStudentMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={createStudentMutation.isPending}
              >
                <FaSave className="mr-2" />
                {createStudentMutation.isPending ? "Saving..." : "Save Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStudent;
