import mongoose, { Schema, model } from "mongoose";
const customerSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
    statuse: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Inactive'],
    },
}, {
    timestamps: true,
}
);
const customerModel = mongoose.models.customer || model('customer', customerSchema);
export default customerModel;

