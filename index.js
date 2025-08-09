 const API_BASE_URL = 'https://codeforces.com/api/user.info?handles=';
  
  const elements = {
   usernameInput: document.getElementById('usernameInput'),
   searchBtn: document.getElementById('searchBtn'),
   loading: document.getElementById('loading'),
   errorMessage: document.getElementById('errorMessage'),
   profileCard: document.getElementById('profileCard'),
   userAvatar: document.getElementById('userAvatar'),
   userFullName: document.getElementById('userFullName'),
   userHandle: document.getElementById('userHandle'),
   userRank: document.getElementById('userRank'),
   userRating: document.getElementById('userRating'),
   maxRating: document.getElementById('maxRating'),
   userContribution: document.getElementById('userContribution'),
   userRegistration: document.getElementById('userRegistration'),
   lastOnline: document.getElementById('lastOnline'),
   friendsCount: document.getElementById('friendsCount')
  };
  
  // Rank colors mapping
  const rankColors = {
   'newbie': '#808080',
   'pupil': '#008000',
   'specialist': '#03a89e',
   'expert': '#0000ff',
   'candidate master': '#aa00aa',
   'master': '#ff8c00',
   'international master': '#ff8c00',
   'grandmaster': '#ff0000',
   'international grandmaster': '#ff0000',
   'legendary grandmaster': '#ff0000'
  };
  
  async function fetchUserData(username) {
   try {
    const response = await fetch(API_BASE_URL + encodeURIComponent(username));
    const data = await response.json();
    
    if (data.status === 'OK' && data.result.length > 0) {
     return data.result[0];
    } else {
     throw new Error(data.comment || 'User not found');
    }
   } catch (error) {
    throw new Error('Failed to fetch user data. Please check the username and try again.');
   }
  }
  
  function formatDate(timestamp) {
   return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
   });
  }
  
  function formatTimeAgo(timestamp) {
   const now = Date.now();
   const diff = now - (timestamp * 1000);
   const days = Math.floor(diff / (1000 * 60 * 60 * 24));
   
   if (days === 0) return 'Today';
   if (days === 1) return '1 day ago';
   if (days < 30) return `${days} days ago`;
   if (days < 365) return `${Math.floor(days / 30)} months ago`;
   return `${Math.floor(days / 365)} years ago`;
  }
  
  function displayUserData(user) {
   elements.userAvatar.src = user.titlePhoto || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Pz88L3RleHQ+Cjwvc3ZnPg==';
   
   elements.userFullName.textContent = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.handle;
   elements.userHandle.textContent = `@${user.handle}`;
   
   const rank = user.rank || 'unrated';
   elements.userRank.textContent = rank.charAt(0).toUpperCase() + rank.slice(1);
   elements.userRank.style.backgroundColor = rankColors[rank.toLowerCase()] || '#808080';
   
   elements.userRating.textContent = user.rating || 'Unrated';
   elements.maxRating.textContent = user.maxRating || 'N/A';
   
   const contribution = user.contribution || 0;
   elements.userContribution.textContent = contribution > 0 ? `+${contribution}` : contribution;
   elements.userContribution.className = contribution >= 0 ? 'stat-value contribution' : 'stat-value negative-contribution';
   
   elements.userRegistration.textContent = formatDate(user.registrationTimeSeconds);
   elements.lastOnline.textContent = formatTimeAgo(user.lastOnlineTimeSeconds);
   elements.friendsCount.textContent = user.friendOfCount || 0;
  }
  
  function showLoading() {
   elements.loading.style.display = 'block';
   elements.profileCard.style.display = 'none';
   elements.errorMessage.style.display = 'none';
   elements.searchBtn.disabled = true;
   elements.searchBtn.textContent = 'Searching...';
  }
  
  function hideLoading() {
   elements.loading.style.display = 'none';
   elements.searchBtn.disabled = false;
   elements.searchBtn.textContent = 'Search';
  }
  
  function showError(message) {
   elements.errorMessage.textContent = message;
   elements.errorMessage.style.display = 'block';
   elements.profileCard.style.display = 'none';
  }
  
  function showProfile() {
   elements.profileCard.style.display = 'block';
   elements.errorMessage.style.display = 'none';
  }
  
  async function handleSearch() {
   const username = elements.usernameInput.value.trim();
   
   if (!username) {
    showError('Please enter a username');
    return;
   }
   
   showLoading();
   
   try {
    const userData = await fetchUserData(username);
    displayUserData(userData);
    showProfile();
   } catch (error) {
    showError(error.message);
   } finally {
    hideLoading();
   }
  }
  
  // Event listeners
  elements.searchBtn.addEventListener('click', handleSearch);
  
  
  elements.usernameInput.addEventListener('keypress', (e) => {
   if (e.key === 'Enter') {
    handleSearch();
   }
  });
  
  // Clear error when typing
  elements.usernameInput.addEventListener('input', () => {
   elements.errorMessage.style.display = 'none';
  });
  
  // Focus input on page load
  elements.usernameInput.focus();
