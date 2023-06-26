const mongoose = require('mongoose').default;
const express = require('express');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/myapp')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
    res.send('Serwer działa poprawnie!');
});

app.listen(port, () => {
    console.log(`Serwer nasłuchuje na http://localhost:${port}`);
});


const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);


