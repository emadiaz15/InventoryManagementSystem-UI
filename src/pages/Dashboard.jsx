import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import DashboardCard from "../components/DashboardCard";
import Footer from "../components/common/Footer";
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-background-100 text-text-primary">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-background-200 shadow-md">
          <Sidebar />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 p-6">
          <div className="p-6 border border-background-200 rounded-lg mt-16 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Tarjetas del Dashboard */}
              <DashboardCard icon={<svg className="w-6 h-6 text-primary-500" aria-hidden="true"><path d="M9 1v16M1 9h16" /></svg>} title="Card 1" />
              <DashboardCard icon={<svg className="w-6 h-6 text-primary-500" aria-hidden="true"><path d="M9 1v16M1 9h16" /></svg>} title="Card 2" />
              <DashboardCard icon={<svg className="w-6 h-6 text-primary-500" aria-hidden="true"><path d="M9 1v16M1 9h16" /></svg>} title="Card 3" />
            </div>

            {/* Tarjeta grande */}
            <div className="flex items-center justify-center h-48 mb-6 rounded-lg bg-background-200 shadow-md">
              <p className="text-2xl text-primary-200">Big Card</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
