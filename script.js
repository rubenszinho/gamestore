const API_KEY = "d25aa82587884b22824222c27300a44d";
const gridContainer = document.querySelector('.grid-container');

async function fetchGames(options = {}) {
  const { title = '', ordering = '', dates = '' } = options;
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(title)}&ordering=${ordering}&dates=${dates}&page_size=8`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching game data:', error);
  }
}

async function fetchFeaturedGames() {
  return await fetchGames();
}

async function fetchTopGames() {
  return await fetchGames({ ordering: '-rating', dates: '2022-01-01,2022-12-31' });
}

async function fetchNewReleases() {
  return await fetchGames({ ordering: '-released', dates: '2022-01-01,2022-12-31' });
}

function createGameCard(game) {
  const gameCard = document.createElement('div');
  gameCard.classList.add('game-card');
  // gameCard.setAttribute('data-game-id', gameId); // Replace with your gameId variable
  gameCard.onclick = onGameCardClick;
  gameCard.className = 'game-card';

  const thumbnail = document.createElement('div');
  thumbnail.className = 'game-card__thumbnail';
  thumbnail.style.backgroundImage = `url(${game.background_image})`;
  thumbnail.alt = game.name;

  const content = document.createElement('div');
  content.className = 'game-card__content';

  const title = document.createElement('h3');
  title.className = 'game-card__title';
  title.textContent = game.name;

  const price = document.createElement('span');
  price.className = 'game-card__price';
  price.textContent = `$${(Math.random() * (59.99 - 19.99) + 19.99).toFixed(2)}`;

  thumbnail.appendChild(price); // Add price to thumbnail instead of content
  content.appendChild(title);

  gameCard.appendChild(thumbnail);
  gameCard.appendChild(content);

  return gameCard;
}

function createBanner(game) {

  const banner = document.createElement('div');
  banner.classList.add('banner');
  banner.style.backgroundImage = `url(${game.background_image})`;

  const gameName = document.createElement('div');
  gameName.classList.add('banner__game-name');
  gameName.textContent = game.name;
  banner.appendChild(gameName);

  banner.onclick = onBannerClick;

  return banner;
}


async function populateHomePage() {
  const searchParams = new URLSearchParams(window.location.search);
  const searchText = searchParams.get('search');

  document.querySelectorAll(".game-card").forEach(card => {
    card.addEventListener("click", () => {
      window.location.href = "game-details.html";
    });
  });

  if (searchText) {
    await populateSearchPage(searchText);
  } else {
    const featuredGames = await fetchFeaturedGames();
    const topGames = await fetchTopGames();
    const newReleases = await fetchNewReleases();

    const topGamesContainer = document.querySelector('.grid-container.top-games');
    topGames.forEach((game) => {
      const gameCard = createGameCard(game);
      topGamesContainer.appendChild(gameCard);
    });

    const newReleasesContainer = document.querySelector('.grid-container.new-releases');
    newReleases.forEach((game) => {
      const gameCard = createGameCard(game);
      newReleasesContainer.appendChild(gameCard);
    });

    const carouselSlide = document.querySelector('.carousel-slide');

    featuredGames.forEach((game) => {
      const banner = createBanner(game);
      carouselSlide.appendChild(banner);
    });

    const carouselContainer = document.querySelector('.carousel-container');
    const carouselButtonLeft = document.querySelector('.carousel-button--left');
    const carouselButtonRight = document.querySelector('.carousel-button--right');

    const banners = document.querySelectorAll('.banner');
    const numBanners = banners.length;
    const bannerWidth = banners[0].offsetWidth;
    const carouselWidth = carouselContainer.clientWidth;
    const bannersPerPage = Math.floor(carouselWidth / bannerWidth);

    let currentPosition = 0;
    const slideWidth = 220;

    function moveCarousel(position) {
      currentPosition += position * bannersPerPage;
      currentPosition = Math.max(0, Math.min(currentPosition, numBanners - bannersPerPage));
      carouselSlide.style.transform = `translateX(-${currentPosition * bannerWidth}px)`;
    }

    carouselButtonLeft.addEventListener('click', () => {
      moveCarousel(-1);
    });

    carouselButtonRight.addEventListener('click', () => {
      moveCarousel(1);
    });
  }
}

let currentTheme = "default";

function toggleTheme() {
  const themeOrder = ["default", "solarized", "light", "dark"];
  let index = themeOrder.indexOf(currentTheme);
  index = (index + 1) % themeOrder.length;
  currentTheme = themeOrder[index];

  document.documentElement.setAttribute("data-theme", currentTheme);
}

function onSearchClick() {
  const searchInput = document.querySelector('.search-input');
  const searchText = searchInput.value.trim();

  if (searchText) {
    window.location.href = `search.html?search=${encodeURIComponent(searchText)}`;
  } else {
    alert('Please enter a search term.');
  }
}

populateHomePage();

async function populateSearchPage(searchText) {
  const searchResults = await fetchGames({ title: searchText });

  const searchResultsContainer = document.querySelector('.grid-container.search-results');
  searchResultsContainer.innerHTML = ''; // Clear any previous search results

  searchResults.forEach((game) => {
    const gameCard = createGameCard(game);
    searchResultsContainer.appendChild(gameCard);
  });
}

if (document.querySelector('.grid-container.search-results')) {
  populateSearchPage();
}

// Update this function to handle the new fields
function updateUserProfile() {
  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {
    id: 12345,
    name: "Rubens",
    email: "rubenszinho@example.com",
    phone: "+1 (555) 123-4567",
    isAdmin: false,
  };

  if (document.querySelector(".user-name")) {
    document.querySelector(".user-name").textContent = userProfile.name;
    document.querySelector(".user-email").textContent = userProfile.email;
    document.querySelector(".user-id").textContent = `ID: ${userProfile.id}`;
    document.querySelector(".user-phone").textContent = `Phone: ${userProfile.phone}`;
    document.querySelector(".user-isAdmin").textContent = `Admin: ${userProfile.isAdmin ? "Yes" : "No"}`;
  }

  if (document.getElementById("name")) {
    document.getElementById("name").value = userProfile.name;
    document.getElementById("email").value = userProfile.email;
    document.getElementById("id").value = userProfile.id;
    document.getElementById("phone").value = userProfile.phone;
    document.getElementById("isAdmin").checked = userProfile.isAdmin;
  }
}


// Call updateUserProfile when the page loads
updateUserProfile();

const editProfileForm = document.getElementById("editProfileForm");
if (editProfileForm) {
  editProfileForm.addEventListener("submit", (e) => {
    // Update the form submit event listener to save the new fields
    document.getElementById("editProfileForm").addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const id = document.getElementById("id").value;
      const isAdmin = document.getElementById("isAdmin").checked;

      if (name && email && phone) {
        localStorage.setItem("userProfile", JSON.stringify({ id, name, email, phone, isAdmin }));
        alert("Profile saved successfully.");
        updateUserProfile();
      } else {
        alert("Please fill in all fields.");
      }
    });
  });
}

function onGameCardClick(event) {
  const gameId = event.currentTarget.getAttribute('data-game-id');
  window.location.href = `game-details.html`; // Assuming game-details.html is the game details page
}

function onBannerClick(event) {
  const gameId = event.currentTarget.getAttribute('data-game-id');
  window.location.href = `game-details.html`; // Assuming game-details.html is the game details page
}
