import React from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const TopBar = () => {
  return (
    <div className="bg-gray-900 text-white text-xs py-2">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-orange-400" />
            <span className="text-orange-400">Juma Market, Mizan Road, Feni</span>
          </div>
          <div className="flex items-center gap-2">
            <FiPhone className="text-orange-400" />
            <span className="text-orange-400">01834258375</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMail className="text-orange-400" />
            <span className="text-orange-400">Chitrojaal@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
