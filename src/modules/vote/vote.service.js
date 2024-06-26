import voteModel from "../../../DB/models/vote.model.js";
import cloudinary from "../../utls/cloudinary.js";
//import moment from "moment";
import userModel from "../../../DB/models/admin.model.js";
import XLSX from "xlsx";
import ResultModel from "../../../DB/models/Result.model.js";
import moment from 'moment-timezone';
import crypto from 'crypto-js';



//تقوم بإنشاء تصويت جديد
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

//تُستخدم لاسترجاع جميع التصويتات المتاحة من قاعدة البيانات
export const getVotes = async (req, res, next) => {
  const votes = await voteModel.find();
  return res.status(200).json({ message: "success", votes });
};
//تُستخدم لاسترجاع التصويتات التي تخص مُسؤول معين بناءً على اي دي.
export const getVotesByIDAdmin = async (req, res, next) => {
  const {AdminID}  = req.params;
  const votes = await voteModel.find({ AdminID });
  if (!votes) {
    return res.status(404).json({ message: "No votes found for this admin" });
  }
  return res.status(200).json({ message: "success", votes });
};

//تُستخدم لاسترجاع التصويتات التي تخص المُسؤول الحالي (المُسجل الدخول).
export const getVotesByAdmin = async (req, res, next) => {
  const AdminID  = req.user._id;
  const votes = await voteModel.find({ AdminID });
  if (!votes) {
    return res.status(404).json({ message: "No votes found for this admin" });
  }
  return res.status(200).json({ message: "success", votes });
};

//ستخدم لتحديث حالة التصويت (نشط أو غير نشط) بناءً على طلب المُسؤول.
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

//ستخدم لتحديث حالة التصويتات التي انتهت مدة صلاحيتها إلى "غير نشط".
function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
  return newDate;   
}
export const sendReminderVotingStatus = async () => {
  try {
    let currentLocalDate = convertUTCDateToLocalDate(new Date());
    console.log("current",currentLocalDate);
    const allVotes = await voteModel.find({});
    const expiredVotes = [];

    for (const vote of allVotes) {
      let endDate = new Date(vote.EndDateVote);
      if (endDate <= currentLocalDate) {
        expiredVotes.push(vote);
      }
    }

    for (const vote of expiredVotes) {
      console.log(vote._id);
      await voteModel.updateOne({_id:vote._id},{VotingStatus:"Inactive"});
    }
    console.log("Done");

  } catch (error) {
    console.error('An error occurred while updating voting status:', error.message);
  }
};

//تُستخدم لاسترجاع التصويتات التي لا تزال نشطة.
export const getVoteOpen = async (req, res, next) => {
  const votes = await voteModel.find({ VotingStatus: "Active" });
  return res.status(200).json({ message: "success", votes });
};
//تُستخدم لاسترجاع التصويتات السابقة التي أصبحت غير نشطة (مدة التصويت انتهت).
export const getpreviousvotes = async (req, res, next) => {
    const votes = await voteModel.find({ VotingStatus: "Inactive",EndDateVote: { $lt: new Date() }  });
    return res.status(200).json({ message: "success", votes });
  };

//تُستخدم لاسترجاع تفاصيل تصويت معين بناءً على مُعرفه.
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
//تُستخدم لاسترجاع جميع التصويتات مع تفاصيل المرشحين.
export const getallVoteandcatecory = async (req, res) => {
  const subvote = await voteModel.find().populate({
    path: "candidates",
  });
  return res.status(200).json({ message: "success", subvote });
};

//تُستخدم لاسترجاع التصويتات التي شارك فيها مستخدم معين.
export const getUserinVote = async (req, res) => {
  try {
      const user_id = req.user._id;
      
      // ابحث عن التصويتات التي تحتوي على المستخدم في الحقل Users
      const subvotes = await voteModel.find({ Users: user_id })
          .select('voteName VotingStatus description image StartDateVote EndDateVote AdminID') // اختر فقط الحقول المطلوبة
          .populate({
              path: 'AdminID',
              select: 'userName'
          });

      // التحقق إذا كانت النتيجة فارغة
      if (!subvotes.length) {
          return res.status(404).json({ message: "No votes found for this user" });
      }

      return res.status(200).json({ message: "success", subvotes });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred while fetching votes", error: error.message });
  }
};

