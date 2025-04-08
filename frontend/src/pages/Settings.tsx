import React, { useState, useEffect } from "react";
import { DashboardLayout } from "components/DashboardLayout";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserSettings } from "utils/firebase-store";
import { useCurrentUser } from "app";
import { useUser } from "utils/user-store";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user } = useCurrentUser();
  const { settings: userSettings, settingsLoading, updateSettings } = useUser();
  
  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    appNotifications: true,
    marketingEmails: false,
    dataSharing: true,
    language: "en",
    timezone: "UTC-7",
    dateFormat: "MM/DD/YYYY",
  });
  
  // Handle toggle change
  const handleToggleChange = (setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };
  
  // Handle select change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Update settings when user settings change
  useEffect(() => {
    if (userSettings) {
      setSettings({
        emailNotifications: userSettings.emailNotifications,
        appNotifications: userSettings.appNotifications,
        marketingEmails: userSettings.marketingEmails,
        dataSharing: userSettings.dataSharing,
        language: userSettings.language || 'en',
        timezone: userSettings.timezone || 'UTC-7',
        dateFormat: userSettings.dateFormat || 'MM/DD/YYYY',
      });
      
      // Update theme from user settings
      if (userSettings.theme) {
        setTheme(userSettings.theme);
      }
    }
  }, [userSettings, setTheme]);
  
  // Handle save settings
  const saveSettings = async () => {
    if (!updateSettings) return;
    
    try {
      // Save settings to Firestore
      await updateSettings({
        theme,
        emailNotifications: settings.emailNotifications,
        appNotifications: settings.appNotifications,
        marketingEmails: settings.marketingEmails,
        dataSharing: settings.dataSharing,
        language: settings.language,
        timezone: settings.timezone,
        dateFormat: settings.dateFormat,
      });
      
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {settingsLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">Manage your app preferences and account settings</p>
            </div>
            
            <div className="space-y-6">
          {/* Appearance */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-6">Appearance</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center space-y-2 p-4 rounded-lg border ${theme === "light" ? "border-primary bg-primary/10" : "border-border"}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M4 12L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M22 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M19.7782 19.7782L17.5563 17.5563" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M6.44365 6.44365L4.22183 4.22183" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M19.7782 4.22183L17.5563 6.44365" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M6.44365 17.5563L4.22183 19.7782" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center space-y-2 p-4 rounded-lg border ${theme === "dark" ? "border-primary bg-primary/10" : "border-border"}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                  
                  <button
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center space-y-2 p-4 rounded-lg border ${theme === "system" ? "border-primary bg-primary/10" : "border-border"}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">System</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-6">Notifications</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive email updates about your account and analyses</p>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-muted">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggleChange("emailNotifications")}
                  />
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${settings.emailNotifications ? "translate-x-6 bg-primary" : "bg-border"}`}
                    onClick={() => handleToggleChange("emailNotifications")}
                  ></span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">App Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive in-app notifications about activity and updates</p>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-muted">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={settings.appNotifications}
                    onChange={() => handleToggleChange("appNotifications")}
                  />
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${settings.appNotifications ? "translate-x-6 bg-primary" : "bg-border"}`}
                    onClick={() => handleToggleChange("appNotifications")}
                  ></span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Marketing Emails</h3>
                  <p className="text-sm text-muted-foreground">Receive emails about new features and offerings</p>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-muted">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={settings.marketingEmails}
                    onChange={() => handleToggleChange("marketingEmails")}
                  />
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${settings.marketingEmails ? "translate-x-6 bg-primary" : "bg-border"}`}
                    onClick={() => handleToggleChange("marketingEmails")}
                  ></span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Regional Settings */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-6">Regional Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="language" className="text-sm font-medium block">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={settings.language}
                  onChange={handleSelectChange}
                  className="w-full p-2 border border-border bg-background rounded-md"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="timezone" className="text-sm font-medium block">
                  Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleSelectChange}
                  className="w-full p-2 border border-border bg-background rounded-md"
                >
                  <option value="UTC-12">UTC-12:00</option>
                  <option value="UTC-11">UTC-11:00</option>
                  <option value="UTC-10">UTC-10:00</option>
                  <option value="UTC-9">UTC-09:00</option>
                  <option value="UTC-8">UTC-08:00</option>
                  <option value="UTC-7">UTC-07:00</option>
                  <option value="UTC-6">UTC-06:00</option>
                  <option value="UTC-5">UTC-05:00</option>
                  <option value="UTC-4">UTC-04:00</option>
                  <option value="UTC-3">UTC-03:00</option>
                  <option value="UTC-2">UTC-02:00</option>
                  <option value="UTC-1">UTC-01:00</option>
                  <option value="UTC+0">UTC+00:00</option>
                  <option value="UTC+1">UTC+01:00</option>
                  <option value="UTC+2">UTC+02:00</option>
                  <option value="UTC+3">UTC+03:00</option>
                  <option value="UTC+4">UTC+04:00</option>
                  <option value="UTC+5">UTC+05:00</option>
                  <option value="UTC+6">UTC+06:00</option>
                  <option value="UTC+7">UTC+07:00</option>
                  <option value="UTC+8">UTC+08:00</option>
                  <option value="UTC+9">UTC+09:00</option>
                  <option value="UTC+10">UTC+10:00</option>
                  <option value="UTC+11">UTC+11:00</option>
                  <option value="UTC+12">UTC+12:00</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="dateFormat" className="text-sm font-medium block">
                  Date Format
                </label>
                <select
                  id="dateFormat"
                  name="dateFormat"
                  value={settings.dateFormat}
                  onChange={handleSelectChange}
                  className="w-full p-2 border border-border bg-background rounded-md"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Privacy Settings */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Data Sharing</h3>
                  <p className="text-sm text-muted-foreground">Allow anonymous usage data to be shared for product improvement</p>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-muted">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={settings.dataSharing}
                    onChange={() => handleToggleChange("dataSharing")}
                  />
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${settings.dataSharing ? "translate-x-6 bg-primary" : "bg-border"}`}
                    onClick={() => handleToggleChange("dataSharing")}
                  ></span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button">
              Reset to Defaults
            </Button>
            <Button type="button" onClick={saveSettings}>
              Save Changes
            </Button>
          </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
