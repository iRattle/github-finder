const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const BASE_URL = 'https://api.github.com';

const headers = {
  'Authorization': `token ${TOKEN}`,
  'Accept': 'application/vnd.github.v3+json'
};

// THIS IS THE CRITICAL LINE
export async function searchUsers(query) {
  const response = await fetch(`${BASE_URL}/search/users?q=${query}`, { headers });
  if (!response.ok) throw new Error('Search request failed');
  return response.json();
}

// Ensure this has 'export'
export async function getUser(username) {
  const response = await fetch(`${BASE_URL}/users/${username}`, { headers });
  if (!response.ok) throw new Error(`User ${username} not found`);
  return response.json();
}

export async function getUserRepos(username) {
  const response = await fetch(`${BASE_URL}/users/${username}/repos?sort=updated&per_page=50`, { headers });
  if (!response.ok) throw new Error(`Repos for ${username} not found`);
  return response.json();
}