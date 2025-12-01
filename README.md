MySQL 기반 서버입니다. <br>
도커 이미지 파일은 구글 드라이브 <br> 
API : https://drive.google.com/file/d/1rXH63tNnzdqXSuGS1O2_dki0FXz3UpLJ/view?usp=sharing <br>
DB : https://drive.google.com/file/d/1MHQQjxXMtuvq2DWiHulGs3Fn7zb6Yk-O/view?usp=drive_link <br>
Nginx : https://drive.google.com/file/d/11N1mkI-PlCbSTnScgNo0RuRpfq6us9rF/view?usp=sharing <br>
에서 찾을 수 있습니다. <br><br>

컨테이너 생성시 이름과 포트를 아래와 같이 하셔야 수정 없이 실행 가능합니다.
API2 ->  ApiTest
DB -> DBserver
Nginx -> Nginx

포트는 각각 <br>
API : 2080:3000 <br>
DB : 3306:3306 <br>
Nginx : 404:80 <br>
으로 설정되어 있습니다. <br><br>

Nginx 컨테이너가 지속적으로 종료 될시 아래 명령어를 통해 생성 하시면 됩니다. <br>
docker run -d --name nginx nginx:latest tail -f /dev/null <br>

컨테이너 실행후 각각 <br>
API 컨테이너 <br>
sudo su <br>
cd /home/forserver2/ <br>
nginx <br>
node app.js <br><br>

DB 컨테이너 <br>
sudo su <br>
service MariaDB start <br><br>

Nginx 컨테이너 <br>
Nginx <br>

으로 서버 기능을 실행합니다. <br><br>

네트워크 설정이 필요하며 파워셀을 통해 아래 명령어를 입력하여 네트워크 브릿지를 만듭니다. <br>
docker network create <네트워크 그룹 이름> <br><br>

docker network connect <네트워크 그룹 이름> DBserver <br>
docker network connect <네트워크 그룹 이름> ApiTest  <br>
docker network connect <네트워크 그룹 이름> Nginx <br><br>

DB에 테이블이 없을시 아래 생성문을 사용합니다.  <br>

create database gpt; <br>

CREATE TABLE `UserLogin` ( <br>
  `member_id` int(11) NOT NULL AUTO_INCREMENT, <br>
  `userID` varchar(50) NOT NULL, <br>
  `password` varchar(255) NOT NULL, <br>
  `salt` varchar(255) NOT NULL, <br>
  `login_locked` tinyint(1) DEFAULT 0, <br>
  PRIMARY KEY (`member_id`) <br>
);  <br><br>

CREATE TABLE `UserInfo` ( <br>
  `member_id` int(11) NOT NULL, <br>
  `SNS` tinyint(1) DEFAULT 0, <br>
  `join_date` datetime DEFAULT CURRENT_TIMESTAMP(), <br>
  `last_login` datetime DEFAULT NULL, <br>
  `email` varchar(255) DEFAULT NULL, <br>
  `phone_num` varchar(20) DEFAULT NULL, <br>
  `family_code` int(11) DEFAULT NULL, <br>
  `role` int(11) DEFAULT 0, <br>
  PRIMARY KEY (`member_id`), <br>
  KEY `fk_userinfo_family` (`family_code`), <br>
  CONSTRAINT `fk_userinfo_family` <br>
    FOREIGN KEY (`family_code`) <br>
    REFERENCES `Family` (`family_code`), <br>
  CONSTRAINT `fk_userinfo_member` <br>
    FOREIGN KEY (`member_id`) <br>
    REFERENCES `UserLogin` (`member_id`) <br>
);  <br>

CREATE TABLE `Schedule` ( <br>
  `schedule_id` int(11) NOT NULL AUTO_INCREMENT, <br>
  `m_name` varchar(255) DEFAULT NULL, <br>
  `start_date` datetime DEFAULT NULL, <br>
  `end_date` datetime DEFAULT NULL, <br>
  `cycle` varchar(50) DEFAULT NULL, <br>
  `method` varchar(50) DEFAULT NULL, <br>
  `protected_id` int(11) DEFAULT NULL, <br>
  PRIMARY KEY (`schedule_id`), <br>
  KEY `fk_schedule_protected` (`protected_id`), <br>
  CONSTRAINT `fk_schedule_protected` <br>
    FOREIGN KEY (`protected_id`) <br>
    REFERENCES `UserLogin` (`member_id`) <br>
); <br><br>

CREATE TABLE `Record` ( <br>
  `record_id` int(11) NOT NULL AUTO_INCREMENT, <br>
  `schedule_id` int(11) DEFAULT NULL, <br>
  `date` date NOT NULL, <br>
  `planned_time` time NOT NULL, <br>
  `actual_time` datetime DEFAULT NULL, <br>
  `status` int(11) DEFAULT NULL, <br>
  PRIMARY KEY (`record_id`), <br>
  KEY `fk_record_schedule` (`schedule_id`), <br>
  CONSTRAINT `fk_record_schedule` <br>
    FOREIGN KEY (`schedule_id`) <br>
    REFERENCES `Schedule` (`schedule_id`) <br>
    ON DELETE CASCADE <br>
);  <br><br>

CREATE TABLE `Family` ( <br>
  `family_code` int(11) NOT NULL AUTO_INCREMENT, <br>
  `protector_id` int(11) DEFAULT NULL, <br>
  PRIMARY KEY (`family_code`), <br>
  KEY `fk_family_protector` (`protector_id`), <br>
  CONSTRAINT `fk_family_protector` <br>
    FOREIGN KEY (`protector_id`) <br>
    REFERENCES `UserLogin` (`member_id`) <br>
); <br><br>

