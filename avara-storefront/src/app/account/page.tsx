"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    HiOutlineUser,
    HiOutlineEnvelope,
    HiOutlineArrowLeft,
    HiOutlineCog,
    HiOutlineDocumentText,
    HiOutlineHeart
} from 'react-icons/hi2';
import { useAuth } from '../../lib/context/AuthContext';
import { getCurrentUser, updateUserProfile, type UserProfile } from '../../lib/api/user';

const AccountPage = () => {
    const router = useRouter();
    const { state: authState, logout } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        first_name: '',
        last_name: '',
        email: ''
    });
    const [updateMessage, setUpdateMessage] = useState('');

    useEffect(() => {
        // Redirect if not authenticated
        if (!authState.isAuthenticated && !authState.isLoading) {
            router.push('/login');
            return;
        }

        // Load user profile if authenticated
        if (authState.isAuthenticated && authState.user) {
            loadUserProfile();
        }
    }, [authState.isAuthenticated, authState.isLoading, router]);

    const loadUserProfile = async () => {
        try {
            const result = await getCurrentUser();
            if (result.success && result.data) {
                setUserProfile(result.data);
                setEditForm({
                    first_name: result.data.first_name,
                    last_name: result.data.last_name,
                    email: result.data.email
                });
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setUpdateMessage('');

        try {
            const result = await updateUserProfile(editForm);
            if (result.success && result.data) {
                setUserProfile(result.data);
                setIsEditing(false);
                setUpdateMessage('Profile updated successfully!');
                setTimeout(() => setUpdateMessage(''), 3000);
            } else {
                setUpdateMessage(result.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setUpdateMessage('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (authState.isLoading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!authState.isAuthenticated) {
        return null; // Will redirect to login
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Back to Home Link */}
                <Link 
                    href="/" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors duration-200"
                >
                    <HiOutlineArrowLeft className="w-5 h-5 mr-2" />
                    Back to Store
                </Link>

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
                            <p className="text-gray-600">Manage your profile and preferences</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Success Message */}
                {updateMessage && (
                    <div className={`mb-6 p-4 rounded-lg ${
                        updateMessage.includes('successfully') 
                            ? 'bg-green-50 border border-green-200 text-green-700' 
                            : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                        {updateMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                >
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </button>
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleEditSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.first_name}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.last_name}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center">
                                            <HiOutlineUser className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">First Name</p>
                                                <p className="font-medium text-gray-900">{userProfile?.first_name || authState.user?.first_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <HiOutlineUser className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Last Name</p>
                                                <p className="font-medium text-gray-900">{userProfile?.last_name || authState.user?.last_name}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <HiOutlineEnvelope className="w-5 h-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email Address</p>
                                            <p className="font-medium text-gray-900">{userProfile?.email || authState.user?.email}</p>
                                        </div>
                                    </div>
                                    
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link 
                                    href="/orders" 
                                    className="flex items-center p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                >
                                    <HiOutlineDocumentText className="w-5 h-5 mr-3" />
                                    <span>My Orders</span>
                                </Link>
                                <Link 
                                    href="/wishlist" 
                                    className="flex items-center p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                >
                                    <HiOutlineHeart className="w-5 h-5 mr-3" />
                                    <span>Wishlist</span>
                                </Link>
                                <Link 
                                    href="/settings" 
                                    className="flex items-center p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                >
                                    <HiOutlineCog className="w-5 h-5 mr-3" />
                                    <span>Settings</span>
                                </Link>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage; 