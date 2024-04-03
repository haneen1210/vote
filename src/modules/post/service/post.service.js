import cloudinary from "../../../utls/cloudinary.js";
import userModel from "../../../../DB/models/admin.model.js";
import PostModel from "../../../../DB/models/post.model.js";
import VoteModel from "../../../../DB/models/vote.model.js";


export const create = async (req, res, next) => {
    const { title, caption,voteName } = req.body;
    const id = req.user._id;
    const role = req.user.role;
    const image = req.user.image;

    const vote = await VoteModel.findOne({ voteName});
    if (!vote ) {
        return res.status(404).json({ message: "Vote  not found" });
      }
    // التحقق مما إذا كانت هناك صورة مرفقة في الطلب
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APP_NAME}/post`
        });
        const post = await PostModel.create({ title, caption, userId: id,image:{ secure_url, public_id } });
        vote.Posts.push(post);
    await vote.save();
        return res.json({ message: "success", post , role , image});
    }
else{
    const post = await PostModel.create({ title, caption, userId: id });
    vote.Posts.push(post);
    await vote.save();
    return res.json({ message: "success", post , role ,image});
    
}
}

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
    const { id } = req.params; // id vote
    const vote = await VoteModel.findOne({_id:id});
    if (!vote ) {
        return res.status(404).json({ message: "Vote  not found" });
      }
      const postvote = await VoteModel.find(vote).populate({
        path: "Posts",
        populate: ([

            {
                path:'userId',
                select:'userName image'
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
            
         
        ])
        
        
      });
      return res.status(200).json({message:`success `,postvote});


}
