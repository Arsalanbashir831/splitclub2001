import React, { useState, useRef } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "../store/authStore";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Camera, Trash2, Key, Loader2 } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export const Settings = () => {
	const { user, isAuthenticated, refreshUserProfile } = useAuthStore();
	const navigate = useNavigate();
	const { toast } = useToast();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [profileData, setProfileData] = useState({
		displayName: user?.name || "",
		phone: user?.phone || "",
		location: user?.location || "",
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	if (!isAuthenticated || !user) {
		navigate("/login");
		return null;
	}

	const handleProfileUpdate = async () => {
		if (!user || !profileData.displayName.trim()) {
			toast({
				title: "Error",
				description: "Display name is required.",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);
		try {
			const { error } = await supabase
				.from("profiles")
				.update({
					display_name: profileData.displayName.trim(),
					phone: profileData.phone,
					location: profileData.location,
				})
				.eq("user_id", user.id);

			if (error) throw error;

			// Refresh the user profile in the auth store
			await refreshUserProfile();

			toast({
				title: "Profile updated",
				description: "Your profile has been successfully updated.",
			});
		} catch (error) {
			console.error("Error updating profile:", error);
			toast({
				title: "Error",
				description: "Failed to update profile. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handlePasswordUpdate = async () => {
		if (
			!profileData.currentPassword ||
			!profileData.newPassword ||
			!profileData.confirmPassword
		) {
			toast({
				title: "Error",
				description: "Please fill in all password fields.",
				variant: "destructive",
			});
			return;
		}

		if (profileData.newPassword !== profileData.confirmPassword) {
			toast({
				title: "Error",
				description: "New passwords do not match.",
				variant: "destructive",
			});
			return;
		}

		if (profileData.newPassword.length < 6) {
			toast({
				title: "Error",
				description: "New password must be at least 6 characters long.",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);
		try {
			// First verify current password by attempting to sign in
			const { error: signInError } = await supabase.auth.signInWithPassword({
				email: user.email,
				password: profileData.currentPassword,
			});

			if (signInError) {
				toast({
					title: "Error",
					description: "Current password is incorrect.",
					variant: "destructive",
				});
				return;
			}

			// If verification passes, update password
			const { error: updateError } = await supabase.auth.updateUser({
				password: profileData.newPassword,
			});

			if (updateError) throw updateError;

			toast({
				title: "Password updated",
				description: "Your password has been successfully updated.",
			});

			setProfileData((prev) => ({
				...prev,
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			}));
		} catch (error: any) {
			console.error("Error updating password:", error);
			toast({
				title: "Error",
				description:
					error.message || "Failed to update password. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleAvatarUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file || !user) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			toast({
				title: "Error",
				description: "Please select an image file.",
				variant: "destructive",
			});
			return;
		}

		// Validate file size (max 2MB)
		if (file.size > 2 * 1024 * 1024) {
			toast({
				title: "Error",
				description: "Image must be less than 2MB.",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);
		try {
			const fileExt = file.name.split(".").pop();
			const fileName = `${user.id}/${Date.now()}.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from("avatars")
				.upload(fileName, file);

			if (uploadError) throw uploadError;

			const {
				data: { publicUrl },
			} = supabase.storage.from("avatars").getPublicUrl(fileName);

			const { error: updateError } = await supabase
				.from("profiles")
				.update({ avatar_url: publicUrl })
				.eq("user_id", user.id);

			if (updateError) throw updateError;

			toast({
				title: "Avatar updated",
				description: "Your profile picture has been updated successfully.",
			});

			// Refresh the page to show the new avatar
			window.location.reload();
		} catch (error: any) {
			console.error("Error uploading avatar:", error);
			toast({
				title: "Error",
				description:
					error.message || "Failed to upload avatar. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteAvatar = async () => {
		if (!user) return;

		setIsLoading(true);
		try {
			const { error } = await supabase
				.from("profiles")
				.update({ avatar_url: null })
				.eq("user_id", user.id);

			if (error) throw error;

			toast({
				title: "Avatar removed",
				description: "Your profile picture has been removed.",
			});

			// Refresh the page to show the change
			window.location.reload();
		} catch (error: any) {
			console.error("Error deleting avatar:", error);
			toast({
				title: "Error",
				description:
					error.message || "Failed to remove avatar. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
					<p className="text-muted-foreground">
						Manage your account settings and preferences
					</p>
				</div>

				<div className="space-y-6">
					{/* Profile Settings */}
					<Card className="mb-6">
						<CardHeader>
							<CardTitle>Profile Information</CardTitle>
							<CardDescription>Update your profile details below.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="displayName">Display Name</Label>
								<Input
									id="displayName"
									value={profileData.displayName}
									onChange={(e) => setProfileData((prev) => ({ ...prev, displayName: e.target.value }))}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone">Phone Number</Label>
								<PhoneInput
									id="phone"
									placeholder="Enter phone number"
									value={profileData.phone}
									onChange={(value) => setProfileData((prev) => ({ ...prev, phone: value || "" }))}
									defaultCountry="GB"
									required
									className="shadcn-phone-input"
									inputComponent={Input}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="location">Location</Label>
								<Input
									id="location"
									value={profileData.location}
									onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
									required
								/>
							</div>
							<Button onClick={handleProfileUpdate} disabled={isLoading}>
								{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
								Save Changes
							</Button>
						</CardContent>
					</Card>

					{/* Password Settings */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Key className="h-5 w-5" />
								<span>Password Settings</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="currentPassword">Current Password</Label>
								<Input
									id="currentPassword"
									type="password"
									value={profileData.currentPassword}
									onChange={(e) =>
										setProfileData((prev) => ({
											...prev,
											currentPassword: e.target.value,
										}))
									}
									placeholder="Enter your current password"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="newPassword">New Password</Label>
									<Input
										id="newPassword"
										type="password"
										value={profileData.newPassword}
										onChange={(e) =>
											setProfileData((prev) => ({
												...prev,
												newPassword: e.target.value,
											}))
										}
										placeholder="Enter new password"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="confirmPassword">Confirm New Password</Label>
									<Input
										id="confirmPassword"
										type="password"
										value={profileData.confirmPassword}
										onChange={(e) =>
											setProfileData((prev) => ({
												...prev,
												confirmPassword: e.target.value,
											}))
										}
										placeholder="Confirm new password"
									/>
								</div>
							</div>

							<div className="text-sm text-muted-foreground">
								Password must be at least 6 characters long.
							</div>

							<Button onClick={handlePasswordUpdate} disabled={isLoading}>
								{isLoading ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Updating...
									</>
								) : (
									"Update Password"
								)}
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Settings;
