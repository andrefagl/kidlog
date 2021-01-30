-- CreateIndex
CREATE INDEX "symptom.logId" ON "Symptom"("logId");

-- AlterIndex
ALTER INDEX "logs.userId" RENAME TO "log.userId";
