-- Delete any partially inserted rows (if any)
DELETE FROM "ProjectAssignment";

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
