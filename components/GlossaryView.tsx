
import React from 'react';

interface GlossaryItem {
    term: string;
    definition: string;
}

interface GlossaryViewProps {
    glossary: GlossaryItem[];
}

const GlossaryView: React.FC<GlossaryViewProps> = ({ glossary }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-primary-700 dark:text-primary-400 mb-6">Glosario de Términos</h2>
            <div className="space-y-4">
                {glossary.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{item.term}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">{item.definition}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GlossaryView;
