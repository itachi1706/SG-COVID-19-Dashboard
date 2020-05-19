-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 19, 2020 at 07:13 PM
-- Server version: 5.7.29
-- PHP Version: 7.2.24-0ubuntu0.18.04.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `covid19`
--

-- --------------------------------------------------------

--
-- Table structure for table `sg_manual_info`
--

CREATE TABLE `sg_manual_info` (
  `Day` int(11) NOT NULL COMMENT 'Basically Previous Day + 1 (CALC)',
  `Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ideally we set current date with time set to 1200h (as per MOH updates)',
  `ConfirmedCases_Day` int(11) NOT NULL DEFAULT '-1',
  `ImportedCase_Day` int(11) NOT NULL DEFAULT '-1',
  `TotalLocalCase_Day` int(11) NOT NULL DEFAULT '0' COMMENT '(CALC)',
  `LocalLinked` int(11) NOT NULL DEFAULT '0' COMMENT '(CALC)',
  `LocalUnlinked` int(11) NOT NULL DEFAULT '-1',
  `Hospital_OtherAreas` int(11) NOT NULL DEFAULT '0' COMMENT 'Combination of Hospitalized and in other areas (CALC)',
  `HospitalizedTotal` int(11) NOT NULL DEFAULT '0' COMMENT '(CALC)',
  `HospitalizedStable` int(11) NOT NULL DEFAULT '0' COMMENT '(CALC)',
  `HospitalizedICU` int(11) NOT NULL DEFAULT '-1',
  `HospitalizedOtherArea` int(11) NOT NULL DEFAULT '-1',
  `Recovered_Day` int(11) NOT NULL DEFAULT '-1',
  `Deaths_Day` int(11) NOT NULL DEFAULT '-1',
  `CumulativeConfirmed` int(11) NOT NULL DEFAULT '0' COMMENT '(CALC)',
  `CumulativeImported` int(11) NOT NULL DEFAULT '0' COMMENT '(CALC)',
  `CumulativeLocal` int(11) NOT NULL DEFAULT '0' COMMENT '(CALC)',
  `CumulativeRecovered` int(11) NOT NULL DEFAULT '0' COMMENT '(CALC)',
  `CumulativeDeaths` int(11) NOT NULL DEFAULT '0' COMMENT '(CALC)',
  `CumulativeDischarged` int(11) NOT NULL DEFAULT '0' COMMENT 'Combination of Recovered and Deaths (CALC)',
  `DailyQuarantineOrdersIssued` int(11) NOT NULL DEFAULT '0' COMMENT '(CALC)',
  `TotalCloseContacts` int(11) NOT NULL DEFAULT '-1' COMMENT 'Additive from Daily Quarantine Orders Issued (CALC)',
  `Quarantined` int(11) NOT NULL DEFAULT '0' COMMENT 'Calculate from all the QUO- fields (CALC)',
  `CompletedQuarantine` int(11) NOT NULL DEFAULT '0',
  `DORSCON` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GREEN' COMMENT 'DORSCON - GREEN, YELLOW, ORANGE, RED',
  `QUO_Pending` int(11) NOT NULL DEFAULT '0',
  `QUO_TransferHospital` int(11) NOT NULL DEFAULT '0',
  `QUO_NonGazettedDorm` int(11) NOT NULL DEFAULT '0',
  `QUO_GazettedDorm` int(11) NOT NULL DEFAULT '0',
  `QUO_GovtQuarantinedFacilities` int(11) NOT NULL DEFAULT '0',
  `QUO_HomeQuarantinedOrder` int(11) NOT NULL DEFAULT '0',
  `Remarks` text COLLATE utf8mb4_unicode_ci COMMENT 'Remarks Column for any remarks of the day'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sg_manual_info`
--
ALTER TABLE `sg_manual_info`
  ADD PRIMARY KEY (`Day`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
