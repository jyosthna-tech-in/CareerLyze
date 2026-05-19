"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sun, Moon, Bell, Zap, Shield } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { settingsSchema } from "@/app/lib/schema";
import { updateSettings } from "@/actions/user";

const SettingsForm = ({ user }) => {
  const {
    loading: updateLoading,
    fn: updateSettingsFn,
    data: updateResult,
  } = useFetch(updateSettings);

  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(settingsSchema),
    mode: "onChange",
    defaultValues: {
      themePreference: user?.themePreference || "system",
      emailNotifications: user?.emailNotifications ?? true,
      pushNotifications: user?.pushNotifications ?? true,
      aiGenerationEnabled: user?.aiGenerationEnabled ?? true,
    },
  });

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Settings updated successfully!");
    }
  }, [updateResult, updateLoading]);

  const onSubmit = async (values) => {
    try {
      await updateSettingsFn(values);
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error(error.message || "Failed to update settings");
    }
  };

  const themePreference = watch("themePreference");
  const emailNotifications = watch("emailNotifications");
  const pushNotifications = watch("pushNotifications");
  const aiGenerationEnabled = watch("aiGenerationEnabled");

  const settingsSections = [
    {
      title: "Theme Preference",
      description: "Choose how you want CareerLyze to look",
      icon: Sun,
      field: "themePreference",
      type: "select",
      options: [
        { value: "light", label: "Light", icon: Sun },
        { value: "dark", label: "Dark", icon: Moon },
        { value: "system", label: "System", icon: "System" },
      ],
    },
    {
      title: "Email Notifications",
      description: "Receive important updates via email",
      icon: Bell,
      field: "emailNotifications",
      type: "toggle",
    },
    {
      title: "Push Notifications",
      description: "Get real-time notifications in browser",
      icon: Bell,
      field: "pushNotifications",
      type: "toggle",
    },
    {
      title: "AI Generation",
      description: "Enable AI-powered features and suggestions",
      icon: Zap,
      field: "aiGenerationEnabled",
      type: "toggle",
    },
  ];

  const handleResetSettings=()=>{
    reset({
      themePreference:"system",
      emailNotifications:true,
      pushNotifications:true,
      aiGenerationEnabled:true,
    });
    toast.success("settings reset successfull!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how CareerLyze looks for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme Preference</Label>
            <Select
              value={themePreference}
              onValueChange={(value) => setValue("themePreference", value)}
              disabled={updateLoading}
            >
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose between light, dark, or follow your system preference
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors">
            <div className="flex-1">
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive important updates and insights via email
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setValue("emailNotifications", !emailNotifications)
              }
              disabled={updateLoading}
              className={`ml-4 relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
                emailNotifications ? "bg-primary" : "bg-secondary"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-foreground transition-transform ${
                  emailNotifications ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Push Notifications Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors">
            <div className="flex-1">
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                Get real-time notifications in your browser
              </p>
            </div>
            <button
              type="button"
              onClick={() => setValue("pushNotifications", !pushNotifications)}
              disabled={updateLoading}
              className={`ml-4 relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
                pushNotifications ? "bg-primary" : "bg-secondary"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-foreground transition-transform ${
                  pushNotifications ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* AI Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Generation
          </CardTitle>
          <CardDescription>
            Control AI-powered features and suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors">
            <div className="flex-1">
              <p className="font-medium">Enable AI Features</p>
              <p className="text-sm text-muted-foreground">
                Allow AI to generate insights, suggestions, and recommendations
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setValue("aiGenerationEnabled", !aiGenerationEnabled)
              }
              disabled={updateLoading}
              className={`ml-4 relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
                aiGenerationEnabled ? "bg-primary" : "bg-secondary"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-foreground transition-transform ${
                  aiGenerationEnabled ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account
          </CardTitle>
          <CardDescription>
            Manage your account and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg border border-border/50 bg-secondary/20">
            <p className="text-sm font-medium mb-2">Email Address</p>
            <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
            <Button variant="outline" size="sm" disabled>
              Change Email (Coming Soon)
            </Button>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-secondary/20">
            <p className="text-sm font-medium mb-2">Password</p>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your password and security settings
            </p>
            <Button variant="outline" size="sm" disabled>
              Change Password (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-3 pt-6 border-t border-border/50">
        <Button
          type="submit"
          disabled={updateLoading || !isValid}
          className="flex items-center gap-2"
        >
          {updateLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {updateLoading ? "Saving..." : "Save Settings"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={updateLoading}
        >
          Cancel
        </Button>

        <Button
        type="button"
        variant="destructive"
        onClick={handleResetSettings}
        disabled={updateLoading}
        >
          Reset Settings
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;
