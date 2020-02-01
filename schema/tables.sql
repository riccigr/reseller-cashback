use db_reseller;

CREATE TABLE `reseller` 
(
	`id` int(10) unsigned not null auto_increment,
    `full_name` varchar(50) not null,
    `cpf` varchar(14) not null unique,
    `email` varchar(255) not null unique,
    `pass` varchar(255) not null,
    primary key (`id`)    
);