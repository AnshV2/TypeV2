-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Champs" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "elo" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Test" (
    "user" TEXT NOT NULL,
    "wpm" INTEGER NOT NULL,
    "cc" INTEGER NOT NULL,
    "wc" INTEGER NOT NULL,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Post_author_idx" ON "Post"("author");

-- CreateIndex
CREATE INDEX "Champs_name_idx" ON "Champs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Test_user_time_key" ON "Test"("user", "time");
