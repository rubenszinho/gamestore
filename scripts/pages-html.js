const admin_game_add = `
<div class="container">
    <h1 class="title">Add Game</h1>
    <form id="editGameForm" class="edit-game-form">
        <div>
            <label for="_id">Game ID</label>
            <input type="number" id="_id" class="edit-profile-input" required />
        </div>
        <div>
            <label for="name">Game Name</label>
            <input type="text" id="name" class="edit-profile-input" required />
        </div>
        <div>
            <label for="price">Game Price</label>
            <input type="number" id="price" class="edit-profile-input" required />
        </div>
        <div>
            <label for="quantidade">Game Quantity</label>
            <input type="number" id="quantidade" class="edit-profile-input" required />
        </div>
        <div>
            <label for="description">Game Description</label>
            <input type="text" id="description" class="edit-profile-input" required />
        </div>
        <div>
            <label for="game-thumbnail">Game Image</label>
            <input type="file" id="game-thumbnail" name="image" accept="image/jpeg" required><br>
        </div>
        <div>
            <label for="isGameOfTheYear">Is Game of the Year?</label>
            <input type="checkbox" id="isGameOfTheYear" class="edit-profile-input">
        </div>
        <div>
            <label for="isFeatured">Is Featured?</label>
            <input type="checkbox" id="isFeatured" class="edit-profile-input">
        </div>
        <div>
            <label for="genre">Genre</label>
            <select id="genre" class="edit-profile-input">
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Puzzle">Puzzle</option>
                <option value="RPG">RPG</option>
                <option value="Simulation">Simulation</option>
                <option value="Strategy">Strategy</option>
                <option value="Sports">Sports</option>
                <option value="MMO">MMO</option>
            </select>
        </div>
        <div>
            <label for="platform">Platform</label>
            <select id="platform" class="edit-profile-input">
                <option value="PC">PC</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Xbox">Xbox</option>
            </select>
        </div>
        <div>
            <button type="submit" class="button">Submit</button>
        </div>
    </form>
</div>`;

const admin_game_edit = `
<div class="container">
    <h1 class="title">Edit Game</h1>
    <form id="editGameForm" class="edit-game-form">
        <div>
            <label for="_id">Game ID</label>
            <input type="number" id="_id" class="edit-profile-input" readonly required />
        </div>
        <div>
            <label for="name">Game Name</label>
            <input type="text" id="name" class="edit-profile-input" required />
        </div>
        <div>
            <label for="price">Game Price</label>
            <input type="number" id="price" class="edit-profile-input" required />
        </div>
        <div>
            <label for="quantidade">Quantity</label>
            <input type="number" id="quantidade" class="edit-profile-input" required />
        </div>
        <div>
            <label for="description">Game Description</label>
            <textarea id="description" class="edit-profile-input" required></textarea>
        </div>
        <div>
            <label for="image">Game Image</label>
            <input type="file" id="image" name="image" accept="image/*"><br>
        </div>
        <div>
            <label for="isGameOfTheYear">Game of the Year</label>
            <input type="checkbox" id="isGameOfTheYear" class="edit-profile-input">
        </div>
        <div>
            <label for="isFeatured">Featured Game</label>
            <input type="checkbox" id="isFeatured" class="edit-profile-input">
        </div>
        <div>
            <label for="genre">Genre</label>
            <select id="genre" class="edit-profile-input">
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Puzzle">Puzzle</option>
                <option value="RPG">RPG</option>
                <option value="Simulation">Simulation</option>
                <option value="Strategy">Strategy</option>
                <option value="Sports">Sports</option>
                <option value="MMO">MMO</option>
            </select>
        </div>
        <div>
            <label for="platform">Platform</label>
            <select id="platform" class="edit-profile-input">
                <option value="PC">PC</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Xbox">Xbox</option>
            </select>
        </div>
        <div>
            <button type="submit" class="button">Submit</button>
        </div>
    </form>
    <div>
        <button id="game-delete-button" class="button">Delete</button>
    </div>
</div>`;

const admin_page = `
<div class="container">
    <h1 class="title">Admin Page</h1>
    <div class="admin-info">
    <div>
        <p class="valor-vendas-id" id="valorVendas">Renda: 10000000,00 </p>
        <p class="num-vendas-id" id="numVendas">Vendas: 1000000 </p>
        <p class="num-jogos-id" id="numJogos">Jogos cadastrados: 1000 </p>
        <p class="num-users-id" id="numUsers">Usuarios cadastrados: 100 </p>
    </div>
    </div>
    <a class="button" onclick="changeContent('/admin-users-list')"">Users List</a>
</div>`

