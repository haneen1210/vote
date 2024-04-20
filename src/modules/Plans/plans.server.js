
import itemModel from "../../../DB/models/item.model.js";
import PlansModel from "../../../DB/models/plans.model.js";


export const newPlans = async (req, res, next) => {
   
    const { planName, description} = req.body;
    const createplans = await PlansModel.create({ planName, description });
    return res.status(201).json({ message: "success", createplans });

}

export const additem = async (req, res, next) => {
    req.body.planId=req.params.id;    //id plan
   // req.body.userId=req.user._id;
    const plan = await PlansModel.findById(req.params.id);
    if (!plan) {
        return res.status(404).json({ message: "plan not found" });
    }
    plan.text = req.body.text;
    const planx=await itemModel.create(req.body);
    return res.status(200).json({ message: "success", planx });
}

export const getSplans = async (req, res, next) => {
    const plans = await PlansModel.find({}).populate({
        path: 'item',
    });
    return res.status(200).json({ message: "success", plans });
}

export const getspecificplan = async (req, res) => {
    const { PlansID } = req.params;
    const plan = await PlansModel.findOne({ _id: PlansID });
    if (!plan) {
        return res.status(404).json({ message: "plans not found" });
    }
    const plans = await PlansModel.find({}).populate({
        path: 'item',
    });
    return res.status(200).json({ message: "plans found", plans });

}

export const updateplan = async (req, res) => {
    const { id } = req.params;
    const plan = await PlansModel.findOne({_id:id });
    if (!plan) {
        return res.status(404).json({ message: "plan not found" });
    }
  
    plan.planName = req.body.planName;
    plan.description = req.body.description;
   // plan.item = req.body.item;
    await plan.save();
    return res.status(200).json({ message: "success update plan ", plan });
}


export const deleteplan = async (req, res) => {
    const { PlansID } = req.params;
    const plan = await PlansModel.findOneAndDelete({_id:PlansID });
    if (!plan) {
        return res.status(404).json({ message: "plan not found" });
    }
  
    return res.status(200).json({ message: "success delet plan ", plan });
}

