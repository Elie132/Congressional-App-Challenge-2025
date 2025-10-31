import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { StoredImage } from "./StoredImage";

interface MapViewProps {
  setCurrentPage: (page: string) => void;
}

interface Listing {
  _id: string;
  title: string;
  description: string;
  address?: string;
  zipCode: string;
  category: string;
  quantity?: string;
  quantityNumber?: number;
  quantityUnit?: string;
  totalQuantity?: number;
  availableQuantity?: number;
  pickupTimeStart: number;
  pickupTimeEnd: number;
  photoUrl?: string;
  source?: string;
  donor: { name?: string; organization?: string } | null;
}

export function MapView({ setCurrentPage }: MapViewProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const listings = useQuery(api.listings.getListings, {});

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const openInAppleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const appleMapsUrl = `http://maps.apple.com/?q=${encodedAddress}`;
    window.open(appleMapsUrl, '_blank');
  };

  const getDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const appleMapsUrl = `http://maps.apple.com/?daddr=${encodedAddress}`;
    window.open(appleMapsUrl, '_blank');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'prepared_food': return '🍽️';
      case 'produce': return '🥬';
      case 'packaged_goods': return '📦';
      case 'baked_goods': return '🥖';
      default: return '🍎';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Map</h1>
        <p className="text-gray-600">Find food donations near you</p>
      </div>

      {/* Location Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            📍
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800">
              {userLocation 
                ? `Location detected: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                : "Getting your location to show nearby food..."
              }
            </p>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings?.map((listing) => (
          <div key={listing._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
            {/* Food Image */}
            <div className="w-full h-48 bg-gray-50 flex items-center justify-center p-2">
              <StoredImage 
                imageId={listing.photoUrl}
                alt={listing.title}
                className="max-w-full max-h-full object-contain rounded"
                fallback={
                  <span className="text-4xl">{getCategoryIcon(listing.category)}</span>
                }
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{getCategoryIcon(listing.category)}</span>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {listing.title}
                  </h3>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {listing.description}
              </p>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <span className="font-medium">📍 Address:</span>
                  <span className="ml-1 line-clamp-1">{listing.address || `ZIP: ${listing.zipCode}`}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">📦 Available:</span>
                  <span className="ml-1">
                    {listing.availableQuantity || listing.quantityNumber || 1} {listing.quantityUnit || 'units'}
                    {listing.totalQuantity && listing.availableQuantity !== listing.totalQuantity && 
                      ` (${listing.totalQuantity} total)`
                    }
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">⏰ Pickup:</span>
                  <span className="ml-1">
                    {formatDate(listing.pickupTimeStart)} {formatTime(listing.pickupTimeStart)} - {formatTime(listing.pickupTimeEnd)}
                  </span>
                </div>
                {listing.source && (
                  <div className="flex items-center">
                    <span className="font-medium">🏪 Source:</span>
                    <span className="ml-1">{listing.source}</span>
                  </div>
                )}
                {listing.donor && (
                  <div className="flex items-center">
                    <span className="font-medium">👤 Donor:</span>
                    <span className="ml-1">
                      {listing.donor.organization || listing.donor.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openInAppleMaps(listing.address || listing.zipCode)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  disabled={!listing.address && !listing.zipCode}
                >
                  View on Map
                </button>
                <button
                  onClick={() => getDirections(listing.address || listing.zipCode)}
                  className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                  disabled={!listing.address && !listing.zipCode}
                >
                  Get Directions
                </button>
              </div>
              
              <button
                onClick={() => setSelectedListing(listing)}
                className="w-full mt-2 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {listings?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No food listings available</h3>
          <p className="text-gray-600 mb-4">Be the first to share food in your area!</p>
          <button
            onClick={() => setCurrentPage("create-listing")}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Create Listing
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedListing.title}</h2>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Description</h3>
                  <p className="text-gray-600">{selectedListing.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-600">{selectedListing.address || `ZIP Code: ${selectedListing.zipCode}`}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Available Quantity</h3>
                  <p className="text-gray-600">
                    {selectedListing.availableQuantity || selectedListing.quantityNumber || 1} {selectedListing.quantityUnit || 'units'}
                    {selectedListing.totalQuantity && selectedListing.availableQuantity !== selectedListing.totalQuantity && 
                      ` (${selectedListing.totalQuantity} total)`
                    }
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Pickup Time</h3>
                  <p className="text-gray-600">
                    {formatDate(selectedListing.pickupTimeStart)} from {formatTime(selectedListing.pickupTimeStart)} to {formatTime(selectedListing.pickupTimeEnd)}
                  </p>
                </div>
                
                {selectedListing.donor && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Donor</h3>
                    <p className="text-gray-600">
                      {selectedListing.donor.organization || selectedListing.donor.name}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => getDirections(selectedListing.address || selectedListing.zipCode)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  disabled={!selectedListing.address && !selectedListing.zipCode}
                >
                  Get Directions
                </button>
                <button
                  onClick={() => {
                    setSelectedListing(null);
                    setCurrentPage("feed");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Claim Food
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}