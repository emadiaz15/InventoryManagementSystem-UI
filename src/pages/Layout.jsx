import React, { useState } from 'react';
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import Spinner from "../components/ui/Spinner"; // 🔁 Agregado
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

            <div className="flex flex-1 relative">
                <Sidebar onToggle={handleSidebarToggle} />

                <div className={`flex-1 p-4 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
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
