import mongoose, { Schema, model } from "mongoose";
const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },

    cardnumber: {
        type: String,
        unique: true,
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
    },

    phone: {
        type: String,
        required:true,
        unique:true,
    },

    address: {
        type: String,
    },

    confirmEmail: {
        type: Boolean,
        default: false,
    },

    gender: {
        type: String,
        enum: ['Male', 'Female'],
    },
    statuse: {
        type: String,
        default: 'Inactive',
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
    votes: { type: Number, default: 0 }

}, {
    timestamps: true,
}

);

const userModel = mongoose.models.User || model('User', UserSchema);
export default userModel;

