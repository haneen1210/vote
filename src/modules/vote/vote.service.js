import voteModel from "../../../DB/models/vote.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../../utls/cloudinary.js";
import moment from "moment";
import userModel from "../../../DB/models/admin.model.js";
import XLSX from "xlsx";


export const createVote = async (req, res, next) => {
  const {
    voteName,
    VotingStatus,
    description,
    StartDateVote,
    EndDateVote,
    image,
  } = req.body;
  if (await voteModel.findOne({ voteName })) {
    return next(new Error("voteName already exists", { cause: 409 }));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/vote`,
    },
  );
  const createVote = await voteModel.create({
    voteName,
    VotingStatus,
    description,
    StartDateVote,
    EndDateVote,
    image: { secure_url, public_id },
  });
  return res.status(201).json({ message: "success", createVote });
};

export const getVotes = async (req, res, next) => {
  const votes = await voteModel.find();
  return res.status(200).json({ message: "success", votes });
};
export const updateVotingStatus = async (req, res, next) => {
  const { id } = req.params;
  const vote = await voteModel.findOne({ _id: id });
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

export const getspecificVote = async (req, res) => {
  const { id } = req.params;
  const vote = await voteModel.findById(id);
  if (!vote) {
    return res.status(404).json({ message: "vote not found" });
  }
  const subvote = await voteModel.find(vote).populate({
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
  const candidate = await userModel.findOne({userName, role: "Candidate", });
  const vote = await voteModel.findOne({ voteName});

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
    const candidate = await userModel.findOne({userName, role: "Candidate", });
    const vote = await voteModel.findOne({ voteName});
  
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