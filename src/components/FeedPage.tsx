import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { ClaimModal } from "./ClaimModal";
import { StoredImage } from "./StoredImage";

interface FeedPageProps {
  setCurrentPage: (page: "home" | "feed" | "dashboard" | "create-listing" | "profile-setup") => void;
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "prepared_food", label: "Prepared Food" },
  { value: "produce", label: "Fresh Produce" },
  { value: "packaged_goods", label: "Packaged Goods" },
  { value: "baked_goods", label: "Baked Goods" },
  { value: "other", label: "Other" },
];

export function FeedPage({ setCurrentPage }: FeedPageProps) {
  const [zipCode, setZipCode] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedListing, setSelectedListing] = useState<any>(null);

  const listings = useQuery(api.listings.getListings, {
    zipCode: zipCode || undefined,
    category: category !== "all" ? category : undefined,
  });

  const user = useQuery(api.users.getCurrentUser);
  const reportListing = useMutation(api.reports.reportListing);

  const handleReport = async (listingId: string, reason: string) => {
    try {
      await reportListing({
        listingId: listingId as any,
        reason: reason as any,
      });
      toast.success("Report submitted successfully");
    } catch (error) {
      toast.error("Failed to submit report");
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getCategoryEmoji = (cat: string) => {
    switch (cat) {
      case "prepared_food": return "🍽️";
      case "produce": return "🥬";
      case "packaged_goods": return "📦";
      case "baked_goods": return "🥖";
      default: return "🍴";
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Please complete your profile to browse food listings.</p>
        </div>
      </div>
    );
  }



  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Food Near You</h1>
        <p className="text-gray-600">Discover available food donations in your area</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
              placeholder="Enter ZIP code to filter"
              maxLength={5}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="space-y-6">
        {listings === undefined ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">No food listings found. Try adjusting your filters.</p>
          </div>
        ) : (
          listings.map((listing) => (
            <div key={listing._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Food Image */}
              <div className="w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                <StoredImage 
                  imageId={listing.photoUrl}
                  alt={listing.title}
                  className="w-full h-full object-contain"
                  fallback={
                    <span className="text-6xl">{getCategoryEmoji(listing.category)}</span>
                  }
                />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getCategoryEmoji(listing.category)}</span>
                    <h3 className="text-xl font-semibold text-gray-900">{listing.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-3">{listing.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Quantity:</span> {listing.quantity}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {listing.zipCode}
                    </div>
                    <div>
                      <span className="font-medium">Pickup Window:</span>
                      <br />
                      {formatTime(listing.pickupTimeStart)} - {formatTime(listing.pickupTimeEnd)}
                    </div>
                    {listing.source && (
                      <div>
                        <span className="font-medium">Source:</span> {listing.source}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Donor:</span> {listing.donor?.organization || listing.donor?.name}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => setSelectedListing(listing)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Request Pickup
                  </button>
                  
                  <div className="relative group">
                    <button className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm">
                      Report
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[150px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      <button
                        onClick={() => handleReport(listing._id, "expired")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Food Expired
                      </button>
                      <button
                        onClick={() => handleReport(listing._id, "inappropriate")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Inappropriate
                      </button>
                      <button
                        onClick={() => handleReport(listing._id, "spam")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Spam
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Posted {new Date(listing._creationTime).toLocaleDateString()}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Available
                </span>
              </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedListing && (
        <ClaimModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
}
