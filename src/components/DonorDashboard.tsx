import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useState } from "react";
import { ChatModal } from "./ChatModal";
import { StoredImage } from "./StoredImage";
import { EditListingModal } from "./EditListingModal";

interface DonorDashboardProps {
  setCurrentPage: (page: "home" | "feed" | "dashboard" | "create-listing" | "profile-setup") => void;
}

export function DonorDashboard({ setCurrentPage }: DonorDashboardProps) {
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [editingListing, setEditingListing] = useState<any>(null);
  
  const myListings = useQuery(api.listings.getMyListings);
  const claims = useQuery(api.claims.getClaimsForDonor);
  const deleteListing = useMutation(api.listings.deleteListing);
  const respondToClaim = useMutation(api.claims.respondToClaim);
  const completeClaim = useMutation(api.claims.completeClaim);

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    
    try {
      await deleteListing({ listingId: listingId as any });
      toast.success("Listing deleted successfully");
    } catch (error) {
      toast.error("Failed to delete listing");
    }
  };

  const handleRespondToClaim = async (claimId: string, response: "accepted" | "rejected") => {
    try {
      await respondToClaim({ claimId: claimId as any, response });
      toast.success(`Request ${response} successfully`);
    } catch (error) {
      toast.error(`Failed to ${response} request`);
    }
  };

  const handleCompleteClaim = async (claimId: string) => {
    try {
      await completeClaim({ claimId: claimId as any });
      toast.success("Pickup marked as completed!");
    } catch (error) {
      toast.error("Failed to complete pickup");
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "claimed": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-gray-100 text-gray-700";
      case "expired": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <button
          onClick={() => setCurrentPage("create-listing")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          + List New Food
        </button>
      </div>

      {/* My Listings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Food Listings</h2>
        
        {myListings === undefined ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : myListings.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No listings yet. Create your first listing to get started!
          </p>
        ) : (
          <div className="space-y-4">
            {myListings.map((listing) => (
              <div key={listing._id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Food Image */}
                <div className="w-full h-32 bg-gray-50 flex items-center justify-center overflow-hidden">
                  <StoredImage 
                    imageId={listing.photoUrl}
                    alt={listing.title}
                    className="w-full h-full object-contain"
                    fallback={
                      <span className="text-3xl">{getCategoryEmoji(listing.category)}</span>
                    }
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(listing.status)}`}>
                      {listing.status}
                    </span>
                  </div>
                
                <p className="text-gray-600 text-sm mb-3">{listing.description}</p>
                
                  <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                    <div><span className="font-medium">Available:</span> {listing.availableQuantity || listing.quantityNumber || 1} {listing.quantityUnit || 'units'}</div>
                    <div><span className="font-medium">ZIP:</span> {listing.zipCode}</div>
                    {listing.source && (
                      <div><span className="font-medium">Source:</span> {listing.source}</div>
                    )}
                    <div className="md:col-span-2">
                      <span className="font-medium">Pickup:</span> {formatTime(listing.pickupTimeStart)} - {formatTime(listing.pickupTimeEnd)}
                    </div>
                  </div>

                  {listing.status === "active" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingListing(listing)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteListing(listing._id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pickup Requests */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pickup Requests</h2>
        
        {claims === undefined ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : claims.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No pickup requests yet.
          </p>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <div key={claim._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{claim.listing?.title}</h3>
                    <p className="text-sm text-gray-600">
                      Requested by: {claim.receiver?.organization || claim.receiver?.name}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(claim.status)}`}>
                    {claim.status}
                  </span>
                </div>

                {claim.message && (
                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <p className="text-sm text-gray-700">"{claim.message}"</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {claim.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleRespondToClaim(claim._id, "accepted")}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespondToClaim(claim._id, "rejected")}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  
                  {claim.status === "accepted" && (
                    <>
                      <button
                        onClick={() => setSelectedClaim(claim)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Chat
                      </button>
                      <button
                        onClick={() => handleCompleteClaim(claim._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        Mark Complete
                      </button>
                    </>
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

      {editingListing && (
        <EditListingModal
          listing={editingListing}
          onClose={() => setEditingListing(null)}
        />
      )}
    </div>
  );
}
