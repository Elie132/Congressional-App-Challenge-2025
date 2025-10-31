import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { DonorDashboard } from "./DonorDashboard";
import { ReceiverDashboard } from "./ReceiverDashboard";

interface DashboardPageProps {
  setCurrentPage: (page: "home" | "feed" | "dashboard" | "create-listing" | "profile-setup") => void;
}

export function DashboardPage({ setCurrentPage }: DashboardPageProps) {
  const user = useQuery(api.users.getCurrentUser);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Please complete your profile to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user.name}! 
          {user.role === "donor" ? " Manage your food listings and pickup requests." : " Track your food claims and requests."}
        </p>
      </div>

      {user.role === "donor" ? (
        <DonorDashboard setCurrentPage={setCurrentPage} />
      ) : (
        <ReceiverDashboard setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
}
