import commentModel from "../../../../DB/models/comment.model.js";
import PostModel from "../../../../DB/models/post.model.js";
import cloudinary from "../../../utls/cloudinary.js";

export const createComment = async (req, res, next) => {
    req.body.postId=req.params.id;
    req.body.userId=req.user._id;
    req.body.userName=req.user.userName;
    req.body.image=req.user.image;
    const post=await PostModel.findById(req.params.id);
    if(!post){
        return next(new Error(`invalid post id`));
    }

    if(req.file){
        const {secure_url,public_id} =await cloudinary.uploader.upload(req.file.path,{folder:'comment'});
        req.body.image={secure_url,public_id}
    }
    
    const comment=await commentModel.create(req.body);
    return res.status(201).json({message:"success",comment});

}