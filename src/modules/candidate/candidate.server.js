import userModel from "../../../DB/models/admin.model.js";
import PostModel from "../../../DB/models/post.model.js";
import VoteModel from "../../../DB/models/vote.model.js";
import WithdrawalModel from "../../../DB/models/withdrawa.model.js";


export const getcandidate = async (req, res, next) => {
    const Candidate = await userModel. find({ isDeleted: false , role : 'Candidate',statuse:'Active'});
    return res.status(200).json({ message: "success", Candidate });

}
export const getspecificCandidateinvote = async (req, res) => {
    const { CandidateID } = req.params;
    const vote = await VoteModel.findOne({ "candidates": CandidateID });
    if (!vote) {
        return res.status(404).json({ message: "Vote not found" });
    }
    return res.status(200).json({ message: "Vote found", vote });

}

export const getspecificCandidate = async (req, res) => {
    const { CandidateID } = req.params;
    const candidate = await userModel.findOne({ _id: CandidateID });
    if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
    }
    return res.status(200).json({ message: "Candidate found", candidate });

}


export const getspecificCandidateinvotes = async (req, res) => {
    try {
        const user_id = req.user._id;

        // تحقق من أن المستخدم مرشح
        const candidate = await userModel.findOne({ _id: user_id, role: 'Candidate' });
        if (!candidate) {
            return res.status(403).json({ message: "Unauthorized: You are not a candidate" });
        }

        // الحصول على جميع التصويتات التي يشارك فيها المرشح
        const votes = await VoteModel.find({ candidates: user_id }).populate('candidates');

        // تحويل نتائج التصويت إلى التنسيق المناسب
        const voteNames = votes.map(vote => vote.voteName);

        // إضافة تفاصيل المرشح
        const candidateDetails = {
            userName: candidate.userName,
            image: candidate.image,
            voteNames
        };

        res.status(200).json({
            message: "Successfully retrieved candidate votes",
            candidate: candidateDetails,
            id: user_id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching candidate votes', error: error.message });
    }
};




export const requestWithdrawal = async (req, res) => {
    const { voteName, reason ,AdminName} = req.body; //userName=Admin
    const candidateId = req.user._id; // candidateId

    // تحقق من أن المرشح موجود وله الصلاحية
    const candidate = await userModel.findOne({ _id: candidateId, role: 'Candidate' });
    if (!candidate) {
        return res.status(404).json({ message: "Candidate not found or unauthorized" });
    }

    // ابحث عن التصويت باستخدام `voteName` بدلاً من `voteId`
    const vote = await VoteModel.findOne({ voteName });
    if (!vote) {
        return res.status(404).json({ message: "Vote not found" });
    }

    const Admin = await userModel.findOne({ userName:AdminName ,role: 'Admin'});
    if (!Admin) {
        return res.status(404).json({ message: "Admin not found" });
    }


    // تحقق من أن المرشح مشارك في التصويت
    if (!vote.candidates.includes(candidateId)) {
        return res.status(400).json({ message: "Candidate not participating in the vote" });
    }

    // تحقق من عدم وجود طلب انسحاب مكرر
    const existingWithdrawalRequest = await WithdrawalModel.findOne({ candidateId, voteId: vote._id ,AdminID:Admin._id});
    if (existingWithdrawalRequest) {
        return res.status(409).json({ message: "Withdrawal request already submitted for this vote" });
    }

    // التحقق من وجود حقل "reason"
    if (!reason || reason.trim() === "") {
        return res.status(400).json({ message: "Reason for withdrawal is required" });
    }

    // إنشاء طلب انسحاب جديد
    const withdrawalRequest = await WithdrawalModel.create({candidateId, voteId: vote._id, reason, AdminID:Admin._id });

    res.status(201).json({ message: "Withdrawal request submitted successfully", withdrawalRequest });
};



export const getCandidatePosts = async (req, res) => {
    try {
        // احصل على معرف المستخدم من التوكين
        const candidateId = req.user._id;

        // تحقق مما إذا كان المستخدم هو بالفعل مرشح
        const candidate = await userModel.findOne({ _id: candidateId, role: 'Candidate' });
        if (!candidate) {
            return res.status(403).json({ message: "Unauthorized: You are not a candidate" });
        }

        // احصل على جميع البوستات الخاصة بالمرشح
        const posts = await PostModel.find({ userId: candidateId, isDeleted: false })
            .select('title caption image like unlike createdAt updatedAt') // اختر فقط الحقول المطلوبة
            .populate({
                path: 'userId',
                select: 'userName image'
            });

        // تحويل النتائج إلى تنسيق مناسب
        const formattedPosts = posts.map(post => ({
            title: post.title,
            caption: post.caption || "",
            image: post.image || {},
            candidateName: post.userId?.userName || "Unknown Candidate",
            candidateImage: post.userId?.image || {},
            likes: post.like.length,
            unlikes: post.unlike.length,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        }));

        res.status(200).json({
            message: "Successfully retrieved candidate's posts",
            posts: formattedPosts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching candidate posts', error: error.message });
    }
};




/*
export const getCandidatePostsShow = async (req, res) => {
    try {
        // احصل على معرف المستخدم من التوكين
        const { candidateId } = req.params;

        // تحقق مما إذا كان المستخدم هو بالفعل مرشح
        const candidate = await userModel.findOne({ _id: candidateId, role: 'Candidate' });
        if (!candidate) {
            return res.status(403).json({ message: "Unauthorized: You are not a candidate" });
        }

        // احصل على جميع البوستات الخاصة بالمرشح
        const posts = await PostModel.find({ userId: candidateId, isDeleted: false })
            .select('title caption image like unlike createdAt updatedAt') // اختر فقط الحقول المطلوبة
            .populate({
                path: 'userId',
                select: 'userName image'
            });

        // تحويل النتائج إلى تنسيق مناسب
        const formattedPosts = posts.map(post => ({
            title: post.title,
            caption: post.caption || "",
            image: post.image || {},
            candidateName: post.userId?.userName || "Unknown Candidate",
            candidateImage: post.userId?.image || {},
            likes: post.like.length,
            unlikes: post.unlike.length,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        }));

        res.status(200).json({
            message: "Successfully retrieved candidate's posts",
            posts: formattedPosts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching candidate posts', error: error.message });
    }
};*/
export const getCandidatePostsShow = async (req, res) => {
    try {
        const { candidateId } = req.params;

        const candidate = await userModel.findOne({ _id: candidateId, role: 'Candidate' });
        if (!candidate) {
            return res.status(403).json({ message: "Unauthorized: You are not a candidate" });
        }

        const posts = await PostModel.find({ userId: candidateId, isDeleted: false })
            .select('title caption image like unlike createdAt updatedAt')
            .populate({
                path: 'userId',
                select: 'userName image',
            })
            .populate({
                path: 'comment',
                match: { isDeleted: false },
                select: 'text userId createdAt',
                populate: {
                    path: 'userId',
                    select: 'userName image',
                },
            });

        const formattedPosts = posts.map(post => ({
            title: post.title,
            caption: post.caption || "",
            image: post.image || {},
            candidateName: post.userId?.userName || "Unknown Candidate",
            candidateImage: post.userId?.image || {},
            likes: post.like.length,
            unlikes: post.unlike.length,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            comments: post.comment.map(comment => ({
                text: comment.text,
                userName: comment.userId?.userName || "Unknown User",
                userImage: comment.userId?.image || {},
                createdAt: comment.createdAt,
            })),
        }));

        res.status(200).json({
            message: "Successfully retrieved candidate's posts",
            posts: formattedPosts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching candidate posts', error: error.message });
    }
};

