const mongoose = require("mongoose");
const recipemodel = require("../models/recipe");
const User = require("../models/user");
const commentmodel = require("../models/comment");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { secretKey } = require("../config/keys");
const { ObjectId } = require("mongoose").Types;

const getAllComments = async (req, res) => {
  try {
  

    const { rid } = req.body;
    const allComments = await commentmodel
      .find({ recipe: rid })
      .populate("user", "username");
 

    res.status(200).json({ comments: allComments });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addReply = async (req, res) => {
  const { commentId } = req.params;
  const { usern, text } = req.body;

  try {
 
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

   
    comment.replies.push({
      usern,
      text,
    });

    await comment.save();

    res
      .status(200)
      .json({ reply: comment.replies[comment.replies.length - 1] });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addcomment = async (req, res) => {
  try {
    const { name, text, replies, rid } = req.body;

   
    const newComment = new commentmodel({
      user: name,
      recipe: rid,
      text,
      replies,
    });


    const savedComment = await newComment.save();

    res.status(200).json({ comment: savedComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addcomment,
  getAllComments,
  addReply,
};
