import { useState } from "react";

export default function AuthForm({ onSubmit, type = "login" }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 w-full max-w-sm mx-auto mt-10 space-y-4"
    >
      <h2 className="text-xl font-bold text-center">
        {type === "login" ? "Login" : "Register"}
      </h2>

      {type === "register" && (
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        required
      />

      <button
        type="submit"
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded py-2"
      >
        {type === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
}
