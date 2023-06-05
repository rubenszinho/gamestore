const API_KEY = "d25aa82587884b22824222c27300a44d";
const gridContainer = document.querySelector('.grid-container');
let currentTheme = "light";

// INICIALIZA A PAGINA ATUAL
populatePage();

function toggleTheme() {
  const themeOrder = ["light", "dark"];
  let index = themeOrder.indexOf(currentTheme);
  index = (index + 1) % themeOrder.length;
  currentTheme = themeOrder[index];

  document.documentElement.setAttribute("data-theme", currentTheme);
  document.querySelector('#theme-toggle')?.setAttribute('aria-label', currentTheme);
}

async function fetchGames(options = {}) {
  const { search = '', ordering = '', dates = '', id= '' } = options;
  let url; // the url for a single game fetch is different
  if (id) {
    url = `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
  } else {
    url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${search}&ordering=${ordering}&dates=${dates}&page_size=8`;
  }
  try {
    const response = await fetch(url);
    const data = await response.json();
    return (id) ? data : data.results;
  } 
  catch (error) {
    console.error('Error fetching game data:', error);
  }
}

function createGameCard(game) {
  const gameCard = document.createElement('div');
  gameCard.classList.add('game-card');
  gameCard.setAttribute('game-id', game.id);
  gameCard.onclick = onGameClick;
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
  price.textContent = `$${game.id}` // como a API nao tem preço, usa o ID

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
  banner.setAttribute('game-id', game.id);

  banner.onclick = onGameClick;

  return banner;
}

function createCartItem(game) {

  const item = document.createElement('div');
  item.classList.add('cart-item');
  item.setAttribute('game-price', game.id);
  item.setAttribute('game-id', game.id);
  item.onclick = () => onGameClick(event);

  const itemImg = document.createElement('img')
  itemImg.alt = game.name
  itemImg.src = game.background_image
  itemImg.classList.add('cart-item-image')

  const cartItemInfo = document.createElement('div')
  cartItemInfo.classList.add('cart-item-info')

  const cartItemTitle = document.createElement('h3')
  cartItemTitle.textContent = game.name
  cartItemTitle.classList.add('cart-item-title')

  const cartItemPrice = document.createElement('p')
  cartItemPrice.textContent = `$${game.id}`
  cartItemPrice.classList.add('cart-item-price')

  const cartItemRemoveButton = document.createElement('button')
  cartItemRemoveButton.textContent = 'Remove'
  cartItemRemoveButton.classList.add('cart-item-remove')
  cartItemRemoveButton.classList.add('button')
  cartItemRemoveButton.setAttribute('game-id', game.id)

  cartItemRemoveButton.addEventListener('click', (event) => {
    event.stopPropagation();
    let oldItems = JSON.parse(localStorage.getItem('cart-items'));
    let newItens = oldItems.filter((item) => {
      return item !== event.currentTarget.getAttribute('game-id');
    });
    localStorage.setItem('cart-items', JSON.stringify(newItens));1
    window.location.reload();
  })

  cartItemInfo.appendChild(cartItemTitle)
  cartItemInfo.appendChild(cartItemPrice)

  item.appendChild(itemImg)
  item.appendChild(cartItemInfo)
  item.appendChild(cartItemRemoveButton)

  return item
}

async function populatePage() {
  const searchParams = new URLSearchParams(window.location.search);
  const searchText = searchParams.get('search');
  const gameId = searchParams.get('id');
  const pagName = window.location.pathname.substring(window.location.pathname.lastIndexOf('/'))

  switch (pagName) {
    case '/search.html':
      await populateSearchPage(searchText);
      break;
    
    case '/game-details.html':
      await populateGameDetailsPage(gameId)
      break;

    case '/my-cart.html':
      await populateCartPage()
      break;

    case '/index.html':
      await populateHomePage()
      break;

    case '/user-profile.html':
      updateUserProfile();
      break;

    case '/edit-profile.html':
      updateUserProfile();
      handleProfileEdit();
      break;

    default:
      break;
  }
}

async function populateSearchPage(searchText) {
  const searchResults = await fetchGames({ ordering: '-rating', search: searchText });

  const searchResultsContainer = document.querySelector('.grid-container.search-results');
  searchResultsContainer.innerHTML = ''; // Clear any previous search results

  searchResults.forEach((game) => {
    const gameCard = createGameCard(game);
    searchResultsContainer.appendChild(gameCard);
  });
}

