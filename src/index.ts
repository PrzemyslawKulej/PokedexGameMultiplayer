import * as mongoose from "mongoose";
import * as express from 'express';
import * as bcrypt from "bcrypt";
import * as path from "path";
import * as fs from "fs";
import * as mongodb from "./mongodb";


const router: express.Router = express.Router();
const app: express.Express = express();
const port: number = 3000;
const viewsPath: string = path.join(__dirname, '/views');



app.listen(port, () => {
    console.log(`Server listen at http://localhost:${port}`);
});

// Setting EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', viewsPath);

const User = mongoose.model<IUser>('User', UserSchema);

// This line enables the parsing of request bodies as JSON
app.use(express.json());


// To serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req: express.Request, res: express.Response) => {
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

router.post('/register', async (req: express.Request<{}, {}, RegisterRequestedBody>, res: express.Response): Promise<express.Response> => {
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

router.post('/login', async (req: express.Request<{}, {}, LoginRequestBody>, res: express.Response): Promise<express.Response> => {
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
// z

