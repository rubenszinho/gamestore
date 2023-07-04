
function createGameCard(game) {
  const gameCard = document.createElement('div');
  gameCard.classList.add('game-card');
  gameCard.setAttribute('game-id', game._id);
  gameCard.onclick = onGameClick;
  gameCard.className = 'game-card';

  const thumbnail = document.createElement('div');
  thumbnail.className = 'game-card__thumbnail';
  thumbnail.style.backgroundImage = `url(/games/image/${game._id})`;
  thumbnail.alt = game.name;

  const content = document.createElement('div');
  content.className = 'game-card__content';

  const title = document.createElement('h3');
  title.className = 'game-card__title';
  title.textContent = game.name;

  const price = document.createElement('span');
  price.className = 'game-card__price';
  price.textContent = `\$${game.price}`; 

  thumbnail.appendChild(price); // Add price to thumbnail instead of content
  content.appendChild(title);

  gameCard.appendChild(thumbnail);
  gameCard.appendChild(content);

  return gameCard;
}

function createBanner(game) {
  const banner = document.createElement('div');
  banner.classList.add('banner');
  banner.style.backgroundImage = `url(/games/image/${game._id})`;

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
  itemImg.src = `/games/image/${game._id}`;
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
          changeContent('/my-cart');
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
  //changeContent(`/game-details?id=${encodeURIComponent(gameId)}`)
  window.location.href = `/game-details?id=${encodeURIComponent(gameId)}`;
}

function onEditClick(gameId) {
  //changeContent(`/admin-game-edit?id=${encodeURIComponent(gameId)}`)
  window.location.href = `/admin-game-edit?id=${encodeURIComponent(gameId)}`;
}

async function addToCart(event) {
  const gameId = event.currentTarget.getAttribute('game-id');
  var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

  // PEGAR INFO DO JOGO E VER SE TEM 1 NO ESTOQUE AINDA
  try {
    const response = await fetch(`/games/id/${gameId}`);
    if (response.ok) {
        const game = await response.json();
        console.log(game);

        if (game.quantidade > 0) {
          fetch(`/users/${loggedInUserId}/cart/add/${gameId}`, { method: 'POST' })
          .then((response) => response.json())
          .then((data) => {
            changeContent('/my-cart');
            alert("Success");
          })
          .catch((error) => {
            console.error('Error adding game to cart:', error);
          });
        } else {
          alert('Não há mais chave para esse jogo no estoque!');
        }
    } else {
        console.error('Error getting game:', response.status);
        // Handle error case when game is not found
    }
  } catch (error) {
    console.error('Error getting game:', error);
    // Handle error case
  }
}

// Chamada da função ao carregar a página
window.addEventListener("load", toggleUserProfileLink);
window.addEventListener("load", handleAdminUI);

function toggleUserProfileLink() {
  var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

  if (loggedInUserId != null) {
      userProfileLink.style.display = "block"; // Exibe o link "User Profile"
      userProfileLink.href = `/user-profile?id=${loggedInUserId}`;
  } else {
      userProfileLink.style.display = "none"; // Oculta o link "User Profile"
  }
}

function handleAdminUI() {
  const editButton = document.querySelector('.edit-game-button');
  const addButton = document.querySelector('.add-game-button');
  if (editButton) {
      editButton.style.visibility = 'hidden';
  }
  if (addButton) {
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
                  if (editButton) {
                      editButton.style.visibility = 'visible';
                  }
                  if (addButton) {
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

/* TEMA */
let currentTheme = "light";

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  // Definir um cookie com o tema selecionado que expira em 365 dias
  document.cookie = `currentTheme=${theme}; expires=${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()}; SameSite=Strict`;
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