async function populateGameDetailsPage(gameId) {
  const game = await fetchGames({ id: gameId })
  console.log(game)
  
  const imgDiv = document.querySelector('.game-details__image');
  const gameImg = document.createElement('img');
  gameImg.alt = game.name
  gameImg.src = game.background_image
  imgDiv.appendChild(gameImg)
  
  document.querySelector('.game-details__title').textContent = game.name
  document.querySelector('.game-details__description').innerHTML = game.description
  document.querySelector('.game-details__price').textContent = `$${game.id}`

  document.querySelector('.button').setAttribute('game-id', gameId);
  document.querySelector('.button').onclick = () => addToCart(event);
}

async function populateCartPage() {
  const cartItems = JSON.parse(localStorage.getItem('cart-items'))
  const items = document.querySelector('.cart-items')
  let totalPrice = 0;

  cartItems.forEach(async (item) => {
    const game = await fetchGames({ id: item })
    const cartItem = createCartItem(game)
    items.appendChild(cartItem) 

    totalPrice = Number(totalPrice) + Number(cartItem.getAttribute('game-price'));
    document.querySelector('.cart-total-price').innerHTML = `$${totalPrice}`
  })

}

async function populateHomePage() {
  const featuredGames = await await fetchGames();
  const topGames = await fetchGames({ ordering: '-rating', dates: '2022-01-01,2022-12-31' });
  const newReleases = await fetchGames({ ordering: '-released', dates: '2022-01-01,2022-12-31' });

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

function onSearchClick() {
  const searchInput = document.querySelector('.search-input');
  const searchText = searchInput.value.trim();

  if (searchText) {
    window.location.href = `search.html?search=${encodeURIComponent(searchText)}`;
  } else {
    alert('Please enter a search term.');
  }
}

function onSearchEnter(event) {
  if (event.keyCode === 13) { // enter foi inserido
    const searchInput = document.querySelector('.search-input');
    const searchText = searchInput.value.trim();

    if (searchText) {
      window.location.href = `search.html?search=${encodeURIComponent(searchText)}`;
    } else {
      alert('Please enter a search term.');
    }
  }
}

function onGameClick(event) {
  const gameId = event.currentTarget.getAttribute('game-id');
  window.location.href = `game-details.html?id=${encodeURIComponent(gameId)}`;
}

function addToCart(event) {
  const gameId = event.currentTarget.getAttribute('game-id');
  let cartItems = JSON.parse(localStorage.getItem('cart-items'))

  if (!cartItems.includes(gameId)) {  
    if (cartItems) {
      cartItems.push(gameId)
    } else {
      cartItems = [gameId]
    }
    localStorage.setItem('cart-items', JSON.stringify(cartItems))

  } else {
    alert('Jogo já está no carrinho')
  }

  window.location.href = 'my-cart.html'
}

function updateUserProfile() {
  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {
    id: 12345,
    name: "Rubens",
    email: "rubenszinho@example.com",
    phone: "+1 (555) 123-4567",
    isAdmin: false,
  };

  if (document.querySelector(".user-name")) { // se estiver na pagina de perfil
    document.querySelector(".user-name").textContent = userProfile.name;
    document.querySelector(".user-email").textContent = userProfile.email;
    document.querySelector(".user-id").textContent = `ID: ${userProfile.id}`;
    document.querySelector(".user-phone").textContent = `Phone: ${userProfile.phone}`;
    document.querySelector(".user-isAdmin").textContent = `Admin: ${userProfile.isAdmin ? "Yes" : "No"}`;
  }

  if (document.getElementById("name")) { // se estiver na pagina de edição de perfil
    document.getElementById("name").value = userProfile.name;
    document.getElementById("email").value = userProfile.email;
    document.getElementById("id").value = userProfile.id;
    document.getElementById("phone").value = userProfile.phone;
    document.getElementById("isAdmin").checked = userProfile.isAdmin;
  }
}

function handleProfileEdit() {

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
      window.location.href = 'user-profile.html';
    } else {
      alert("Please fill in all fields.");
    }
  })
}

