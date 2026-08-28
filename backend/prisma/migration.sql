-- CreateTable
CREATE TABLE "ProjectAssignment" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "internId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadlineDays" INTEGER NOT NULL DEFAULT 7,
    "deadlineAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',

    CONSTRAINT "ProjectAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectAssignment_projectId_internId_key" ON "ProjectAssignment"("projectId", "internId");

-- AddForeignKey
ALTER TABLE "ProjectAssignment" ADD CONSTRAINT "ProjectAssignment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAssignment" ADD CONSTRAINT "ProjectAssignment_internId_fkey" FOREIGN KEY ("internId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Data Migration Step: Backfill ProjectAssignments from Tasks
INSERT INTO "ProjectAssignment" ("id", "projectId", "internId", "assignedAt", "deadlineDays", "deadlineAt", "status")
SELECT 
    gen_random_uuid(), 
    t."projectId",
    t."assigneeId",
    COALESCE(MAX(p."assignedAt"), CURRENT_TIMESTAMP),
    COALESCE(MAX(p."deadlineDays"), 7),
    COALESCE(MAX(p."deadlineAt"), CURRENT_TIMESTAMP + interval '7 days'),
    'IN_PROGRESS'
FROM "Task" t
JOIN "Project" p ON t."projectId" = p."id"
GROUP BY t."projectId", t."assigneeId";

-- Drop Columns from Project
ALTER TABLE "Project" DROP COLUMN IF EXISTS "assignedAt",
DROP COLUMN IF EXISTS "deadlineAt";
