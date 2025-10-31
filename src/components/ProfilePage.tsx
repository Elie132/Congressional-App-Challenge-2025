import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface ProfilePageProps {
  setCurrentPage: (page: string) => void;
}

export function ProfilePage({ setCurrentPage }: ProfilePageProps) {
  const user = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "" as "donor" | "receiver" | "",
    address: "",
    zipCode: "",
    phone: "",
    organization: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        role: user.role || "",
        address: user.address || "",
        zipCode: user.zipCode || "",
        phone: user.phone || "",
        organization: user.organization || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.zipCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        name: formData.name,
        address: formData.address,
        zipCode: formData.zipCode,
        phone: formData.phone || undefined,
        organization: formData.organization || undefined,
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (newRole: "donor" | "receiver") => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await updateProfile({
        name: user.name,
        address: user.address,
        zipCode: user.zipCode,
        phone: user.phone || undefined,
        organization: user.organization || undefined,
        role: newRole,
      });
      
      toast.success(`Switched to ${newRole} mode!`);
    } catch (error) {
      toast.error("Failed to switch role. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 border border-green-600 hover:border-green-700 rounded-md transition-colors"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {!isEditing ? (
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  {profileImagePreview ? (
                    <img 
                      src={profileImagePreview} 
                      alt="Profile Preview" 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : user.profilePictureUrl ? (
                    <img 
                      src={user.profilePictureUrl} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-gray-500">
                      {(user.name || user.organization || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profile-photo"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedProfileImage(file);
                      // Create preview URL
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setProfileImagePreview(e.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                      toast.success(`Profile photo selected: ${file.name}`);
                    }
                  }}
                />
                <label htmlFor="profile-photo" className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              </div>
              {selectedProfileImage && (
                <div className="mt-2 text-center">
                  <p className="text-xs text-green-600">📷 New photo selected: {selectedProfileImage.name}</p>
                  <button
                    onClick={() => {
                      setSelectedProfileImage(null);
                      setProfileImagePreview(null);
                      const input = document.getElementById('profile-photo') as HTMLInputElement;
                      if (input) input.value = '';
                    }}
                    className="text-xs text-red-600 hover:text-red-700 mt-1"
                  >
                    Remove new photo
                  </button>
                </div>
              )}
            </div>

            {/* Profile Info Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{user.name || "Not provided"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <p className="text-gray-900">{user.address || "Not provided"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <p className="text-gray-900">{user.zipCode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900">{user.phone || "Not provided"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                <p className="text-gray-900">{user.organization || "Not provided"}</p>
              </div>
            </div>

            {/* Role Switcher */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Current Mode</label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${user.role === "donor" ? "bg-green-500" : "bg-gray-300"}`}></div>
                    <div>
                      <div className="font-medium text-gray-900">Food Donor</div>
                      <div className="text-sm text-gray-600">Post surplus food for donation</div>
                    </div>
                  </div>
                  {user.role !== "donor" && (
                    <button
                      onClick={() => handleRoleChange("donor")}
                      disabled={isSubmitting}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      Switch to Donor
                    </button>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${user.role === "receiver" ? "bg-green-500" : "bg-gray-300"}`}></div>
                    <div>
                      <div className="font-medium text-gray-900">Food Receiver</div>
                      <div className="text-sm text-gray-600">Browse and claim food donations</div>
                    </div>
                  </div>
                  {user.role !== "receiver" && (
                    <button
                      onClick={() => handleRoleChange("receiver")}
                      disabled={isSubmitting}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      Switch to Receiver
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                  required
                />
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
                  placeholder="123 Main St, City, State"
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
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}