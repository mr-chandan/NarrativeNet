import express from "express";
import StoryController from "../controllers/Stories.controller.js";

const router = express.Router();
const storyController = new StoryController();

router.get("/gettrendstories", storyController.fetchRandom5stories);
router.post("/createstory", storyController.createStory);
router.post("/getuserstory", storyController.fetchStoriesByAuthorId);
router.post("/getuserstorybyid", storyController.fetchStoryById);
router.post("/putcontrubtion", storyController.addContribution);
router.post("/putvote", storyController.castVote);
router.post("/getvote", storyController.countVotesByContributionId);

export default router;
