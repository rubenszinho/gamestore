function logout() {
    // Salvar o usuário atualizado no session Storage
    sessionStorage.setItem("loggedInUserId", null);

    // Redirecionar para a página de login
    window.location.href = "/login";
}

function handleForgotPassword() {
    document.getElementById("recoveryForm").addEventListener("submit", function (e) {
        e.preventDefault();

        var email = document.getElementById("email").value;
        var phone = document.getElementById("phone").value;
        var password = document.getElementById("password").value;
        var checkPassword = document.getElementById("check-password").value;

        if (password !== checkPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Obter a lista de usuários do session Storage
        var userList = JSON.parse(sessionStorage.getItem("users"));

        // Atualizar a senha no objeto de usuário correspondente
        var user = userList.find(function (user) {
            return user.email === email && user.phone === phone;
        });

        if (user) {
            user.password = password;
            sessionStorage.setItem("users", JSON.stringify(userList));
            alert("Password updated successfully.");
        } else {
            alert("User not found.");
        }

        // Redirecionar para a página de login ou qualquer outra página necessária
        window.location.href = "/login";
    });
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

// Função para adicionar um novo jogo
function addGame(event) {
    event.preventDefault();

    // Obter os valores dos campos do formulário
    var id = document.getElementById("_id").value;
    var name = document.getElementById("name").value;
    var description = document.getElementById("description").value;
    var price = document.getElementById("price").value;
    var qtt = document.getElementById("quantidade").value;
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
    formData.append("quantidade", qtt);
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

async function updateGame(gameId) {
    try {
        const id = document.getElementById("_id").value;
        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;
        const price = document.getElementById("price").value;
        const quantidade = document.getElementById("quantidade").value;
        const isGameOfTheYear = document.getElementById("isGameOfTheYear").checked;
        const isFeatured = document.getElementById("isFeatured").checked;
        const genre = document.getElementById("genre").value;
        const platform = document.getElementById("platform").value;
        const image = document.getElementById("image").files[0];

        const formData = new FormData();
        formData.append("_id", id);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("quantidade", quantidade);
        formData.append("isGameOfTheYear", isGameOfTheYear);
        formData.append("isFeatured", isFeatured);
        formData.append("genre", genre);
        formData.append("platform", platform);
        formData.append("image", image);

        const response = await fetch(`/games/id/${gameId}`, {
            method: "PUT",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to update game");
        }

        // Redirecionar para a página de detalhes do jogo
        window.location.href = `/game-details?id=${gameId}`;
    } catch (error) {
        console.error("Error updating game:", error);
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