const admin_users_list = `
<div class="container">
    <h1 class="title">Users List</h1>
    <div class="users-info">
        <div>
        </div>
    </div>
</div>`

const edit_profile = `
<div class="container">
    <form id="editProfileForm" class="edit-profile-form">
        <div>
            <label for="id">ID</label>
            <input type="text" id="id" disabled />
        </div>
        <div>
            <label for="isAdmin">Admin</label>
            <input type="checkbox" id="isAdmin" disabled />
        </div>
        <div>
            <label for="name">Name</label>
            <input type="text" id="name" class="edit-profile-input" required />
        </div>
        <div>
            <label for="email">Email</label>
            <input type="email" id="email" class="edit-profile-input" required />
        </div>
        <div>
            <label for="phone">Phone</label>
            <input type="text" id="phone" class="edit-profile-input" required />
        </div>
        <div>
            <button type="submit" class="button">Save</button>
        </div>
    </form>
</div>`

const forgot_password = `
<div class="recovery-container">
    <h1 class="title">Password Recovery</h1>
    <form id="recoveryForm" class="auth-form">
        <div>
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" required>
        </div>

        <div>
            <label for="phone">Phone</label>
            <input type="tel" id="phone" placeholder="Enter your phone" required>
        </div>

        <div>
            <label for="password">New password</label>
            <input type="password" id="password" placeholder="Enter your new password" required>
        </div>
        
        <div>
            <label for="password">Check password</label>
            <input type="password" id="check-password" placeholder="Enter your new password again" required>
        </div>

        <button type="submit" class="button">Change Password</button>
    </form>
</div>`

const game_details = `
<div class="container">
    <div class="game-details">
    <div class="game-details__image"></div>
    <div class="game-details__info">
        <h1 class="game-details__title"></h1>
        <p class="game-details__description"></p>
        <p class="game-details__price">$0</p>
        <p class="game-details__stock"></p>
        <a class="button">Add to Cart</a>
    </div>
    </div>
</div>
    <div class="edit-game-button" id="edit-game-button">
        <div class="edit-game-button__plus">
        <span class="material-symbols-outlined">edit</span>
        </div>
    </div>
</div>`

const login = `
<div class="login-container">
    <h1 class="title">Login</h1>
    <form id="loginForm" class="auth-form">
        <div>
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" required>
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required>
            <p style="text-align: end;">Forgot password? <a onclick="changeContent('/forgot-password')">Click here</a></p>
        </div>
        <button type="submit" class="button">Login</button>
    </form>
    <p>Don't have an account? <a onclick="changeContent('/register')">Register here</a></p>
</div>`

const my_cart = `
<div class="container">
    <h1 class="title">My Cart</h1>
    <div class="cart-items"></div>
    <div class="cart-summary">
        <h2>Total:</h2>
        <p class="cart-total-price">$0</p>
        <button class="button" onclick="handleCheckout()">Checkout</button>
    </div>
</div>

<div id="checkout" class="container checkout">
    <div class="checkout-options"></div>
    <div class="checkout-info"></div>
    <div class="checkout-confirm"></div>
</div>`

const register = `
<div class="register-container">
    <h1 class="title">Register</h1>
    <form id="registerForm" class="auth-form">
        <div>
            <label for="name">Name</label>
            <input type="text" id="name" placeholder="Enter your name" required>
        </div>

        <div>
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" required>
        </div>

        <div>
            <label for="phone">Phone</label>
            <input type="tel" id="phone" placeholder="Enter your phone" required>
        </div>

        <div>
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required>
        </div>
        
        <div>
            <label for="password">Check password</label>
            <input type="password" id="check-password" placeholder="Enter your password again" required>
        </div>

        <button type="submit" class="button">Register</button>
    </form>
    <p>Already have an account? <a onclick="changeContent('/login')">Login here</a></p>
</div>`

