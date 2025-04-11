import React, { useState } from 'react';
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";

const Layout = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

    const handleSidebarToggle = (isCollapsed) => {
        setSidebarCollapsed(isCollapsed);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-100 text-text-primary">
            {/* Navbar */}
            <Navbar />

            <div className="flex flex-1 relative">
                {/* Sidebar con estado controlado */}
                <Sidebar onToggle={handleSidebarToggle} />

                {/* Contenido principal con margen dinámico */}
                <div className={`flex-1 p-4 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
                    {children}
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Layout;
