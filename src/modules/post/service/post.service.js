import cloudinary from "../../../utls/cloudinary.js";
import userModel from "../../../../DB/models/admin.model.js";
import commentModel from "../../../../DB/models/comment.model.js";
import PostModel from "../../../../DB/models/post.model.js";


export const create = async (req, res, next) => {
    const { title, caption } = req.body;
    const id = req.user._id;

    // التحقق مما إذا كانت هناك صورة مرفقة في الطلب
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APP_NAME}/post`
        });
        const post = await PostModel.create({ title, caption, userId: id,image:{ secure_url, public_id } });
        return res.json({ message: "success", post });
    }
else{
    const post = await PostModel.create({ title, caption, userId: id });
    return res.json({ message: "success", post });

}
   

};



export const likePost = async (req, res, next) => {
    const { id } = req.params;//id post
    const user_id = req.user._id;

    const post = await PostModel.findByIdAndUpdate(id, { $addToSet: { like: user_id } },
        {
            new: true
        })
    post.totalvote = post.like.length - post.unlike.length;
    await post.save();
    return res.status(200).json({ message: "success", post });
}

export const unlikePost = async (req, res, next) => {
    const { id } = req.params;//id post
    const user_id = req.user._id;

    const post = await PostModel.findByIdAndUpdate(id, { $addToSet: { unlike: user_id }, $pull: { like: user_id } },
        {
            new: true
        })
    post.totalvote = post.like.length - post.unlike.length;
    await post.save();
    return res.status(200).json({ message: "success", post });
}

export const getPost = async (req, res, next) => {
const posts = await PostModel.find({}).populate([

    {
        path:'userId',
        select:'userName'
    },
    {
        path:'like',
        select:'userName'  
    },

    {
        path:'unlike',
        select:'userName'  
    },
    {
        path:'comment',
    }
 
]);


return res.status(200).json({message:"success",posts});

}
