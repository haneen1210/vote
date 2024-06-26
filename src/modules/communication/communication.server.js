
import communicationModel from "../../../DB/models/communication.js";

// إنشاء معلومات اتصال جديدة
export const createcommunicatione = async (req, res, next) => {
 
    const {  socialMedia, email, address, logo, phone} = req.body;
   
    if (await communicationModel.findOne({ phone })) {
        return next(new Error("phone already exists", { cause: 409 }));}
     
        if (await communicationModel.findOne({ email })) {
            return next(new Error("email already exists", { cause: 409 }));}
    
     
    const communication = await communicationModel.create({  socialMedia, email, address, logo, phone});
 
    return res.status(201).json({ message: "success", communication });
}

// الحصول على جميع معلومات الاتصال
export const getcommunication = async (req, res, next) => {
    const communication = await communicationModel. find({});
    return res.status(200).json({ message: "success", communication });
}

// الحصول على معلومات اتصال محددة
export const getspecificcommunication = async (req, res) => {
    const { communicationID } = req.params;
    const communication = await communicationModel.findOne({ _id: communicationID });
    if (!communication) {
        return res.status(404).json({ message: "communication not found" });
    }
    return res.status(200).json({ message: "communication found", communication });
}

// تحديث معلومات الاتصال
export const updatecommunication = async (req, res) => {
    const { id } = req.params;
    const communication = await communicationModel.findOne({_id:id });
    if (!communication) {
        return res.status(404).json({ message: "communication not found" });
    }

    if (await communicationModel.findOne({ email: req.body.email, _id: { $ne: id } }).select('email')) {
        return res.status(409).json({ message: ` ${req.body.email} alredy exists` })
    }

    communication.email = req.body.email;
    communication.logo = req.body.logo;
    communication.phone = req.body.phone;
    communication.address = req.body.address;
   

    await communication.save();
    return res.status(200).json({ message: "success update communication ", communication });
}

// حذف معلومات الاتصال
export const deletecommunication = async (req, res) => {
    const { communicationID } = req.params;
    const communication = await communicationModel.findOneAndDelete({_id:communicationID });
    if (!communication) {
        return res.status(404).json({ message: "communication not found" });
    }

    return res.status(200).json({ message: "success delet communication ", communication });
}

