import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UserProfile {
  name: string;
  lastName?: string;
  date?: string;
  mobilePhone?: string;
  email: string;
}

export default function Settings() {
  const { user, token } = useAuthContext();
  const toastId = "profile-loaded";
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<UserProfile>();

  // Fetch user data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.sub || !token) return;
        const res = await axios.get(
          `http://localhost:5000/api/users/${user.sub}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        const data = res.data;

        // Format the date field if it exists
        const formattedDate = data.date
          ? new Date(data.date).toISOString().split("T")[0]
          : "";
        reset({...data,
          date: formattedDate}); // Populate form
      } catch (error) {
        toast.error("Failed to load profile");
        console.error(error);
      }
    };

    fetchData();
  }, [token, reset]);

  // Submit handler
  const onSubmit = async (data: UserProfile) => {
    try {
      if (!user?.sub || !token) return;

      await axios.patch(
        `${process.env.REACT_APP_API_URL}/users/${user.sub}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile updated");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6">
      <h2 className="text-2xl font-semibold mb-1">Account Information</h2>
      <p className="text-sm text-gray-500 mb-6">
        Update your account information
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">First Name</label>
            <input
              {...register("name", { required: true })}
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="First Name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Last Name</label>
            <input
              {...register("lastName")}
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Last Name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Date of Birth</label>
            <input
              {...register("date")}
              type="date"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Mobile Number</label>
            <input
              {...register("mobilePhone")}
              type="tel"
              className="w-full border rounded px-3 py-2"
              placeholder="+1234567890"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Email (not editable)</label>
            <input
              {...register("email")}
              type="email"
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
