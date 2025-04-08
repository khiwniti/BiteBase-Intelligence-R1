import React, { useState, useEffect } from "react";
import { DashboardLayout } from "components/DashboardLayout";
import { useCurrentUser } from "app";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserProfile } from "utils/firebase-store";
import { UserAvatar } from "components/UserAvatar";
import { useUser } from "utils/user-store";

export default function Profile() {
  const { user } = useCurrentUser();
  const { profile, profileLoading, updateProfile } = useUser();
  
  // Profile form state
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    restaurantName: "",
    position: "",
    bio: "",
    photoURL: user?.photoURL || "",
  });
  
  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData(prevData => ({
        ...prevData,
        displayName: profile.displayName || user?.displayName || "",
        email: profile.email || user?.email || "",
        phoneNumber: profile.phoneNumber || user?.phoneNumber || "",
        restaurantName: profile.restaurantName || "",
        position: profile.position || "",
        bio: profile.bio || "",
        photoURL: profile.photoURL || user?.photoURL || "",
      }));
    }
  }, [profile, user]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateProfile) return;
    
    try {
      // Save profile data to Firestore
      await updateProfile({
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        restaurantName: formData.restaurantName,
        position: formData.position,
        bio: formData.bio,
      });
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {profileLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Your Profile</h1>
              <p className="text-muted-foreground">Manage your personal information and preferences</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="mb-4">
                  <UserAvatar 
                    name={formData.displayName} 
                    imgUrl={formData.photoURL} 
                    size="lg" 
                  />
                </div>
                <h3 className="font-semibold text-xl">{formData.displayName || user?.displayName || "User"}</h3>
                <p className="text-sm text-muted-foreground">{formData.email || user?.email}</p>
              </div>
              
              <div className="space-y-1">
                <button className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors text-primary font-medium">
                  Profile Information
                </button>
                <button className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                  Account Security
                </button>
                <button className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                  Notification Settings
                </button>
                <button className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                  Subscription & Billing
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="displayName" className="text-sm font-medium block">
                      Full Name
                    </label>
                    <input
                      id="displayName"
                      name="displayName"
                      type="text"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="w-full p-2 border border-border bg-background rounded-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium block">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full p-2 border border-border bg-muted text-muted-foreground rounded-md cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="text-sm font-medium block">
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full p-2 border border-border bg-background rounded-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="restaurantName" className="text-sm font-medium block">
                      Restaurant / Company
                    </label>
                    <input
                      id="restaurantName"
                      name="restaurantName"
                      type="text"
                      value={formData.restaurantName}
                      onChange={handleChange}
                      className="w-full p-2 border border-border bg-background rounded-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="position" className="text-sm font-medium block">
                      Position / Title
                    </label>
                    <input
                      id="position"
                      name="position"
                      type="text"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full p-2 border border-border bg-background rounded-md"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium block">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full p-2 border border-border bg-background rounded-md"
                    placeholder="Tell us about yourself or your business"
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
