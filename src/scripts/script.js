
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

function addToCart(event) {
  const gameId = event.currentTarget.getAttribute('game-id');
  var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

  fetch(`/users/${loggedInUserId}/cart/add/${gameId}`, { method: 'POST' })
    .then((response) => response.json())
    .then((data) => {
      changeContent('/my-cart');
      alert("Success");
    })
    .catch((error) => {
      console.error('Error adding game to cart:', error);
    });
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

/* CHECKOUT FUNCTIONS */
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
    <img src="/assets/cartao.png" alt="cartao">
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
    <img src="/assets/qrcode.png" alt="qrcode">
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
     <img class="checkout-info-paypal-img" src="/assets/paypal.png" alt="paypal-site" href="https://paypal.com">
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

function handleCheckout() { 
  var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

  if (loggedInUserId == null) {
    changeContent('/login');
  }
  
  if (!document.querySelector('.cart-item')) {
    alert('Voce não possui nenhum item no carrinho.');
    changeContent('/');
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
