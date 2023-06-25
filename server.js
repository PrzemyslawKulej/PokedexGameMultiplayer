const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});

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


