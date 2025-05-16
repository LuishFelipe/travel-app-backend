-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_postComponentId_fkey";

-- DropForeignKey
ALTER TABLE "PostComponent" DROP CONSTRAINT "PostComponent_postId_fkey";

-- DropForeignKey
ALTER TABLE "Text" DROP CONSTRAINT "Text_postComponentId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_postComponentId_fkey";

-- AddForeignKey
ALTER TABLE "PostComponent" ADD CONSTRAINT "PostComponent_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_postComponentId_fkey" FOREIGN KEY ("postComponentId") REFERENCES "PostComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_postComponentId_fkey" FOREIGN KEY ("postComponentId") REFERENCES "PostComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Text" ADD CONSTRAINT "Text_postComponentId_fkey" FOREIGN KEY ("postComponentId") REFERENCES "PostComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
