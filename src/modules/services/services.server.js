
import ServicesModel from "../../../DB/models/services.model.js";

//بإنشاء خدمة جديدة
export const newServices = async (req, res, next) => {
   
    const { title, description} = req.body;
    const createservices = await ServicesModel.create({ title, description });
    return res.status(201).json({ message: "success", createservices });

}
//بارجاع جميع الخدمة 
export const getServices = async (req, res, next) => {
    const Services = await ServicesModel. find({});
    return res.status(200).json({ message: "success", Services });

}
//بارجاع خدمة معينة
export const getspecificService = async (req, res) => {
    const { ServiceID } = req.params;
    const Service = await ServicesModel.findOne({ _id: ServiceID });
    if (!Service) {
        return res.status(404).json({ message: "Service not found" });
    }
    return res.status(200).json({ message: "Service found", Service });
}
//تعديل خدمة معينة
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

//حذف خدمة معينة
export const deleteservice = async (req, res) => {
    const { ServiceID } = req.params;
    const Service = await ServicesModel.findOneAndDelete({_id:ServiceID });
    if (!Service) {
        return res.status(404).json({ message: "Service not found" });
    }
  
    return res.status(200).json({ message: "success delet Service ", Service });
}

