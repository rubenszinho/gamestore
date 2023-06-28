const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Serve static files from the "src" directory
app.use(express.static(path.join(__dirname, '../')));

// Middleware to parse request body
app.use(bodyParser.json());

// Create a new router
const gamestoreRouter = express.Router();

// Define routes on the router
gamestoreRouter.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'index.html'));
});

gamestoreRouter.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'login.html'));
});

gamestoreRouter.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'register.html'));
});

gamestoreRouter.get('/admin-game-add', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'admin-game-add.html'));
});

gamestoreRouter.get('/edit-profile', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'edit-profile.html'));
});

gamestoreRouter.get('/forgot-password', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'forgot-password.html'));
});

gamestoreRouter.get('/game-details', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'game-details.html'));
});

gamestoreRouter.get('/home-admin', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'home-admin.html'));
});

gamestoreRouter.get('/my-cart', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'my-cart.html'));
});

gamestoreRouter.get('/search', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'search.html'));
});

gamestoreRouter.get('/user-profile', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'user-profile.html'));
});

gamestoreRouter.get('/admin-page', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'admin-page.html'));
});

gamestoreRouter.get('/admin-users-list', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'admin-users-list.html'));
});

// Use the router for paths starting with /gamestore
app.use('/gamestore', gamestoreRouter);

app.listen(3000, () => console.log('Server is running on port 3000'));


// const MongoClient = require('mongodb').MongoClient;

// const url = 'mongodb://localhost:27017';
// const dbName = 'myDatabase';

// // Connection pooling
// let db;
// MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
//     console.log("Connected successfully to server");
//     db = client.db(dbName);
// });

// app.post('/users', (req, res) => {
//     const user = req.body;
//     insertUsers(db, user, () => res.send('User inserted!'));
// });

// app.put('/users/:email', (req, res) => {
//     const email = req.params.email;
//     const newValues = req.body;
//     updateUser(db, email, newValues, () => res.send(`User with email ${email} updated!`));
// });

// app.delete('/users/:email', (req, res) => {
//     const email = req.params.email;
//     deleteUser(db, email, () => res.send(`User with email ${email} deleted!`));
// });

// app.get('/users', (req, res) => {
//     findUsers(db, (users) => res.json(users));
// });

// app.post('/admins', (req, res) => {
//     const admin = req.body;
//     insertAdmins(db, admin, () => res.send('Admin inserted!'));
// });

// app.post('/products', (req, res) => {
//     const product = req.body;
//     insertProducts(db, product, () => res.send('Product inserted!'));
// });

// app.post('/orders', (req, res) => {
//     const order = req.body;
//     placeOrder(db, order, () => res.send('Order placed!'));
// });

// // Function to insert users
// const insertUsers = function (db, callback) {
//     const collection = db.collection('users');

//     collection.insertMany([
//         { name: 'John Doe', email: 'john@example.com' },
//         { name: 'Jane Doe', email: 'jane@example.com' }
//     ], function (err, result) {
//         console.log("Inserted users into the collection");
//         callback(result);
//     });
// }

// const updateUser = function (db, email, newValues, callback) {
//     const collection = db.collection('users');

//     collection.updateOne({ email: email }, { $set: newValues }, function (err, result) {
//         console.log("Updated the document with the email " + email);
//         callback(result);
//     });
// }

// // Usage: updateUser(db, 'john@example.com', { name: 'John Updated' }, callback);


// const deleteUser = function (db, email, callback) {
//     const collection = db.collection('users');

//     collection.deleteOne({ email: email }, function (err, result) {
//         console.log("Removed the document with the email " + email);
//         callback(result);
//     });
// }

// // Usage: deleteUser(db, 'john@example.com', callback);


// // Function to insert admins
// const insertAdmins = function (db, callback) {
//     const collection = db.collection('admins');

//     collection.insertMany([
//         { name: 'Admin1', email: 'admin1@example.com' },
//         { name: 'Admin2', email: 'admin2@example.com' }
//     ], function (err, result) {
//         console.log("Inserted admins into the collection");
//         callback(result);
//     });
// }

// // Function to insert products
// const insertProducts = function (db, callback) {
//     const collection = db.collection('products');

//     collection.insertMany([
//         { name: 'Game1', description: 'This is game1', price: 50 },
//         { name: 'Game2', description: 'This is game2', price: 70 }
//     ], function (err, result) {
//         console.log("Inserted products into the collection");
//         callback(result);
//     });
// }

// const placeOrder = function (db, order, callback) {
//     const collection = db.collection('orders');

//     collection.insertOne(order, function (err, result) {
//         console.log("Placed a new order");
//         callback(result);
//     });
// }

// // Usage:
// // const order = { userEmail: 'john@example.com', products: ['Game1', 'Game2'], total: 120 };
// // placeOrder(db, order, callback);

// MongoClient.connect(url, function (err, client) {
//     console.log("Connected successfully to server");

//     const db = client.db(dbName);

//     insertUsers(db, function () {
//         insertAdmins(db, function () {
//             insertProducts(db, function () {
//                 client.close();
//             });
//         });
//     });
// });

// const findUsers = function (db, callback) {
//     const collection = db.collection('users');

//     collection.find({}).toArray(function (err, docs) {
//         console.log("Found the following user records");
//         console.log(docs)
//         callback(docs);
//     });
// }

  // Similar functions can be created for admins and products

