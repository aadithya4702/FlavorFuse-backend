const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  vegetarian: Boolean,
  Likes: { type: Number, default: 0 },

  Author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  serving: Number,
  extendedIngredients: { type: String },
  title: String,
  category: {
    type: String,
  },
  readyInMinutes: Number,
  image: String,
  instructions: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
