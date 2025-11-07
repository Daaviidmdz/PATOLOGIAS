import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { catalogService } from './services/catalogService';
import { Pathology, ViewMode, System } from './types';
import { GLOSSARY, RED_FLAGS, URGENCY_30S } from './constants';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import InteractiveIndex from './components/InteractiveIndex';
import PathologyCard from './components/PathologyCard';
import GlossaryView from './components/GlossaryView';

const App: React.FC = () => {
    // State management
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.INDEX);
    const [currentSystem, setCurrentSystem] = useState<System | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Pathology[]>([]);
    const [latestItems, setLatestItems] = useState<Pathology[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inputMode, setInputMode] = useState<'search' | 'chat'>('search');

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Effects
    useEffect(() => {
        // Initialize catalog
        catalogService.initializeCatalog().then(() => {
            setIsInitialized(true);
        });

        // Dark mode preference
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDarkMode);
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Handlers
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const handleSelectSystem = (system: System) => {
        setCurrentSystem(system);
        setViewMode(ViewMode.CATALOG);
    };

    const handleBackToIndex = () => {
        setViewMode(ViewMode.INDEX);
        setCurrentSystem(null);
        setSearchResults([]);
        setSearchQuery('');
    };
    
    const handleSearchSubmit = async (query: string) => {
        setError(null);
        const lowerQuery = query.toLowerCase().trim();

        if (inputMode === 'chat') {
            await handleGeneratePathology(query);
            return;
        }

        if (lowerQuery.includes('glosario')) {
            setViewMode(ViewMode.GLOSSARY);
        } else if (lowerQuery.includes('últimas') || lowerQuery.includes('latest')) {
            setLatestItems(catalogService.getLatest());
            setViewMode(ViewMode.LATEST);
        } else if (lowerQuery === '') {
            handleBackToIndex();
        } else {
            const results = catalogService.searchPathologies(lowerQuery);
            setSearchResults(results);
            setViewMode(ViewMode.CATALOG);
            setCurrentSystem(null);
        }
    };

    const handleGeneratePathology = async (pathologyName: string) => {
        if (!pathologyName.trim()) {
            setError("Por favor, introduce un nombre para la patología.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const pathologySchema = {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "Un identificador único en formato 'sistema-slug-name'. Ejemplo: 'cardio-insuficiencia-venosa'." },
                    name: { type: Type.STRING },
                    sistema: { type: Type.STRING, enum: Object.values(System), description: "El sistema al que pertenece la patología." },
                    etimologia: { type: Type.STRING },
                    definicionClinica: { type: Type.STRING },
                    sintomatologia: { type: Type.ARRAY, items: { type: Type.STRING } },
                    diagnosticoNANDA: { type: Type.STRING, description: "Un diagnóstico NANDA principal. Formato: '[código] Diagnóstico r/c factores.'" },
                    intervencionesNIC: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Intervenciones NIC. Formato: '[código] Intervención'" },
                    resultadosNOC: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Resultados NOC. Formato: '[código] Resultado'" },
                    planDeCuidados: { type: Type.STRING },
                    farmacosPrincipales: { type: Type.ARRAY, items: { type: Type.STRING } },
                    clavesResumen: { type: Type.STRING, description: "Un resumen corto y conciso con los puntos más importantes para el estudio." },
                },
                required: ['id', 'name', 'sistema', 'etimologia', 'definicionClinica', 'sintomatologia', 'diagnosticoNANDA', 'intervencionesNIC', 'resultadosNOC', 'planDeCuidados', 'farmacosPrincipales', 'clavesResumen']
            };

            const prompt = `Genera una ficha de patología completa y detallada para "${pathologyName}" en formato JSON. Sigue estrictamente el schema proporcionado. La información debe ser precisa, concisa y orientada a la enfermería, usando terminología NANDA-NIC-NOC. El idioma debe ser español.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: pathologySchema
                }
            });

            const jsonText = response.text.trim();
            const newPathology = JSON.parse(jsonText) as Pathology;
            
            catalogService.addPathology(newPathology);
            setSearchQuery('');
            setInputMode('search');
            setSearchResults([newPathology]);
            setViewMode(ViewMode.CATALOG);
            setCurrentSystem(null);

        } catch (e) {
            console.error("Error generating pathology:", e);
            setError("No se pudo generar la patología. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderContent = () => {
        if (!isInitialized) {
            return <p className="text-center mt-8">Cargando catálogo...</p>;
        }

        switch(viewMode) {
            case ViewMode.GLOSSARY:
                return <GlossaryView glossary={GLOSSARY} />;
            case ViewMode.CATALOG:
                let pathologies: Pathology[];
                let title: string | null = null;
                
                if (currentSystem) {
                    pathologies = catalogService.getPathologiesBySystem(currentSystem);
                    title = currentSystem;
                } else {
                    pathologies = searchResults;
                    title = `Resultados para "${searchQuery}"`;
                    if (pathologies.length === 0 && searchQuery) {
                        return <p className="text-center mt-8">No se encontraron resultados para "{searchQuery}".</p>;
                    }
                }
                
                return (
                    <div>
                        <button onClick={handleBackToIndex} className="mb-4 text-primary-600 dark:text-primary-400 hover:underline">&larr; Volver al índice</button>
                        <h2 className="text-2xl font-bold mb-4">{title}</h2>
                        <div className="space-y-4">
                            {pathologies.map(p => <PathologyCard key={p.id} pathology={p} />)}
                        </div>
                    </div>
                );
            case ViewMode.LATEST:
                return (
                    <div>
                        <button onClick={handleBackToIndex} className="mb-4 text-primary-600 dark:text-primary-400 hover:underline">&larr; Volver al índice</button>
                        <h2 className="text-2xl font-bold mb-4">Últimas Patologías Añadidas</h2>
                        <div className="space-y-4">
                            {latestItems.map(p => <PathologyCard key={p.id} pathology={p} />)}
                        </div>
                    </div>
                );
            case ViewMode.INDEX:
            default:
                return (
                    <>
                        <InteractiveIndex onSelectSystem={handleSelectSystem} />
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-red-500">
                                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">🚩 Red Flags</h3>
                                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                    {RED_FLAGS.map(flag => <li key={flag.title}><strong>{flag.title}:</strong> {flag.content}</li>)}
                                </ul>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                                <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">⚡️ Urgencias 30s</h3>
                                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                    {URGENCY_30S.map(item => <li key={item.title}><strong>{item.title}:</strong> {item.content}</li>)}
                                </ul>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}>
            <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <main className="container mx-auto p-2 sm:p-4 max-w-4xl">
                <div className="sticky top-[52px] z-40 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-sm pb-3 border-b border-gray-200 dark:border-gray-700/50">
                    <SearchBar 
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        onSubmit={handleSearchSubmit}
                        inputMode={inputMode}
                    />
                    <div className="flex items-center justify-center space-x-2 mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <span>Búsqueda</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={inputMode === 'chat'} onChange={() => setInputMode(prev => prev === 'search' ? 'chat' : 'search')} className="sr-only peer" />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                        <span>Añadir con IA</span>
                    </div>
                    {error && <p className="text-red-500 text-center mt-2 text-sm">{error}</p>}
                    {isLoading && <p className="text-center mt-2 animate-pulse text-sm">Generando con IA...</p>}
                </div>

                <div className="mt-4">
                    {renderContent()}
                </div>
            </main>
            <footer className="text-center py-4">
                <p className="text-xs text-gray-400 dark:text-gray-600">
                    CREADA POR DAVID ALFONSO ISLA
                </p>
            </footer>
        </div>
    );
};

export default App;