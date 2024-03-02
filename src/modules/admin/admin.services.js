import userModel from "../../../DB/models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utls/email.js";
import cloudinary from "../../utls/cloudinary.js";



export const getAdmin = async (req, res, next) => {
    const Admins = await userModel.find({ role: 'Admin' });
    return res.status(200).json({ message: "success", Admins });

}


export const softDeletAdmin = async (req, res) => {
    const { id } = req.params;
    const admin = await userModel.findOneAndUpdate({ _id: id, isDeleted: false, role: 'Admin' }, { isDeleted: true }, { new: true });

    if (!admin) {
        return res.status(400).json({ message: "cont delete this admin" });
    }
    return res.status(200).json({ message: "success" });
}


export const Harddeleteadmin = async (req, res, next) => {
    const { id } = req.params;
    const admin = await userModel.findOneAndDelete({ _id: id, isDeleted: true, role: 'Admin' });

    if (!admin) {
        return res.status(400).json({ message: "cont delete this admin" });
    }
    return res.status(200).json({ message: "success" });
}

export const restore = async (req, res) => {
    const { id } = req.params;
    const admin = await userModel.findOneAndUpdate({ _id: id, isDeleted: true, role: 'Admin' }, { isDeleted: false }, { new: true })
        ;
    if (!admin) {
        return res.status(400).json({ message: "cont restore this coupon" });
    }
    return res.status(200).json({ message: "success" });
}



export const updateadmin = async (req, res, next) => {
    const { id } = req.params;
    const admin = await userModel.findOne({ _id: id });
    if (!admin) {
        return res.status(404).json({ message: "admin not found" });
    }
    if (await userModel.findOne({ email: req.body.email, _id: { $ne: id } }).select('email')) {
        return res.status(409).json({ message: `admin ${req.body.email} alredy exists` })
    }
    if(req.file){
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APP_NAME}/Admin`
        })
        cloudinary.uploader.destroy(admin.image.public_id);
        admin.image={ secure_url, public_id };
        
    }
  
    admin.email = req.body.email;
    admin.userName = req.body.userName;
    admin.address = req.body.address;
    admin.statuse = req.body.statuse;


    await admin.save();
    return res.status(200).json({ message: "success", admin });

}


