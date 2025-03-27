import React from 'react';
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-background-100 text-text-primary">
            {/* Navbar */}
            <Navbar />

            <div className="flex flex-1">
                {/* Sidebar */}
                <div className="w-64 bg-background-200 shadow-md">
                    <Sidebar />
                </div>

                {/* Contenido principal, donde se inyecta el contenido de la página */}
                <div className="flex-1 p-6">
                    {children}
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Layout;
