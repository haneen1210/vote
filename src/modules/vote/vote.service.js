import voteModel from "../../../DB/models/vote.model.js";
import cloudinary from "../../utls/cloudinary.js";
import moment from "moment";
import userModel from "../../../DB/models/admin.model.js";
import XLSX from "xlsx";
import ResultModel from "../../../DB/models/Result.model.js";

export const createVote = async (req, res, next) => {
  const { voteName, VotingStatus, description, StartDateVote, EndDateVote, image, AdminID } = req.body;
  if (await voteModel.findOne({ voteName })) {
    return next(new Error("voteName already exists", { cause: 409 }));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/vote`,
    },
  );
  const createVote = await voteModel.create({voteName, VotingStatus, description, StartDateVote, EndDateVote, image: { secure_url, public_id },AdminID});
  return res.status(201).json({ message: "success", createVote });
};

export const getVotes = async (req, res, next) => {
  const votes = await voteModel.find();
  return res.status(200).json({ message: "success", votes });
};

export const getVotesByAdmin = async (req, res, next) => {
  const { adminId } = req.params;
  const votes = await voteModel.find({ AdminID: adminId });
  if (!votes) {
    return res.status(404).json({ message: "No votes found for this admin" });
  }
  return res.status(200).json({ message: "success", votes });
};

export const updateVotingStatus = async (req, res, next) => {
  const Admin_id = req.user._id; 

  const { id } = req.params;
  const vote = await voteModel.findOne({ _id: id });
  if (Admin_id.toString() !== vote.AdminID.toString()) {
    return res.status(403).json({ message: "Unauthorized action" });
  }

  if (!vote) {
    return res.status(404).json({ message: "vote not found" });
  }
  if (req.body.VotingStatus === "Active") {
    const currentTime = moment();
    const allowedStartTime = moment(vote.StartDateVote);
    const allowedEndTime = moment(vote.EndDateVote);
    if (currentTime.isBetween(allowedStartTime, allowedEndTime)) {
      vote.VotingStatus = "Active";
      await vote.save();
      return res.status(201).json({
        message: "success Voting has been activated successfully",
        vote,
      });
    } else {
      return res.status(400).json({
        message:
          "Not useful for modifying the voting status outside the voting period",
      });
    }
  } else if (req.body.VotingStatus === "Inactive") {
    vote.VotingStatus = "Inactive";
    await vote.save();
    return res
      .status(200)
      .json({ message: "Voting has been successfully deactivated", vote });
  } else {
    return res
      .status(400)
      .json({ message: "The requested status is not recognized" });
  }
};


export const sendReminderVotingStatus = async (req, res, next) => {
    try {
        // العثور على جميع التصويتات التي موعدها انتهى
        const expiredVotes = await voteModel.find({ EndDateVote: { $lt: new Date() } });

        // تحديث حالة التصويت لكل تصويت منتهي
        for (const vote of expiredVotes) {
            vote.VotingStatus = "Inactive";
            await vote.save();
            console.log(`Voting is optionally chosen to vote: ${vote._id} ${vote.voteName}`);
        }
    } catch (error) {
        console.error("An error occurred while terminating voting automatically:", error.message);
    }


}


export const getVoteOpen = async (req, res, next) => {
  const votes = await voteModel.find({ VotingStatus: "Active" });
  return res.status(200).json({ message: "success", votes });
};

export const getpreviousvotes = async (req, res, next) => {
    const votes = await voteModel.find({ VotingStatus: "Inactive",EndDateVote: { $lt: new Date() }  });
    return res.status(200).json({ message: "success", votes });
  };


export const getspecificVote = async (req, res) => {
  const { id } = req.params;
  const vote = await voteModel.findById(id);
  if (!vote) {
    return res.status(404).json({ message: "vote not found" });
  }
  const subvote = await voteModel.findById(id).populate({
    path: "candidates",
  });
  return res.status(200).json({ message: "success", subvote });
};

export const getallVoteandcatecory = async (req, res) => {
  const subvote = await voteModel.find().populate({
    path: "candidates",
  });
  return res.status(200).json({ message: "success", subvote });
};


// وظيفة لإضافة مرشح موجود إلى التصويت
export const addExistingCandidateToVote = async (req, res) => {
  const { userName, voteName } = req.body;
  const Admin_id = req.user._id; 

  const candidate = await userModel.findOne({userName, role: "Candidate" });
  const vote = await voteModel.findOne({ voteName});
 
  if (Admin_id.toString() !== vote.AdminID.toString()) {
    return res.status(403).json({ message: "Unauthorized action" });
  }
  if (!vote || !candidate) {
    return res.status(404).json({ message: "Vote or Candidate not found" });
  }
  const existingCandidate = await voteModel.findOne({
        _id: vote._id,
        candidates: candidate._id,
  });
  if (existingCandidate) {
    return res
      .status(400)
      .json({ message: "Candidate already exists in the vote" });
  }
  vote.candidates.push(candidate);
  await vote.save();
  return res
    .status(200)
    .json({ message: "Candidate added to vote successfully" });
};

export const uploadExcelCandidateToVote = async (req, res, next) => {
  try {
    const woorkBook = XLSX.readFile(req.file.path);
    const woorkSheet = woorkBook.Sheets[woorkBook.SheetNames[0]];
    const users = XLSX.utils.sheet_to_json(woorkSheet);

    for (const row of users) {
      const { CandidateName, voteName } = row;
      // Find the vote and candidate in the database
      const candidate = await userModel.findOne({
        userName: CandidateName,
        role: "Candidate",
      });
      const vote = await voteModel.findOne({ voteName: voteName });
      //console.log(vote);

      // Check if the vote and candidate exist
      if (!vote || !candidate) {
        console.log(
          `Vote or Candidate not found for voteName ${voteName} and CandidateName ${CandidateName}`,
        );
        continue; // Skip to the next row
      }
      // Check if the candidate already exists in the vote
      const existingCandidate = await voteModel.findOne({
        _id: vote._id,
        candidates: candidate._id,
      });
      if (existingCandidate) {
        console.log(
          `Candidate ${CandidateName} already exists in the vote ${voteName}`,
        );
        continue; // Skip to the next row
      }

      // Add the candidate to the vote
      vote.candidates.push(candidate);
      await vote.save();
      console.log(
        `Candidate ${CandidateName} added to vote ${voteName} successfully`,
      );
    }
    return res
      .status(200)
      .json({ message: "Candidates added to votes successfully" });
  } catch (error) {
    console.error("Error while uploading candidates to votes:", error);
    return res
      .status(500)
      .json({ message: "Error while uploading candidates to votes" });
  }
};


export const removeCandidateFromVote = async (req, res) => {
    const { userName, voteName } = req.body;
    const Admin_id = req.user._id; 

    
    const candidate = await userModel.findOne({userName, role: "Candidate", });
    const vote = await voteModel.findOne({ voteName});
    
    if (Admin_id.toString() !== vote.AdminID.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }
    if (!vote || !candidate) {
      return res.status(404).json({ message: "Vote or Candidate not found" });
    }
    const existingCandidate = await voteModel.findOneAndUpdate({ _id: vote._id, candidates: candidate._id},{ $pull: { candidates: candidate._id } });

    
      
  if (!existingCandidate) {
    return res.status(400).json({ message: "Candidate not exists in the vote" });
  }

  await vote.save();
  return res.status(200).json({ message: "Candidate removed from vote successfully" });
};
/*
export const join1 = async (req, res, next) => {
  const { idvote } = req.params;//id idvote
  const { idcandidate } = req.params;//id idcandidate
  const user_id = req.user._id;
  if (!idvote || !idcandidate) {
    return res.status(404).json({ message: "Vote or Candidate not found" });
  }
  const inactiveVote = await voteModel.findOne({ _id: idvote, VotingStatus: "Inactive" });
  if (inactiveVote) {
    return res.status(400).json({ message: "The voting period has ended" });
  }
  const join = await voteModel.findByIdAndUpdate(idvote, { $addToSet: { join1: user_id } },
      {
          new: true
      })
      const result = await ResultModel.create({VoteId:idvote,candidateId:idcandidate,userId: user_id });
  await join.save();
  return res.status(200).json({ message: "success", join,result });
}

*/

export const join1 = async (req, res, next) => {
  const { idvote, idcandidate } = req.params;
  const user_id = req.user._id;
  
  // Check if both vote and candidate IDs are provided
  if (!idvote || !idcandidate) {
    return res.status(404).json({ message: "Vote or Candidate not found" });
  }
  // Check if the vote is inactive
  const inactiveVote = await voteModel.findOne({ _id: idvote, VotingStatus: "Inactive" });
  if (inactiveVote) {
    return res.status(400).json({ message: "The voting period has ended" });
  }

  // Check if the user has already participated in this vote
  const existingParticipation = await ResultModel.findOne({ VoteId: idvote, userId: user_id });
  if (existingParticipation) {
    return res.status(409).json({ message: "User has already participated in this vote" });
  }

  // Add user to the vote (assuming that join1 is an array of user IDs)
  const join = await voteModel.findByIdAndUpdate(
    idvote,
    { $addToSet: { join1: user_id } },  // Ensures user is added only once
    { new: true }
  );

  // Create a result entry for the user's participation
  const result = await ResultModel.create({ VoteId: idvote, candidateId: idcandidate, userId: user_id });

  // There's no need to call save after findByIdAndUpdate if you're not making additional changes to 'join'
  return res.status(200).json({ message: "Success", join, result });
};


export const countVotesForCandidates = async (req, res) => {
     // استخدام Mongoose لجمع الأصوات وتعبئة التفاصيل ذات الصلة
     const results = await ResultModel.aggregate([
      {
          $group: {
              _id: {
                  VoteId: "$VoteId",
                  candidateId: "$candidateId"
              },
              count: { $sum: 1 }
          }
      }
  ]);

  // تحويل نتائج التجميع إلى وعدات لتعبئة تفاصيل التصويت والمرشحين
  const populatedResults = await Promise.all(
      results.map(async result => {
          const voteDetails = await voteModel.findById(result._id.VoteId);
          const candidateDetails = await userModel.findById(result._id.candidateId);

          // فحص إذا كانت تفاصيل التصويت أو المرشح موجودة
          if (!voteDetails || !candidateDetails) {
              return null;  // يمكنك أيضاً تعديل هذا السلوك ليتناسب مع متطلباتك
          }

          return {
              voteId: result._id.VoteId,
              candidateId: result._id.candidateId,
              voteName: voteDetails.voteName,
              candidateName: candidateDetails.userName,
              voteCount: result.count
          };
      })
  );

  // تصفية النتائج الفارغة
  const finalResults = populatedResults.filter(result => result !== null);

  res.status(200).json({
      message: "Vote counts for each candidate including candidate names",
      results: finalResults
  });

};

/*
export const countVotesForCandidates = async (req, res) => {

      const results = await ResultModel.aggregate([
          { $group: { _id: { VoteId: "$VoteId", candidateId: "$candidateId" }, count: { $sum: 1 } } }
      ]);

      const populatedResults = await Promise.all(results.map(async result => {
        const voteDetails = await voteModel.findById(result._id.VoteId);
        const candidateDetails = await userModel.findById(result._id.candidateId);

          // التحقق من أن voteDetails و candidateDetails ليست null قبل الوصول إلى خصائصها
          if (!voteDetails || !candidateDetails) {
              console.log('One of the documents was not found:', { voteDetails, candidateDetails });
              return {
                  voteId: result._id.VoteId,
                  candidateId: result._id.candidateId,
                  voteName: voteDetails ? voteDetails.voteName : 'Vote details not found',
                  candidateName: candidateDetails ? candidateDetails.userName : 'Candidate details not found',
                  voteCount: result.count
              };
          }

          return {
              voteId: result._id.VoteId,
              candidateId: result._id.candidateId,
              voteName: voteDetails.voteName,
              candidateName: candidateDetails.userName,
              voteCount: result.count
          };
      }));

      res.status(200).json({
          message: "Vote counts for each candidate including candidate names",
          results: populatedResults
      });
 
};


*/

export const findUserVotes = async (req, res) => {
  const { userId } = req.params;
      // استعلام لجلب جميع معرفات التصويتات التي شارك فيها المستخدم
      const userVotes = await ResultModel.find({ userId }) .select('VoteId -_id'); // اختيار فقط حقل VoteId وإخفاء _id

      // تحويل النتيجة إلى مصفوفة من معرفات التصويت
      const voteIds = userVotes.map(vote => vote.VoteId);
      // استعلام لجلب تفاصيل التصويتات باستخدام معرفات التصويت
      const voteDetails = await voteModel.find({ _id: { $in: voteIds } });
      res.status(200).json({
          message: 'Retrieved all votes the user has participated in',
          data: voteDetails
      });
};

/*
export const uploadExcelCandidateToVote = async (req, res, next) => {
  try {
    const woorkBook = XLSX.readFile(req.file.path);
    const woorkSheet = woorkBook.Sheets[woorkBook.SheetNames[0]];
    const users = XLSX.utils.sheet_to_json(woorkSheet);
    for (const row of users) {
      const { CandidateID, voteID } = row;
      // Find the vote and candidate in the database
      const vote = await voteModel.findOne({ _id: voteID });
      const candidate = await userModel.findOne({
        _id: CandidateID,
        role: "Candidate",
      });
      if (!vote || !candidate) {
        console.log(
          `Vote or Candidate not found for voteID ${voteID} and CandidateID ${CandidateID}`,
        );
        continue; // Skip to the next row
      }
      // Check if the candidate already exists in the vote
      const existingCandidate = await voteModel.findOne({
        _id: voteID,
        candidates: CandidateID,
      });
      if (existingCandidate) {
        console.log(
          `Candidate ${CandidateID} already exists in the vote ${voteID}`,
        );
        continue; // Skip to the next row
      }
      // Add the candidate to the vote
      vote.candidates.push(candidate);
      await vote.save();
      console.log(
        `Candidate ${CandidateID} added to vote ${voteID} successfully`,
      );
    }
    return res
      .status(200)
      .json({ message: "Candidates added to votes successfully" });
  } catch (error) {
    console.error("Error while uploading candidates to votes:", error);
    return res
      .status(500)
      .json({ message: "Error while uploading candidates to votes" });
  }
};*/

//localhost:5000/


/*
export const getUserVotes = async (req, res) => {

  // احصل على معرف المستخدم من التوكين
  const userId = req.user._id;

  // العثور على جميع التصويتات التي شارك فيها المستخدم
  const userVotes = await ResultModel.find({ userId })
      .populate({
          path: 'VoteId',
          select: 'voteName VotingStatus StartDateVote EndDateVote description image'
      });

  // استخراج التصويتات فقط من نتائج الاستعلام
  const votes = userVotes.map(result => result.VoteId);

  res.status(200).json({
      message: "Successfully retrieved user's votes",
      votes
  });

};*/

export const getUserVotes = async (req, res) => {
 
      // احصل على معرف المستخدم من التوكين
      const userId = req.user._id;
      const user = await userModel.findOne({ _id: userId, role: 'User' });
     
      if (!user) {
          return res.status(403).json({ message: "Unauthorized: You are not a user" });
      }
      // العثور على جميع التصويتات التي شارك فيها المستخدم
      const userVotes = await ResultModel.find({ userId })
          .populate({
              path: 'VoteId',
              select: 'voteName VotingStatus StartDateVote EndDateVote description image'
          })
          .populate({
              path: 'userId',
              select: 'userName'
          });

      // تحويل النتائج إلى تنسيق مناسب
      const votes = userVotes.map(result => ({
          userName: result.userId?.userName || "Unknown User",
          voteName: result.VoteId?.voteName || "Unknown Vote",
        //  VotingStatus: result.VoteId?.VotingStatus || "Unknown",
        //  StartDateVote: result.VoteId?.StartDateVote || "Unknown",
         // EndDateVote: result.VoteId?.EndDateVote || "Unknown",
         // description: result.VoteId?.description || "Unknown",
        //  image: result.VoteId?.image || {},
      }));

      res.status(200).json({
          message: "Successfully retrieved user's votes",
          votes
      });
 
};









