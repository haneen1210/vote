
import blogsModel from "../../../DB/models/blog.model.js";
import cloudinary from "../../utls/cloudinary.js";
 






export const createblog = async (req, res, next) => {
    const {  titel,short_description,long_description,image} = req.body;

  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
    folder: `${process.env.APP_NAME}/customer`
  })

    const createblog = await blogsModel.create({ titel,short_description,long_description,image:{ secure_url, public_id } });
    return res.status(201).json({ message: "success", createblog });
}


export const getblog = async (req, res, next) => {
    const blog = await blogsModel. find({});
    return res.status(200).json({ message: "success", blog });
}

export const getspecificblog = async (req, res) => {
    const { blogID } = req.params;
    const blog = await blogsModel.findOne({ _id: blogID });
    if (!blog) {
        return res.status(404).json({ message: "blog not found" });
    }
    return res.status(200).json({ message: "blog found", blog });
}


export const updateblog = async (req, res) => {
    const { id } = req.params;
    const blog = await blogsModel.findOne({_id:id });
    if (!blog) {
        return res.status(404).json({ message: "blog not found" });
    }
 
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/blog`
    })
    cloudinary.uploader.destroy(blog.image.public_id);
    blog.image={ secure_url, public_id };
   
  
    blog.titel = req.body.titel;
    blog.short_description = req.body.short_description;
    blog.long_description = req.body.long_description;
    blog.address = req.body.address;


    await blog.save();
    return res.status(200).json({ message: "success update blog ", blog });
}


export const deleteblog = async (req, res) => {
    const { blogID } = req.params;
    const blog = await blogsModel.findOneAndDelete({_id:blogID });
    if (!blog) {
        return res.status(404).json({ message: "blog not found" });
    }

    return res.status(200).json({ message: "success delet blog ", blog });
}
