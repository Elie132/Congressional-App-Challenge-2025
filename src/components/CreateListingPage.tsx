import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { storeImage, getImageUrl } from "../utils/imageStorage";

interface CreateListingPageProps {
  setCurrentPage: (page: "home" | "feed" | "dashboard" | "create-listing" | "profile-setup" | "safety") => void;
}

const categories = [
  { value: "prepared_food", label: "Prepared Food", emoji: "🍽️" },
  { value: "produce", label: "Fresh Produce", emoji: "🥬" },
  { value: "packaged_goods", label: "Packaged Goods", emoji: "📦" },
  { value: "baked_goods", label: "Baked Goods", emoji: "🥖" },
  { value: "other", label: "Other", emoji: "🍴" },
];

const quantityUnits = [
  "serving", "portion", "meal", "sandwich", "slice", "piece", 
  "package", "box", "bag", "container", "bottle", "can",
  "pound", "kilogram", "ounce", "gram", "cup", "liter",
  "loaf", "dozen", "item", "unit", "other"
];

export function CreateListingPage({ setCurrentPage }: CreateListingPageProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "prepared_food" as const,
    quantityNumber: 1,
    quantityUnit: "serving",
    pickupDate: "",
    pickupTimeStart: "",
    pickupTimeEnd: "",
    address: "",
    zipCode: "",
    source: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [storedImageId, setStoredImageId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useQuery(api.users.getCurrentUser);
  const createListing = useMutation(api.listings.createListing);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || user.role !== "donor") {
      toast.error("Only donors can create listings");
      return;
    }

    // Validate required fields
    if (!formData.title || !formData.description || formData.quantityNumber < 1 || !formData.quantityUnit ||
        !formData.pickupDate || !formData.pickupTimeStart || !formData.pickupTimeEnd || 
        !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Extract ZIP code from address if not provided
    let zipCode = formData.zipCode;
    if (!zipCode) {
      // Try to extract ZIP code from address (simple regex for 5-digit ZIP)
      const zipMatch = formData.address.match(/\b\d{5}\b/);
      zipCode = zipMatch ? zipMatch[0] : "00000";
    }

    // Create timestamps
    const pickupTimeStart = new Date(`${formData.pickupDate}T${formData.pickupTimeStart}`).getTime();
    const pickupTimeEnd = new Date(`${formData.pickupDate}T${formData.pickupTimeEnd}`).getTime();

    if (pickupTimeStart >= pickupTimeEnd) {
      toast.error("End time must be after start time");
      return;
    }

    if (pickupTimeStart <= Date.now()) {
      toast.error("Pickup time must be in the future");
      return;
    }

    setIsSubmitting(true);
    try {
      await createListing({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        quantityNumber: formData.quantityNumber,
        quantityUnit: formData.quantityUnit,
        pickupTimeStart,
        pickupTimeEnd,
        address: formData.address,
        zipCode: zipCode,
        source: formData.source,
        photoUrl: storedImageId || undefined,
      });
      
      toast.success("Food listing created successfully!");
      setCurrentPage("dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Please complete your profile to create listings.</p>
        </div>
      </div>
    );
  }

  if (user.role !== "donor") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Food Listing</h2>
          <p className="text-gray-600 mb-6">Only donors can create food listings. Switch to receiver mode to find food.</p>
          <button
            onClick={() => setCurrentPage("feed")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse Food Instead
          </button>
        </div>
      </div>
    );
  }

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">List Surplus Food</h1>
        <p className="text-gray-600">Help reduce food waste by sharing your surplus with those in need</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Food Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
            placeholder="e.g., Fresh sandwiches, Leftover pizza, Day-old bread"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <label
                key={category.value}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.category === category.value
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={category.value}
                  checked={formData.category === category.value}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="sr-only"
                />
                <span className="text-xl mr-2">{category.emoji}</span>
                <span className="text-sm font-medium">{category.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors resize-none"
            rows={3}
            placeholder="Describe the food, any special handling requirements, etc."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Food Photo (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="food-photo"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedImage(file);
                  // Create preview URL
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setImagePreview(e.target?.result as string);
                  };
                  reader.readAsDataURL(file);
                  
                  // Store image persistently
                  try {
                    const imageId = await storeImage(file);
                    setStoredImageId(imageId);
                    toast.success(`Photo uploaded: ${file.name}`);
                  } catch (error) {
                    toast.error("Failed to upload photo");
                  }
                }
              }}
            />
            <label htmlFor="food-photo" className="cursor-pointer">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Food preview" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm">Click to change photo</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-gray-400 mb-2">
                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-green-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </>
              )}
            </label>
            {selectedImage && (
              <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                <span>📷 {selectedImage.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                    setStoredImageId(null);
                    const input = document.getElementById('food-photo') as HTMLInputElement;
                    if (input) input.value = '';
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            📝 Note: Photo preview works locally. In production, images would be uploaded to a cloud service.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Food Source
          </label>
          <input
            type="text"
            value={formData.source || ""}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
            placeholder="e.g., Mario's Pizza Kitchen, Home Kitchen, Downtown Bakery"
          />
          <p className="text-xs text-gray-500 mt-1">
            Let people know where this food is coming from
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity Available *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Number of units</label>
              <input
                type="number"
                min="1"
                max="999"
                value={formData.quantityNumber}
                onChange={(e) => setFormData({ ...formData, quantityNumber: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Unit type</label>
              <select
                value={formData.quantityUnit}
                onChange={(e) => setFormData({ ...formData, quantityUnit: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                required
              >
                {quantityUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Example: 10 servings means 10 people can each claim 1 serving
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Date *
          </label>
          <input
            type="date"
            value={formData.pickupDate}
            onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
            min={today}
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Start Time *
            </label>
            <input
              type="time"
              value={formData.pickupTimeStart}
              onChange={(e) => setFormData({ ...formData, pickupTimeStart: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup End Time *
            </label>
            <input
              type="time"
              value={formData.pickupTimeEnd}
              onChange={(e) => setFormData({ ...formData, pickupTimeEnd: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Address *
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
            placeholder="123 Main St, City, State 12345"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Include full address with ZIP code for better navigation
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Code (Optional)
          </label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
            placeholder="12345"
            pattern="[0-9]{5}"
            maxLength={5}
          />
          <p className="text-xs text-gray-500 mt-1">
            Will be extracted from address if not provided
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">📋 How Multiple Claims Work</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Multiple people can claim portions until all units are taken</li>
            <li>• You approve each claim individually</li>
            <li>• Listings automatically expire after 48 hours</li>
            <li>• Use the built-in chat to coordinate pickup details</li>
            <li>• Ensure food safety and proper handling</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-green-800 mb-1">🛡️ Food Safety Reminder</h3>
              <p className="text-sm text-green-700">
                Only share food you'd eat yourself. Follow proper storage and handling guidelines.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage("safety")}
              className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              View Guidelines
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setCurrentPage("dashboard")}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
