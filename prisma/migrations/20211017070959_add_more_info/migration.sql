-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "isReady" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "nationality" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT E'';

-- AlterTable
ALTER TABLE "Tutor" ADD COLUMN     "monthlyClass" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Evaluation" (
    "studentId" INTEGER NOT NULL,
    "fluency" INTEGER NOT NULL,
    "vocabulary" INTEGER NOT NULL,
    "grammar" INTEGER NOT NULL,
    "pronunciation" INTEGER NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("studentId")
);

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
