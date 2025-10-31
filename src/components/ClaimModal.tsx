import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface ClaimModalProps {
  listing: any;
  onClose: () => void;
}

export function ClaimModal({ listing, onClose }: ClaimModalProps) {
  const [message, setMessage] = useState("");
  const [quantityRequested, setQuantityRequested] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createClaim = useMutation(api.claims.createClaim);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createClaim({
        listingId: listing._id,
        quantityClaimed: quantityRequested,
        message: message || undefined,
      });
      toast.success("Pickup request sent successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to send request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Request Pickup</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-2">{listing.title}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Available:</span> {listing.availableQuantity || listing.quantityNumber || 1} {listing.quantityUnit || 'units'}</p>
            <p><span className="font-medium">Pickup Window:</span></p>
            <p className="ml-2">{formatTime(listing.pickupTimeStart)} - {formatTime(listing.pickupTimeEnd)}</p>
            <p><span className="font-medium">Location:</span> {listing.address || listing.zipCode}</p>
            {listing.source && (
              <p><span className="font-medium">Source:</span> {listing.source}</p>
            )}
            <p><span className="font-medium">Donor:</span> {listing.donor?.organization || listing.donor?.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How many {listing.quantityUnit || 'units'} do you want? *
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max={listing.availableQuantity || listing.quantityNumber || 1}
                value={quantityRequested}
                onChange={(e) => setQuantityRequested(parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-center"
                required
              />
              <span className="text-sm text-gray-600">
                out of {listing.availableQuantity || listing.quantityNumber || 1} {listing.quantityUnit || 'units'} available
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              You can request 1 to {listing.availableQuantity || listing.quantityNumber || 1} {listing.quantityUnit || 'units'}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to Donor (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none resize-none"
              rows={3}
              placeholder="Let the donor know about your organization or any special requirements..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
