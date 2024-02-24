"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation"; // 1. Import the useRouter hook

export default function Page() {
  const router = useRouter(); // 2. Invoke the useRouter hook
  let username: string = "electrical";
  let password: string = "electrical";
  
  const [inputValueUsername, setInputValueUsername] = useState("");
  const [inputValuePassword, setInputValuePassword] = useState("");

  // State to hold the verification results
  const [usernameVerificationResult, setUsernameVerificationResult] =
    useState("");
  const [passwordVerificationResult, setPasswordVerificationResult] =
    useState("");


  // Function to handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Verify username and password
    if (inputValueUsername === username && inputValuePassword === password) {
      setUsernameVerificationResult("Username is Correct.");
      setPasswordVerificationResult("Password is Correct.");
      // 3. Navigate to another page upon successful form submission
      router.push("/");
    } else {
      setUsernameVerificationResult("Username is incorrect.");
      setPasswordVerificationResult("Password is incorrect.");
    }
  };

  return (
    <>
      {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto h-15 w-auto"
            src="/artistic_logo.png"
            alt="Your Company"
            width={200}
            height={200}
            loading="eager"
          />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            action="/"
            method="POST"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={inputValueUsername}
                  onChange={(e) => setInputValueUsername(e.target.value)}
                  required
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <p
                  style={{
                    color: usernameVerificationResult.includes(
                      "Username is Correct."
                    )
                      ? "green"
                      : "red",
                  }}
                >
                  {usernameVerificationResult}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-[#1b2d92] hover:text-blue-800"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={inputValuePassword}
                  onChange={(e) => setInputValuePassword(e.target.value)}
                  required
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <p
                  style={{
                    color: passwordVerificationResult.includes(
                      "Password is Correct."
                    )
                      ? "green"
                      : "red",
                  }}
                >
                  {passwordVerificationResult}
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                // onSubmit={handleSubmit}
                onClick={handleSubmit}
                className="flex w-full justify-center rounded-md bg-[#1b2d92] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
                {/* <a href="/">Sign in</a> */}
              </button>
            </div>
          </form>

          <p className="mt-3 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="#"
              className="font-semibold leading-6 text-[#1b2d92] hover:text-indigo-600"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
