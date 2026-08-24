import React from 'react';

interface CardProps {
  title: string;
  num: number;
  percent: string;
  icon: React.ReactNode;
  forBG: string ;
}

function Card({ title, num, percent, icon , forBG}: CardProps) {
  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${forBG} `}>
          {icon}
        </div>
        <span className="inline-flex items-center justify-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
          {percent}
        </span>
      </div>

      {/* Content Section */}
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-gray-900">{num}</h3>
        <p className="mt-1 text-sm font-medium text-gray-500">{title}</p>
      </div>
    </div>
  );
}

export default Card;