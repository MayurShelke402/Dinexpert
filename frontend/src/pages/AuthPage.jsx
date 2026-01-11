import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, registerUser } from "../api/authAPI";
import { startTableSession } from "../api/tableAPI";
import { getHotelById } from "../api/hotelAPI";
import AuthForm from "../components/AuthForm";
import { useSessionStore } from "../store/useSessionStore";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [logo, setLogo] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Zustand store
  const { hotelId, tableId, userId, setSession } = useSessionStore();

  /** Handle QR code session on first load */
  useEffect(() => {
    const match = location.pathname.match(/\/order\/table\/(.+)/);
    const qrCodeRaw = match?.[1];
    const qrCodeValue = qrCodeRaw ? decodeURIComponent(qrCodeRaw) : null;

    if (qrCodeValue && (!hotelId || !tableId)) {
      startTableSession(qrCodeValue)
        .then((res) => {
          const { hotel, table } = res.data;
          setSession({ hotelId: hotel._id, tableId: table._id });
        })
        .catch((err) => {
          console.error("Session start failed", err);
          setMessage("Invalid or expired QR Code. Please scan a valid QR.");
        });
    }
  }, [location.pathname, hotelId, tableId, setSession]);

  /** Fetch hotel logo */
  useEffect(() => {
    if (hotelId) {
      getHotelById(hotelId)
        .then((res) => {
          setLogo(res.data.logo);
        })
        .catch((err) => console.error("Error fetching hotel details", err));
    }
  }, [hotelId]);

  /** Handle login/register form submit */
  const handleSubmit = async (formData) => {
    try {
      setMessage("");
      const { data } =
        mode === "login"
          ? await loginUser(formData)
          : await registerUser(formData);

      localStorage.setItem("token", data.token);

      // Keep hotelId & tableId from QR session, add userId
      setSession({
        hotelId,
        tableId,
        userId: data.user._id
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      const fallback = err?.message ?? `${mode} failed. Please try again.`;
      setMessage(err?.response?.data?.message || fallback);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute top-0 left-0 w-full h-full animate-pulse-slow">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob-one"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob-two"></div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl p-8 transform transition-transform duration-500 animate-fade-in-up">
        {logo && (
          <img
            src={logo}
            alt="Hotel Logo"
            className="w-full h-32 mx-auto mb-6 object-cover rounded-xl shadow-lg animate-pulse-logo"
          />
        )}

        <AuthForm onSubmit={handleSubmit} type={mode} />

        {message && (
          <div className="mt-4 p-3 text-sm text-center text-red-700 bg-red-100 rounded-lg">
            {message}
          </div>
        )}

        <p className="text-sm mt-6 text-center text-gray-600">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("register")}
                className="font-semibold text-orange-600 hover:text-orange-800 transition-colors duration-200"
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="font-semibold text-orange-600 hover:text-orange-800 transition-colors duration-200"
              >
                Login here
              </button>
            </>
          )}
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes pulse-logo {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.02); opacity: 1; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob-one {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes blob-two {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, -50px) scale(1.1); }
          66% { transform: translate(20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-pulse-slow { animation: pulse-slow 10s infinite; }
        .animate-blob-one { animation: blob-one 10s infinite ease-in-out; }
        .animate-blob-two { animation: blob-two 12s infinite ease-in-out; }
        .animate-fade-in-up { animation: fade-in-up 0.7s ease-out; }
        .animate-pulse-logo { animation: pulse-logo 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
