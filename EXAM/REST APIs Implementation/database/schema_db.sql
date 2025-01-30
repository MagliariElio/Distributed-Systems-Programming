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

DROP TABLE IF EXISTS "editReviewsRequests";

CREATE TABLE
	"editReviewsRequests" (
		"filmId" INTEGER NOT NULL,
		"reviewerId" INTEGER NOT NULL,
		"deadline" TEXT NOT NULL,
		"status" INTEGER NOT NULL DEFAULT 0, -- 0 pending, 1 rejected, 2 accepted
		PRIMARY KEY ("filmId", "reviewerId"),
		FOREIGN KEY ("filmId") REFERENCES "films" ("id") ON DELETE CASCADE,
		FOREIGN KEY ("reviewerId") REFERENCES "users" ("id") ON DELETE CASCADE
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
	(2, 'Heaven''s Feel', 2, 0, NULL, NULL, NULL),
	(3, 'You Can (Not) Redo', 1, 0, NULL, NULL, NULL),
	(4, 'Weathering with You', 1, 0, NULL, NULL, NULL),
	(5, 'Aria of a Starless Night', 1, 1, '2022-07-20', 8, 0),
	(6, 'Spirited Away', 1, 0, NULL, NULL, NULL),
	(7, '5 Centimeters Per Second', 1, 0, NULL, NULL, NULL),
	(8, 'Nausicaa', 1, 1, '2020-03-15', 9, 0),
	(9, 'The Garden of Words', 1, 0, NULL, NULL, NULL),
	(10, 'Paradox Spiral', 3, 1, '2021-12-26', 10, 1),
	(11, 'A Silent Voice', 2, 0, NULL, NULL, NULL),
	(12, 'The Spirited Journey', 1, 0, NULL, NULL, NULL),
	(13, 'Echoes of Eternity', 4, 0, NULL, NULL, NULL),
	(14, 'Shadows of Tomorrow', 5, 0, NULL, NULL, NULL),
	(15, 'Whispers in the Wind', 6, 0, NULL, NULL, NULL),
	(16, 'Fragments of Destiny', 6, 0, NULL, NULL, NULL),
	(17, 'Journey Beyond Time', 1, 1, '2024-11-15', 8, 1),
	(18, 'The Silent Horizon', 3, 0, NULL, NULL, NULL),
	(19, 'Interstellar', 3, 0, NULL, NULL, NULL),
	(20, 'Echoes of the Forgotten', 1, 0, NULL, NULL, NULL),
	(21, 'The Prestige', 4, 0, NULL, NULL, NULL);

INSERT INTO
	"reviews" ("filmId", "reviewerId", "completed", "reviewDate", "rating", "reviewText")
VALUES
	(3, 5, 1, '2023-06-15', 2, 'A visually stunning film, but the plot could have been stronger.'),
	(2, 5, 1, '2024-03-04', 10, 'This film is a perfect conclusion for the trilogy.'),
	(3, 4, 1, '2024-01-23', 9, 'I appreciated the plot twists, but I did not understand so much the ending. I am eagerly waiting for the sequel.'),
	(3, 2, 1, '2024-04-04', 8, 'I would have preferred that this film did not adopt the widescreen cinema standard resolution.'),
	(2, 2, 1, '2024-04-04', 10, 'I could not stop watching until the very end. However, you must watch the prequels before this film to really understand it.'),
	(7, 5, 1, '2024-03-04', 7, 'The ending feels rushed and it should have better explained the life decisions of the characters.'),
	(11, 1, 1, '2025-01-11', 9, 'A deeply moving film with stunning animation and a memorable soundtrack.'),
	(12, 4, 1, '2025-01-10', 8, 'Amazing storytelling and breathtaking visuals! The cast delivered outstanding performances, and the plot kept me hooked until the end. A must-watch.'),
	(12, 5, 1, '2025-01-15', 8, 'A captivating story with heartfelt moments and breathtaking visuals. Truly a must-watch.'),
	(12, 1, 1, '2025-01-10', 4, 'While the film has great visuals and a solid premise, the pacing feels a bit slow, and some plot points could have been developed further.'),
	(14, 1, 1, '2025-01-12', 5, 'The film had potential, but the narrative was muddled, and the characters lacked development. The visuals were its only redeeming quality.'),
	(16, 1, 1, '2025-01-12', 5, "The visuals are breathtaking, but the storyline feels uninspired and predictable. It's a movie that entertains but doesn't leave a lasting impact."),
	(19, 1, 0, '2025-01-07', 8, 'Interstellar is a visually captivating film with a compelling storyline and strong performances'),
	(21, 1, 0, NULL, NULL, NULL),
	(20, 1, 0, NULL, NULL, NULL),
	(6, 1, 0, NULL, NULL, NULL),
	(4, 1, 0, '2025-01-05', 9, NULL),
	(13, 1, 0, '2025-01-03', NULL, 'An emotional journey of hope and resilience. Truly one of the greatest films ever made.'),
	(15, 1, 0, '2025-01-07', 8, "Heath Ledger's Joker steals the show. A dark, gripping, and thrilling superhero film."),
	(18, 1, 0, '2025-01-09', 3, NULL),
	(9, 5, 0, '2025-01-11', 10, 'A visually stunning exploration of love, time, and space. Both emotional and thought-provoking.'),
	(2, 3, 0, NULL, NULL, NULL),
	(4, 5, 0, NULL, NULL, NULL),
	(5, 4, 0, NULL, NULL, NULL),
	(10, 1, 0, NULL, NULL, NULL),
	(7, 1, 0, NULL, NULL, NULL);

INSERT INTO
	"editReviewsRequests" ("filmId", "reviewerId", "deadline", "status")
VALUES
	(3, 2, '2025-08-10 00:00:00+00:00', 0),
	(12, 1, '2026-04-08 00:00:00+00:00', 0),
	(14, 1, '2027-03-01 00:00:00+00:00', 0),
	(3, 4, '2025-06-14 00:00:00+00:00', 0),
	(3, 5, '2025-04-08 00:00:00+00:00', 0),
	(2, 5, '2024-07-20 00:00:00+00:00', 0),
	(12, 5, '2023-04-08 00:00:00+00:00', 0),
	(16, 1, '2025-02-28 00:00:00+00:00', 1),
	(19, 1, '2025-10-20 00:00:00+00:00', 1),
	(7, 5, '2025-07-20 00:00:00+00:00', 1),
	(4, 1, '2025-07-20 00:00:00+00:00', 2),
	(13, 1, '2025-09-09 00:00:00+00:00', 2),
	(15, 1, '2025-03-10 00:00:00+00:00', 2),
	(18, 1, '2025-08-01 00:00:00+00:00', 2),
	(9, 5, '2025-08-10 00:00:00+00:00', 2);

COMMIT;