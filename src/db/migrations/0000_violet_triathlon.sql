CREATE TABLE `account` (
	`id` text(50) PRIMARY KEY NOT NULL,
	`balance` real,
	`user_id` text NOT NULL,
	`category_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `account_category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `account_category` (
	`id` text(50) PRIMARY KEY NOT NULL,
	`name` text(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `expense_category` (
	`id` text(50) PRIMARY KEY NOT NULL,
	`name` text(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `expense` (
	`id` text(50) PRIMARY KEY NOT NULL,
	`amount` real NOT NULL,
	`user_id` text NOT NULL,
	`account_id` text NOT NULL,
	`category_id` text NOT NULL,
	`date` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`account_id`) REFERENCES `account`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `expense_category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `income_category` (
	`id` text(50) PRIMARY KEY NOT NULL,
	`name` text(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `income` (
	`id` text(50) PRIMARY KEY NOT NULL,
	`amount` real NOT NULL,
	`user_id` text NOT NULL,
	`account_id` text NOT NULL,
	`category_id` text NOT NULL,
	`date` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`account_id`) REFERENCES `account`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `income_category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verify_email` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`otp` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);