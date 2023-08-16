import * as mongoose from "mongoose";
import express, { Request, Response, Router } from "express";
import * as bcrypt from "bcrypt";
import * as path from "path";
import * as fs from "fs";


const router: Router = express.Router();
const app: express.Express = express();
const port: number = 3000;



app.listen(port, () => {
    console.log(`Server listen at http://localhost:${port}`);
});

// MongoDB configuration

mongoose.connect('mongodb://localhost:27017/myapp')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err: mongoose.Error) => console.error('Could not connect to MongoDB', err));

const Schema = mongoose.Schema;

interface IUser {
    username: string;
    mail: string;
    password: string;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    mail: {type: String, required: true},
    password: { type: String, required: true }
});

const User = mongoose.model<IUser>('User', UserSchema);

// This line enables the parsing of request bodies as JSON
app.use(express.json());

// Setting EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// To serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req: Request, res: Response) => {
    res.render('main');
});

enum HttpStatusCode {
    BAD_REQUEST = 400,
    OK = 200,
}

interface RegisterRequestedBody {
    username: string;
    email: string;
    password: string;
}

router.post('/register', async (req: Request<{}, {}, RegisterRequestedBody>, res: Response): Promise<Response> => {
    // Check, if user exist
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) return res.status(HttpStatusCode.BAD_REQUEST).send('User already exist.');

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    let user = new User({
        username: req.body.username,
        mail: req.body.email,
        password: hashedPassword
    });
    user = await user.save();

    res.send(user);
});

// User login

interface LoginRequestBody {
    username: string;
    password: string;
}

router.post('/login', async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<Response> => {
    // Check, if user exist
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('Wrong email or password.');

    // Comparing password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Wrong email or password.');

    res.send('Logged succesfull!');
});

app.use('/api/users', router);


// testing swc

