MySQL 기반 서버입니다.
도커 컨테이너 파일은 구글 드라이브 
API : https://drive.google.com/file/d/1iQr7vJXAQ9vD4s0wmwm013UvWJEKCIsE/view?usp=drive_link
DB : https://drive.google.com/file/d/1MHQQjxXMtuvq2DWiHulGs3Fn7zb6Yk-O/view?usp=drive_link
에서 찾을 수 있습니다.

포트는 각각 
API : 2080:3000, 336:80
DB : 3306:3306으로 설정되어 있으며

컨테이너 실행후 각각 
API 
sudo su
cd /home/forserver2/
nginx
node app.js

db
sudo su
service MariaDB start

으로 서버 기능을 실행합니다.

네트워크 설정이 필요하며 파워셀을 통해 아래 명령어를 입력하여 네트워크 브릿지를 만듭니다.
docker network create <네트워크 그룹 이름>

docker network connect <네트워크 그룹 이름> <DB 컨테이너 이름>
docker network connect <네트워크 그룹 이름> <API 컨테이너 이름>

DB에 테이블이 없을시 아래 생성문을 사용합니다.

create database gpt;

CREATE TABLE `UserLogin` (
  `member_id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `login_locked` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`member_id`)
); 

CREATE TABLE `UserInfo` (
  `member_id` int(11) NOT NULL,
  `SNS` tinyint(1) DEFAULT 0,
  `join_date` datetime DEFAULT CURRENT_TIMESTAMP(),
  `last_login` datetime DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_num` varchar(20) DEFAULT NULL,
  `family_code` int(11) DEFAULT NULL,
  `role` int(11) DEFAULT 0,
  PRIMARY KEY (`member_id`),
  KEY `fk_userinfo_family` (`family_code`),
  CONSTRAINT `fk_userinfo_family`
    FOREIGN KEY (`family_code`)
    REFERENCES `Family` (`family_code`),
  CONSTRAINT `fk_userinfo_member`
    FOREIGN KEY (`member_id`)
    REFERENCES `UserLogin` (`member_id`)
); 

CREATE TABLE `Schedule` (
  `schedule_id` int(11) NOT NULL AUTO_INCREMENT,
  `m_name` varchar(255) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `cycle` varchar(50) DEFAULT NULL,
  `method` varchar(50) DEFAULT NULL,
  `protected_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`schedule_id`),
  KEY `fk_schedule_protected` (`protected_id`),
  CONSTRAINT `fk_schedule_protected`
    FOREIGN KEY (`protected_id`)
    REFERENCES `UserLogin` (`member_id`)
);

CREATE TABLE `Record` (
  `record_id` int(11) NOT NULL AUTO_INCREMENT,
  `schedule_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `planned_time` time NOT NULL,
  `actual_time` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`record_id`),
  KEY `fk_record_schedule` (`schedule_id`),
  CONSTRAINT `fk_record_schedule`
    FOREIGN KEY (`schedule_id`)
    REFERENCES `Schedule` (`schedule_id`)
    ON DELETE CASCADE
); 

CREATE TABLE `Family` (
  `family_code` int(11) NOT NULL AUTO_INCREMENT,
  `protector_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`family_code`),
  KEY `fk_family_protector` (`protector_id`),
  CONSTRAINT `fk_family_protector`
    FOREIGN KEY (`protector_id`)
    REFERENCES `UserLogin` (`member_id`)
);

