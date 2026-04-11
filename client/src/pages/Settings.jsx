import { useState, useEffect, useRef } from 'react';
import { authService } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Camera, Upload } from 'lucide-react';

export default function Settings() {
    const { user, refetchUser } = useAuth();
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(user?.profileImage || '');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        company: user?.company || '',
        profileImage: user?.profileImage || '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                company: user.company || '',
                city: user.city || '',
                profileImage: user.profileImage || '',
            });
            setPreviewImage(user.profileImage || '');
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be smaller than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewImage(e.target?.result || '');
        };
        reader.readAsDataURL(file);

        uploadToCloudinary(file);
    };

    const uploadToCloudinary = async (file) => {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            toast.error('Cloudinary configuration missing');
            return;
        }

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('upload_preset', uploadPreset);

        try {
            const loadingToast = toast.loading('Uploading image...');
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formDataUpload,
                }
            );

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();
            setFormData({ ...formData, profileImage: data.secure_url });
            toast.dismiss(loadingToast);
            toast.success('Profile picture updated!');
        } catch (error) {
            toast.error('Failed to upload image');
            setPreviewImage(user?.profileImage || '');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authService.updateProfile(formData);
            toast.success('Profile updated successfully!');
            if (refetchUser) {
                refetchUser();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Settings</h1>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-bold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 dark:bg-neutral-900 bg-white p-2 rounded-full hover:opacity-90 transition"
                            >
                                <Upload size={16} />
                            </button>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Profile Picture</p>
                            <p className="text-xs mt-1">JPG, PNG or GIF (Max 5MB)</p>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    {/* Broker Fields */}
                    {user?.role === 'broker' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full cursor-pointer bg-primary hover:opacity-90 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}
