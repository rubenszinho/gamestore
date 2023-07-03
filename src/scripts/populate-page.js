async function populatePage(pagName) {
    const searchParams = new URLSearchParams(window.location.search);
    const searchText = searchParams.get('search');
    const id = searchParams.get('id');

    switch (pagName) {
        case '/search':
            await populateSearchPage(searchText);
            break;

        case '/game-details':
            // handleAdminUI();
            await populateGameDetailsPage(id)
            break;

        case '/my-cart':
            await populateCartPage()
            break;

        case '/':
            // handleAdminUI();
            await populateHomePage()
            break;

        case '/user-profile':
            updateUserProfile(id);
            break;

        case '/edit-profile':
            updateUserProfile(id);
            handleProfileEdit(id);
            break;

        case '/admin-users-list':
            populateUsersList();
            break;

        case '/admin-page':
            populateAdminPage();
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
            populateGameEdit(id);
            document.getElementById("editGameForm").addEventListener("submit", (e) => {
                e.preventDefault();
                updateGame(id);
            });
            document.getElementById("game-delete-button").addEventListener("click", (e) => {
                e.preventDefault();
                deleteGame(id);
            });
            break;

        case '/forgot-password':
            handleForgotPassword();
        default:
            //handleAdminUI();
            //await populateHomePage()
            break;
    }
}

async function populateSearchPage(searchText) {
    try {
        let response;
        if (searchText == null) {
            response = await fetch(`/games/search/*`);
        } else {
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
            gameImg.src = `/games/image/${gameId}`;
            imgDiv.appendChild(gameImg);

            document.querySelector('.game-details__title').textContent = game.name;
            document.querySelector('.game-details__description').innerHTML = game.description;
            document.querySelector('.game-details__price').textContent = `\$${game.price}`;

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
                        window.location.href = `/edit-profile?id=${user._id}`;
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

function populateAdminPage() {
    const numJogosElement = document.getElementById('numJogos');
    const numUsersElement = document.getElementById('numUsers');

    // Obter a quantidade de jogos cadastrados
    fetch('/games/count')
        .then(response => response.json())
        .then(data => {
            if (data.count) {
                numJogosElement.textContent = `Jogos cadastrados: ${data.count}`;
            }
        })
        .catch(error => console.error('Erro ao obter a quantidade de jogos:', error));

    // Obter a quantidade de usuários cadastrados
    fetch('/users/count')
        .then(response => response.json())
        .then(data => {
            if (data.count) {
                numUsersElement.textContent = `Usuários cadastrados: ${data.count}`;
            }
        })
        .catch(error => console.error('Erro ao obter a quantidade de usuários:', error));
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

function updateUserProfile(userId) {
    if (userId) {
        // Enviar uma solicitação GET para obter os dados do perfil do usuário
        fetch('/profile/' + userId)
            .then(response => response.json())
            .then(data => {
                if (data.user) {
                    var user = data.user;

                    // Preencher os campos do formulário com os dados do usuário
                    if (document.getElementById("userName")) { // se estiver na página de perfil
                        document.getElementById("userName").textContent = user.name;
                        document.getElementById("userEmail").textContent = user.email;
                        document.getElementById("userPhone").textContent = `Phone: ${user.phone}`;
                        document.getElementById("editProfileButton").href = `/edit-profile?id=${user._id}`;
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
function handleProfileEdit(userId) {
    document.getElementById("editProfileForm").addEventListener("submit", (e) => {
        e.preventDefault();

        var updatedName = document.getElementById("name").value;
        var updatedEmail = document.getElementById("email").value;
        var updatedPhone = document.getElementById("phone").value;

        // Verificar se todos os campos foram preenchidos
        if (updatedName && updatedEmail && updatedPhone) {
            // Enviar uma solicitação PUT para atualizar o perfil do usuário
            fetch('/profile/' + userId, {
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
