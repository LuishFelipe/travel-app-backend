-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "photoProfile" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
