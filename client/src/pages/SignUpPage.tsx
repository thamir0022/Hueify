import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/auth/user/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Signup failed.");
        setIsSuccess(false);
        return;
      }

      setMessage("Signup successful!");
      setIsSuccess(true);
      setTimeout(() => navigate("/sign-in"), 3000);

    } catch (error) {
      console.error("Signup error:", error);
      setMessage("An error occurred during sign-up.");
      setIsSuccess(false);
    }
  };

  return (
    <section className="w-screen overflow-x-hidden flex flex-col">
      <Header />
      <div className="flex items-center justify-center min-h-screen">
        <div className="border dark:border-gray-900 w-full max-w-md p-8 space-y-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center">Create Your Account</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {["firstName", "lastName", "email", "password"].map((field, idx) => (
              <div key={idx} className="space-y-2">
                <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                <Input
                  id={field}
                  type={field === "email" ? "email" : field === "password" ? "password" : "text"}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleInputChange}
                  placeholder={`Enter ${field}`}
                  required
                />
              </div>
            ))}

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <label htmlFor="terms" className="text-sm font-medium">
                I agree to the terms and conditions
              </label>
            </div>

            <Button type="submit" className="w-full">Sign Up</Button>

            {message && (
              <p className={`text-center font-semibold ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                {message}
              </p>
            )}

            <div className="text-center">
              Already have an account?{" "}
              <Link to="/sign-in" className="font-semibold text-blue-600">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
