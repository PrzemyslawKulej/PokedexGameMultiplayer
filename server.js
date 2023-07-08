const mongoose = require('mongoose').default;
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/myapp')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
    res.send('Server is working!');
});

app.listen(port, () => {
    console.log(`Server listen at http://localhost:${port}`);
});


const Schema = mongoose.Schema;

router.post('/register', async (req, res) => {
    // Check, if user exist
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) return res.status(400).send('User already exist.');

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    let user = new User({
        username: req.body.username,
        password: hashedPassword
    });
    user = await user.save();

    res.send(user);
});

// User login
router.post('/login', async (req, res) => {
    // Check, if user exist
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('Wrong email or password.');

    // Comparing password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Wrong email or password.');

    res.send('Logged sucesfull!');
});


const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// comma
// comma

