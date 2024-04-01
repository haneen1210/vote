
import customerModel from "../../../DB/models/customers.model.js";
import cloudinary from "../../utls/cloudinary.js";
 


export const createcustomer = async (req, res, next) => {
    const {  userName,email,image,phone,address,statuse} = req.body;
    if (await customerModel.findOne({ userName })) {
        return next(new Error("userName already exists", { cause: 409 }));
    }
    if (await customerModel.findOne({ email })) {
        return next(new Error("email already exists", { cause: 409 }));
    }
    if (await customerModel.findOne({ phone })) {
        return next(new Error("phone already exists", { cause: 409 }));}

  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
    folder: `${process.env.APP_NAME}/customer`
  })

    const createcustomer = await customerModel.create({ userName,email,image:{ secure_url, public_id },phone,address,statuse });
    return res.status(201).json({ message: "success", createcustomer });
}


export const getcustomer = async (req, res, next) => {
    const customer = await customerModel. find({});
    return res.status(200).json({ message: "success", customer });
}

export const getspecificCustomer = async (req, res) => {
    const { customerID } = req.params;
    const customer = await customerModel.findOne({ _id: customerID });
    if (!customer) {
        return res.status(404).json({ message: "customer not found" });
    }
    return res.status(200).json({ message: "customer found", customer });
}


export const updatecustomer = async (req, res) => {
    const { id } = req.params;
    const customer = await customerModel.findOne({_id:id });
    if (!customer) {
        return res.status(404).json({ message: "customer not found" });
    }
  
    if (await customerModel.findOne({ email: req.body.email, _id: { $ne: id } }).select('email')) {
        return res.status(409).json({ message: ` ${req.body.email} alredy exists` })
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/customer`
      })
 
    cloudinary.uploader.destroy(customer.image.public_id);
    customer.image={ secure_url, public_id };
   
    
    customer.userName = req.body.userName;
    customer.email = req.body.email;
    customer.phone = req.body.phone;
    customer.address = req.body.address;
    customer.statuse = req.body.statuse;

    await customer.save();
    return res.status(200).json({ message: "success update customer ", customer });
}


export const deletecustomer = async (req, res) => {
    const { customerID } = req.params;
    const customer = await customerModel.findOneAndDelete({_id:customerID });
    if (!customer) {
        return res.status(404).json({ message: "customer not found" });
    }

    return res.status(200).json({ message: "success delet customer ", customer });
}

