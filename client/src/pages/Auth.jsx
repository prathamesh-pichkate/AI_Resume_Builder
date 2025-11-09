import React, { useEffect } from "react";

const Login = () => {
  const [state, setState] = React.useState("login");
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  // ✅ Parse query param safely on mount
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    let urlState = query.get("state");

    if (urlState) {
      // Remove extra quotes or invalid chars
      urlState = urlState.replace(/['"]+/g, "");
      if (urlState === "login" || urlState === "register") {
        setState(urlState);
      }
    }
  }, []);

  // ✅ Update URL whenever state changes
  useEffect(() => {
    const newUrl = `${window.location.pathname}?state=${state}`;
    window.history.replaceState(null, "", newUrl);
  }, [state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state === "login") {
      console.log("Logging in with:", formData);
      // login logic
    } else {
      console.log("Signing up with:", formData);
      // signup logic
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Side (Image) */}
      <div className="hidden lg:block w-1/2 h-full">
        <img
          className="w-full h-full object-cover"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          alt="leftSideImage"
        />
      </div>

      {/* Right Side (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="md:w-96 w-80 flex flex-col items-center justify-center"
        >
          <h2 className="text-4xl text-gray-100 font-semibold">
            {state === "login" ? "Sign in" : "Sign up"}
          </h2>

          <p className="text-sm text-gray-400/90 mt-3">
            {state === "login"
              ? "Welcome back! Please sign in to continue"
              : "Create your account to get started"}
          </p>

          {/* Google Login */}
          <button
            type="button"
            className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full text-gray-50 hover:bg-gray-500/20 transition-colors gap-3"
          >
            <img
              src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"
              alt="googleLogo"
              className="w-7"
            />
            {state === "login" ? "Sign in with Google" : "Sign up with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 w-full my-5">
            <div className="w-full h-px bg-gray-300/90"></div>
            <p className="w-full text-nowrap text-sm text-gray-500/90">
              or {state === "login" ? "sign in" : "sign up"} with email
            </p>
            <div className="w-full h-px bg-gray-300/90"></div>
          </div>

          {/* Name Field (only for Signup) */}
          {state === "register" && (
            <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user-round"
              >
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div className="flex items-center w-full mt-4 bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg
              width="16"
              height="11"
              viewBox="0 0 16 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="email"
              name="email"
              placeholder="Email id"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center mt-4 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg
              width="13"
              height="17"
              viewBox="0 0 13 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          {/* Login extras */}
          {state === "login" && (
            <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
              <div className="flex items-center gap-2">
                <input className="h-5" type="checkbox" id="checkbox" />
                <label className="text-sm" htmlFor="checkbox">
                  Remember me
                </label>
              </div>
              <a className="text-sm underline" href="#">
                Forgot password?
              </a>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
          >
            {state === "login" ? "Login" : "Sign up"}
          </button>

          {/* Toggle Link */}
          <p className="text-gray-500/90 text-sm mt-4">
            {state === "login"
              ? "Don’t have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() =>
                setState((prev) => (prev === "login" ? "register" : "login"))
              }
              className="text-indigo-400 hover:underline"
            >
              {state === "login" ? "Sign up" : "Login"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
