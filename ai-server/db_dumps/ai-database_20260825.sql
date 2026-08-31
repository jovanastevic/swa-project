-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 25, 2026 at 05:15 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ai-database`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `title`, `description`) VALUES
(1, 'Coding', 'Coding related prompts'),
(2, 'Writing', 'Writing related prompts');

-- --------------------------------------------------------

--
-- Table structure for table `chatroom`
--

CREATE TABLE `chatroom` (
  `chat_id` int(11) NOT NULL,
  `prompt_id` int(11) NOT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chatroom`
--

INSERT INTO `chatroom` (`chat_id`, `prompt_id`, `time_stamp`) VALUES
(1, 2, '2026-08-19 22:26:30'),
(2, 5, '2026-08-25 14:42:10');

-- --------------------------------------------------------

--
-- Table structure for table `chat_member`
--

CREATE TABLE `chat_member` (
  `chat_id` int(11) NOT NULL,
  `username` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_member`
--

INSERT INTO `chat_member` (`chat_id`, `username`) VALUES
(1, 'jovanatest'),
(1, 'test'),
(1, 'testuser'),
(2, 'test');

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `message_id` int(11) NOT NULL,
  `chat_id` int(11) NOT NULL,
  `username` varchar(25) NOT NULL,
  `message` text NOT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`message_id`, `chat_id`, `username`, `message`, `time_stamp`) VALUES
(1, 2, 'test', 'fasfd', '2026-08-25 15:14:41'),
(2, 2, 'test', 'fa', '2026-08-25 15:14:43');

-- --------------------------------------------------------

--
-- Table structure for table `prompts`
--

CREATE TABLE `prompts` (
  `prompt_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `username` varchar(25) NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prompts`
--

INSERT INTO `prompts` (`prompt_id`, `category_id`, `username`, `title`, `description`, `time_stamp`) VALUES
(2, 2, 'testuser', 'Test Prompt', 'das ist ein test prompt', '2026-07-23 19:08:46'),
(3, 1, 'ichbinuser', 'test', 'test', '2026-07-25 22:02:15'),
(4, 1, 'nocheinuser', 'bitte ich will nicht mehr coden', 'bitte macht mir das swa projekt fertig hihihuhu', '2026-08-15 22:55:08'),
(5, 1, 'test', 'Hall ein', 'afsf', '2026-08-25 14:42:06');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `username` varchar(25) NOT NULL,
  `password` varchar(500) NOT NULL,
  `email` varchar(100) NOT NULL,
  `profile_description` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`username`, `password`, `email`, `profile_description`) VALUES
('ichbinuser', '$2b$12$d9TjbaaTJUuXMZgc7VBMG.tWQcSQag.8vAGpm.Lg/Fwo.CLsgHCje', 'user@user.com', 'ich bin ein user'),
('jovanatest', '$2b$12$sGvnK5vJTPc.d0tOyenmN.1LexYAIScEkouk5WgNdpPMoxiBPzw.q', 'jovana@gmail.com', 'bambam'),
('nocheinuser', '$2b$12$ZVHE82R3EKwj5/NDuS5cUeH2suNBwAoKbiuxjpv.JNffogfF.RwAS', 'nochuser@gmail.com', 'Ich bin ein user'),
('test', '$2b$12$g23wPb17FP3c7If.gCoYX.NYGeafOOYFaIXfuNqOpBW3aBjD.7sNW', 'test@test.com', NULL),
('test2test', '$2b$12$s1Z9THmsNchzotGqWy5vkOE/IwhzTE7SJfkOf2pQotS3sZOHLnvuW', 'testtest@gmail.com', NULL),
('testuser', '123456', 'test@user.com', 'testuser hallo');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `chatroom`
--
ALTER TABLE `chatroom`
  ADD PRIMARY KEY (`chat_id`),
  ADD UNIQUE KEY `prompt_id` (`prompt_id`),
  ADD UNIQUE KEY `prompt_id_2` (`prompt_id`);

--
-- Indexes for table `chat_member`
--
ALTER TABLE `chat_member`
  ADD PRIMARY KEY (`chat_id`,`username`),
  ADD KEY `username` (`username`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `chat_id` (`chat_id`),
  ADD KEY `username` (`username`);

--
-- Indexes for table `prompts`
--
ALTER TABLE `prompts`
  ADD PRIMARY KEY (`prompt_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `username` (`username`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `chatroom`
--
ALTER TABLE `chatroom`
  MODIFY `chat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `prompts`
--
ALTER TABLE `prompts`
  MODIFY `prompt_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chatroom`
--
ALTER TABLE `chatroom`
  ADD CONSTRAINT `chatroom_ibfk_1` FOREIGN KEY (`prompt_id`) REFERENCES `prompts` (`prompt_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chat_member`
--
ALTER TABLE `chat_member`
  ADD CONSTRAINT `chat_member_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chatroom` (`chat_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chat_member_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chatroom` (`chat_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `prompts`
--
ALTER TABLE `prompts`
  ADD CONSTRAINT `prompts_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `prompts_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
