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
-- Table structure for table `sg_manual_delta`
--

CREATE TABLE `sg_manual_delta` (
  `id` int(11) NOT NULL,
  `Day` int(11) NOT NULL COMMENT 'Foreign Key referencing details table',
  `ConfirmedCases_Day` int(11) NOT NULL DEFAULT '-1',
  `ImportedCase_Day` int(11) NOT NULL DEFAULT '-1',
  `TotalLocalCase_Day` int(11) NOT NULL DEFAULT '0',
  `LocalLinked` int(11) NOT NULL DEFAULT '0',
  `LocalUnlinked` int(11) NOT NULL DEFAULT '-1',
  `Hospital_OtherAreas` int(11) NOT NULL DEFAULT '0',
  `HospitalizedTotal` int(11) NOT NULL DEFAULT '0',
  `HospitalizedStable` int(11) NOT NULL DEFAULT '0',
  `HospitalizedICU` int(11) NOT NULL DEFAULT '-1',
  `HospitalizedOtherArea` int(11) NOT NULL DEFAULT '-1',
  `Recovered_Day` int(11) NOT NULL DEFAULT '-1' COMMENT '(INC-GREEN)',
  `Deaths_Day` int(11) NOT NULL DEFAULT '-1',
  `CumulativeConfirmed` int(11) NOT NULL DEFAULT '0',
  `CumulativeImported` int(11) NOT NULL DEFAULT '0',
  `CumulativeLocal` int(11) NOT NULL DEFAULT '0',
  `CumulativeRecovered` int(11) NOT NULL DEFAULT '0' COMMENT '(INC-GREEN)',
  `CumulativeDeaths` int(11) NOT NULL DEFAULT '0',
  `CumulativeDischarged` int(11) NOT NULL DEFAULT '0' COMMENT 'Deaths + Recovered (INC-GREEN)',
  `DailyQuarantineOrdersIssued` int(11) NOT NULL DEFAULT '0',
  `TotalCloseContacts` int(11) NOT NULL DEFAULT '-1',
  `Quarantined` int(11) NOT NULL DEFAULT '0',
  `CompletedQuarantine` int(11) NOT NULL DEFAULT '0' COMMENT '(INC-GREEN)',
  `QUO_Pending` int(11) NOT NULL DEFAULT '0',
  `QUO_TransferHospital` int(11) NOT NULL DEFAULT '0',
  `QUO_NonGazettedDorm` int(11) NOT NULL DEFAULT '0',
  `QUO_GazettedDorm` int(11) NOT NULL DEFAULT '0',
  `QUO_GovtQuarantinedFacilities` int(11) NOT NULL DEFAULT '0',
  `QUO_HomeQuarantinedOrder` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sg_manual_delta`
--
ALTER TABLE `sg_manual_delta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Day` (`Day`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sg_manual_delta`
--
ALTER TABLE `sg_manual_delta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `sg_manual_delta`
--
ALTER TABLE `sg_manual_delta`
  ADD CONSTRAINT `sg_manual_delta_ibfk_1` FOREIGN KEY (`Day`) REFERENCES `sg_manual_info` (`Day`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
