import React from "react";
import ProfileInfo from "../components/ProfileInfo";
import OrderHistory from "../components/OrderHistory";

export default function ProfilePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
      <ProfileInfo />
      <OrderHistory />
    </div>
  );
}