function handleCheckout() { 
  
  const paymentMethods = "<h2>Payments</h2><ul id='list-checkboxes' class='checkout-options'><li class='type-card'><input type='checkbox' value='card'><label>Credit/Debit Card</label></li><li class='type-paypal'><input type='checkbox' value='paypal'><label>Paypal</label></li><li class='type-pix'><input type='checkbox' value='pix'><label>Pix</label></li></ul>"

  document.querySelector('.checkout-options').innerHTML = paymentMethods;

  let checkboxes = document.querySelectorAll('#list-checkboxes input[type="checkbox"]');
  checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      document.querySelector('.checkout-info').innerHTML = ''; // retira o pagamento q estava antes
      document.querySelector('.checkout-confirm').innerHTML = '';
      if (this.checked) {
        checkboxes.forEach(function(otherCheckbox) {
          if (otherCheckbox !== checkbox) {
            otherCheckbox.checked = false;
          }
        });
        showPaymentMethod(this);
      }
    });
  });
}

function showPaymentMethod(checkbox) {
  switch (checkbox.value) {
    case 'card':
      showCardMethod();
      break;
      
    case 'pix':
      showPixMethod();
      break;

    case 'paypal':
      showPaypalMethod();
      break;

    default:
      console.log("Checkout Error")
      break;
  }
}

function showCardMethod() {
  const cardMethod = '<form id="checkout-form" class="checkout-info-forms"><img src="../assets/cartao.png" alt="cartao"><label for="cardNumber">Card´s Number:</label><input type="text" id="cardNumber" placeholder="1234 2345 3456 4567" required><br><label for="expirationDate">Expiration Date:</label><input type="text" id="expirationDate" placeholder="MM/AA" required><br><label for="CVC-CVV">CVC/CVV:</label><input type="text" id="CVC-CVV" placeholder="123" required><br><label for="CardName">Card´s Name</label><input type="text" id="CardName" placeholder="Example Example" required><button type="submit" class="button">Confirm</button></form>';

  document.querySelector('.checkout-info').innerHTML = cardMethod;

  document.getElementById('checkout-form').addEventListener("submit", (e) => {
    e.preventDefault();
    showCheckoutConfirmation(true)
  })
}

function showPixMethod() {
  const pixMethod = '<div class="checkout-info-pix">  <img src="../assets/qrcode.png" alt="qrcode">  <p>Pix Copia e Cola:</p>  <input id="pix-copia-cola" type="text" value="DNWUQODNFQUOFBPQWbEWYCFUBKFBECWYFBWUCFBWCBFW@gamestore.net"    disabled><button class="button" id="copyButton">Copy</button></div>';

  document.querySelector('.checkout-info').innerHTML = pixMethod;

  document.getElementById('copyButton').addEventListener('click', function() {
    const value = document.getElementById('pix-copia-cola');
    value.select();
    navigator.clipboard.writeText(value.value);
  });

  showCheckoutConfirmation(false)
}

function showPaypalMethod() {
  const paypalMethod = '<div class="checkout-info-paypal">  <a href="https://paypal.com" target="_blank">    <img class="checkout-info-paypal-img" src="../assets/paypal.png" alt="paypal-site" href="https://paypal.com">  </a>  <p>PayPal transactions are authorized through the PayPal website. Click in the logo above to open a new browser    window and start the transaction.<br><br>    Please review your order before go to the website.  </p></div>'

  document.querySelector('.checkout-info').innerHTML = paypalMethod;

  showCheckoutConfirmation(false)
}

function showCheckoutConfirmation(method) {
  
  let confirmation = '<h1>Order confirmation</h1><h2>Game list</h2><div id="checkout-game-list"></div><div>  <h2>Total price:</h2>  <p id="checkout-total-price"></p></div>'

  if (method) {
    confirmation += '<button class="button">Confirm Transaction</button>'
  } else {
    confirmation += '<button class="button" disable>Waiting for the payment server...</button>'
  }
  
  document.querySelector('.checkout-confirm').innerHTML = confirmation;

  let gameList = '';
  document.querySelectorAll('.cart-item-title').forEach((item) => {
    gameList += item.textContent + "<br><br>";
  })

  document.querySelector('#checkout-game-list').innerHTML = gameList

  document.querySelector('#checkout-total-price').textContent = document.querySelector('.cart-total-price').innerHTML;
}
