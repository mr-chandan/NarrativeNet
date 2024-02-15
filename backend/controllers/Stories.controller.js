import sql from "../Database/Postgres.js";

class StoryController {
    async createStory(req, res) {
        const currentDate = new Date();
        const { user, values } = req.body;
        console.log(user);
        try {
            const newStory = await sql`
            INSERT INTO stories (title, author_name,author_id, starting_line, type_of_tone, published_date)
                VALUES (${values.title}, ${user.name}, ${user.sub}, ${values.Startingline}, ${values.Type_of_tone}, ${currentDate})RETURNING *;`;
            res.status(201).json(newStory);
        } catch (error) {
            console.error("Error inserting new story:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async fetchRandom5stories(req, res) {
        try {
            const stories = await sql`
            SELECT * FROM stories
            ORDER BY RANDOM()
            LIMIT 6;
        `;
            res.status(200).json(stories);
        } catch (error) {
            console.error("Error fetching random stories:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }


    async fetchStoriesByAuthorId(req, res) {
        const { authorId } = req.body;
        console.log(req.body)

        try {
            const stories = await sql`
                SELECT * FROM stories
                WHERE author_id = ${authorId};
            `;
            res.status(200).json(stories);
        } catch (error) {
            console.error("Error fetching stories by author ID:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async fetchStoryById(req, res) {
        const { storyid } = req.body;

        try {
            // Fetch story from the stories table
            const [story] = await sql`
                SELECT * FROM stories
                WHERE story_id = ${storyid};
            `;

            if (!story) {
                return res.status(404).json({ message: "Story not found" });
            }

            // Fetch contributions from the Contribution Table based on the story ID
            const contributions = await sql`
                SELECT * FROM StoryContributionTable
                WHERE story_id = ${storyid};
            `;

            // Combine the story and contributions into a single response object
            const storyWithContributions = {
                story,
                contributions,
            };

            res.status(200).json(storyWithContributions);
        } catch (error) {
            console.error("Error fetching story by ID:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }


    async addContribution(req, res) {
        console.log(req.body);

        const { user, data, storyid } = req.body;

        try {
            // Check if contribution already exists
            const existingContribution = await sql`
                SELECT * FROM StoryContributionTable
                WHERE story_id = ${storyid} AND contributing_user_id = ${user.sub};
            `;

            if (existingContribution.count > 0) {
                res.status(400).json({ message: "Contribution already exists for this user and story." });
                return;
            }

            // Contribution does not exist, proceed with adding it
            const contributionDate = new Date();
            const newContribution = await sql`
                INSERT INTO StoryContributionTable (story_id, contributing_user_id, contributing_user_name, Content, ContributionDate)
                VALUES (${storyid}, ${user.sub}, ${user.name}, ${data.bio}, ${contributionDate})
                RETURNING *;
            `;
            res.status(201).json(newContribution);
        } catch (error) {
            console.error("Error adding contribution:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async castVote(req, res) {
        const { user, vote, selectedContribution } = req.body;

        console.log(vote);
        try {
            // Convert vote to boolean
            const voteValue = vote === 1 ? true : false;

            // Check if the user has already voted for this contribution
            const existingVote = await sql`
                SELECT *
                FROM UserContributionVoteTable
                WHERE contribution_story_id = ${selectedContribution.contributionid} AND user_id = ${selectedContribution.contributing_user_id}
            `;

            if (existingVote && existingVote.length > 0) {
                return res.status(500).json({ message: "User has already voted for this contribution." });
            }

            // Insert the new vote into the UserContributionVoteTable
            await sql`
                INSERT INTO UserContributionVoteTable (contribution_story_id, user_id, vote_type)
                VALUES (${selectedContribution.contributionid}, ${selectedContribution.contributing_user_id}, ${voteValue})
            `;

            // Update upvote and downvote columns in StoryContributionTable
            if (voteValue) {
                await sql`
                    UPDATE StoryContributionTable
                    SET upvotes = upvotes + 1
                    WHERE contributionid = ${selectedContribution.contributionid};
                `;
            } else {
                await sql`
                    UPDATE StoryContributionTable
                    SET downvotes = downvotes + 1
                    WHERE contributionid = ${selectedContribution.contributionid};
                `;
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
            const trueVotes = await sql`
                SELECT COUNT(*) AS true_votes
                FROM UserContributionVoteTable
                WHERE contribution_story_id = ${contributionId} AND vote_type = true
            `;

            const falseVotes = await sql`
                SELECT COUNT(*) AS false_votes
                FROM UserContributionVoteTable
                WHERE contribution_story_id = ${contributionId} AND vote_type = false
            `;

            const result = {
                trueVotes: trueVotes[0].true_votes || 0,
                falseVotes: falseVotes[0].false_votes || 0
            };

            res.status(200).json(result); // Send the result as JSON response
        } catch (error) {
            console.error('Error counting votes:', error);
            res.status(500).json({ error: 'Failed to count votes.' }); // Send error response
        }
    }
}

export default StoryController;