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
  password: String,
  cart: {
    type: [Number],
    default: []
  }
});

const User = mongoose.model('User', userSchema);

// Código para criar o usuário admin padrão
const createDefaultAdminUser = async () => {
  try {
    const adminUser = await User.findOne({ email: 'admin@admin.com' });
    if (!adminUser) {
      const newUser = new User({
        _id: 42,
        name: 'admin',
        email: 'admin@admin.com',
        password: 'admin',
        isAdmin: true
      });
      await newUser.save();
      console.log('Usuário admin padrão criado com sucesso.');
    } else {
      console.log('Usuário admin já existe no banco de dados.');
    }
  } catch (error) {
    console.error('Ocorreu um erro ao criar o usuário admin padrão:', error);
  }
};
createDefaultAdminUser();

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

// Rota para obter a quantidade de jogos cadastrados
app.get('/users/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro ao obter a quantidade de usuarios.' });
  }
});

const gameSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantidade: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: Buffer,
    required: true
  },
  isGameOfTheYear: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  genre: {
    type: String,
    default: ""
  },
  platform: {
    type: String,
    default: ""
  }
});

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Especifique o diretório onde as imagens serão armazenadas
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: multer.memoryStorage() });

const Game = mongoose.model('Game', gameSchema);

// Rota para adicionar um novo jogo
app.post('/games/add', upload.single('image'), async (req, res) => {
  try {
    const { id, name, price, quantidade, description, isFeatured, isGameOfTheYear, genre, platform} = req.body;
    const image = req.file.buffer;

    // Criar um novo objeto de usuário
    const newGame = new Game({
      _id: id,
      name: name,
      price: price,
      quantidade: quantidade,
      description: description,
      image: image,
      // image: "batata",
      isFeatured: isFeatured,
      isGameOfTheYear: isGameOfTheYear,
      genre: genre,
      platform: platform
    });

    // Salvar o novo usuário no banco de dados
    await newGame.save();
    res.status(200).json({ message: "Game added." });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// rota pra pegar uma imagem
app.get('/games/image/:id', async (req, res) => {
  try {
    const gameId = req.params.id;
    const game = await Game.findById(gameId);

    if (!game || !game.image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set('Content-Type', 'image/jpeg');
    res.send(game.image);
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Rota para buscar jogos por texto
app.get('/games/search/:text', async (req, res) => {
  try {
    const searchText = req.params.text;
    let searchResults;
    if(searchText == "*"){
      searchResults = await Game.find();
    }else {
      searchResults = await Game.find({ name: searchText } );
    }
    res.json(searchResults);
  } catch (error) {
    console.error('Error searching games:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Rota para obter um jogo específico por ID
app.get('/games/id/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (game) {
      res.json(game);
    } else {
      res.status(404).json({ message: 'Game not found' });
    }
  } catch (error) {
    console.error('Error getting game:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Rota para atualizar um jogo existente
app.put('/games/id/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (game) {
      res.json(game);
    } else {
      res.status(404).json({ message: 'Game not found' });
    }
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Rota para excluir um jogo
app.delete('/games/id/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (game) {
      res.json({ message: 'Game deleted' });
    } else {
      res.status(404).json({ message: 'Game not found' });
    }
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Rota para obter os últimos 8 jogos adicionados
app.get('/games/latest', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 }).limit(8);
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para obter os 5 jogos em destaque
app.get('/games/featured', async (req, res) => {
  try {
    const games = await Game.find({ isFeatured: true }).limit(5);
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para obter os 8 jogos top do ano
app.get('/games/top', async (req, res) => {
  try {
    const games = await Game.find({ isGameOfTheYear: true }).limit(8);
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para obter a quantidade de jogos cadastrados
app.get('/games/count', async (req, res) => {
  try {
    const count = await Game.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro ao obter a quantidade de jogos.' });
  }
});

// Rota para obter a lista do carrinho de um usuário
app.get('/users/:userId/cart', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user cart' });
  }
});

// Rota para adicionar um jogo ao carrinho de um usuário
app.post('/users/:userId/cart/add/:gameId', async (req, res) => {
  const userId = req.params.userId;
  const gameId = req.params.gameId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.cart.push(gameId);
    await user.save();
    res.json({ message: `Game ${gameId} added to cart` });
  } catch (error) {
    res.status(500).json({ error: 'Error adding game to user cart' });
  }
});

// Rota para remover um jogo do carrinho de um usuário
app.delete('/users/:userId/cart/:gameId', async (req, res) => {
  const userId = req.params.userId;
  const gameId = req.params.gameId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.cart.pop(gameId);
    await user.save();
    res.json({ message: 'Game removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing game from user cart' });
  }
});

app.delete('/users/:userId/cart/all', async (req, res) => {
  const userId = req.params.userId;
  try {
    // Atualizar o documento do usuário para remover os itens do carrinho
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.updateOne({cart: []});

    res.status(200).json({ message: 'Checkout confirmed. Cart items cleared.' });
  } catch (error) {
    console.error('Error confirming checkout:', error);
    res.status(500).json({ error: 'An error occurred while confirming the checkout.' });
  }
});
