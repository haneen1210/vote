
import contectModel from "../../../DB/models/contect.model.js";
import { sendEmailcontact } from "../../utls/email.js";

// إنشاء بيانات اتصال جديدة
export const createcontect = async (req, res, next) => {
    const {  fullName,email,phone,message} = req.body;
    
    if (await contectModel.findOne({ phone })) {
        return next(new Error("phone already exists", { cause: 409 }));}

        if (await contectModel.findOne({ email })) {
            return next(new Error("email already exists", { cause: 409 }));}

    const communication = await contectModel.create({ fullName,email,phone,message});
    const html=`<div>
    <p>from : ${fullName}</p>
    <p>message: ${message}</p>
    <p>phone : ${phone}</p>
    </div>`;
    await sendEmailcontact(email,`voteele@gmail.com`,"contact: ",html);
    return res.status(201).json({ message: "success", communication });
}

// الحصول على جميع بيانات الاتصال
export const getcontect = async (req, res, next) => {
    const communication = await contectModel. find({});
    return res.status(200).json({ message: "success", communication });
}

// الحصول على بيانات اتصال محددة
export const getspecificcontect = async (req, res) => {
    const { contectID } = req.params;
    const communication = await contectModel.findOne({ _id: contectID });
    if (!communication) {
        return res.status(404).json({ message: "contect not found" });
    }
    return res.status(200).json({ message: "contect found", communication });
}

// تحديث بيانات الاتصال
export const updatecontect = async (req, res) => {
    const { id } = req.params;
    const communication = await contectModel.findOne({_id:id });
    if (!communication) {
        return res.status(404).json({ message: "contect not found" });
    }
    if (await contectModel.findOne({ email: req.body.email, _id: { $ne: id } }).select('email')) {
        return res.status(409).json({ message: `${admin.role} ${req.body.email} alredy exists` })
    }

    communication.fullName = req.body.fullName;
    communication.email = req.body.email;
    communication.phone = req.body.phone;
    communication.message = req.body.message;
   

    await communication.save();
    return res.status(200).json({ message: "success update contect ", communication });
}

// حذف بيانات الاتصال
export const deletecontect = async (req, res) => {
    const { contectID } = req.params;
    const communication = await contectModel.findOneAndDelete({_id:contectID });
    if (!communication) {
        return res.status(404).json({ message: "contect not found" });
    }

    return res.status(200).json({ message: "success delet contect ", communication });
}

