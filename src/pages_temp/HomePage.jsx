import { useState } from 'react';
import { SearchBar } from '../Components/SearchBar';
import { searchUsers } from '../services/githubApi';
import { UserProfilePage } from './UserProfilePage';
import { Link } from 'react-router-dom';

export function HomePage({ isDark }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await searchUsers(query);
      setUsers(data.items || []);
    } catch (error) {
      console.error("Search failed:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className={`text-4xl font-bold mb-6 text-center ${isDark ? 'text-gray-700':' text-amber-50'}`}>Find GitHub Users</h2>
      <SearchBar onSearch={handleSearch} isDark={isDark} />

      {loading && <p className="text-center mt-6 animate-pulse">Searching GitHub...</p>}

      {!loading && hasSearched && users.length === 0 && (
        <p className="text-center mt-6 text-gray-500">No users found for this query.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {users.map((user) => (
          <div key={user.id} className={` ${isDark ? 'bg-amber-200': 'bg-gray-700'} p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center`}>
            <img 
              src={user.avatar_url} 
              alt={`${user.login}'s avatar`} 
              className="w-20 h-20 rounded-full border-3 border-green-500" 
            />
            <h3 className={`mt-4 font-semibold text-lg ${isDark ? 'text-gray-800': 'text-amber-50'}`}>{user.login}</h3>
           <Link 
             to={`/user/${user.login}`} 
             className="mt-3 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 text-center"
           >
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}