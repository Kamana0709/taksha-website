-- AlterTable
ALTER TABLE "User" ADD COLUMN "isAlumni" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "alumniSince" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Task" ADD COLUMN "skillTags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN "videoUrl" TEXT,
ADD COLUMN "firstPassReview" JSONB;

-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN "projectsCompleted" JSONB;
