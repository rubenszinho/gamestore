const gridContainer = document.querySelector('.grid-container');
let currentTheme = "light";

// INICIALIZA A PAGINA ATUAL
populatePage();

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  // Definir um cookie com o tema selecionado que expira em 365 dias
  document.cookie = `currentTheme=${theme}; expires=${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()}`;
}

function getTheme() {
  // Obter o valor do cookie "currentTheme"
  const cookies = document.cookie.split(";").map(cookie => cookie.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith("currentTheme=")) {
      return cookie.substring("currentTheme=".length);
    }
  }
  return null;
}

function toggleTheme() {
  const currentTheme = getTheme();
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
}

window.addEventListener("DOMContentLoaded", function () {
  const currentTheme = getTheme();
  if (currentTheme) {
    setTheme(currentTheme);
  }
});

function createGameCard(game) {
  const gameCard = document.createElement('div');
  gameCard.classList.add('game-card');
  gameCard.setAttribute('game-id', game._id);
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
  price.textContent = game.price 

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
  banner.setAttribute('game-id', game._id);

  banner.onclick = onGameClick;

  return banner;
}

function createCartItem(game) {
  const item = document.createElement('div');
  item.classList.add('cart-item');
  item.setAttribute('game-price', game.price);
  item.setAttribute('game-id', game._id);
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
  cartItemPrice.textContent = `$${game.price}`
  cartItemPrice.classList.add('cart-item-price')

  const cartItemRemoveButton = document.createElement('button')
  cartItemRemoveButton.textContent = 'Remove'
  cartItemRemoveButton.classList.add('cart-item-remove')
  cartItemRemoveButton.classList.add('button')
  cartItemRemoveButton.setAttribute('game-id', game._id)

  cartItemRemoveButton.addEventListener('click', (event) => {
    event.stopPropagation();

    const gameId = event.currentTarget.getAttribute('game-id');
    var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

    fetch(`/users/${loggedInUserId}/cart/${gameId}`, { method: 'DELETE' })
      .then((response) => response.json())
      .then((data) => {
          alert('Sucess.');
          location.reload();
      })
      .catch((error) => {
        console.error('Error removing game to cart:', error);
        alert('An error occurred while removing the item from the cart.');
      });
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
    case '/search':
      await populateSearchPage(searchText);
      break;
    
    case '/game-details':
      // handleAdminUI();
      await populateGameDetailsPage(gameId)
      break;

    case '/my-cart':
      await populateCartPage()
      break;

    case '/':
      // handleAdminUI();
      await populateHomePage()
      break;

    case '/user-profile':
      updateUserProfile();
      break;

    case '/edit-profile':
      updateUserProfile();
      handleProfileEdit();
      break;

    case '/admin-users-list':
      populateUsersList();
      break;

    case '/login':
      loginListener();
      break;

    case '/register':
      registerListener();
      break;

    case '/admin-game-add':
      document.getElementById("editGameForm").addEventListener("submit", addGame);
      break;

    case '/admin-game-edit':
      populateGameEdit(gameId);
      document.getElementById("editGameForm").addEventListener("submit", (e) => {
        e.preventDefault();
        updateGame(gameId);
      });
      document.getElementById("game-delete-button").addEventListener("click", (e) => {
        e.preventDefault();
        deleteGame(gameId);
      });
      break;

    default:
      //handleAdminUI();
      //await populateHomePage()
      break;
  }
}

async function populateSearchPage(searchText) {
  try {
    let response;
    if(searchText == null){
      response = await fetch(`/games/search/*`);
    }else{
      response = await fetch(`/games/search/${searchText}`);
    }
    if (response.ok) {
      const searchResults = await response.json();

      const searchResultsContainer = document.querySelector('.grid-container.search-results');
      searchResultsContainer.innerHTML = ''; // Clear any previous search results

      searchResults.forEach((game) => {
        const gameCard = createGameCard(game);
        searchResultsContainer.appendChild(gameCard);
      });
    } else {
      console.error('Error searching games:', response.status);
      // Handle error case
    }
  } catch (error) {
    console.error('Error searching games:', error);
    // Handle error case
  }
}

async function populateGameDetailsPage(gameId) {
  try {
    const response = await fetch(`/games/id/${gameId}`);
    if (response.ok) {
      const game = await response.json();
      console.log(game);

      const imgDiv = document.querySelector('.game-details__image');
      const gameImg = document.createElement('img');
      gameImg.alt = game.name;
      gameImg.src = game.background_image;
      imgDiv.appendChild(gameImg);

      document.querySelector('.game-details__title').textContent = game.name;
      document.querySelector('.game-details__description').innerHTML = game.description;
      document.querySelector('.game-details__price').textContent = game.price;

      document.querySelector('.button').setAttribute('game-id', gameId);
      document.querySelector('.button').onclick = () => addToCart(event);
      document.querySelector('.edit-game-button').onclick = () => onEditClick(gameId);
    } else {
      console.error('Error getting game:', response.status);
      // Handle error case when game is not found
    }
  } catch (error) {
    console.error('Error getting game:', error);
    // Handle error case
  }
}

async function populateCartPage() {
  const itemsContainer = document.querySelector('.cart-items');
  var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));
  let totalPrice = 0;

  try {
    const response = await fetch(`/users/${loggedInUserId}/cart`);
    const cartItems = await response.json();

    if (cartItems.length > 0) {
      cartItems.forEach(async (item) => {
        try {
          const gameResponse = await fetch(`/games/id/${item}`);
          const game = await gameResponse.json();
          const cartItem = createCartItem(game);
          itemsContainer.appendChild(cartItem);

          totalPrice += Number(game.price);
          document.querySelector('.cart-total-price').innerHTML = `$${totalPrice}`;
        } catch (error) {
          console.error('Error retrieving game from cart:', error);
        }
      });
    } else {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'Your cart is empty.';
      itemsContainer.appendChild(emptyMessage);
    }
  } catch (error) {
    console.error('Error retrieving cart items:', error);
  }
}

