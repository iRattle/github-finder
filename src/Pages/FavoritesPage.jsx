import { useEffect, useState } from 'react';
import { supabase } from '../Services/supabaseClient';
import { Link } from 'react-router-dom';

export function FavoritesPage({ isDark }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    const { data, error } = await supabase.from('favorites').select('*');
    if (error) console.error("Error fetching:", error);
    else setFavorites(data);
  }

  // The Delete Logic
  const handleRemove = async (id) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id); // Match the database row by its unique ID

    if (error) {
      console.error("Error removing:", error);
    } else {
      // Refresh the list locally after deletion
      setFavorites(favorites.filter(fav => fav.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-gray-800': ' text-amber-200'}`}>Your Favorites</h1>
      <div className="grid gap-4">
        {favorites.map((fav) => (
          <div key={fav.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-xl">
            <div className="flex items-center gap-4">
              <img src={fav.avatar_url} alt={fav.username} className="w-12 h-12 rounded-full" />
              <span className="text-white font-semibold">{fav.name || fav.username}</span>
            </div>

            <span className="flex gap-x-2">
 
  <Link 
    to={`/user/${fav.username}`}
    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition"
  >
    View Profile
  </Link>
  
  {/* Button strictly for deleting the item */}
  <button 
    onClick={() => handleRemove(fav.id)}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
  >
    Remove
  </button>
</span>
          </div>
        ))}
      </div>
    </div>
  );
}