-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 29, 2020 at 09:05 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `fromsb` varchar(50) NOT NULL,
  `saytosb` varchar(50) NOT NULL,
  `publishTime` timestamp(1) NOT NULL DEFAULT current_timestamp(1) ON UPDATE current_timestamp(1),
  `content` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderid` varchar(20) NOT NULL,
  `storageid` varchar(10) NOT NULL,
  `customer` varchar(30) NOT NULL,
  `confirm` varchar(6) NOT NULL DEFAULT 'no',
  `startdate` date NOT NULL,
  `enddate` date NOT NULL,
  `length` int(5) NOT NULL,
  `baseprice` decimal(8,4) NOT NULL,
  `servicefee` decimal(8,4) NOT NULL,
  `totalprice` decimal(8,4) NOT NULL,
  `personaltitle` varchar(10) NOT NULL,
  `firstname` varchar(20) NOT NULL,
  `lastname` varchar(20) NOT NULL,
  `request` varchar(300) NOT NULL,
  `paid` varchar(5) NOT NULL DEFAULT 'no',
  `ended` varchar(5) NOT NULL DEFAULT 'no',
  `reviewed` varchar(5) NOT NULL DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`orderid`, `storageid`, `customer`, `confirm`, `startdate`, `enddate`, `length`, `baseprice`, `servicefee`, `totalprice`, `personaltitle`, `firstname`, `lastname`, `request`, `paid`, `ended`, `reviewed`) VALUES
('6767121020237566083', '621876634', 'xujingtao9587@gmail.com', 'yes', '2020-04-05', '2020-04-09', 4, '19.4400', '0.9700', '20.4100', 'Mr.', 'zhen', 'lan', 'hahahahahahha', 'yes', 'no', 'no');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` varchar(20) NOT NULL,
  `orderid` varchar(20) NOT NULL,
  `price` decimal(8,4) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`id`, `orderid`, `price`, `time`) VALUES
('1122813507211585298', '6767121020237566083', '0.0000', '2020-03-28 15:32:17');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `reviewid` varchar(20) NOT NULL,
  `orderid` varchar(20) NOT NULL,
  `writer` varchar(30) NOT NULL,
  `content` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `storage`
--

CREATE TABLE `storage` (
  `id` varchar(10) NOT NULL,
  `owner` varchar(30) NOT NULL,
  `accessibility` varchar(6) NOT NULL DEFAULT 'yes',
  `price` decimal(6,4) NOT NULL,
  `title` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `size` varchar(15) NOT NULL,
  `address0` varchar(200) NOT NULL,
  `address1` varchar(200) NOT NULL,
  `city` varchar(80) NOT NULL,
  `province` varchar(80) NOT NULL,
  `zipcode` varchar(20) NOT NULL,
  `country` varchar(80) NOT NULL,
  `dedicated` varchar(5) NOT NULL COMMENT 'yes or no',
  `conditions` varchar(10) NOT NULL COMMENT '(no=0 yes=1) 0=open shelves 1=closed shelves 2=locker 3=room 4=warehouse 5=wine rack',
  `paragraph` varchar(300) NOT NULL COMMENT 'no more than 300 charac',
  `feature` varchar(10) NOT NULL COMMENT '(no=0 yes=1) 0=24hours 1=lock&key 2=CCTV 3=Safe deposite box 4=Delivery',
  `image` varchar(100) NOT NULL,
  `mention` varchar(300) NOT NULL COMMENT 'no more than 300 charac',
  `prohibited` varchar(10) NOT NULL COMMENT '(no=0 yes=1) 0=Furnishings 1=Books 2=Dolls&Plushies 3=Liquid Items box 4=Fragile Items'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `storage`
--

INSERT INTO `storage` (`id`, `owner`, `accessibility`, `price`, `title`, `type`, `size`, `address0`, `address1`, `city`, `province`, `zipcode`, `country`, `dedicated`, `conditions`, `paragraph`, `feature`, `image`, `mention`, `prohibited`) VALUES
('621876634', '272286222@qq.com', 'yes', '4.8600', 'Cozy toa payoh', 'Normal Storage', 'Small', '1 jln rama rama', '#04-02', 'Singapore', 'Singapore', '123456', 'Singapore', 'yes', '0134', 'hahahahahahha', '03', 'picture', 'coolllllllllll', '3');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `email` varchar(30) NOT NULL,
  `password` varchar(50) NOT NULL,
  `username` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`email`, `password`, `username`) VALUES
('272286222@qq.com', '665f644e43731ff9db3d341da5c827e1', 'zhaoyi'),
('cynthiakua11@gmail.com', 'ed108f6919ebadc8e809f8b86ef40b05', 'cynthia'),
('xujingtao9587@gmail.com', 'a12c5e427085fb239fca642b0e7a45e5', 'irene');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderid`),
  ADD KEY `buyer` (`customer`),
  ADD KEY `storage` (`storageid`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orderconnection` (`orderid`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`reviewid`),
  ADD KEY `orderId` (`orderid`),
  ADD KEY `Writer` (`writer`);

--
-- Indexes for table `storage`
--
ALTER TABLE `storage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Owners` (`owner`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD UNIQUE KEY `email` (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `buyer` FOREIGN KEY (`customer`) REFERENCES `user` (`email`),
  ADD CONSTRAINT `storage` FOREIGN KEY (`storageid`) REFERENCES `storage` (`id`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `orderconnection` FOREIGN KEY (`orderid`) REFERENCES `orders` (`orderid`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `Writer` FOREIGN KEY (`writer`) REFERENCES `user` (`email`),
  ADD CONSTRAINT `orderId` FOREIGN KEY (`orderid`) REFERENCES `orders` (`orderid`);

--
-- Constraints for table `storage`
--
ALTER TABLE `storage`
  ADD CONSTRAINT `Owners` FOREIGN KEY (`owner`) REFERENCES `user` (`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
