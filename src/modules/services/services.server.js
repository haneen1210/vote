
import ServicesModel from "../../../DB/models/services.model.js";


export const newServices = async (req, res, next) => {
   
    const { title, description} = req.body;
    const createservices = await ServicesModel.create({ title, description });
    return res.status(201).json({ message: "success", createservices });

}

export const getServices = async (req, res, next) => {
    const Services = await ServicesModel. find({});
    return res.status(200).json({ message: "success", Services });

}

export const getspecificService = async (req, res) => {
    const { ServiceID } = req.params;
    const Service = await ServicesModel.findOne({ _id: ServiceID });
    if (!Service) {
        return res.status(404).json({ message: "Service not found" });
    }
    return res.status(200).json({ message: "Service found", Service });
}

export const updateservice = async (req, res) => {
    const { id } = req.params;
    const Service = await ServicesModel.findOne({_id:id });
    if (!Service) {
        return res.status(404).json({ message: "Service not found" });
    }
  
    Service.title = req.body.title;
    Service.description = req.body.description;
     
    await Service.save();
    return res.status(200).json({ message: "success update Service ", Service });
}


export const deleteservice = async (req, res) => {
    const { ServiceID } = req.params;
    const Service = await ServicesModel.findOneAndDelete({_id:ServiceID });
    if (!Service) {
        return res.status(404).json({ message: "Service not found" });
    }
  
    return res.status(200).json({ message: "success delet Service ", Service });
}

