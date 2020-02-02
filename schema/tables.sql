use db_reseller;

CREATE TABLE `revendedor` 
(
	`cpf` varchar(14) not null unique,
    `nome` varchar(50) not null,
    `email` varchar(255) not null unique,
    `senha` varchar(255) not null,
    primary key (`cpf`)    
);

CREATE TABLE `compra` 
(
	`codigo` int(10) not null auto_increment,
    `valor` decimal(13,2) not null,
    `data` datetime not null,
    `cpf` varchar(14) not null,
    `status` int(2) not null default 0,
    primary key (`codigo`),
    foreign key(`cpf`) REFERENCES  `revendedor`(`cpf`)
);

CREATE TABLE `cashback` 
(
    `codigo_compra` int(10) not null,
    `valor` decimal(13,2) not null,
    `porcentagem`  decimal(13,2) not null,
    primary key (`codigo_compra`),
    foreign key(`codigo_compra`) REFERENCES `compra`(`codigo`)
);
