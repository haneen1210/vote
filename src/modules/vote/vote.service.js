import voteModel from "../../../DB/models/vote.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utls/email.js";
import cloudinary from "../../utls/cloudinary.js";
import moment from "moment";


export const createVote = async (req, res, next) => {
    const { voteName, VotingStatus, description, Title, StartDateVote, EndDateVote } = req.body;
    if (await voteModel.findOne({ voteName })) {
        return next(new Error("voteName already exists", { cause: 409 }));
    }
    if (await voteModel.findOne({ Title })) {
        return next(new Error("Title already exists", { cause: 409 }));
    }

    const createVote = await voteModel.create({ voteName, VotingStatus, description, Title, StartDateVote, EndDateVote });
    return res.status(201).json({ message: "success", createVote });

}


export const getVote = async (req, res, next) => {
    const votes = await voteModel.find();
    return res.status(200).json({ message: "success", votes });

}
export const updateVotingStatus = async (req, res, next) => {
    const { id } = req.params;
    const vote = await voteModel.findOne({ _id: id });
    if (!vote) {
        return res.status(404).json({ message: "vote not found" });
    }

    if (req.body.VotingStatus === 'Active') {

        const currentTime = moment();
        const allowedStartTime = moment(vote.StartDateVote);
        const allowedEndTime = moment(vote.EndDateVote);

        if (currentTime.isBetween(allowedStartTime, allowedEndTime)) {
            vote.VotingStatus = 'Active';
            await vote.save();
            return res.status(201).json({ message: "success Voting has been activated successfully", vote });
        }
        else {
            return res.status(400).json({ message: "Not useful for modifying the voting status outside the voting period" });
        }
    }
    else if (req.body.VotingStatus === 'Inactive') {
        vote.VotingStatus = 'Inactive';
        await vote.save();
        return res.status(200).json({ message: "Voting has been successfully deactivated", vote });

    } else {
        return res.status(400).json({ message: "The requested status is not recognized" });

    }

}

export const getVoteOpen = async (req, res, next) => {
    const votes = await voteModel.find({ VotingStatus: 'Active' });
    return res.status(200).json({ message: "success", votes });

}
