import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { useState } from 'react';
import { UserProfilePage } from './pages/UserProfilePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { Link } from 'react-router-dom';

function App() {

  const [isDark, setIsDark] = useState(false)

  return (
    <Router>
      <div className={`min-h-screen  ${isDark ? 'bg-amber-50': 'bg-gray-800'}`}>
        <nav className="p-4 bg-green-700 shadow-sm  mb-6 font-bold text-lg text-white">
  <div className='max-w-7xl flex justify-between mx-auto'>

<h3>GitHub Finder</h3> 
  
  <div className="flex gap-4 items-center">
    {/* New Favorites Link */}
    <Link to="/favorites" className="hover:underline">Favorites</Link>
    
    <span> 
      <button 
        onClick={() => setIsDark(!isDark)} 
        className='bg-white w-20 text-xl text-green-700 rounded'
      >
        Theme
      </button>
    </span>
  </div>

  </div>
</nav>
        <div className="container max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<HomePage isDark={isDark} />} />
            <Route path="/user/:username" element={<UserProfilePage isDark={isDark} />} />
            <Route path="/favorites" element={<FavoritesPage isDark={isDark} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;