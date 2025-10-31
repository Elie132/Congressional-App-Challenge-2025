import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { ChatModal } from "./ChatModal";
import { StoredImage } from "./StoredImage";

interface ReceiverDashboardProps {
  setCurrentPage: (page: "home" | "feed" | "dashboard" | "create-listing" | "profile-setup") => void;
}

export function ReceiverDashboard({ setCurrentPage }: ReceiverDashboardProps) {
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  
  const myClaims = useQuery(api.listings.getMyClaims);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "claimed": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-gray-100 text-gray-700";
      case "expired": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case "prepared_food": return "🍽️";
      case "produce": return "🥬";
      case "packaged_goods": return "📦";
      case "baked_goods": return "🥖";
      default: return "🍎";
    }
  };

  // Find claims for each listing
  const getClaimForListing = (listingId: string) => {
    // This would need to be implemented with a proper query
    // For now, we'll show the listing status
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <button
          onClick={() => setCurrentPage("feed")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          🔍 Browse Available Food
        </button>
      </div>

      {/* My Claims */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Food Claims</h2>
        
        {myClaims === undefined ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : myClaims.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No food claims yet. Browse available food to get started!
          </p>
        ) : (
          <div className="space-y-4">
            {myClaims.map((listing) => (
              <div key={listing._id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Food Image */}
                <div className="w-full h-32 bg-gray-50 flex items-center justify-center p-2">
                  <StoredImage 
                    imageId={listing.photoUrl}
                    alt={listing.title}
                    className="max-w-full max-h-full object-contain rounded"
                    fallback={
                      <span className="text-3xl">{getCategoryEmoji(listing.category)}</span>
                    }
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                    <p className="text-sm text-gray-600">
                      From: {listing.donor?.organization || listing.donor?.name}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(listing.status)}`}>
                    {listing.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{listing.description}</p>
                
                <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div><span className="font-medium">Quantity:</span> {listing.quantity}</div>
                  <div><span className="font-medium">ZIP:</span> {listing.zipCode}</div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Pickup:</span> {formatTime(listing.pickupTimeStart)} - {formatTime(listing.pickupTimeEnd)}
                  </div>
                  {listing.claimedAt && (
                    <div className="md:col-span-2">
                      <span className="font-medium">Claimed:</span> {formatTime(listing.claimedAt)}
                    </div>
                  )}
                </div>

                {listing.status === "claimed" && (
                  <div className="text-sm text-blue-600">
                    ✓ Pickup request sent - waiting for donor response
                  </div>
                )}
                
                {listing.status === "completed" && (
                  <div className="text-sm text-green-600">
                    ✓ Pickup completed successfully
                  </div>
                )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedClaim && (
        <ChatModal
          claim={selectedClaim}
          onClose={() => setSelectedClaim(null)}
        />
      )}
    </div>
  );
}
