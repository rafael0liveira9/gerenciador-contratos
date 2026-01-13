-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: contract_cms
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blocos`
--

DROP TABLE IF EXISTS `blocos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blocos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pagina_id` int(11) NOT NULL,
  `clausula_id` int(11) DEFAULT NULL,
  `cabecalho_id` int(11) DEFAULT NULL,
  `rodape_id` int(11) DEFAULT NULL,
  `ordem` int(11) NOT NULL,
  `level` int(11) NOT NULL DEFAULT 1,
  `numeracao` varchar(50) DEFAULT NULL,
  `html_tag` varchar(20) NOT NULL DEFAULT 'p',
  `styles` text DEFAULT NULL,
  `tipo` enum('TITULO','CLAUSULA','OBSERVACAO','CABECALHO','RODAPE') NOT NULL,
  `data_criacao` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `data_edicao` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `blocos_pagina_id_fkey` (`pagina_id`),
  KEY `blocos_clausula_id_fkey` (`clausula_id`),
  KEY `blocos_cabecalho_id_fkey` (`cabecalho_id`),
  KEY `blocos_rodape_id_fkey` (`rodape_id`),
  CONSTRAINT `blocos_cabecalho_id_fkey` FOREIGN KEY (`cabecalho_id`) REFERENCES `cabecalhos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `blocos_clausula_id_fkey` FOREIGN KEY (`clausula_id`) REFERENCES `clausulas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `blocos_pagina_id_fkey` FOREIGN KEY (`pagina_id`) REFERENCES `paginas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `blocos_rodape_id_fkey` FOREIGN KEY (`rodape_id`) REFERENCES `rodapes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blocos`
--

LOCK TABLES `blocos` WRITE;
/*!40000 ALTER TABLE `blocos` DISABLE KEYS */;
/*!40000 ALTER TABLE `blocos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cabecalhos`
--

DROP TABLE IF EXISTS `cabecalhos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cabecalhos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `empresa_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `conteudo` text NOT NULL,
  `versao` int(11) NOT NULL DEFAULT 1,
  `data_criacao` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `data_edicao` datetime(3) DEFAULT NULL,
  `data_exclusao` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cabecalhos_empresa_id_fkey` (`empresa_id`),
  KEY `cabecalhos_parent_id_fkey` (`parent_id`),
  CONSTRAINT `cabecalhos_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cabecalhos_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `cabecalhos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cabecalhos`
--

LOCK TABLES `cabecalhos` WRITE;
/*!40000 ALTER TABLE `cabecalhos` DISABLE KEYS */;
/*!40000 ALTER TABLE `cabecalhos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clausulas`
--

DROP TABLE IF EXISTS `clausulas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clausulas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `empresa_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `conteudo` text NOT NULL,
  `versao` int(11) NOT NULL DEFAULT 1,
  `data_criacao` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `data_edicao` datetime(3) DEFAULT NULL,
  `data_exclusao` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clausulas_empresa_id_fkey` (`empresa_id`),
  KEY `clausulas_parent_id_fkey` (`parent_id`),
  CONSTRAINT `clausulas_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `clausulas_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `clausulas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clausulas`
--

LOCK TABLES `clausulas` WRITE;
/*!40000 ALTER TABLE `clausulas` DISABLE KEYS */;
/*!40000 ALTER TABLE `clausulas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contratos`
--

DROP TABLE IF EXISTS `contratos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contratos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `empresa_id` int(11) NOT NULL,
  `template_id` int(11) NOT NULL,
  `conteudo` longtext NOT NULL,
  `data_enviado` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `data_assinado` datetime(3) DEFAULT NULL,
  `data_concluido` datetime(3) DEFAULT NULL,
  `data_cancelado` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contratos_empresa_id_fkey` (`empresa_id`),
  KEY `contratos_template_id_fkey` (`template_id`),
  CONSTRAINT `contratos_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `contratos_template_id_fkey` FOREIGN KEY (`template_id`) REFERENCES `templates` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contratos`
--

LOCK TABLES `contratos` WRITE;
/*!40000 ALTER TABLE `contratos` DISABLE KEYS */;
/*!40000 ALTER TABLE `contratos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresas`
--

DROP TABLE IF EXISTS `empresas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `documento` varchar(20) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `secret` varchar(255) NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `data_criacao` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `data_edicao` datetime(3) NOT NULL,
  `data_exclusao` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `empresas_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresas`
--

LOCK TABLES `empresas` WRITE;
/*!40000 ALTER TABLE `empresas` DISABLE KEYS */;
/*!40000 ALTER TABLE `empresas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paginas`
--

DROP TABLE IF EXISTS `paginas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paginas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_id` int(11) NOT NULL,
  `ordem` int(11) NOT NULL,
  `conteudo` text DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `data_criacao` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `data_exclusao` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `paginas_template_id_fkey` (`template_id`),
  CONSTRAINT `paginas_template_id_fkey` FOREIGN KEY (`template_id`) REFERENCES `templates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paginas`
--

LOCK TABLES `paginas` WRITE;
/*!40000 ALTER TABLE `paginas` DISABLE KEYS */;
/*!40000 ALTER TABLE `paginas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `responsaveis`
--

DROP TABLE IF EXISTS `responsaveis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `responsaveis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `empresa_id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `data_criacao` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `data_edicao` datetime(3) NOT NULL,
  `data_exclusao` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `responsaveis_empresa_id_fkey` (`empresa_id`),
  CONSTRAINT `responsaveis_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `responsaveis`
--

LOCK TABLES `responsaveis` WRITE;
/*!40000 ALTER TABLE `responsaveis` DISABLE KEYS */;
/*!40000 ALTER TABLE `responsaveis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rodapes`
--

DROP TABLE IF EXISTS `rodapes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rodapes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `empresa_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `conteudo` text NOT NULL,
  `versao` int(11) NOT NULL DEFAULT 1,
  `data_criacao` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `data_edicao` datetime(3) DEFAULT NULL,
  `data_exclusao` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rodapes_empresa_id_fkey` (`empresa_id`),
  KEY `rodapes_parent_id_fkey` (`parent_id`),
  CONSTRAINT `rodapes_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rodapes_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `rodapes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rodapes`
--

LOCK TABLES `rodapes` WRITE;
/*!40000 ALTER TABLE `rodapes` DISABLE KEYS */;
/*!40000 ALTER TABLE `rodapes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `templates`
--

DROP TABLE IF EXISTS `templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `empresa_id` int(11) NOT NULL,
  `versao` int(11) NOT NULL DEFAULT 1,
  `nome` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `data_criacao` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `data_edicao` datetime(3) DEFAULT NULL,
  `data_exclusao` datetime(3) DEFAULT NULL,
  `inicio_vigencia` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `fim_vigencia` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `templates_empresa_id_fkey` (`empresa_id`),
  CONSTRAINT `templates_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `templates`
--

LOCK TABLES `templates` WRITE;
/*!40000 ALTER TABLE `templates` DISABLE KEYS */;
/*!40000 ALTER TABLE `templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variaveis`
--

DROP TABLE IF EXISTS `variaveis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variaveis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `empresa_id` int(11) NOT NULL,
  `label` varchar(255) NOT NULL,
  `tag` varchar(100) NOT NULL,
  `data_criacao` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `data_edicao` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `variaveis_empresa_id_fkey` (`empresa_id`),
  CONSTRAINT `variaveis_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variaveis`
--

LOCK TABLES `variaveis` WRITE;
/*!40000 ALTER TABLE `variaveis` DISABLE KEYS */;
/*!40000 ALTER TABLE `variaveis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'contract_cms'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-13 16:51:39
