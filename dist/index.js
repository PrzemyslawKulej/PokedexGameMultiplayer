"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt = __importStar(require("bcrypt"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
const mongodb_1 = __importDefault(require("./mongodb"));
dotenv.config();
const router = express_1.default.Router();
const app = (0, express_1.default)();
const port = process.env.SERVER_PORT;
const viewsPath = path.join(__dirname, '/views');
app.listen(port, () => {
    console.log(`Server listen at http://localhost:${port}`);
});
// Setting EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', viewsPath);
// This line enables the parsing of request bodies as JSON
app.use(express_1.default.json());
// To serve static files
app.use(express_1.default.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.render('main');
});
var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
})(HttpStatusCode || (HttpStatusCode = {}));
router.post('/register', async (req, res) => {
    // Check, if user exist
    const existingUser = await mongodb_1.default.findOne({ username: req.body.username });
    if (existingUser)
        return res.status(HttpStatusCode.BAD_REQUEST).send('User already exist.');
    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // Create new user
    let user = new mongodb_1.default({
        username: req.body.username,
        mail: req.body.email,
        password: hashedPassword
    });
    user = await user.save();
    res.send(user);
});
router.post('/login', async (req, res) => {
    // Check, if user exist
    const user = await mongodb_1.default.findOne({ username: req.body.username });
    if (!user)
        return res.status(400).send('Wrong email or password.');
    // Comparing password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
        return res.status(400).send('Wrong email or password.');
    res.send('Logged succesfull!');
});
app.use('/api/users', router);
// testing swc
// z
//# sourceMappingURL=index.js.map