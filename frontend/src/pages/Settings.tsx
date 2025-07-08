import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { fetchUser, updateUserProfile } from "../features/user/userSlice";

interface UserProfile {
  name: string;
  lastName?: string;
  date?: string;
  mobilePhone?: string;
  email: string;
}

export default function Settings() {
  const { token, user: auth0User } = useAuthContext();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UserProfile>();

  // Fetch user data on mount
  useEffect(() => {
    if (auth0User?.sub && token) {
      dispatch(fetchUser({ token, auth0Id: auth0User.sub }));
    }
  }, [auth0User, token, dispatch]);

  useEffect(() => {
    if (user) {
      const formattedDate = user.date
        ? new Date(user.date).toISOString().split("T")[0]
        : "";
      reset({ ...user, date: formattedDate });
    }
  }, [user, reset]);

  // Submit handler
  const onSubmit = async (data: UserProfile) => {
    if (!user?._id || !token) return;
    try {
      await dispatch(
        updateUserProfile({ token, userId: user._id, data })
      ).unwrap();

      // ✅ Immediately re-fetch the latest user after update
      if (auth0User && typeof auth0User.sub === "string") {
        await dispatch(fetchUser({ token, auth0Id: auth0User.sub }));
      }

      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-lg shadow  ">
      <h2 className="text-2xl font-semibold mb-1 text-black dark:text-gray-100">
        Account Information
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Update your account information
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-black dark:text-gray-100">
              First Name
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-gray-100 border-gray-300 dark:border-gray-700"
              placeholder="First Name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-black dark:text-gray-100">
              Last Name
            </label>
            <input
              {...register("lastName")}
              type="text"
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-gray-100 border-gray-300 dark:border-gray-700"
              placeholder="Last Name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-black dark:text-gray-100">
              Date of Birth
            </label>
            <input
              {...register("date")}
              type="date"
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-gray-100 border-gray-300 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-black dark:text-gray-100">
              Mobile Number
            </label>
            <input
              {...register("mobilePhone")}
              type="tel"
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-gray-100 border-gray-300 dark:border-gray-700"
              placeholder="+1234567890"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1 text-black dark:text-gray-100">
              Email (not editable)
            </label>
            <input
              {...register("email")}
              type="email"
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed border-gray-300 dark:border-gray-700"
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
