import { useState } from "react";
import { signUpWithEmail, auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signUpWithEmail(formData.email, formData.password);
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Section: Signup Form */}
      <div className="flex-1 bg-[#000] text-white flex flex-col justify-center items-center p-8">
        <div className="bg-[#0e0e0e] p-8 rounded-xl shadow-lg max-w-md w-full flex flex-col gap-4">
          <div className="text-xl mb-6 text-center text-gradient text-[#999999]">
            <div className="text-4xl text-center font-semibold text-gradient py-4">
              <span className="text-[#e2ff24]">&lt;/</span>
              <span className="text-white">codeslate.io</span>
              <span className="text-[#24fe41]">&gt;</span>
            </div>
            Create your account,
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          
          <form onSubmit={handleSignup} className="flex flex-col gap-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 text-lg rounded-md bg-[#141414] text-white placeholder-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 text-lg rounded-md bg-[#141414] text-white placeholder-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 text-lg rounded-md bg-[#141414] text-white placeholder-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />

            <button
              type="submit"
              className={`text-black px-12 py-3 rounded-md font-semibold text-xl hover:bg-green-600  bg-gradient-to-r from-[#e2ff24] to-[#24fe41] transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Signing Up..." : "SIGN UP"}
            </button>
          </form>
          
          <div className="mt-6">
            <button
              onClick={handleGoogleSignup}
              className="w-full p-3 flex items-center justify-center gap-2 rounded-md font-semibold transition border border-[#24fe41] disabled:opacity-50"
              disabled={loading}
            >
              <FcGoogle className="text-xl" />
              <span>{loading ? "Loading..." : "SIGN UP WITH GOOGLE"}</span>
            </button>
          </div>

          <p className="text-center mt-4 text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-green-400 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>

      {/* Right Section: Background Image */}
      <div className="relative flex-1 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex justify-center items-center">
        <img
          src="/loginbg.jpg" // Replace with your image path
          alt="Illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Signup;
