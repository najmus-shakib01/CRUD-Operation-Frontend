import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { baseUrl } from "../../constants/env.constants";

const StudentTable = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const queryClient = useQueryClient();

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/crud_opt/plans/`);
      if (!response.ok) throw new Error("Failed to fetch students");
      return response.json();
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: (studentId) => {
      return fetch(`${baseUrl}/crud_opt/plans/${studentId}/`, {
        method: "DELETE",
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to delete student");
        return res;
      });
    },
    onSuccess: () => {
      toast.success("Student deleted successfully");
      queryClient.invalidateQueries(["students"]);
      setDeleteModalOpen(false);
      setStudentToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Error:", error);
    },
  });

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteStudentMutation.mutate(studentToDelete.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {studentToDelete?.name}? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                disabled={deleteStudentMutation.isPending}
              >
                {deleteStudentMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Student Records
            </h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600">
              Manage all student information in one place
            </p>
          </div>
          <Link
            to="/student/create"
            className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition text-sm sm:text-base"
          >
            <FaPlus className="mr-2" /> Add New Student
          </Link>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {students.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No students found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "#",
                      "Name",
                      "Place",
                      "Phone",
                      "Email",
                      "Created",
                      "Updated",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-3 py-3 sm:px-6 sm:py-3 text-left text-xs text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student, index) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-3 py-4 text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.place}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.phone}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="hidden sm:inline">
                          {student.created_at}
                        </span>
                        <span className="sm:hidden text-xs">
                          {student.created_at?.split("T")[0]}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="hidden sm:inline">
                          {student.update_at}
                        </span>
                        <span className="sm:hidden text-xs">
                          {student.update_at?.split("T")[0]}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/student/edit/${student.id}/`}
                            className="text-blue-600 hover:text-blue-900 transition"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(student)}
                            className="text-red-600 hover:text-red-900 transition"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
