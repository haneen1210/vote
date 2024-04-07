import mongoose, { Schema, model ,Types} from "mongoose";
const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },

    cardnumber: {
        type: String,
        unique: true,
        required: true,
    },


    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        unique: true,
        required: true,
    },

    image: {
        type: Object,
        required: true,
    },

    phone: {
        type: String,
        required:true,
        unique:true,
    },

    address: {
        type: String,
        required: true,
    },

    confirmEmail: {
        type: Boolean,
        default: false,
    },

    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true,
    },
    statuse: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Inactive'],

    },
    
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin', 'Candidate'],

    },
    sendCode: {
        type: String,
        default: null,
    },
    changePasswordTime: {
        type: Date,
    },
    isDeleted:{
        type:Boolean,
        default:false,
    },
    votes: [{ type:Types.ObjectId, ref: 'Vote' }]

}, {
    timestamps: true,
}

);

const userModel = mongoose.models.User || model('User', UserSchema);
export default userModel;

