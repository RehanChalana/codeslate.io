import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      console.log(localStorage.getItem("user"));
      navigate("/home");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      console.log(localStorage.getItem("user"));
      navigate("/home");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Section: Form */}

      <div className="flex-1 bg-[#000] text-white flex flex-col justify-center items-center p-8">
        <div className="bg-[#0e0e0e] p-8 rounded-xl shadow-lg max-w-md w-full flex flex-col gap-4">
          <div className="text-xl mb-6 text-center text-gradient text-[#999999]">
            <div
              onClick={() => navigate("/")}
              className="text-4xl text-center font-semibold text-gradient py-4 cursor-pointer"
            >
              <span className="text-[#e2ff24]">&lt;/</span>
              <span className="text-white">codeslate.io</span>
              <span className="text-[#24fe41]">&gt;</span>
            </div>
            Welcome back,
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
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

            <button
              type="submit"
              className={`text-black px-12 py-3 rounded-md font-semibold cursor-pointer text-xl hover:bg-green-600  bg-gradient-to-r from-[#e2ff24] to-[#24fe41] transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>
          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full p-3 flex items-center justify-center gap-2 cursor-pointer rounded-md font-semibold transition border border-[#24fe41] disabled:opacity-50"
              disabled={loading}
            >
              <FcGoogle className="text-xl" />
              <span>{loading ? "Loading..." : "LOGIN WITH GOOGLE"}</span>
            </button>
          </div>
          <p className="text-center mt-4 text-gray-400">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-green-400 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>

      {/* Right Section: Image/Gradient */}
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

export default Login;
