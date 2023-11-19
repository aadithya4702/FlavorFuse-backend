const mongoose = require("mongoose");
const recipemodel = require("../models/recipe");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { secretKey } = require("../config/keys");
const { ObjectId } = require("mongoose").Types;

const getmyrecipe = async (req, res) => {
  const { name } = req.body;

  try {
    const user = await User.findById(name);
    const recipes = await recipemodel.find({
      _id: { $in: user.recipes },
    });

    if (recipes.length > 0) {
      res.status(200).json({ recipes });
    } else {
      res
        .status(404)
        .json({ message: "No recipes found for the specified author." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createRecipe = async (req, res) => {
  try {
    const {
      vegetarian,
      author,
      serving,
      ingrediant,
      title,
      category,
      readyin,
      imageurl,
      instruction,
    } = req.body;

    const authorExists = await User.findById(author);
    if (!authorExists) {
      return res.status(400).json({ error: "Author (User) not found" });
    }

    const newRecipe = new recipemodel({
      vegetarian,
      Likes: 0,
      Author: author,
      serving,
      extendedIngredients: ingrediant,
      title,
      category,
      readyInMinutes: readyin,
      image: imageurl,
      instructions: instruction,
    });

    const savedRecipe = await newRecipe.save();

    if (!authorExists.addedRecipes) {
      authorExists.addedRecipes = [];
    }
    authorExists.recipes.push(savedRecipe._id);
    await authorExists.save();

    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const editmyrecipe = async (req, res) => {
  try {
    const {
      vegetarian,
      author,
      serving,
      extendedIngredients,
      title,
      category,
      readyInMinutes,
      image,
      instructions,
    } = req.body;

    
    const authorExists = await User.findById(author);
    if (!authorExists) {
      return res.status(400).json({ error: "Author (User) not found" });
    }

    const updatedRecipe = await recipemodel.findOneAndUpdate(
      { title },
      {
        $set: {
          vegetarian,
          Likes: 0,
          Author: author,
          serving,
          extendedIngredients,
          title,
          category,
          readyInMinutes,
          image,
          instructions,
        },
      },
      { new: true, upsert: true }
    );

    res.status(201).json(updatedRecipe);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      // Handle validation errors
      res.status(400).json({ error: error.message });
    } else {
      // Handle other errors
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const randomrecipe = async (req, res) => {
  try {
    const randomRecipe = await recipemodel.aggregate([
      { $sample: { size: 1 } },
    ]);
    res.status(200).json({ randomRecipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const latestrecipe = async (req, res) => {
  try {
    const latestRecipes = await recipemodel
      .find()
      .sort({ date: -1 })
      .limit(10); 

    res.status(200).json({ latestRecipes });
  } catch (error) {
    console.error("Error fetching latest recipes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const recipedesciption = async (req, res) => {
  try {
    const rid = req.params.recipeId;

    if (rid.toLowerCase() === "search") {
      const recipes = await recipemodel.find();
      res.status(200).json({ recipes });
      return;
    }

    const recipe = await recipemodel.findById(rid);

    if (recipe) {
      res.status(200).json({ recipe });
    } else {
      res.status(404).json({ message: "Recipe not found" });
    }
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchRecipes = async (req, res) => {
  try {
    const { query } = req.body;

    console.log("Received query:", query); 

    if (query) {
      const recipes = await recipemodel.find({
        title: { $regex: new RegExp(query, "i") },
      });

      console.log("Matching recipes:", recipes); 

      res.status(200).json({ recipes });
    } else {
      console.log("Query is missing");
      res.status(400).json({ error: "Query parameter is missing" });
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getmyrecipe,
  createRecipe,
  editmyrecipe,
  randomrecipe,
  latestrecipe,
  recipedesciption,
  searchRecipes,
};
