
import definitionModel from "../../../DB/models/definition.model.js";


export const newdefinition = async (req, res, next) => {
    const {  description} = req.body;
    const createdefinition = await definitionModel.create({ description });
    return res.status(201).json({ message: "success", createdefinition });
}


export const getdefinition = async (req, res, next) => {
    const definition = await definitionModel. find({});
    return res.status(200).json({ message: "success", definition });
}

export const getspecificdefinition = async (req, res) => {
    const { definitionID } = req.params;
    const definition = await definitionModel.findOne({ _id: definitionID });
    if (!definition) {
        return res.status(404).json({ message: "definition not found" });
    }
    return res.status(200).json({ message: "definition found", definition });
}


export const updatedefinition = async (req, res) => {
    const { id } = req.params;
    const definition = await definitionModel.findOne({_id:id });
    if (!definition) {
        return res.status(404).json({ message: "definition not found" });
    }
    definition.description = req.body.description;
     
    await definition.save();
    return res.status(200).json({ message: "success update definition ", definition });
}


export const deletedefinition = async (req, res) => {
    const { definitionID } = req.params;
    const definition = await definitionModel.findOneAndDelete({_id:definitionID });
    if (!definition) {
        return res.status(404).json({ message: "definition not found" });
    }

    return res.status(200).json({ message: "success delet definition ", definition });
}