async function populateHomePage() {
  const featuredGames = await fetch('/games/featured').then(response => response.json());
  const topGames = await fetch('/games/top').then(response => response.json());
  const newReleases = await fetch('/games/latest').then(response => response.json());

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
    window.location.href = `/search?search=${encodeURIComponent(searchText)}`;
  } else {
    alert('Please enter a search term.');
  }
}

function onSearchEnter(event) {
  if (event.keyCode === 13) { // enter foi inserido
    const searchInput = document.querySelector('.search-input');
    const searchText = searchInput.value.trim();

    if (searchText) {
      window.location.href = `/search?search=${encodeURIComponent(searchText)}`;
    } else {
      alert('Please enter a search term.');
    }
  }
}

function onGameClick(event) {
  const gameId = event.currentTarget.getAttribute('game-id');
  window.location.href = `/game-details?id=${encodeURIComponent(gameId)}`;
}

function onEditClick(gameId) {
  window.location.href = `/admin-game-edit?id=${encodeURIComponent(gameId)}`;
}

function addToCart(event) {
  const gameId = event.currentTarget.getAttribute('game-id');
  var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

  fetch(`/users/${loggedInUserId}/cart/add/${gameId}`, { method: 'POST' })
    .then((response) => response.json())
    .then((data) => {
      window.location.href = '/my-cart';
      alert("Success");
    })
    .catch((error) => {
      console.error('Error adding game to cart:', error);
    });
}


// Chamada da função ao carregar a página
window.addEventListener("load", toggleUserProfileLink);
window.addEventListener("load", handleAdminUI);



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
  const cardMethod = `
  <form id="checkout-form" class="checkout-info-forms">
    <img src="../../public/assets/cartao.png" alt="cartao">
    <label for="cardNumber">Card´s Number:</label>
    <input type="text" id="cardNumber" placeholder="1234 2345 3456 4567" required>
    <br>

    <label for="expirationDate">Expiration Date:</label>
    <input type="text" id="expirationDate" placeholder="MM/AA" required>
    <br>

    <label for="CVC-CVV">CVC/CVV:</label>
    <input type="text" id="CVC-CVV" placeholder="123" required>
    <br>

    <label for="CardName">Card´s Name</label>
    <input type="text" id="CardName" placeholder="Example Example" required>
    <button type="submit" class="button">Confirm</button>
  </form>`;

  document.querySelector('.checkout-info').innerHTML = cardMethod;

  document.getElementById('checkout-form').addEventListener("submit", (e) => {
    e.preventDefault();
    showCheckoutConfirmation(true)
  })
}

