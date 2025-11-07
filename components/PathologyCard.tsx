import React, { useState } from 'react';
import { Pathology } from '../types';

interface PathologyCardProps {
  pathology: Pathology;
}

const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4 className="font-bold text-primary-600 dark:text-primary-400 mb-1">{title}</h4>
    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        {children}
    </div>
  </div>
);

const PathologyCard: React.FC<PathologyCardProps> = ({ pathology }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 flex justify-between items-center focus:outline-none transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{pathology.name}</h3>
        <ChevronDownIcon className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`transition-all duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2 space-y-4">
                  <DetailSection title="Definición Clínica">
                      <p>{pathology.definicionClinica}</p>
                      <p className="text-xs italic text-gray-500">{pathology.etimologia}</p>
                  </DetailSection>
                  <DetailSection title="Claves y Resumen de Estudio">
                      <p className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 rounded-r-md">{pathology.clavesResumen}</p>
                  </DetailSection>
              </div>

              <div className="space-y-4">
                <DetailSection title="Sintomatología">
                  <ul className="list-disc pl-5">
                    {pathology.sintomatologia.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </DetailSection>
                <DetailSection title="Diagnóstico NANDA">
                  <p>{pathology.diagnosticoNANDA}</p>
                </DetailSection>
                <DetailSection title="Fármacos Principales">
                   <div className="flex flex-wrap gap-2">
                      {pathology.farmacosPrincipales.map((drug, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full dark:bg-blue-900 dark:text-blue-200">
                          {drug}
                        </span>
                      ))}
                    </div>
                </DetailSection>
              </div>

              <div className="space-y-4">
                 <DetailSection title="Intervenciones NIC">
                  <ul className="list-disc pl-5">
                    {pathology.intervencionesNIC.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </DetailSection>
                <DetailSection title="Resultados NOC">
                  <ul className="list-disc pl-5">
                    {pathology.resultadosNOC.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </DetailSection>
              </div>

              <div className="md:col-span-2">
                 <DetailSection title="Plan de Cuidados">
                    <p>{pathology.planDeCuidados}</p>
                 </DetailSection>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PathologyCard;