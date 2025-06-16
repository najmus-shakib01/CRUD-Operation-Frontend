import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaSave } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../constants/env.constants";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    place: "",
    phone: "",
    email: "",
  });

  const { data: student, isLoading } = useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      if (!id) return {};
      const response = await fetch(`${baseUrl}/crud_opt/plans/${id}/`);
      if (!response.ok) throw new Error("Failed to fetch student data");
      return response.json();
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (student) {
      setFormData(student);
    }
  }, [student]);

  const saveStudentMutation = useMutation({
    mutationFn: (studentData) => {
      const url = id
        ? `${baseUrl}/crud_opt/plans/${id}/`
        : `${baseUrl}/crud_opt/plans/`;
      const method = id ? "PUT" : "POST";

      return fetch(url, {
        method,
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
      toast.success(`Student ${id ? "updated" : "created"} successfully!`);
      queryClient.invalidateQueries(["students"]);
      navigate("/");
    },
    onError: (error) => {
      error
        .then((errData) => {
          toast.error(`Failed to ${id ? "update" : "create"} student`);
          console.error("Error:", errData);
        })
        .catch(() => {
          toast.error("An error occurred");
        });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveStudentMutation.mutate(formData);
  };

  if (isLoading && id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? "Edit Student" : "Create New Student"}
          </h1>
          <div className="w-8"></div>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="place"
                  className="block text-sm font-medium text-gray-700"
                >
                  Place *
                </label>
                <input
                  type="text"
                  id="place"
                  name="place"
                  value={formData.place}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={saveStudentMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={saveStudentMutation.isPending}
              >
                <FaSave className="mr-2" />
                {saveStudentMutation.isPending
                  ? id
                    ? "Updating..."
                    : "Creating..."
                  : id
                  ? "Update Student"
                  : "Create Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
