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

  document.getElementById('copyButton').addEventListener('click', function () {
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
    confirmation += '<button class="button" onclick="confirmCheckout()">Waiting for the payment server...</button>'
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

  // altera as infos no estoque
  handleStock(loggedInUserId);

  fetch(`/users/${loggedInUserId}/cart/all`, { method: 'DELETE' })
    .then((response) => response.json())
    .then((data) => {
      alert('Success.');
      changeContent('/my-cart')
    })
    .catch((error) => {
      console.error('Error confirming checkout:', error);
      alert('An error occurred while confirming the checkout.');
    });
}

async function handleCheckout() {
  var loggedInUserId = JSON.parse(sessionStorage.getItem("loggedInUserId"));

  if (loggedInUserId == null) {
    changeContent('/login');
  }

  if (!document.querySelector('.cart-item')) {
    alert('Voce não possui nenhum item no carrinho.');
    changeContent('/');
  }

  try {
    const response = await fetch(`/users/${loggedInUserId}/cart`);
    const cartItems = await response.json();

    cartItems.forEach(async (item) => {
      try {
        const gameResponse = await fetch(`/games/id/${item}`);
        const game = await gameResponse.json();
        if (game.quantidade <= 0) {
          alert(`O jogo ${game.name} não está mais em estoque, retire-o do carrinho para continuar a compra!`);
          changeContent('/my-cart');
        }
      } catch (error) {
        console.error('Error retrieving game from cart:', error);
      }
    });
  } catch (error) {
    console.error('Error retrieving cart items:', error);
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
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      document.querySelector('.checkout-info').innerHTML = ''; // retira o pagamento q estava antes
      document.querySelector('.checkout-confirm').innerHTML = '';
      if (this.checked) {
        checkboxes.forEach(function (otherCheckbox) {
          if (otherCheckbox !== checkbox) {
            otherCheckbox.checked = false;
          }
        });
        showPaymentMethod(this);
      }
    });
  });
}

async function handleStock(loggedInUserId) {
  // FAZER UM POST PARA DIMINUIR A QTT COMPRADA NO ESTOQUE DO JOGO
  try {
    const response = await fetch(`/users/${loggedInUserId}/cart`);
    const cartItems = await response.json();

    cartItems.forEach(async (item) => {
      try {
        const gameResponse = await fetch(`/games/id/${item}`);
        const game = await gameResponse.json();
        let new_qtt = game.quantidade - 1;

        const formData = new FormData();
        formData.append("_id", game._id);
        formData.append("name", game.name);
        formData.append("description", game.description);
        formData.append("price", game.price);
        formData.append("quantidade", new_qtt);
        formData.append("isGameOfTheYear", game.isGameOfTheYear);
        formData.append("isFeatured", game.isFeatured);
        formData.append("genre", game.genre);
        formData.append("platform", game.platform);
        formData.append("image", game.image);
        
        await fetch(`/games/id/${game._id}`, {
          method: "PUT",
          body: formData,
        });


      } catch (error) {
        console.error('Error to update the stock:', error);
      }
    });
  } catch (error) {
    console.error('Error to update the stock:', error);
  }
}