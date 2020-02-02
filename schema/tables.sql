use db_reseller;

CREATE TABLE `revendedor` 
(
	`cpf` varchar(14) not null unique,
    `nome` varchar(50) not null,
    `email` varchar(255) not null unique,
    `senha` varchar(255) not null,
    primary key (`cpf`)    
);