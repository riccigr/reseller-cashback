use db_reseller;

-- originally CPF would not be a PK
-- because with LGPD it bring some issues
CREATE TABLE `revendedor` 
(
	`cpf` varchar(14) not null unique,
    `nome` varchar(50) not null,
    `email` varchar(255) not null unique,
    `senha` varchar(255) not null,
    primary key (`cpf`)    
);

-- originally cashback would stay in another table
-- but I try not over enginnering to delivery it in time
CREATE TABLE `compra` 
(
    `codigo` int(10) unsigned not null,
    `valor` decimal(13,2) not null,
    `data` datetime not null,
    `cpf` varchar(14) not null,
    `status` int(2) not null default 0,
    `valor_cashback` decimal(13,2) not null,
    `porcentagem_cashback`  decimal(13,2) not null,
    primary key (`codigo`),
    foreign key(`cpf`) REFERENCES `revendedor`(`cpf`)
);