function showPixMethod() {
  const pixMethod = `
  <div class="checkout-info-pix">
    <img src="../../public/assets/qrcode.png" alt="qrcode">
    <p>Pix Copia e Cola:</p>
    <input id="pix-copia-cola" type="text" value="DNWUQODNFQUOFBPQWbEWYCFUBKFBECWYFBWUCFBWCBFW@gamestore.net"    disabled>
    <button class="button" id="copyButton">Copy</button>
  </div>`;

  document.querySelector('.checkout-info').innerHTML = pixMethod;

  document.getElementById('copyButton').addEventListener('click', function() {
    const value = document.getElementById('pix-copia-cola');
    value.select();
    navigator.clipboard.writeText(value.value);
  });

  showCheckoutConfirmation(false)
}

function showPaypalMethod() {
  const paypalMethod = `
  <div class="checkout-info-paypal">
    <a href="https://paypal.com" target="_blank">
     <img class="checkout-info-paypal-img" src="../../public/assets/paypal.png" alt="paypal-site" href="https://paypal.com">
    </a>
    <p>PayPal transactions are authorized through the PayPal website. Click in the logo above to open a new browser    window and start the transaction.<br><br>    Please review your order before go to the website.  </p>
  </div>`;

  document.querySelector('.checkout-info').innerHTML = paypalMethod;

  showCheckoutConfirmation(false)
}

function showCheckoutConfirmation(method) {
  
  let confirmation = `
  <h1>Order confirmation</h1>
  <h2>Game list</h2>
  <div id="checkout-game-list">
  
  </div>
  <div>
    <h2>Total price:</h2>
    <p id="checkout-total-price"></p>
  </div>`;

  if (method) {
    confirmation += '<button class="button" onclick="confirmCheckout()">Confirm Transaction</button>'
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

function confirmCheckout() {
  // Realizar uma solicitação POST para limpar o carrinho no MongoDB
  var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

  fetch(`/users/${loggedInUserId}/cart/all`, { method: 'DELETE' })
    .then((response) => response.json())
    .then((data) => {
      alert('Success.');
      location.reload();
    })
    .catch((error) => {
      console.error('Error confirming checkout:', error);
      alert('An error occurred while confirming the checkout.');
    });
}


function logout() {
  // Salvar o usuário atualizado no session Storage
  sessionStorage.setItem("loggedInUserId", null);

  // Redirecionar para a página de login
  window.location.href = "/login";
}

// Função para deletar um usuário
function deleteUser(userId) {
  fetch(`/api/users/${userId}`, { method: 'DELETE' })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      logout();
      location.reload();
    })
    .catch((error) => {
      console.error('Error deleting user:', error);
    });
}

// Função para popular a lista de usuários
function populateUsersList() {
  fetch('/api/users')
    .then((response) => response.json())
    .then((users) => {
      var usersList = document.querySelector('.users-info');

      if (users.length > 0) {
        var userListElement = document.createElement('ul');

        users.forEach(function (user) {
          var userItem = document.createElement('li');
          userItem.textContent = 'ID: ' + user._id + ', Name: ' + user.name + ', Email: ' + user.email;

          var deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.classList.add('button');
          deleteButton.addEventListener('click', function () {
            deleteUser(user._id);
          });
          userItem.appendChild(deleteButton);

          var editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.classList.add('button');
          editButton.addEventListener('click', function () {
            window.location.href = '/edit-profile';
          });
          userItem.appendChild(editButton);

          userListElement.appendChild(userItem);
        });

        usersList.appendChild(userListElement);
      } else {
        usersList.textContent = 'No users found.';
      }
    })
    .catch((error) => {
      console.error('Error retrieving users:', error);
    });
}

