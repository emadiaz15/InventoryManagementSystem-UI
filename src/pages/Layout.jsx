import React, { useState } from 'react';
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../context/AuthProvider";

const Layout = ({ children, isLoading = false }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const { profileImage } = useAuth();

    const handleSidebarToggle = (isCollapsed) => {
        setSidebarCollapsed(isCollapsed);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-100 text-text-primary">
            <Navbar key={profileImage || 'default'} />

            <div className="flex flex-1 relative bg-background-100">
                <Sidebar onToggle={handleSidebarToggle} />

                <div
                    className={`flex-1 min-h-[calc(100vh-64px)] transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} bg-background-100 p-4`}
                >
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Spinner size="10" />
                        </div>
                    ) : (
                        children
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Layout;
