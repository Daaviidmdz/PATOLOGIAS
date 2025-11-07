import React from 'react';

interface SearchBarProps {
  value: string;
  // FIX: Corrected typo from onValuecha to onValueChange
  onValueChange: (query: string) => void;
  onSubmit: (query: string) => void;
  inputMode: 'search' | 'chat';
}

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);


const SearchBar: React.FC<SearchBarProps> = ({ value, onValueChange, onSubmit, inputMode }) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
  }

  const placeholderText = inputMode === 'search' 
    ? 'Buscar, "Ver glosario", "Ver últimas"...' 
    : 'Escribe el nombre de la patología a crear...';

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {inputMode === 'chat' ? <PlusIcon/> : <SearchIcon/>}
        </div>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholderText}
          className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:border-primary-500 transition-shadow duration-300"
        />
        <button 
            type="submit" 
            className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-primary-600 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200 rounded-full focus:outline-none"
            aria-label={inputMode === 'search' ? 'Buscar' : 'Añadir patología'}
        >
            {inputMode === 'chat' ? <SendIcon /> : <SearchIcon />}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;