function handleAdminUI(){
  const editButton = document.querySelector('.edit-game-button');
  const addButton = document.querySelector('.add-game-button');
  if(editButton){
    editButton.style.visibility = 'hidden';
  }
  if(addButton){
    addButton.style.visibility = 'hidden';
  }
  adminLink.style.display = "none";

  // Verificar se há um usuário logado no Session Storage
  var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

  if (loggedInUserId) {
    // Enviar uma solicitação GET para obter os dados do perfil do usuário
    fetch('/profile/' + loggedInUserId)
      .then(response => response.json())
      .then(data => {
        // verificar se o usuario e admin
        if (data.user.isAdmin) {
          adminLink.style.display = "block"; // Exibe o link "User Profile"
          if(editButton){
            editButton.style.visibility = 'visible';
          }
          if(addButton){
            addButton.style.visibility = 'visible';
          }
        }
      })
      .catch(error => {
        console.error('Error retrieving user profile:', error);
        alert("Failed to retrieve user profile. Please try again.");
      });
  }
}

function loginListener() {
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Obter os valores do formulário
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    // Fazer uma requisição para o backend para verificar o login do usuário
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.loggedIn) {
          var loggedInUserId = data.userId;

          // Salvar o ID do usuário logado no session Storage
          sessionStorage.setItem("loggedInUserId", JSON.stringify(loggedInUserId));

          window.location.href = "/";
        } else {
          alert("Invalid email or password. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        alert("An error occurred while logging in. Please try again.");
      });
  });
}


function registerListener() {
  document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("password").value;

    // Realizar uma chamada de API para registrar o usuário no servidor
    try {
      const response = await fetch('/registerUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        window.location.href = "/login"; // Redirecionar para a página de login ou qualquer outra página necessária
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to register user');
    }
  });
}

function updateUserProfile() {
  // Verificar se há um usuário logado no Session Storage
  var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

  if (loggedInUserId) {
    // Enviar uma solicitação GET para obter os dados do perfil do usuário
    fetch('/profile/' + loggedInUserId)
      .then(response => response.json())
      .then(data => {
        if (data.user) {
          var user = data.user;

          // Preencher os campos do formulário com os dados do usuário
          if (document.getElementById("userName")) { // se estiver na página de perfil
            document.getElementById("userId").textContent = user._id;
            document.getElementById("isAdmin").textContent = user.isAdmin;
            document.getElementById("userName").textContent = user.name;
            document.getElementById("userEmail").textContent = user.email;
            document.getElementById("userPhone").textContent = user.phone;
          }

          if (document.getElementById("name")) { // se estiver na página de edição de perfil
            document.getElementById("id").value = user._id;
            document.getElementById("isAdmin").checked = user.isAdmin;
            document.getElementById("name").value = user.name;
            document.getElementById("email").value = user.email;
            document.getElementById("phone").value = user.phone;
          }
        } else {
          // Redirecionar para a página de login se o usuário não for encontrado
          window.location.href = "/login";
        }
      })
      .catch(error => {
        console.error('Error retrieving user profile:', error);
        alert("Failed to retrieve user profile. Please try again.");
      });
  } else {
    // Redirecionar para a página de login se o usuário não estiver logado
    window.location.href = "/login";
  }
}

// Atualizar o perfil do usuário
function handleProfileEdit() {
  // Verificar se há um usuário logado no session Storage
  var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

  document.getElementById("editProfileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    var updatedName = document.getElementById("name").value;
    var updatedEmail = document.getElementById("email").value;
    var updatedPhone = document.getElementById("phone").value;

    // Verificar se todos os campos foram preenchidos
    if (updatedName && updatedEmail && updatedPhone) {
      // Enviar uma solicitação PUT para atualizar o perfil do usuário
      fetch('/profile/' + loggedInUserId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: updatedName, email: updatedEmail, phone: updatedPhone })
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === "User profile updated successfully.") {
            alert("Profile saved successfully.");
            // Redirecionar para a página de perfil ou qualquer outra página necessária
            window.location.href = "/user-profile";
          } else {
            alert("Failed to update user profile. Please try again.");
          }
        })
        .catch(error => {
          console.error('Error updating user profile:', error);
          alert("Failed to update user profile. Please try again.");
        });
    } else {
      alert("Please fill in all fields.");
    }
  })
}


