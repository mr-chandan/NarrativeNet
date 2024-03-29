-- CreateTable
CREATE TABLE "User" (
    "id" INT8 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "user_id" STRING NOT NULL,
    "username" STRING NOT NULL,
    "email" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" INT8 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "title" STRING(200) NOT NULL,
    "author_id" STRING NOT NULL,
    "author_name" STRING NOT NULL,
    "starting_line" STRING NOT NULL,
    "type_of_tone" STRING(200) NOT NULL,
    "published_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryContribution" (
    "contributionid" INT8 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "story_id" INT8 NOT NULL,
    "contributing_user_id" STRING NOT NULL,
    "contributing_user_name" STRING NOT NULL,
    "content" STRING NOT NULL,
    "contributiondate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upvotes" INT4 NOT NULL,
    "downvotes" INT4 NOT NULL,

    CONSTRAINT "StoryContribution_pkey" PRIMARY KEY ("contributionid")
);

-- CreateTable
CREATE TABLE "UserContributionVote" (
    "vote_id" INT8 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "contribution_story_id" INT8 NOT NULL,
    "user_id" STRING NOT NULL,
    "vote_type" BOOL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserContributionVote_pkey" PRIMARY KEY ("vote_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryContribution" ADD CONSTRAINT "StoryContribution_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryContribution" ADD CONSTRAINT "StoryContribution_contributing_user_id_fkey" FOREIGN KEY ("contributing_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserContributionVote" ADD CONSTRAINT "UserContributionVote_contribution_story_id_fkey" FOREIGN KEY ("contribution_story_id") REFERENCES "StoryContribution"("contributionid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserContributionVote" ADD CONSTRAINT "UserContributionVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
