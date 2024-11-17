BEGIN TRANSACTION;

DROP TABLE IF EXISTS "users";
CREATE TABLE
	"users" ("id" INTEGER NOT NULL, "email" TEXT NOT NULL, "name" TEXT, "hash" TEXT NOT NULL, PRIMARY KEY ("id" AUTOINCREMENT));

DROP TABLE IF EXISTS "films";
CREATE TABLE
	"films" (
		"id" INTEGER,
		"title" TEXT NOT NULL,
		"owner" INTEGER NOT NULL,
		"private" INTEGER NOT NULL DEFAULT 1,
		"watchDate" TEXT,
		"rating" INTEGER,
		"favorite" INTEGER,
		PRIMARY KEY ("id"),
		FOREIGN KEY ("owner") REFERENCES "users" ("id") ON DELETE CASCADE
	);

DROP TABLE IF EXISTS "reviews";
CREATE TABLE
	"reviews" (
		"filmId" INTEGER NOT NULL,
		"reviewerId" INTEGER NOT NULL,
		"completed" INTEGER NOT NULL DEFAULT 0,
		"reviewDate" TEXT,
		"rating" INTEGER,
		"reviewText" TEXT,
		PRIMARY KEY ("filmId", "reviewerId"),
		FOREIGN KEY ("filmId") REFERENCES "films" ("id") ON DELETE CASCADE,
		FOREIGN KEY ("reviewerId") REFERENCES "users" ("id") ON DELETE CASCADE
	);

DROP TABLE IF EXISTS "images";
CREATE TABLE
	"images" (
		"id" INTEGER NOT NULL,
		"filmId" INTEGER NOT NULL,
		"originalname" INTEGER NOT NULL DEFAULT 0,
		"filename" TEXT NOT NULL,
		PRIMARY KEY ("id"),
		FOREIGN KEY ("filmId") REFERENCES "films" ("id") ON DELETE CASCADE
	);

DROP TABLE IF EXISTS "image_formats";
CREATE TABLE
	"image_formats" (
		"imageId" INTEGER NOT NULL,
		"mimetype" TEXT NOT NULL,
		PRIMARY KEY ("imageId", "mimetype"),
		FOREIGN KEY ("imageId") REFERENCES "images" ("id") ON DELETE CASCADE
	);

INSERT INTO
	"users" ("id", "email", "name", "hash")
VALUES
	(1, 'user.dsp@polito.it', 'User', '$2a$10$.hw.euW0lGhWtNfigv5U9uEcwc1cfgH3DK7.zReNHPvi5xpJRfPc2'),
	(2, 'frank.stein@polito.it', 'Frank', '$2a$10$YBUtQ7qWvOo9xBuJfLWAkeTHmQHZe0uB0NM/7zAITHCccGVAfOkEm'),
	(3, 'karen.makise@polito.it', 'Karen', '$2a$10$d9pllxqTsXoAXJwE14VzzeJPJc6Z1igrR2/jfa1IQeAb5pNPfYViS'),
	(4, 'rene.regeay@polito.it', 'Rene', '$2a$10$WJcNTzEY1rIePhRVKdfkYeSkVJ20PLMEktgdjVPJq9qUeP1ZdSrPi'),
	(5, 'beatrice.golden@polito.it', 'Beatrice', '$2a$10$wQtLnqD224VS3US.LCrWXOWfASq6PZJHEpViYV6GEKUXWxMZNmSTW'),
	(6, 'arthur.pendragon@polito.it', 'Arthur', '$2a$10$uFVLA5yq4LZTB.gglOqsReDsm.KgeRrhcSy4T45Dlh.yWyR.uYA7a');

INSERT INTO
	"films" ("id", "title", "owner", "private", "watchDate", "rating", "favorite")
VALUES
	(1, 'Your Name', 1, 1, '2021-10-03', 9, 1),
	(2, 'Heaven''s Feel', 1, 0, NULL, NULL, NULL),
	(3, 'You Can (Not) Redo', 1, 0, NULL, NULL, NULL),
	(4, 'Weathering with You', 2, 0, NULL, NULL, NULL),
	(5, 'Aria of a Starless Night', 1, 1, '2022-07-20', 8, 0),
	(6, 'Spirited Away', 1, 0, NULL, NULL, NULL),
	(7, '5 Centimeters Per Second', 1, 0, NULL, NULL, NULL),
	(8, 'Nausicaa', 1, 1, '2020-03-15', 9, 0),
	(9, 'The Garden of Words', 1, 0, NULL, NULL, NULL),
	(10, 'Paradox Spiral', 1, 1, '2021-12-26', 10, 1);

INSERT INTO
	"reviews" ("filmId", "reviewerId", "completed", "reviewDate", "rating", "reviewText")
VALUES
	(2, 5, 1, '2022-03-04', 10, 'This film is a perfect conclusion for the trilogy.'),
	(3, 4, 1, '2022-01-23', 9, 'I appreciated the plot twists, but I did not understand so much the ending. I am eagerly waiting for the sequel.'),
	(3, 2, 1, '2022-04-04', 8, 'I would have preferred that this film did not adopt the widescreen cinema standard resolution.'),
	(2, 2, 1, '2022-04-04', 10, 'I could not stop watching until the very end. However, you must watch the prequels before this film to really understand it.'),
	(6, 1, 1, NULL, NULL, NULL),
	(7, 5, 1, '2022-03-04', 7, 'The ending feels rushed and it should have better explained the life decisions of the characters.'),
	(6, 5, 1, NULL, NULL, NULL),
	(9, 1, 0, NULL, NULL, NULL),
	(2, 1, 0, NULL, NULL, NULL),
	(4, 1, 0, NULL, NULL, NULL),
	(5, 1, 0, NULL, NULL, NULL),
	(10, 1, 0, NULL, NULL, NULL),
	(7, 1, 0, NULL, NULL, NULL),
	(9, 5, 1, '2022-04-04', 9, 'Even if the film is short, it provides a deep characterizaition for the two main characters.');

COMMIT;