const API_KEY = "d25aa82587884b22824222c27300a44d";
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
    localStorage.setItem('cart-items', JSON.stringify(newItens));
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
    case '/search':
      await populateSearchPage(searchText);
      break;
    
    case '/game-details':
      handleAdminUI();
      await populateGameDetailsPage(gameId)
      break;

    case '/my-cart':
      await populateCartPage()
      break;

    case '/':
      handleAdminUI();
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

    default:
      //handleAdminUI();
      //await populateHomePage()
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

  if (cartItems) {
    cartItems.forEach(async (item) => {
      const game = await fetchGames({ id: item })
      const cartItem = createCartItem(game)
      items.appendChild(cartItem) 
      
      totalPrice = Number(totalPrice) + Number(cartItem.getAttribute('game-price'));
      document.querySelector('.cart-total-price').innerHTML = `$${totalPrice}`
    })
  }

}

async function populateHomePage() {
  const featuredGames = await fetchGames();
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

function addToCart(event) {
  const gameId = event.currentTarget.getAttribute('game-id');
  let cartItems = JSON.parse(localStorage.getItem('cart-items'))

    if (cartItems) {
      if (!cartItems.includes(gameId)) {
        cartItems.push(gameId)
      } else {
        alert('Jogo já está no carrinho')
      }
    } else {
      cartItems = [gameId]
    }
    localStorage.setItem('cart-items', JSON.stringify(cartItems))

  window.location.href = '/my-cart'
}

function updateUserProfile() {
  // Verificar se há um usuário logado no Session Storage
  var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

  // Obter a lista de usuários do Session Storage
  var userList = JSON.parse(sessionStorage.getItem("users"));

  // Verificar se o usuário está logado
  if (loggedInUserId != null) {
      // Procurar o usuário logado na lista de usuários
      var user = userList.find(function (user) {
          return user.id == loggedInUserId;
      });

      // Verificar se o usuário foi encontrado
      if (user) {
          // Preencher os campos do formulário com os dados do usuário
          if (document.getElementById("userName")) { // se estiver na pagina de perfil
            document.getElementById("userId").textContent = user.id;
            document.getElementById("isAdmin").textContent = user.isAdmin;
            document.getElementById("userName").textContent = user.name;
            document.getElementById("userEmail").textContent = user.email;
            document.getElementById("userPhone").textContent = user.phone;
          }

          if (document.getElementById("name")) { // se estiver na pagina de edição de perfil
            document.getElementById("id").value = user.id;
            document.getElementById("isAdmin").checked = user.isAdmin;
            document.getElementById("name").value = user.name;
            document.getElementById("email").value = user.email;
            document.getElementById("phone").value = user.phone;
          }
      } else {
          // Redirecionar para a página de login se o usuário não for encontrado
          window.location.href = "/login";
      }
  } else {
      // Redirecionar para a página de login se o usuário não estiver logado ou a lista de usuários estiver vazia
      window.location.href = "/login";
  }
}

function handleProfileEdit() {
  // Verificar se há um usuário logado no session Storage
  var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

  // Obter a lista de usuários do session Storage
  var userList = JSON.parse(sessionStorage.getItem("users"));

  document.getElementById("editProfileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    var updatedName = document.getElementById("name").value;
    var updatedEmail = document.getElementById("email").value;
    var updatedPhone = document.getElementById("phone").value;
    // Atualizar os dados do usuário na lista de usuários
    var updatedUserIndex = userList.findIndex(function (user) {
        return user.id == loggedInUserId;
    });


    if (updatedName && updatedEmail && updatedPhone) {
      if (updatedUserIndex !== -1) {
          userList[updatedUserIndex].name = updatedName;
          userList[updatedUserIndex].email = updatedEmail;
          userList[updatedUserIndex].phone = updatedPhone;
          sessionStorage.setItem("users", JSON.stringify(userList));

          // Atualizar o usuário no session Storage, se necessário
          var userInSessionStorage = JSON.parse(sessionStorage.getItem("user"));

          if (userInSessionStorage && userInSessionStorage.id === loggedInUserId) {
              userInSessionStorage.name = updatedName;
              userInSessionStorage.email = updatedEmail;
              userInSessionStorage.phone = updatedPhone;
              sessionStorage.setItem("user", JSON.stringify(userInSessionStorage));
              alert("Profile saved successfully.");
          }
      }
      window.location.href = '/user-profile';
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

function toggleAdminLink() {
    adminLink.style.display = "none"; // Oculta o link "User Profile"
    var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

    // Obter a lista de usuários do session Storage
    var userList = JSON.parse(sessionStorage.getItem("users"));

    // Verificar se o usuário está logado
    if (loggedInUserId != null) {
        // Procurar o usuário logado na lista de usuários
        var user = userList.find(function (user) {
            return user.id == loggedInUserId;
        });

        // Verificar se o usuário foi encontrado
        if (user) {
          // verificar se o usuario e admin
          if(user.isAdmin){
            adminLink.style.display = "block"; // Exibe o link "User Profile"
          }
        }
    }
}

// Chamada da função ao carregar a página
window.addEventListener("load", toggleUserProfileLink);
window.addEventListener("load", toggleAdminLink);


function handleCheckout() { 
  var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

  if (loggedInUserId == null) {
    window.location.href = "/login";
  }
  
  if (!document.querySelector('.cart-item')) {
    alert('Voce não possui nenhum item no carrinho.');
    window.location.href = "/index";
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
  const noItensCart = [];
  localStorage.setItem('cart-items', JSON.stringify(noItensCart));

  alert("A sua compra foi confirmada!");
  window.location.reload();
}

function logout() {
  // Salvar o usuário atualizado no session Storage
  sessionStorage.setItem("loggedInUserId", null);

  // Redirecionar para a página de login
  window.location.href = "/login";
}

// Função para deletar um usuário
function deleteUser(userId) {
  // Obtém os dados de usuários armazenados na sessionStorage
  var usersData = sessionStorage.getItem('users');

  // Verifica se há dados de usuários armazenados
  if (usersData) {
    // Converte os dados de usuários de uma string JSON para um objeto JavaScript
    var users = JSON.parse(usersData);

    // Encontra o índice do usuário com base no userId
    var userIndex = users.findIndex(function(user) {
      return user.id === userId;
    });

    // Verifica se o usuário foi encontrado
    if (userIndex !== -1) {
      // Remove o usuário do array de usuários
      users.splice(userIndex, 1);

      // Atualiza os dados de usuários na sessionStorage
      sessionStorage.setItem('users', JSON.stringify(users));

      // Recarrega a página para refletir a remoção do usuário
      location.reload();
    }
  }
}

function populateUsersList(){
  // Obtém os dados de usuários armazenados na sessionStorage
  var usersData = sessionStorage.getItem('users');
  // Verifica se há dados de usuários armazenados
  if (usersData) {
    // Converte os dados de usuários de uma string JSON para um objeto JavaScript
    var users = JSON.parse(usersData);

    // Seleciona o elemento HTML onde a lista de usuários será exibida
    var usersList = document.querySelector('.users-info');

    // Verifica se há usuários para exibir
    if (users.length > 0) {
      // Cria uma lista não ordenada para exibir os usuários
      var userListElement = document.createElement('ul');

      // Itera sobre cada usuário e cria um item de lista para cada um
      users.forEach(function(user) {
        var userItem = document.createElement('li');
        userItem.textContent = 'ID: ' + user.id + ', Name: ' + user.name + ', Email: ' + user.email;

        // Cria botão de deletar
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('button');
        deleteButton.addEventListener('click', function() {
          // Chama a função para deletar o usuário
          deleteUser(user.id);
        });
        userItem.appendChild(deleteButton);

        // Cria botão de editar
        var editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('button');
        editButton.addEventListener('click', function() {
          // Redireciona para a página de edição do perfil do usuário
          window.location.href = '/edit-profile';
        });
        userItem.appendChild(editButton);

        userListElement.appendChild(userItem);
      });

      // Adiciona a lista de usuários ao elemento HTML
      usersList.appendChild(userListElement);
    } else {
      // Caso não haja usuários, exibe uma mensagem informando isso
      usersList.textContent = 'No users found.';
    }
  } else {
    // Caso não haja dados de usuários armazenados, exibe uma mensagem informando isso
    var usersList = document.querySelector('.users-info');
    usersList.textContent = 'No user data found in sessionStorage.';
  }
}

function handleAdminUI(){
  // Verificar se há um usuário logado no session Storage
  var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

  // Obter a lista de usuários do session Storage
  var userList = JSON.parse(sessionStorage.getItem("users"));

  const editButton = document.querySelector('.edit-game-button');
  const addButton = document.querySelector('.add-game-button');
  if(editButton){
    editButton.style.visibility = 'hidden';
  }
  if(addButton){
    addButton.style.visibility = 'hidden';
  }

  // Verificar se o usuário está logado
  if (loggedInUserId != null) {
      // Procurar o usuário logado na lista de usuários
      var user = userList.find(function (user) {
          return user.id == loggedInUserId;
      });

      // Verificar se o usuário foi encontrado
      if (user) {
        // verificar se o usuario e admin
        if(user.isAdmin){
          if(editButton){
            editButton.style.visibility = 'visible';
          }
          if(addButton){
            addButton.style.visibility = 'visible';
          }
        }
      }
  }
}

function loginListener(){
  document.getElementById("loginForm").addEventListener("submit", function (e) {
      e.preventDefault();

      // Obter os valores do formulário
      var email = document.getElementById("email").value;
      var password = document.getElementById("password").value;

      // Obter a matriz de usuários do session Storage
      var users = JSON.parse(sessionStorage.getItem("users")) || [];

      // Verificar se existe um usuário com o email e senha fornecidos
      var loggedInUser = users.find(function (user) {
          return user.email === email && user.password === password;
      });

      if (loggedInUser) {
          // Salvar o ID do usuário logado no session Storage
          sessionStorage.setItem("loggedInUserId", JSON.stringify(loggedInUser.id));

          window.location.href = "/";
      } else {
          alert("Invalid email or password. Please try again.");
      }
  });
}

function registerListener(){
  document.getElementById("registerForm").addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("name").value;
      var email = document.getElementById("email").value;
      var phone = document.getElementById("phone").value;
      var password = document.getElementById("password").value;

      // Verificar se já existe um usuário com o mesmo email ou telefone
      var users = JSON.parse(sessionStorage.getItem("users")) || [];
      var existingUser = users.find(function (user) {
          return user.email === email || user.phone === phone;
      });

      if (existingUser) {
          alert("User with the same email or phone already exists.");
          return;
      }

      // Criar um novo objeto de usuário
      var newUser = {
          id: phone,
          isAdmin: false,
          name: name,
          email: email,
          phone: phone,
          password: password
      };

      // Adicionar o novo usuário à matriz
      users.push(newUser);

      // Armazenar a matriz de usuários atualizada no session Storage
      sessionStorage.setItem("users", JSON.stringify(users));

      alert("Registration successful. You can now login.");

      // Redirecionar para a página de login ou qualquer outra página necessária
      window.location.href = "/login";
  });
}