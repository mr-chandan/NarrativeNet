import sql from "../Database/Postgres.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class StoryController {
    async createStory(req, res) {
        const { user, values } = req.body;
        try {
            const newStory = await prisma.story.create({
                data: {
                    title: values.title,
                    author_name: user.name,
                    author_id: user.sub,
                    starting_line: values.Startingline,
                    type_of_tone: values.Type_of_tone,
                }
            });
            res.status(201).json(newStory);
        } catch (error) {
            console.error("Error inserting new story:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async fetchRandom5stories(req, res) {
        try {
            const allStories = await prisma.story.findMany();
            const shuffledStories = allStories.sort(() => 0.5 - Math.random());
            const stories = shuffledStories.slice(0, 5);
            res.status(200).json(stories);
        } catch (error) {
            console.error("Error fetching random stories:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async fetchStoriesByAuthorId(req, res) {
        const { authorId } = req.body;

        try {
            const stories = await prisma.story.findMany({
                where: {
                    author_id: authorId
                }
            });
            res.status(200).json(stories);
        } catch (error) {
            console.error("Error fetching stories by author ID:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async fetchStoryById(req, res) {
        const { storyid } = req.body;
        console.log(storyid)
        try {
            const story = await prisma.story.findUnique({
                where: {
                    id: storyid
                },
                include: { StoryContribution: true },
            });

            if (!story) {
                return res.status(404).json({ message: "Story not found" });
            }

            res.status(200).json(story);
        } catch (error) {
            console.error("Error fetching story by ID:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }


    async addContribution(req, res) {
        const { user, data, storyid } = req.body;

        try {
            // Check if contribution already exists
            const existingContribution = await prisma.StoryContribution.count({
                where: {
                    story_id: storyid,
                    contributing_user_id: user.sub
                }
            })

            if (existingContribution.count > 0) {
                res.status(400).json({ message: "Contribution already exists for this user and story." });
                return;
            }

            // Contribution does not exist, proceed with adding it
            const newContribution = await prisma.storyContribution.create({
                data: {
                    story_id: storyid,
                    contributing_user_id: user.sub,
                    contributing_user_name: user.name,
                    content: data.bio
                }
            })

            res.status(201).json(newContribution);
        } catch (error) {
            console.error("Error adding contribution:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async castVote(req, res) {
        const { user, vote, selectedContribution } = req.body;

        console.log(req.body)

        console.log(vote);
        try {
            // Convert vote to boolean
            const voteValue = vote === 1 ? true : false;

            // Check if the user has already voted for this contribution
            const existingVote = await prisma.userContributionVote.findFirst({
                where: {
                    contribution_story_id: selectedContribution.contributionid,
                    user_id: user.sub
                }
            });

            if (existingVote) {
                return res.status(500).json({ message: "User has already voted for this contribution." });
            }

            // Insert the new vote into the UserContributionVoteTable
            await prisma.userContributionVote.create({
                data: {
                    contribution_story_id: selectedContribution.contributionid,
                    user_id: user.sub,
                    vote_type: voteValue
                }
            });

            // Update upvote and downvote columns in StoryContributionTable
            if (voteValue) {
                await prisma.storyContribution.update({
                    where: { contributionid: selectedContribution.contributionid },
                    data: { upvotes: { increment: 1 } }
                });
            } else {
                await prisma.storyContribution.update({
                    where: { contributionid: selectedContribution.contributionid },
                    data: { downvotes: { increment: 1 } }
                });
            }

            console.log('Vote recorded successfully.');
            res.status(200).json({ message: "Vote recorded successfully." })
        } catch (error) {
            console.error('Error casting vote:', error);
            res.status(500).json({ message: "Failed to cast vote." });
        }
    }




    async countVotesByContributionId(req, res) {
        const { contributionId } = req.body;
        try {
            const trueVotes = await prisma.userContributionVote.count({
                where: {
                    contribution_story_id: contributionId,
                    vote_type: true
                }
            });

            const falseVotes = await prisma.userContributionVote.count({
                where: {
                    contribution_story_id: contributionId,
                    vote_type: false
                }
            });

            const result = {
                trueVotes: trueVotes,
                falseVotes: falseVotes
            };

            res.status(200).json(result); // Send the result as JSON response
        } catch (error) {
            console.error('Error counting votes:', error);
            res.status(500).json({ error: 'Failed to count votes.' }); // Send error response
        }
    }
}

export default StoryController;