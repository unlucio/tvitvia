/*
 Navicat Premium Data Transfer

 Source Server         : misato
 Source Server Type    : MySQL
 Source Server Version : 50521
 Source Host           : localhost
 Source Database       : twitvia

 Target Server Type    : MySQL
 Target Server Version : 50521
 File Encoding         : utf-8

 Date: 06/08/2012 09:31:12 AM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `aswers`
-- ----------------------------
DROP TABLE IF EXISTS `aswers`;
CREATE TABLE `aswers` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `questionID` int(10) unsigned DEFAULT NULL,
  `value` longtext,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `points`
-- ----------------------------
DROP TABLE IF EXISTS `points`;
CREATE TABLE `points` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userID` int(10) unsigned DEFAULT NULL,
  `value` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `questions`
-- ----------------------------
DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `question` longtext,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `twittedQuestions`
-- ----------------------------
DROP TABLE IF EXISTS `twittedQuestions`;
CREATE TABLE `twittedQuestions` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tweetID` longblob,
  `questionID` int(10) unsigned DEFAULT NULL,
  `answered` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `twUser` text,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

SET FOREIGN_KEY_CHECKS = 1;
