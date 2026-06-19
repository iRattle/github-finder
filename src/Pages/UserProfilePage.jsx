import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUser, getUserRepos } from '../services/githubApi';
import { supabase } from '../Services/supabaseClient';

export function UserProfilePage({ isDark }) {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  // 1. Data Fetching
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [userData, repoData] = await Promise.all([
          getUser(username),
          getUserRepos(username)
        ]);
        setUser(userData);
        setRepos(repoData);
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [username]);

  // 2. Supabase Integration
  const handleAddFavorite = async (user) => {
  // 1. First, check if the user is already favorited
  const { data: existing, error: checkError } = await supabase
    .from('favorites')
    .select('*')
    .eq('username', user.login)
    .single();

  if (existing) {
    alert("This user is already in your favorites!");
    return; // Stop here!
  }

  // 2. If they don't exist, proceed to insert
  setIsFavorited(true);
  const { error } = await supabase
    .from('favorites')
    .insert([{ 
      username: user.login, 
      avatar_url: user.avatar_url, 
      name: user.name 
    }]);

  if (error) {
    console.error("Error saving favorite:", error);
    setIsFavorited(false);
  } else {
    alert(`${user.login} added to favorites!`);
  }
};

  // 3. Loading & Error States
  if (loading) return <div className="text-center mt-10 text-white">Loading profile...</div>;
  if (!user) return <div className="text-center mt-10 text-white">User not found.</div>;

  // 4. Render Layout
  return (
    <div className={`p-8 max-w-6xl mx-auto ${isDark ? 'text-gray-800' : 'text-white'}`}>
      <Link to="/" className="mb-6 inline-block text-green-500 hover:underline">← Back to Search</Link>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Identity, Stats & Actions */}
        <div className="md:col-span-1 space-y-6">
          <img src={user.avatar_url} className="w-full rounded-2xl border-4 border-green-500" alt={user.login} />
          
          <button 
            disabled={isFavorited}
            onClick={() => handleAddFavorite(user)}
            className={`w-full py-2 rounded-lg font-bold transition ${isFavorited ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isFavorited ? 'Added to Favorites' : 'Add to Favorites'}
          </button>

          <div>
            <h1 className="text-3xl font-bold">{user.name || user.login}</h1>
            <p className="text-xl text-green-500">@{user.login}</p>
          </div>
          <p className="text-gray-400">{user.bio}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 p-3 rounded-lg text-center">
              <div className="font-bold">{user.public_repos}</div>
              <div className="text-xs text-gray-400">Repos</div>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg text-center">
              <div className="font-bold">{user.followers}</div>
              <div className="text-xs text-gray-400">Followers</div>
            </div>
          </div>
        </div>

        {/* Right Column: Repository List */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Latest Repositories</h2>
          <div className="grid gap-4">
            {repos.slice(0, 6).map((repo) => (
              <div key={repo.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-green-500 transition-all">
                <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-green-400 font-semibold hover:underline">{repo.name}</a>
                <p className="text-sm text-gray-400 mt-1">{repo.description || 'No description'}</p>
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>⑂ {repo.forks_count}</span>
                  <span>{repo.language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}