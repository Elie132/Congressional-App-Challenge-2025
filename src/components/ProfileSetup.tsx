import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface ProfileSetupProps {
  onComplete: () => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "" as "donor" | "receiver" | "",
    address: "",
    zipCode: "",
    phone: "",
    organization: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProfile = useMutation(api.users.createUserProfile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!formData.name && !formData.organization) || !formData.role || !formData.zipCode) {
      toast.error("Please fill in name or organization, role, and ZIP code");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProfile({
        name: formData.name,
        role: formData.role,
        address: formData.address,
        zipCode: formData.zipCode,
        phone: formData.phone || undefined,
        organization: formData.organization || undefined,
      });
      toast.success("Profile created successfully!");
      onComplete();
    } catch (error) {
      toast.error("Failed to create profile. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
        <p className="text-gray-600">Tell us a bit about yourself to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
            placeholder="Enter your full name (or leave blank if using organization name)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            I want to *
          </label>
          <div className="space-y-3">
            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="role"
                value="donor"
                checked={formData.role === "donor"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as "donor" })}
                className="text-green-600 focus:ring-green-500"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-900">Donate surplus food</div>
                <div className="text-sm text-gray-600">I'm a restaurant, bakery, or individual with extra food</div>
              </div>
            </label>
            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="role"
                value="receiver"
                checked={formData.role === "receiver"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as "receiver" })}
                className="text-green-600 focus:ring-green-500"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-900">Receive food donations</div>
                <div className="text-sm text-gray-600">I'm with a shelter, food pantry, or family in need</div>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
            placeholder="123 Main St, City, State (Optional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Code *
          </label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
            placeholder="12345"
            pattern="[0-9]{5}"
            maxLength={5}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization
          </label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
            placeholder="Restaurant name, shelter, company, etc. (Required if no name provided)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Provide either your name or organization name (or both)
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating Profile..." : "Complete Setup"}
        </button>
      </form>
    </div>
  );
}
