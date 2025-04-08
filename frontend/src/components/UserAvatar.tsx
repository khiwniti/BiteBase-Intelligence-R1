import React, { useState, useEffect } from "react";
import { useCurrentUser } from "app";
import { useUser } from "utils/user-store";

export interface Props {
  /** User's display name */
  name?: string | null;
  /** User's profile image URL */
  imgUrl?: string | null;
  /** Avatar size (small, medium, large) */
  size?: "sm" | "md" | "lg";
  /** Optional className for additional styling */
  className?: string;
}

/**
 * User avatar component that shows image or initials
 */
export const UserAvatar = ({ name: providedName, imgUrl: providedImgUrl, size = "md", className = "" }: Props) => {
  const { user } = useCurrentUser();
  const { profile } = useUser();
  const [name, setName] = useState<string | null | undefined>(providedName);
  const [imgUrl, setImgUrl] = useState<string | null | undefined>(providedImgUrl);
  
  // If no name/image is provided, use profile or current user's info
  useEffect(() => {
    if (!providedName) {
      // First try to use profile data, then fall back to auth user data
      if (profile?.displayName) {
        setName(profile.displayName);
      } else if (user?.displayName) {
        setName(user.displayName);
      } else if (profile?.email) {
        setName(profile.email.split('@')[0]); // Use username part of email
      } else if (user?.email) {
        setName(user.email.split('@')[0]);
      }
    }
    
    if (!providedImgUrl) {
      // First try to use profile photo, then fall back to auth user photo
      if (profile?.photoURL) {
        setImgUrl(profile.photoURL);
      } else if (user?.photoURL) {
        setImgUrl(user.photoURL);
      }
    }
  }, [user, profile, providedName, providedImgUrl]);
  // Determine size in pixels
  const sizeClass = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
  }[size];
  
  // Get initials from name
  const getInitials = (): string => {
    if (!name && user?.email) {
      // Use first letter of email if no name
      return user.email.charAt(0).toUpperCase();
    }
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={`relative rounded-full overflow-hidden ${sizeClass} ${className}`}>
      {imgUrl ? (
        <img src={imgUrl} alt={name || "User"} className="w-full h-full object-cover" />
      ) : (
        <div className="bg-primary/10 text-primary flex items-center justify-center w-full h-full font-medium">
          {getInitials()}
        </div>
      )}
    </div>
  );
};
