const express = require("express");
const router = express.Router();
const {
  createUser,
  loginactivity,
  getProfile,
  validateotp,
} = require("../controllers/appcontroller");
const {
  getmyrecipe,
  createRecipe,
  editmyrecipe,
  randomrecipe,
  latestrecipe,
  recipedesciption,
  searchRecipes,
} = require("../controllers/appreceipecontroller");
const {
  addcomment,
  getAllComments,
  addReply,
} = require("../controllers/commentcontroller");

router.post("/", createUser);
router.post("/login", loginactivity); 
router.get("/profile", getProfile);
router.post("/otpvalidation", validateotp);

router.post("/addrecipe", createRecipe);
router.post("/editmyrecipe", editmyrecipe);
router.post("/getmyrecipe", getmyrecipe);

router.post("/addcomments", addcomment);
router.post("/getcomments", getAllComments);
router.post("comments/:commentId/replies", addReply);

router.get("/random", randomrecipe);
router.get("/latestrecipe", latestrecipe);

router.get("/:recipeId", recipedesciption);
router.post("/search", searchRecipes);

module.exports = router;