function toggleUserProfileLink() {
    var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

    if (loggedInUserId != null) {
      userProfileLink.style.display = "block"; // Exibe o link "User Profile"
    } else {
      userProfileLink.style.display = "none"; // Oculta o link "User Profile"
    }
}

function handleCheckout() { 
  var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

  if (loggedInUserId == null) {
    window.location.href = "/login";
  }
  
  if (!document.querySelector('.cart-item')) {
    alert('Voce não possui nenhum item no carrinho.');
    window.location.href = "/";
  }

  const paymentMethods = `
  <h2>Payments</h2>
  <ul id='list-checkboxes' class='checkout-options'>
    <li class='type-card'>
      <input type='checkbox' value='card'>
      <label>Credit/Debit Card</label>
    </li>
    <li class='type-paypal'>
      <input type='checkbox' value='paypal'>
      <label>Paypal</label>
    </li>
    <li class='type-pix'>
      <input type='checkbox' value='pix'>
      <label>Pix</label>
    </li>
  </ul>`;

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

// Função para adicionar um novo jogo
function addGame(event) {
  event.preventDefault();

  // Obter os valores dos campos do formulário
  var id = document.getElementById("_id").value;
  var name = document.getElementById("name").value;
  var description = document.getElementById("description").value;
  var price = document.getElementById("price").value;
  var image = document.getElementById("game-thumbnail").files[0];
  var isFeatured = document.getElementById("isFeatured").checked;
  var isGameOfTheYear = document.getElementById("isGameOfTheYear").checked;
  var genre = document.getElementById("genre").value;
  var platform = document.getElementById("platform").value;

  var formData = new FormData();
  formData.append("id", id);
  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("quantidade", 100);
  formData.append("isFeatured", isFeatured);
  formData.append("isGameOfTheYear", isGameOfTheYear);
  formData.append("genre", genre);
  formData.append("platform", platform);
  formData.append("image", image);

  // Enviar uma requisição POST para a rota de adicionar jogo
  fetch("/games/add", {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      // Exibir uma mensagem de sucesso
      alert("Game added successfully!");

      // Redirecionar para a página de administração
      window.location.href = "/admin-page";
    })
    .catch(error => {
      console.error("Error adding game:", error);
    });
}

async function populateGameEdit(gameId) {
  try {
    const response = await fetch(`/games/id/${gameId}`);
    if (!response.ok) {
      throw new Error('Game not found');
    }
    const game = await response.json();

    document.getElementById("_id").value = game._id
    document.getElementById('name').value = game.name;
    document.getElementById('description').value = game.description;
    document.getElementById('price').value = game.price;
    document.getElementById('quantidade').value = game.quantidade;
    document.getElementById('isGameOfTheYear').checked = game.isGameOfTheYear;
    document.getElementById('isFeatured').checked = game.isFeatured;
    document.getElementById('genre').value = game.genre;
    document.getElementById('platform').value = game.platform;

  } catch (error) {
    console.error('Error setting initial values:', error);
    // Lógica para lidar com o erro, como exibir uma mensagem de erro na página.
  }
}

async function updateGame(gameId) {
  try {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;

    const updatedData = {
      name: name,
      description: description,
      price: parseFloat(price)
      // Adicione outras propriedades que você deseja atualizar
    };

    const response = await fetch(`/games/id/${gameId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    });

    window.location.href = `/game-details?id=${gameId}`;
  } catch (error) {
    console.error('Error updating game:', error);
    // Lógica para lidar com o erro, como exibir uma mensagem de erro na página.
  }
}

async function deleteGame(gameId) {
  try {
    const response = await fetch(`/games/id/${gameId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Error deleting game');
    }

    window.location.href = "/";
  } catch (error) {
    console.error('Error deleting game:', error);
    // Lógica para lidar com o erro, como exibir uma mensagem de erro na página.
  }
}