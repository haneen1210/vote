import cloudinary from "../../../utls/cloudinary.js";
import userModel from "../../../../DB/models/admin.model.js";
import PostModel from "../../../../DB/models/post.model.js";
import VoteModel from "../../../../DB/models/vote.model.js";

//هذه الدالة تقوم بإنشاء منشور جديد وإضافته إلى التصويت المحدد
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
        //addto set بدون تكرار
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
//تُعيد هذه الدالة جميع المنشورات المتعلقة بالتصويت المحدد، مع بيانات المستخدمين
export const getPost = async (req, res, next) => {
    try {
        const { id } = req.params; // id vote
        const vote = await VoteModel.findOne({ _id: id });
        if (!vote) {
            return res.status(404).json({ message: "Vote not found" });
        }
        
        const postvote = await VoteModel.findById(id).populate({
            path: "Posts",
            populate: [
                {
                    path: 'userId',
                    select: 'userName image'
                },
                {
                    path: 'like',
                    select: 'userName'
                },
                {
                    path: 'unlike',
                    select: 'userName'
                },
                {
                    path: 'comment'
                }
            ]
        });

        return res.status(200).json({ message: "success", postvote });
    } catch (error) {
        next(error);
    }
};

//تُعيد هذه الدالة بيانات منشور محدد بناءً على مُعرفه، مع بيانات المستخدمين
export const geSpecifictPost = async (req, res, next) => {
    const { id } = req.params; // id post
    const post = await PostModel.findOne({_id:id});
    if (!post ) {
        return res.status(404).json({ message: "post  not found" });
      }
      const postmodel = await PostModel.find(post).populate([
        

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
                populate: {
                    path:'userId',select :'image.secure_url userName'
                }

                

                
            }
            
         
       
        
        
        ]);
      return res.status(200).json({message:`success `,postmodel});


}