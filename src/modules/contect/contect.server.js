
import contectModel from "../../../DB/models/contect.model.js";


export const createcontect = async (req, res, next) => {
    const {  fullName,email,phone,message} = req.body;
    
    if (await contectModel.findOne({ phone })) {
        return next(new Error("phone already exists", { cause: 409 }));}

        if (await contectModel.findOne({ email })) {
            return next(new Error("email already exists", { cause: 409 }));}

    const communication = await contectModel.create({ fullName,email,phone,message});
    return res.status(201).json({ message: "success", communication });
}


export const getcontect = async (req, res, next) => {
    const communication = await contectModel. find({});
    return res.status(200).json({ message: "success", communication });
}


export const getspecificcontect = async (req, res) => {
    const { contectID } = req.params;
    const communication = await contectModel.findOne({ _id: contectID });
    if (!communication) {
        return res.status(404).json({ message: "contect not found" });
    }
    return res.status(200).json({ message: "contect found", communication });
}


export const updatecontect = async (req, res) => {
    const { id } = req.params;
    const communication = await contectModel.findOne({_id:id });
    if (!communication) {
        return res.status(404).json({ message: "contect not found" });
    }
    if (await userModel.findOne({ email: req.body.email, _id: { $ne: id } }).select('email')) {
        return res.status(409).json({ message: `${admin.role} ${req.body.email} alredy exists` })
    }

    communication.fullName = req.body.fullName;
    communication.email = req.body.email;
    communication.phone = req.body.phone;
    communication.message = req.body.message;
   

    await communication.save();
    return res.status(200).json({ message: "success update contect ", communication });
}


export const deletecontect = async (req, res) => {
    const { contectID } = req.params;
    const communication = await contectModel.findOneAndDelete({_id:contectID });
    if (!communication) {
        return res.status(404).json({ message: "contect not found" });
    }

    return res.status(200).json({ message: "success delet contect ", communication });
}

