import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import Loading from "./Loading"

const Register = () => {

  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  const signUpSchema = z.object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" }),

    email: z.string().email({ message: "Invalid email address" }),

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(10, { message: "Password must not exceed 10 characters" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (formData) => {
    setLoading(true);
  try {
    const { data } = await axios.post('http://localhost:3000/api/v1/auth/register', {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (data.success) {
      console.log(data);
      toast.success(data.message);
      reset();
      navigate("/login"); 
    }
  } catch (error) {
    const errMsg =
      error.response?.data?.message || "Something went wrong. Try again.";
    toast.error(errMsg);
  }finally{
    setLoading(false);
  }
};

if (loading) return <Loading/>;


  return (
    <div className="w-full h-screen bg-gradient-to-b from-white to-pink-100 flex items-center justify-center">
      <div className="bg-white/30 backdrop-blur-md shadow-xl rounded-2xl p-10 w-full max-w-md border border-white/40">
        <h2 className="text-2xl font-bold text-center mb-6 text-pink-600">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Username Input */}
          <div>
            <input
              {...register("username")}
              placeholder="Username"
              type="text"
              className="w-full p-3 rounded-md border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            {errors.username && (
              <span className="text-red-500 text-sm">
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Email Input */}
          <div>
            <input
              {...register("email")}
              placeholder="Email"
              type="email"
              className="w-full p-3 rounded-md border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Input */}
          <div>
            <input
              {...register("password")}
              placeholder="Password"
              type="password"
              className="w-full p-3 rounded-md border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={isSubmitting}
            type="submit"
            className="bg-pink-500 cursor-pointer hover:bg-pink-600 transition-colors text-white font-semibold py-3 rounded-md disabled:bg-pink-300"
          >
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </button>
          <p className="text-[15px] font-bold text-center pb-6 text-pink-600">Already have an account? <span onClick={()=>navigate('login')} className="text-blue-500 cursor-pointer underline"> Login</span></p>
        </form>
      </div>
    </div>
  );
};

export default Register;
