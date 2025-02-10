import React from 'react';
import { FaHeart, FaRobot, FaSync } from 'react-icons/fa';

interface CardProps {
  title: string;
  lendingValue: number;
  borrowValue: number;
  lendingAPY: number;
  borrowAPY: number;
  healthRatio: number;
  strategies: string[];
  color?: 'red' | 'blue' | 'green' | 'purple' | 'yellow';
}

const Card: React.FC<CardProps> = ({ 
  title,
  lendingValue,
  borrowValue,
  lendingAPY,
  borrowAPY,
  healthRatio,
  strategies,
  color = 'blue'
}) => {
  const colorClasses = {
    red: 'bg-red-100 text-red-800 border-red-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    green: 'bg-green-100 text-green-800 border-green-300',
    purple: 'bg-purple-100 text-purple-800 border-purple-300',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  };

  const shadowIntensity = healthRatio < 1.5 ? 'shadow-red-500' : 'shadow-green-500';
  const heartColor = healthRatio < 1.5 ? 'text-red-500' : 'text-green-500';

  return (
    <div className={`relative w-full max-w-sm p-6 rounded-xl border-2 ${colorClasses[color]} 
      transition-all hover:shadow-lg text-center shadow-md ${shadowIntensity}`}>
      
      <h3 className="text-xl font-semibold uppercase tracking-wide mb-3">
        {title}
      </h3>
      
      <div className="flex justify-between items-center w-full mb-3">
        <div className="text-green-500">
          <p className="text-lg font-semibold">${lendingValue.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Lending</p>
        </div>
        <div className="text-red-500">
          <p className="text-lg font-semibold">${borrowValue.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Borrow</p>
        </div>
      </div>

      <div className="flex justify-between items-center w-full mb-4">
        <span className="text-lg font-semibold">{lendingAPY}%</span>
        <div className="flex items-center">
          <FaHeart className={`${heartColor} mr-2`} />
          <span className="text-lg font-semibold">{healthRatio.toFixed(2)}</span>
        </div>
        <span className="text-lg font-semibold text-red-500">{borrowAPY}%</span>
      </div>
      
      <div className="flex justify-center space-x-4">
        {strategies.map((strategy, index) => (
          <div key={index} className="text-gray-600 text-xl">
            {strategy === 'automation' && <FaRobot />}
            {strategy === 'reinvest' && <FaSync />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