const search = `
<div class="container">
    <div class="search-content">
    <div class="filter-sidebar">
        <div class="filter-section">
            <h3>Genre</h3>
            <div class="filter-item">
                <input type="checkbox" id="genre-action" />
                <label for="genre-action">Action</label>
            </div>
            <div class="filter-item">
                <input type="checkbox" id="genre-adventure" />
                <label for="genre-adventure">Adventure</label>
            </div>
            <div class="filter-item">
                <input type="checkbox" id="genre-puzzle" />
                <label for="genre-puzzle">Puzzle</label>
            </div>
            <div class="filter-item">
                <input type="checkbox" id="genre-rpg" />
                <label for="genre-rpg">RPG</label>
            </div>
            <div class="filter-item">
                <input type="checkbox" id="genre-simulation" />
                <label for="genre-simulation">Simulation</label>
            </div>
            <div class="filter-item">
                <input type="checkbox" id="genre-strategy" />
                <label for="genre-strategy">Strategy</label>
            </div>
            <div class="filter-item">
                <input type="checkbox" id="genre-sports" />
                <label for="genre-sports">Sports</label>
            </div>
            <div class="filter-item">
                <input type="checkbox" id="genre-mmo" />
                <label for="genre-mmo">MMO</label>
            </div>
        </div>
        <div class="filter-section">
            <h3>Platform</h3>
            <div class="filter-item">
                <input type="checkbox" id="platform-pc" />
                <label for="platform-pc">PC</label>
            </div>
            <div class="filter-item">
                <input type="checkbox" id="platform-ps" />
                <label for="platform-ps">PlayStation</label>
            </div>
            <div class="filter-item">
                <input type="checkbox" id="platform-xbox" />
                <label for="platform-xbox">Xbox</label>
            </div>
        </div>
    </div>
    <div class="search-results-container"> <!-- Adicione esta linha -->
        <h1 class="title">Search Results</h1>
        <div class="grid-container search-results"></div>
    </div> <!-- Adicione esta linha -->
    </div>
</div>`

const user_profile = `
<div class="container">
    <h1 class="title">User Profile</h1>
    <div class="user-info">
    <img class="user-avatar" src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png" alt="User Avatar">
    <div>
        <h2 class="user-name" id="userName"></h2>
        <p class="user-email" id="userEmail"></p>
        <p class="user-phone" id="userPhone">Phone: </p>
    </div>
    </div>
    <a id="editProfileButton" class="button" onclick="changeContent('/edit-profile')">Edit Profile</a>
    <button class="button" onclick="logout()" >Log out</button>
</div>
</div>`

const home = `
<div class="limit-container">
    <div class="container">
        <h1 class="title">Featured & Recommended Games</h1>
        <div class="carousel-container">
        <div class="carousel-slide"></div>
        <button class="carousel-button carousel-button--left">
            <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <button class="carousel-button carousel-button--right">
            <span class="material-symbols-outlined">arrow_forward</span>
        </button>
        </div>
    </div>
    <div class="container">
        <h1 class="title">New Releases</h1>
        <div class="grid-container new-releases"></div>
    </div>
    <div class="container">
        <h1 class="title">Top Games of the Year</h1>
        <div class="grid-container top-games"></div>
    </div>
    <a onclick="changeContent('/admin-game-add')">
        <div class="add-game-button">
        <div class="add-game-button__plus">+</div>
        </div>
    </a>
</div>`

function pageContent(pagName) {

    switch (pagName) {
        case '/search':
            document.getElementById('page-content').innerHTML = search;
            break;

        case '/game-details':
            document.getElementById('page-content').innerHTML = game_details;
            break;

        case '/my-cart':
            document.getElementById('page-content').innerHTML = my_cart;
            break;

        case '/':
            document.getElementById('page-content').innerHTML = home;
            break;

        case '/user-profile':
            document.getElementById('page-content').innerHTML = user_profile;
            break;

        case '/edit-profile':
            document.getElementById('page-content').innerHTML = edit_profile;
            break;

        case '/admin-users-list':
            document.getElementById('page-content').innerHTML = admin_users_list;
            break;

        case '/admin-page':
            document.getElementById('page-content').innerHTML = admin_page;
            break;

        case '/login':
            document.getElementById('page-content').innerHTML = login;
            break;

        case '/register':
            document.getElementById('page-content').innerHTML = register;
            break;

        case '/admin-game-add':
            document.getElementById('page-content').innerHTML = admin_game_add;
            break;

        case '/admin-game-edit':
            document.getElementById('page-content').innerHTML = admin_game_edit
            break;

        case '/forgot-password':
            document.getElementById('page-content').innerHTML = forgot_password

        default:
            //document.getElementById('page-content').innerHTML = '';
            break;
    }
}