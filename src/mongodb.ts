import * as mongoose from "mongoose";

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

export default User;