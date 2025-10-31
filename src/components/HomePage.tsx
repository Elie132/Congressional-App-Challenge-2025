import { Authenticated, Unauthenticated } from "convex/react";
import { LogoWithText } from "./Logo";

interface HomePageProps {
  setCurrentPage: (page: "home" | "feed" | "dashboard" | "create-listing" | "profile-setup" | "auth") => void;
}

export function HomePage({ setCurrentPage }: HomePageProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            Congressional App Challenge 2025
          </span>
        </div>
        
        {/* Large Logo */}
        <div className="flex justify-center mb-8">
          <LogoWithText size="lg" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Stop Food Waste,
          <br />
          <span className="text-green-600">Feed Communities</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          ShelfShare connects restaurants, bakeries, and residents with surplus food 
          to shelters, food pantries, and families in need. Together, we can reduce 
          waste and strengthen our communities.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Authenticated>
            <button
              onClick={() => setCurrentPage("create-listing")}
              className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              🍽️ List Surplus Food
            </button>
            <button
              onClick={() => setCurrentPage("feed")}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              🔍 Find Food Near Me
            </button>
          </Authenticated>
          <Unauthenticated>
            <button
              onClick={() => setCurrentPage("auth")}
              className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              Get Started
            </button>
          </Unauthenticated>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-green-600 mb-2">40%</div>
          <p className="text-gray-600">of food in the US is wasted annually</p>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-blue-600 mb-2">38M</div>
          <p className="text-gray-600">Americans face food insecurity</p>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-purple-600 mb-2">Local</div>
          <p className="text-gray-600">community-driven solution</p>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How ShelfShare Works
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-green-600 mb-6">For Food Donors</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">List Your Surplus</h4>
                  <p className="text-gray-600">Post details about available food, pickup times, and location</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Review Requests</h4>
                  <p className="text-gray-600">Approve pickup requests from verified receivers</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Coordinate Pickup</h4>
                  <p className="text-gray-600">Use built-in chat to confirm details and complete the transfer</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-blue-600 mb-6">For Food Receivers</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Search by Location</h4>
                  <p className="text-gray-600">Find available food listings in your ZIP code area</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Request Pickup</h4>
                  <p className="text-gray-600">Submit requests for food that meets your needs</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Collect Food</h4>
                  <p className="text-gray-600">Coordinate with donors to pick up food safely</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-6">
          Built for the Congressional App Challenge, ShelfShare addresses two critical issues: 
          food waste and food insecurity. By creating a simple, accessible platform for local 
          food redistribution, we're empowering communities to take action and make a real difference.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span className="px-4 py-2 bg-white rounded-full text-gray-700">🌱 Environmental Impact</span>
          <span className="px-4 py-2 bg-white rounded-full text-gray-700">🤝 Community Building</span>
          <span className="px-4 py-2 bg-white rounded-full text-gray-700">📱 Mobile-First Design</span>
          <span className="px-4 py-2 bg-white rounded-full text-gray-700">🔒 Safe & Secure</span>
        </div>
      </div>
    </div>
  );
}
