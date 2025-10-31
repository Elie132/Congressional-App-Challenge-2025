import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { storeImage, getImageUrl } from "../utils/imageStorage";

interface EditListingModalProps {
    listing: any;
    onClose: () => void;
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

export function EditListingModal({ listing, onClose }: EditListingModalProps) {
    const [formData, setFormData] = useState({
        title: listing.title || "",
        description: listing.description || "",
        category: listing.category || "prepared_food",
        quantityNumber: listing.quantityNumber || listing.totalQuantity || 1,
        quantityUnit: listing.quantityUnit || "serving",
        pickupDate: "",
        pickupTimeStart: "",
        pickupTimeEnd: "",
        address: listing.address || "",
        zipCode: listing.zipCode || "",
        source: listing.source || "",
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [storedImageId, setStoredImageId] = useState<string | null>(listing.photoUrl);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateListing = useMutation(api.listings.updateListing);

    useEffect(() => {
        // Set initial date/time values
        const startDate = new Date(listing.pickupTimeStart);
        const endDate = new Date(listing.pickupTimeEnd);

        setFormData(prev => ({
            ...prev,
            pickupDate: startDate.toISOString().split('T')[0],
            pickupTimeStart: startDate.toTimeString().slice(0, 5),
            pickupTimeEnd: endDate.toTimeString().slice(0, 5),
        }));

        // Set existing image preview
        if (listing.photoUrl) {
            const existingImageUrl = getImageUrl(listing.photoUrl);
            if (existingImageUrl) {
                setImagePreview(existingImageUrl);
            }
        }
    }, [listing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.title || !formData.description || formData.quantityNumber < 1 || !formData.quantityUnit ||
            !formData.pickupDate || !formData.pickupTimeStart || !formData.pickupTimeEnd ||
            !formData.address) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Create timestamps
        const pickupTimeStart = new Date(`${formData.pickupDate}T${formData.pickupTimeStart}`).getTime();
        const pickupTimeEnd = new Date(`${formData.pickupDate}T${formData.pickupTimeEnd}`).getTime();

        if (pickupTimeStart >= pickupTimeEnd) {
            toast.error("End time must be after start time");
            return;
        }

        // Extract ZIP code from address if not provided
        let zipCode = formData.zipCode;
        if (!zipCode) {
            const zipMatch = formData.address.match(/\b\d{5}\b/);
            zipCode = zipMatch ? zipMatch[0] : "00000";
        }

        setIsSubmitting(true);
        try {
            await updateListing({
                listingId: listing._id,
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

            toast.success("Listing updated successfully!");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to update listing");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Edit Food Listing</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Food Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
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
                                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${formData.category === category.value
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
                                required
                            />
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
                                    id="edit-food-photo"
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
                                                toast.success(`Photo updated: ${file.name}`);
                                            } catch (error) {
                                                toast.error("Failed to upload photo");
                                            }
                                        }
                                    }}
                                />
                                <label htmlFor="edit-food-photo" className="cursor-pointer">
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
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Updating..." : "Update Listing"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}