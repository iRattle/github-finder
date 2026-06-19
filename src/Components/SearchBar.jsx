import { useState } from 'react';

// Make sure you have 'export' right before 'function'
export function SearchBar({ onSearch, isDark }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(text);
  };

  return (
    <div className='flex justify-center items-center'>
    <form onSubmit={handleSubmit} className="flex gap-2">
    
      <input
        type="text"
        className={`rounded-full h-12 w-150 px-5 outline-0 ${isDark ? 'bg-gray-300':' bg-amber-50'}`}
        placeholder="Enter GitHub username..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="bg-green-500 text-white p-2 rounded-full w-30">
        Search
      </button>
    </form>
    </div>
  );
}