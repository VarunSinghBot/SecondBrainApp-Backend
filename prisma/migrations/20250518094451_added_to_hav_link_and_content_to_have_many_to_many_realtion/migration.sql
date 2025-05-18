-- CreateTable
CREATE TABLE "_LinkContents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LinkContents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LinkContents_B_index" ON "_LinkContents"("B");

-- AddForeignKey
ALTER TABLE "_LinkContents" ADD CONSTRAINT "_LinkContents_A_fkey" FOREIGN KEY ("A") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinkContents" ADD CONSTRAINT "_LinkContents_B_fkey" FOREIGN KEY ("B") REFERENCES "Link"("hash") ON DELETE CASCADE ON UPDATE CASCADE;
