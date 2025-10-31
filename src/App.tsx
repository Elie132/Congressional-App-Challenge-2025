import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { ProfileSetup } from "./components/ProfileSetup";
import { ProfilePage } from "./components/ProfilePage";
import { FeedPage } from "./components/FeedPage";
import { MapView } from "./components/MapView";
import { DashboardPage } from "./components/DashboardPage";
import { CreateListingPage } from "./components/CreateListingPage";
import { SafetyGuidelinesPage } from "./components/SafetyGuidelinesPage";
import { Logo } from "./components/Logo";

type Page = "home" | "feed" | "map" | "dashboard" | "create-listing" | "profile-setup" | "profile" | "safety" | "auth";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const user = useQuery(api.users.getCurrentUser);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage("home")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Logo size="md" />
            <span className="text-2xl font-bold text-green-600">ShelfShare</span>
          </button>
          
          <Authenticated>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-4">
                <button
                  onClick={() => setCurrentPage("feed")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === "feed"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Browse Food
                </button>
                <button
                  onClick={() => setCurrentPage("map")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === "map"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Map View
                </button>
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === "dashboard"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage("profile")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === "profile"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setCurrentPage("safety")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === "safety"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Safety
                </button>
              </nav>
              <SignOutButton />
            </div>
          </Authenticated>
        </div>
      </header>

      <main className="flex-1">
        <Content 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          user={user}
        />
      </main>

      <footer className="bg-white border-t py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-gray-600 mb-1">
                Built for the Congressional App Challenge 2025
              </p>
              <p className="text-xs text-gray-500">
                Reducing food waste, strengthening communities, one meal at a time.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setCurrentPage("safety")}
                className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                🛡️ Safety & Guidelines
              </button>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500">
                Safe food sharing for all
              </span>
            </div>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

function Content({ 
  currentPage, 
  setCurrentPage, 
  user 
}: { 
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  user: any;
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <>
      <Unauthenticated>
        {currentPage === "home" ? (
          <HomePage setCurrentPage={setCurrentPage} />
        ) : (
          <div className="max-w-md mx-auto mt-16 px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In to ShelfShare</h1>
              <p className="text-gray-600">Join the fight against food waste</p>
            </div>
            <SignInForm />
            <div className="mt-6 text-center">
              <button
                onClick={() => setCurrentPage("home")}
                className="text-green-600 hover:text-green-700 text-sm"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        )}
      </Unauthenticated>

      <Authenticated>
        {!user ? (
          <ProfileSetup onComplete={() => setCurrentPage("home")} />
        ) : (
          <>
            {currentPage === "home" && <HomePage setCurrentPage={setCurrentPage} />}
            {currentPage === "feed" && <FeedPage setCurrentPage={setCurrentPage} />}
            {currentPage === "map" && <MapView setCurrentPage={setCurrentPage} />}
            {currentPage === "dashboard" && <DashboardPage setCurrentPage={setCurrentPage} />}
            {currentPage === "create-listing" && <CreateListingPage setCurrentPage={setCurrentPage} />}
            {currentPage === "profile-setup" && <ProfileSetup onComplete={() => setCurrentPage("home")} />}
            {currentPage === "profile" && <ProfilePage setCurrentPage={setCurrentPage} />}
            {currentPage === "safety" && <SafetyGuidelinesPage setCurrentPage={setCurrentPage} />}
          </>
        )}
      </Authenticated>
    </>
  );
}
