import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTableByQRCode } from "../api/tableAPI";
import { useSessionStore } from "../store/useSessionStore";

export default function OrderPage() {
  const { qrCodeValue } = useParams();
  const navigate = useNavigate();
  const setSession = useSessionStore((state) => state.setSession);

  useEffect(() => {
    const fetchTable = async () => {
      try {
        const { table, hotel } = await getTableByQRCode(qrCodeValue);
        
        console.log("Table and Hotel Info:", { 
          tableId: table.id, 
          hotelId: hotel.id, 
          hotelName: hotel.name 
        });
        
        // ✅ Save hotelId, tableId, and hotelName to store
        setSession({ 
          hotelId: hotel.id, 
          tableId: table.id,
          hotelName: hotel.name // Store hotel name
        });

        navigate("/auth"); // redirect to login/home
      } catch (err) {
        console.error("Invalid QR Code:", err);
        alert("Invalid QR Code");
        navigate("/404");
      }
    };

    if (qrCodeValue) fetchTable();
  }, [qrCodeValue, navigate, setSession]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Table Info...</p>
      </div>
    </div>
  );
}
