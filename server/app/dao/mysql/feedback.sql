
CREATE TABLE IF NOT EXISTS `User` (
	`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
	`name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
	`password` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
	`lastLoginTime` bigint(20) unsigned DEFAULT '0',
	PRIMARY KEY (`id`),
	UNIQUE KEY `INDEX_ACCOUNT_NAME` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `comments` (
	`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
	`userId` bigint(20) unsigned NOT NULL DEFAULT '0',
	`content` varchar(5000) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
	PRIMARY KEY (`id`),
	KEY `INDEX_PLAYER_ID` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
