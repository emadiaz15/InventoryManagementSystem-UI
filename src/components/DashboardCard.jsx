import React from "react";

const DashboardCard = ({ icon, title }) => {
  return (
    <div className="flex items-center justify-center h-24 w-full rounded-2xl bg-background-100 shadow-md hover:shadow-lg transition-all">
      <p className="text-3xl text-primary-500">{icon}</p>
      <span className="ms-3 text-primary-500 text-lg font-medium">{title}</span>
    </div>
  );
};

export default DashboardCard;
