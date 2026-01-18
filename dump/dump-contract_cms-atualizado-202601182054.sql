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
  `conteudo` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `blocos_cabecalho_id_fkey` (`cabecalho_id`),
  KEY `blocos_clausula_id_fkey` (`clausula_id`),
  KEY `blocos_pagina_id_fkey` (`pagina_id`),
  KEY `blocos_rodape_id_fkey` (`rodape_id`),
  CONSTRAINT `blocos_cabecalho_id_fkey` FOREIGN KEY (`cabecalho_id`) REFERENCES `cabecalhos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `blocos_clausula_id_fkey` FOREIGN KEY (`clausula_id`) REFERENCES `clausulas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `blocos_pagina_id_fkey` FOREIGN KEY (`pagina_id`) REFERENCES `paginas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `blocos_rodape_id_fkey` FOREIGN KEY (`rodape_id`) REFERENCES `rodapes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blocos`
--

LOCK TABLES `blocos` WRITE;
/*!40000 ALTER TABLE `blocos` DISABLE KEYS */;
INSERT INTO `blocos` VALUES (5,1,8,NULL,NULL,5,1,NULL,'div','{}','CLAUSULA','2026-01-16 18:42:11.442','2026-01-16 18:43:33.244',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cabecalhos`
--

LOCK TABLES `cabecalhos` WRITE;
/*!40000 ALTER TABLE `cabecalhos` DISABLE KEYS */;
INSERT INTO `cabecalhos` VALUES (1,1,NULL,'CONTRATO DE PRESTAÇÃO DE SERVIÇOS','CONTRATO DE PRESTAÇÃO DE SERVIÇOS',1,'2026-01-16 15:10:19.998','2026-01-16 15:10:19.998',NULL),(2,1,1,'CONTRATO DE PRESTAÇÃO DE SERVIÇOS','<div style=\"text-align: center;\"><span style=\"font-size: large;\"><b>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</b></span></div>',2,'2026-01-16 15:11:05.133','2026-01-16 15:11:05.133',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clausulas`
--

LOCK TABLES `clausulas` WRITE;
/*!40000 ALTER TABLE `clausulas` DISABLE KEYS */;
INSERT INTO `clausulas` VALUES (1,1,NULL,'DADOS CONTRATANTE','CONTRATANTE: AMA APOIO E GESTÃO EMPRESARIAL LTDA, pessoa jurídica de direito privado, inscrita no CNPJ sob nº 44.992.304/0001-58, com endereço na Rua Marechal Deodoro, nº 869, Conj. 1202, andar 12, Cond. Center Tower ED, Centro, em Curitiba - PR, neste ato representada por sua sócia administradora, Sra. LEONICE ANTÔNIA ASSUNÇÃO E SILVA, brasileira, viúva, empresária, inscrita no CPF sob nº 085.515.808-50.',1,'2026-01-16 14:33:54.582','2026-01-16 14:33:54.582',NULL),(2,1,NULL,'DADOS DO CONTRATADO','CONTRATADA: RAFAEL MARIANO DE OLIVEIRA 06473846980, pessoa jurídica de direito privado inscrita no CNPJ nº 48.849.536/0001-02, com sede na Rua O Brasil para Cristo – de 1771/1772 ao Fim, Nº 3473, Casa 3, Bairro Boqueirão, Município de Curitiba - PR, CEP: 81.730-070, neste ato, representada por RAFAEL MARIANO DE OLIVEIRA, brasileiro, inscrito no CPF nº 064.738.469-80, residente e domiciliado no mesmo endereço.',1,'2026-01-16 14:48:19.231','2026-01-16 14:48:19.231',NULL),(3,1,2,'DADOS DO CONTRATADO','CONTRATADA: {{empresa}}, pessoa jurídica de direito privado inscrita no CNPJ nº {{cnpj}}, com sede na {{endereço_completo}}, neste ato, representada por {{nome}}, brasileiro, inscrito no CPF nº {{cpf}}, residente e domiciliado no mesmo endereço.',2,'2026-01-16 14:50:48.154','2026-01-16 14:50:48.154',NULL),(4,1,1,'DADOS CONTRATANTE','<b>CONTRATANTE</b>: <b>AMA APOIO E GESTÃO EMPRESARIAL LTDA</b>, pessoa jurídica de direito privado, inscrita no CNPJ sob nº 44.992.304/0001-58, com endereço na Rua Marechal Deodoro, nº 869, Conj. 1202, andar 12, Cond. Center Tower ED, Centro, em Curitiba - PR, neste ato representada por sua sócia administradora, Sra. LEONICE ANTÔNIA ASSUNÇÃO E SILVA, brasileira, viúva, empresária, inscrita no CPF sob nº 085.515.808-50.',2,'2026-01-16 15:02:05.731','2026-01-16 15:02:05.731',NULL),(5,1,NULL,'Imagem','Imagem',1,'2026-01-16 18:42:08.032','2026-01-16 18:42:08.032',NULL),(6,1,5,'Imagem','{{imagem}}',2,'2026-01-16 18:42:34.830','2026-01-16 18:42:34.830',NULL),(7,1,5,'Imagem','{{imagem}}<br><br>{{texto_map}}',3,'2026-01-16 18:43:00.390','2026-01-16 18:43:00.390',NULL),(8,1,5,'Imagem','{{imagem}}<br><br>{{texto_map}}<br><br><br>{{tabela_simples}}',4,'2026-01-16 18:43:33.238','2026-01-16 18:43:33.238',NULL);
/*!40000 ALTER TABLE `clausulas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentos`
--

DROP TABLE IF EXISTS `documentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `empresa_id` int(11) NOT NULL,
  `template_id` int(11) NOT NULL,
  `pdf_path` varchar(500) NOT NULL,
  `data_enviado` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `data_assinado` datetime(3) DEFAULT NULL,
  `data_concluido` datetime(3) DEFAULT NULL,
  `data_cancelado` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `documentos_empresa_id_fkey` (`empresa_id`),
  KEY `documentos_template_id_fkey` (`template_id`),
  CONSTRAINT `documentos_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `documentos_template_id_fkey` FOREIGN KEY (`template_id`) REFERENCES `templates` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentos`
--

LOCK TABLES `documentos` WRITE;
/*!40000 ALTER TABLE `documentos` DISABLE KEYS */;
INSERT INTO `documentos` VALUES (1,1,1,'/public/documentos/1/documento_1768589063390.pdf','2026-01-16 18:44:23.394',NULL,NULL,NULL),(2,1,1,'/public/documentos/1/documento_1768589769075.pdf','2026-01-16 18:56:09.077',NULL,NULL,NULL);
/*!40000 ALTER TABLE `documentos` ENABLE KEYS */;
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
  `data_edicao` datetime(3) DEFAULT NULL,
  `data_exclusao` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `empresas_slug_key` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresas`
--

LOCK TABLES `empresas` WRITE;
/*!40000 ALTER TABLE `empresas` DISABLE KEYS */;
INSERT INTO `empresas` VALUES (1,'111111111111','Speed Sale','speed-sale','A9fK3xQm7P2ZLwE8sR4H',1,'2026-01-16 10:41:16.132',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paginas`
--

LOCK TABLES `paginas` WRITE;
/*!40000 ALTER TABLE `paginas` DISABLE KEYS */;
INSERT INTO `paginas` VALUES (1,1,1,NULL,1,'2026-01-16 14:06:32.834',NULL);
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
  `data_edicao` datetime(3) DEFAULT NULL,
  `data_exclusao` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `responsaveis_empresa_id_fkey` (`empresa_id`),
  CONSTRAINT `responsaveis_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `responsaveis`
--

LOCK TABLES `responsaveis` WRITE;
/*!40000 ALTER TABLE `responsaveis` DISABLE KEYS */;
INSERT INTO `responsaveis` VALUES (1,1,'Rafael Mariano de Oliveira','06473846980','41992730204','rafaelde0liveira@hotmail.com','2026-01-16 10:41:49.899',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `templates`
--

LOCK TABLES `templates` WRITE;
/*!40000 ALTER TABLE `templates` DISABLE KEYS */;
INSERT INTO `templates` VALUES (1,1,1,'Contrato de Prestação de Serviços',NULL,'2026-01-16 14:06:32.834','2026-01-16 14:06:43.670',NULL,'2026-01-15 00:00:00.000',NULL);
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
  `tag` varchar(100) NOT NULL,
  `data_criacao` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `data_edicao` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `variaveis_empresa_id_fkey` (`empresa_id`),
  CONSTRAINT `variaveis_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variaveis`
--

LOCK TABLES `variaveis` WRITE;
/*!40000 ALTER TABLE `variaveis` DISABLE KEYS */;
INSERT INTO `variaveis` VALUES (4,1,'nome','2026-01-16 13:44:14.774','2026-01-16 13:44:14.774'),(5,1,'empresa','2026-01-16 13:44:18.966','2026-01-16 13:44:18.966'),(6,1,'cnpj','2026-01-16 13:44:22.856','2026-01-16 13:44:22.856'),(7,1,'cpf','2026-01-16 14:49:07.695','2026-01-16 14:49:07.695'),(8,1,'endereço_completo','2026-01-16 14:49:40.527','2026-01-16 14:49:40.527'),(9,1,'imagem','2026-01-16 18:42:29.260','2026-01-16 18:42:29.260'),(10,1,'texto_map','2026-01-16 18:42:49.460','2026-01-16 18:42:49.460'),(11,1,'tabela_simples','2026-01-16 18:43:26.083','2026-01-16 18:43:26.083');
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

-- Dump completed on 2026-01-18 20:54:52
