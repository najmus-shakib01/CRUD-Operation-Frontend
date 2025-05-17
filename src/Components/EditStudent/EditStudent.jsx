import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../../constants/env.constants";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    place: "",
    phone: "",
    email: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        `${baseUrl}/crud_opt/plans/${id}`
      )
      .then((res) => {
        setFormData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching student:", err);
        toast.error("Failed to load student data");
        setIsLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(
        `${baseUrl}/crud_opt/plans/${id}`,
        formData
      )
      .then(() => {
        toast.success("Student updated successfully", {
          onClose: () => navigate("/"),
        });
      })
      .catch((err) => {
        console.error("Update error:", err);
        toast.error("Failed to update student");
      });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${baseUrl}/crud_opt/plans/${id}`
      );
      toast.success("Student deleted successfully", {
        onClose: () => navigate("/"),
      });
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete student");
    }
  };

  const showDeleteConfirmation = () => {
    toast.warning(
      <div className="p-4">
        <p className="text-center mb-3 text-gray-700 font-medium">
          Are you sure you want to delete this student?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              toast.dismiss();
              confirmDelete();
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition shadow-md hover:shadow-lg"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition shadow-md hover:shadow-lg"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        position: "top-center",
        className: "w-full max-w-md",
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Edit Student
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Update the student information below
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {["name", "place", "phone", "email"].map((field) => (
                  <div
                    key={field}
                    className={
                      field === "name" || field === "email"
                        ? "sm:col-span-2"
                        : ""
                    }
                  >
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      id={field}
                      placeholder={`Enter student ${field}`}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-end gap-3 pt-4">
                <Link
                  to="/"
                  className="px-6 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="button"
                  onClick={showDeleteConfirmation}
                  className="px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                >
                  Delete
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
