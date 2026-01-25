-- CreateEnum
CREATE TYPE "Role" AS ENUM ('COUSOMER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'COUSOMER';
