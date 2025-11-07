import React from 'react';
import { System } from '../types';

interface InteractiveIndexProps {
  onSelectSystem: (system: System) => void;
}

const InteractiveIndex: React.FC<InteractiveIndexProps> = ({ onSelectSystem }) => {
  const systems = Object.values(System);

  return (
    <div className="mt-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-primary-700 dark:text-primary-400 mb-6 text-center">Índice Interactivo</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {systems.map((system) => {
          const [emoji, ...nameParts] = system.split(' ');
          const systemName = nameParts.join(' ');
          return (
            <button
              key={system}
              onClick={() => onSelectSystem(system)}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center aspect-square focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900 active:scale-95"
            >
              <span className="text-4xl mb-2">{emoji}</span>
              <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">{systemName}</span>
            </button>
          )
        })}
      </div>
    </div>
  );
};

export default InteractiveIndex;