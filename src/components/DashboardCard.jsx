import React from "react";

const DashboardCard = ({ icon, title }) => {
  return (
    <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
      <p className="text-2xl text-gray-400 dark:text-gray-500">
        {icon}
      </p>
      <span className="ms-3 text-gray-500">{title}</span>
    </div>
  );
};

export default DashboardCard;