// وظيفة لإضافة مرشح موجود إلى التصويت
export const addExistingCandidateToVote = async (req, res) => {
  const { userName, voteName } = req.body;
  const Admin_id = req.user._id; 

  const candidate = await userModel.findOne({isDeleted: false,userName, role: "Candidate" });
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
// وظيفة لإضافة مرشح موجود إلى التصويت عن طريق ملف اكسل 
export const uploadExcelCandidateToVote = async (req, res, next) => {
  try {
    const Admin_id = req.user._id;
    // تحقق من وجود الملف قبل محاولة قراءته
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const workBook = XLSX.readFile(req.file.path);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const users = XLSX.utils.sheet_to_json(workSheet);
    const errors = [];
    const successes = [];

    for (const row of users) {
      const { CandidateName,voteName } = row;

      // Find the vote and candidate in the database
      const candidate = await userModel.findOne({ userName: CandidateName, role: "Candidate" });
      const vote = await voteModel.findOne({ voteName });

      if (!vote) {
        errors.push({ message: `Vote not found for voteName: ${voteName}`, CandidateName });
        continue;
      }
      if (Admin_id.toString() !== vote.AdminID.toString()) {
        errors.push({ message: "Unauthorized action by this admin", CandidateName, voteName });
        continue;
      }

      if (!candidate) {
        errors.push({ message: `Candidate not found: ${CandidateName}`, voteName });
        continue;
      }

      // Check if the candidate already exists in the vote
      const existingCandidate = vote.candidates.includes(candidate._id);
      if (existingCandidate) {
        errors.push({ message: `Candidate ${CandidateName} already exists in the vote ${voteName}` });
        continue;
      }
      
      // Add the candidate to the vote
      vote.candidates.push(candidate._id);
      await vote.save();
      successes.push({ message: `Candidate ${CandidateName} added to vote ${voteName} successfully` });
    }

    return res.status(200).json({ message: "Candidates processed successfully", successes, errors });

  } catch (error) {
    return res.status(500).json({ message: "Error while uploading candidates to votes", error });
  }
};

//تُستخدم لإزالة مرشح موجود من التصويت
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
//تُستخدم للسماح للمستخدم بالانضمام إلى التصويت مع تحديد المرشح
export const join = async (req, res, next) => {
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

  // Check if the user is allowed to vote (if the user is in the 'Users' array of the vote)
  const vote = await voteModel.findById(idvote);
  if (!vote.Users.includes(user_id)) {
    return res.status(403).json({ message: "User is not allowed to vote in this election" });
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

*/


/*
// تُستخدم للسماح للمستخدم بالانضمام إلى التصويت مع تحديد المرشح***
export const join = async (req, res, next) => {
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

  // تشفير البيانات باستخدام AES
  const voteData = JSON.stringify({ idvote });
  const candidateData = JSON.stringify({ idcandidate });
  const userData = JSON.stringify({ user_id: user_id.toString() });

  const voteHash = crypto.AES.encrypt(voteData, process.env.ENCRYPTION_KEY).toString();
  const candidateHash = crypto.AES.encrypt(candidateData, process.env.ENCRYPTION_KEY).toString();
  const userHash = crypto.AES.encrypt(userData, process.env.ENCRYPTION_KEY).toString();

  // فك البيانات المخزنة في ResultModel والتحقق من المشاركة السابقة
  const results = await ResultModel.find({});
  for (let result of results) {
    try {
      const decryptedVoteId = JSON.parse(crypto.AES.decrypt(result.VoteId, process.env.ENCRYPTION_KEY).toString(crypto.enc.Utf8)).idvote;
      const decryptedUserId = JSON.parse(crypto.AES.decrypt(result.userId, process.env.ENCRYPTION_KEY).toString(crypto.enc.Utf8)).user_id;

      if (decryptedVoteId === idvote && decryptedUserId === user_id.toString()) {
        return res.status(409).json({ message: "User has already participated in this vote" });
      }
    } catch (error) {
      console.error('Error decrypting result:', error);
      continue; // إذا كانت هناك مشكلة في فك التشفير، تجاهل هذا السجل وانتقل إلى السجل التالي
    }
  }

  // Check if the user is allowed to vote (if the user is in the 'Users' array of the vote)
  const vote = await voteModel.findById(idvote);
  if (!vote.Users.includes(user_id)) {
    return res.status(403).json({ message: "User is not allowed to vote in this election" });
  }

  // Add user to the vote (assuming that join1 is an array of user IDs)
  const join = await voteModel.findByIdAndUpdate(
    idvote,
    { $addToSet: { join1: user_id } },  // Ensures user is added only once
    { new: true }
  );

  // Create a result entry for the user's participation
  const result = await ResultModel.create({
    VoteId: voteHash, 
    candidateId: candidateHash, 
    userId: userHash, 
  });

  // إرسال الاستجابة مع التجزئات المشفرة
  return res.status(200).json({ message: "Success", join, result });
};
*/

const encryptionKey = process.env.ENCRYPTION_KEY;
if (!encryptionKey) {
  throw new Error('ENCRYPTION_KEY is not defined in environment variables');
}

export const join = async (req, res, next) => {
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

  // تشفير البيانات باستخدام AES
  const voteData = JSON.stringify({ idvote });
  const candidateData = JSON.stringify({ idcandidate });
  const userData = JSON.stringify({ user_id: user_id.toString() });

  console.log('Encryption Key:', encryptionKey);
  console.log('Data to Encrypt:', { voteData, candidateData, userData });

  const voteHash = crypto.AES.encrypt(voteData, encryptionKey).toString();
  const candidateHash = crypto.AES.encrypt(candidateData, encryptionKey).toString();
  const userHash = crypto.AES.encrypt(userData, encryptionKey).toString();

  console.log('Encrypted Data:', { voteHash, candidateHash, userHash });

  // فك البيانات المخزنة في ResultModel والتحقق من المشاركة السابقة
  const results = await ResultModel.find({});
  for (let result of results) {
    try {
      const decryptedVoteId = JSON.parse(crypto.AES.decrypt(result.VoteId, encryptionKey).toString(crypto.enc.Utf8)).idvote;
      const decryptedUserId = JSON.parse(crypto.AES.decrypt(result.userId, encryptionKey).toString(crypto.enc.Utf8)).user_id;

      if (decryptedVoteId === idvote && decryptedUserId === user_id.toString()) {
        return res.status(409).json({ message: "User has already participated in this vote" });
      }
    } catch (error) {
      console.error('Error decrypting result:', error);
      continue; // إذا كانت هناك مشكلة في فك التشفير، تجاهل هذا السجل وانتقل إلى السجل التالي
    }
  }

  // Check if the user is allowed to vote (if the user is in the 'Users' array of the vote)
  const vote = await voteModel.findById(idvote);
  if (!vote.Users.includes(user_id)) {
    return res.status(403).json({ message: "User is not allowed to vote in this election" });
  }

  // Add user to the vote (assuming that join1 is an array of user IDs)
  const join = await voteModel.findByIdAndUpdate(
    idvote,
    { $addToSet: { join1: user_id } },  // Ensures user is added only once
    { new: true }
  );

  // Create a result entry for the user's participation
  const result = await ResultModel.create({
    VoteId: voteHash, 
    candidateId: candidateHash, 
    userId: userHash, 
  });

  // إرسال الاستجابة مع التجزئات المشفرة
  return res.status(200).json({ message: "Success", join, result });
};



export const countVotesForCandidates = async (req, res) => {
  const user_id = req.user._id;
  const user_role = req.user.role;

  let voteFilter;

  // تحديد الفلتر حسب دور المستخدم
  if (user_role === 'Admin') {
    voteFilter = { AdminID: user_id };
  } else if (user_role === 'User') {
    voteFilter = { Users: user_id };
  } else if (user_role === 'Candidate') {
    voteFilter = { candidates: user_id };
  } else if (user_role === 'SuperAdmin') {
    voteFilter = {}; // يعرض جميع التصويتات
  } else {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    // البحث عن التصويتات بناءً على دور المستخدم
    const votes = await voteModel.find(voteFilter);

    if (votes.length === 0) {
      return res.status(404).json({ message: 'No votes found for this user' });
    }

    // جمع معرفات التصويت
    const voteIds = votes.map(vote => vote._id.toString());

    // جلب جميع نتائج التصويت من ResultModel
    const results = await ResultModel.find({});

    // فك تشفير نتائج التصويت وتصفية النتائج التي تتطابق مع معرفات التصويت
    const decryptedResults = results.map(result => {
      try {
        const decryptedVoteId = JSON.parse(crypto.AES.decrypt(result.VoteId, encryptionKey).toString(crypto.enc.Utf8)).idvote;
        const decryptedCandidateId = JSON.parse(crypto.AES.decrypt(result.candidateId, encryptionKey).toString(crypto.enc.Utf8)).idcandidate;
        if (voteIds.includes(decryptedVoteId)) {
          return {
            ...result._doc, // نسخ جميع الحقول الأصلية
            decryptedVoteId,
            decryptedCandidateId
          };
        }
        return null; // تجاهل النتائج التي لا تتطابق
      } catch (error) {
        console.error('Error decrypting result:', error);
        return null; // تجاهل النتائج التي لا يمكن فك تشفيرها
      }
    }).filter(result => result !== null); // تصفية النتائج الفارغة

    // جمع الأصوات وتعبئة التفاصيل ذات الصلة
    const aggregatedResults = decryptedResults.reduce((acc, result) => {
      const key = `${result.decryptedVoteId}-${result.decryptedCandidateId}`;
      if (!acc[key]) {
        acc[key] = {
          voteId: result.decryptedVoteId,
          candidateId: result.decryptedCandidateId,
          count: 0
        };
      }
      acc[key].count += 1;
      return acc;
    }, {});

    // تحويل نتائج التجميع إلى وعود لتعبئة تفاصيل التصويت والمرشحين
    const finalResults = await Promise.all(Object.values(aggregatedResults).map(async result => {
      const voteDetails = await voteModel.findById(result.voteId);
      const candidateDetails = await userModel.findById(result.candidateId);

      if (!voteDetails || !candidateDetails) {
        return null;
      }

      return {
        voteId: result.voteId,
        candidateId: result.candidateId,
        voteName: voteDetails.voteName,
        candidateName: candidateDetails.userName,
        voteCount: result.count
      };
    }));

    // تصفية النتائج الفارغة
    const filteredResults = finalResults.filter(result => result !== null);

    res.status(200).json({
      message: "Vote counts for each candidate including candidate names",
      results: filteredResults
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/////

/*
//تُستخدم لجمع الأصوات لكل مرشح وإعادة تنسيق النتائج.
export const countVotesForCandidates = async (req, res) => {
  const user_id = req.user._id;
  const user_role = req.user.role;

  let voteFilter;

  // تحديد الفلتر حسب دور المستخدم
  if (user_role === 'Admin') {
      voteFilter = { AdminID: user_id };
  } else if (user_role === 'User') {
      voteFilter = { Users: user_id };
  } else if (user_role === 'Candidate') {
      voteFilter = { candidates: user_id };
  } else if (user_role === 'SuperAdmin') {
    voteFilter = {}; // يعرض جميع التصويتات
} else {
      return res.status(403).json({ message: 'Access denied' });
  }

  try {
      // البحث عن التصويتات بناءً على دور المستخدم
      const votes = await voteModel.find(voteFilter);

      if (votes.length === 0) {
          return res.status(404).json({ message: 'No votes found for this user' });
      }

      // جمع الأصوات وتعبئة التفاصيل ذات الصلة
      const results = await ResultModel.aggregate([
        //استخدام التجميع (aggregation) لجمع الأصوات لكل مرشح بناءً على VoteId و candidateId. يتم حساب عدد الأصوات باستخدام $sum
          {
              $match: {
                  VoteId: { $in: votes.map(vote => vote._id) }
              }
          },
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

      // تحويل نتائج التجميع إلى وعود لتعبئة تفاصيل التصويت والمرشحين
      const populatedResults = await Promise.all(
          results.map(async result => {
              const voteDetails = await voteModel.findById(result._id.VoteId);
              const candidateDetails = await userModel.findById(result._id.candidateId);

              // فحص إذا كانت تفاصيل التصويت أو المرشح موجودة
              if (!voteDetails || !candidateDetails) {
                  return null;  // يمكنك أيضاً تعديل هذا السلوك ليتناسب مع متطلباتك
     //إذا لم يتم العثور على تفاصيل التصويت أو المرشحين، يتم إرجاع null.

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

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

*/

 // جلب جميع نتائج التصويت من ResultModel
export const findUserVotes = async (req, res) => {
  const { userId } = req.params;

  try {
    // جلب جميع نتائج التصويت من ResultModel
    const results = await ResultModel.find({});

    // فك تشفير userId والمقارنة مع userId المطلوب
    const userVotes = results.filter(result => {
      try {
        const decryptedUserId = JSON.parse(crypto.AES.decrypt(result.userId, encryptionKey).toString(crypto.enc.Utf8)).user_id;
        return decryptedUserId === userId;
      } catch (error) {
        console.error('Error decrypting userId:', error);
        return false;
      }
    });

    if (userVotes.length === 0) {
      return res.status(404).json({ message: 'No votes found for this user' });
    }

    // فك تشفير معرفات التصويت
    const voteIds = userVotes.map(vote => {
      try {
        return JSON.parse(crypto.AES.decrypt(vote.VoteId, encryptionKey).toString(crypto.enc.Utf8)).idvote;
      } catch (error) {
        console.error('Error decrypting VoteId:', error);
        return null;
      }
    }).filter(idvote => idvote !== null); // تصفية القيم الفارغة

    // استعلام لجلب تفاصيل التصويتات باستخدام معرفات التصويت المفكوكة
    const voteDetails = await voteModel.find({ _id: { $in: voteIds } });

    res.status(200).json({
      message: 'Retrieved all votes the user has participated in',
      data: voteDetails
    });
  } catch (error) {
    console.error('Error retrieving user votes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/*
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

*/
// تُستخدم لاسترجاع التصويتات التي شارك فيها المستخدم الحالي.
export const getUserVotes = async (req, res) => {
  const userId = req.user._id;

  try {
    // تحقق من أن المستخدم هو من نوع 'User'
    const user = await userModel.findOne({ _id: userId, role: 'User' });
    if (!user) {
      return res.status(403).json({ message: "Unauthorized: You are not a user" });
    }

    // جلب جميع نتائج التصويت من ResultModel
    const results = await ResultModel.find({});

    // فك تشفير userId والمقارنة مع userId الحالي
    const userVotes = results.filter(result => {
      try {
        const decryptedUserId = JSON.parse(crypto.AES.decrypt(result.userId, encryptionKey).toString(crypto.enc.Utf8)).user_id;
        return decryptedUserId === userId.toString();
      } catch (error) {
        console.error('Error decrypting userId:', error);
        return false;
      }
    });

    if (userVotes.length === 0) {
      return res.status(404).json({ message: 'No votes found for this user' });
    }

    // فك تشفير معرفات التصويت
    const voteIds = userVotes.map(vote => {
      try {
        return JSON.parse(crypto.AES.decrypt(vote.VoteId, encryptionKey).toString(crypto.enc.Utf8)).idvote;
      } catch (error) {
        console.error('Error decrypting VoteId:', error);
        return null;
      }
    }).filter(idvote => idvote !== null); // تصفية القيم الفارغة

    // جلب تفاصيل التصويتات باستخدام معرفات التصويت المفكوكة
    const voteDetails = await voteModel.find({ _id: { $in: voteIds } }).select('voteName VotingStatus StartDateVote EndDateVote description image');

    // تحويل النتائج إلى تنسيق مناسب
    const votes = userVotes.map(result => {
      const voteDetail = voteDetails.find(vote => vote._id.toString() === JSON.parse(crypto.AES.decrypt(result.VoteId, encryptionKey).toString(crypto.enc.Utf8)).idvote);
      return {
        userName: user.userName,
        voteName: voteDetail?.voteName || "Unknown Vote",
        VotingStatus: voteDetail?.VotingStatus || "Unknown",
        StartDateVote: voteDetail?.StartDateVote || "Unknown",
        EndDateVote: voteDetail?.EndDateVote || "Unknown",
        description: voteDetail?.description || "Unknown",
        image: voteDetail?.image || {},
      };
    });

    res.status(200).json({
      message: "Successfully retrieved user's votes",
      votes
    });
  } catch (error) {
    console.error('Error retrieving user votes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/*
//تُستخدم لاسترجاع التصويتات التي شارك فيها المستخدم الحالي.
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
*/
// وظيفة لإضافة مستخدم موجود إلى التصويت
export const addExistingUserToVote = async (req, res) => {
  const { userName, voteName } = req.body;
  const Admin_id = req.user._id; 

  const User = await userModel.findOne({isDeleted: false,userName, role: "User" });
  const vote = await voteModel.findOne({ voteName});
 
  if (Admin_id.toString() !== vote.AdminID.toString()) {
    return res.status(403).json({ message: "Unauthorized action to this Admin" });
  }
  if (!User || !vote) {
    return res.status(404).json({ message: "Vote or User not found" });
  }
  const existingUser = await voteModel.findOne({
        _id: vote._id,
        Users: User._id,
  });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists in the vote" });
  }
  vote.Users.push(User);
  await vote.save();
  return res
    .status(200)
    .json({ message: "User added to vote successfully" });
};



//تُستخدم لرفع ملف Excel يحتوي على بيانات المستخدمين ليتم إضافتهم إلى التصويت.
export const uploadExcelUSerToVote = async (req, res, next) => {
  try {
    const Admin_id = req.user._id;
    // تحقق من وجود الملف قبل محاولة قراءته
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const workBook = XLSX.readFile(req.file.path);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const users = XLSX.utils.sheet_to_json(workSheet);
    const errors = [];
    const successes = [];

    for (const row of users) {
      const { UserName,voteName } = row;

      // Find the vote and candidate in the database
      const User = await userModel.findOne({ userName: UserName, role: "User" });
      const vote = await voteModel.findOne({ voteName });

      if (!vote) {
        errors.push({ message: `Vote not found for voteName: ${voteName}`, UserName });
        continue;
      }
      if (Admin_id.toString() !== vote.AdminID.toString()) {
        errors.push({ message: "Unauthorized action by this admin", UserName, voteName });
        continue;
      }

      if (!User) {
        errors.push({ message: `User not found: ${UserName}`, voteName });
        continue;
      }

      // Check if the User already exists in the vote
      const existingUser = vote.Users.includes(User._id);
      if (existingUser) {
        errors.push({ message: `User ${UserName} already exists in the vote ${voteName}` });
        continue;
      }
      
      // Add the candidate to the vote
      vote.Users.push(User._id);
      await vote.save();
      successes.push({ message: `User ${UserName} added to vote ${voteName} successfully` });
    }

    return res.status(200).json({ message: "User processed successfully", successes, errors });

  } catch (error) {
    return res.status(500).json({ message: "Error while uploading User to votes", error });
  }
};




