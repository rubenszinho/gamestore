const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Serve static files from the "src" directory
app.use(express.static(path.join(__dirname, '../')));

// // Middleware to parse request body
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'index.html'));
});

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'login.html'));
});

app.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'register.html'));
});

app.get('/admin-game-add', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'admin-game-add.html'));
});

app.get('/admin-game-edit', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'admin-game-edit.html'));
});

app.get('/edit-profile', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'edit-profile.html'));
});

app.get('/forgot-password', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'forgot-password.html'));
});

app.get('/game-details', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'game-details.html'));
});

app.get('/home-admin', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'home-admin.html'));
});

app.get('/my-cart', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'my-cart.html'));
});

app.get('/search', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'search.html'));
});

app.get('/user-profile', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'user-profile.html'));
});

app.get('/admin-page', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'admin-page.html'));
});

app.get('/admin-users-list', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'admin-users-list.html'));
});

app.listen(3000, () => console.log('Server is running on port 3000'));

// const MongoClient = require('mongodb').MongoClient;

const mongoose = require("mongoose");

const mongoURI = 'mongodb://127.0.0.1:27017/test';

// Conectar ao MongoDB usando o Mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Definir o esquema do usuário usando o Mongoose
const userSchema = new mongoose.Schema({
  _id: Number,
  isAdmin: Boolean,
  name: String,
  email: String,
  phone: Number,
  password: String
});

const User = mongoose.model('User', userSchema);

// Rota para registrar usuário
app.post('/registerUser', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Verificar se já existe um usuário com o mesmo email ou telefone
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with the same email or phone already exists." });
    }

    // Criar um novo objeto de usuário
    const newUser = new User({
      _id: phone,
      isAdmin: false,
      name: name,
      email: email,
      phone: phone,
      password: password
    });

    // Salvar o novo usuário no banco de dados
    await newUser.save();

    res.status(200).json({ message: "Registration successful. You can now login." });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: "Failed to register user." });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar se o email e a senha correspondem a um usuário no banco de dados
    const user = await User.findOne({ email, password });

    if (user) {
      res.json({ loggedIn: true, userId: user._id });
    } else {
      res.json({ loggedIn: false });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Rota para obter os dados do perfil do usuário
app.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Procurar o usuário pelo ID
    const user = await User.findById(userId);

    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ message: "Failed to retrieve user profile." });
  }
});

// Rota para atualizar os dados do perfil do usuário
app.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { isAdmin, name, email, phone } = req.body;

    // Atualizar os campos do perfil do usuário
    const updatedUser = await User.findByIdAndUpdate(userId, {
      isAdmin,
      name,
      email,
      phone
    }, { new: true });

    if (updatedUser) {
      res.status(200).json({ message: "User profile updated successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: "Failed to update user profile." });
  }
});

// Importe os módulos e configure o servidor Express

// Rota para deletar um usuário
app.delete('/api/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Deleta o usuário pelo ID no banco de dados
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Rota para obter a lista de usuários
app.get('/api/users', async (req, res) => {
  try {
    // Obtém todos os usuários do banco de dados
    const users = await User.find();

    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
