-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 21, 2020 at 05:37 PM
-- Server version: 5.7.29
-- PHP Version: 7.2.24-0ubuntu0.18.04.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `covid19`
--

-- --------------------------------------------------------

--
-- Table structure for table `sg_case_info`
--

CREATE TABLE `sg_case_info`
(
    `id`                  int(11)                                NOT NULL,
    `CaseID`              int(11)                                NOT NULL,
    `CaseCount`           varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `Cluster`             varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
    `CurrLoc`             varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
    `PHI`                 text COLLATE utf8mb4_unicode_ci        NOT NULL,
    `Infected`            varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `Place`               varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `Age`                 int(11)                                NOT NULL,
    `Gender`              varchar(2) COLLATE utf8mb4_unicode_ci  NOT NULL,
    `Nationality`         varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `Status`              varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
    `ConfirmedDate`       bigint(20)                             NOT NULL,
    `DischargedDate`      bigint(20)                             NOT NULL DEFAULT '0',
    `Region`              varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    `District`            varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `PostalCode`          int(11)                                NOT NULL,
    `Lng`                 decimal(10, 0)                         NOT NULL,
    `Lat`                 decimal(10, 0)                         NOT NULL,
    `Total`               int(11)                                NOT NULL,
    `UpdatedAt`           text COLLATE utf8mb4_unicode_ci        NOT NULL,
    `PendingCases`        int(11)                                NOT NULL,
    `NegativeCases`       int(11)                                NOT NULL,
    `ConfirmedCases`      int(11)                                NOT NULL,
    `DischargedCases`     int(11)                                NOT NULL,
    `DeathCases`          int(11)                                NOT NULL,
    `SuspectedCases`      int(11)                                NOT NULL,
    `NonICUCases`         int(11)                                NOT NULL,
    `ICUCases`            int(11)                                NOT NULL,
    `ImportedCases`       int(11)                                NOT NULL,
    `LocalCases`          int(11)                                NOT NULL,
    `VisitedPlaces`       text COLLATE utf8mb4_unicode_ci,
    `ResidentialLocation` text COLLATE utf8mb4_unicode_ci,
    `RESPOSTCOD`          text COLLATE utf8mb4_unicode_ci        NOT NULL,
    `DT_CAS_TOT`          bigint(20)                             NOT NULL,
    `CNFRM_CLR`           text COLLATE utf8mb4_unicode_ci        NOT NULL,
    `TotalCases`          int(11)                                NOT NULL,
    `PressUrl`            text COLLATE utf8mb4_unicode_ci        NOT NULL,
    `ObjectId`            int(11)                                NOT NULL,
    `gid`                 int(11)                                NOT NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sg_case_info`
--
ALTER TABLE `sg_case_info`
    ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--
/*!40101 SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION */;
