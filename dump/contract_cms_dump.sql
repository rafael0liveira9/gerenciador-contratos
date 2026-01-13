-- =========================================================
-- BANCO: contract_cms
-- =========================================================

DROP DATABASE IF EXISTS contract_cms;
CREATE DATABASE contract_cms
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE contract_cms;

-- =========================================================
-- TABELA: clauses
-- Biblioteca de cláusulas (versionadas)
-- =========================================================

DROP TABLE IF EXISTS clauses;
CREATE TABLE clauses (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  original_clause_id BIGINT NULL,
  title VARCHAR(255) NULL,
  content LONGTEXT NOT NULL,

  version INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  created_by BIGINT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_clauses_original (original_clause_id),
  INDEX idx_clauses_active (is_active),

  CONSTRAINT fk_clauses_original
    FOREIGN KEY (original_clause_id)
    REFERENCES clauses(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================================================
-- TABELA: contracts
-- Contratos
-- =========================================================

DROP TABLE IF EXISTS contracts;
CREATE TABLE contracts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  name VARCHAR(255) NOT NULL,
  status ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo',

  valid_from DATE NULL,
  valid_until DATE NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_contracts_status (status)
) ENGINE=InnoDB;

-- =========================================================
-- TABELA: contract_blocks
-- Estrutura do documento (drag & drop)
-- =========================================================

DROP TABLE IF EXISTS contract_blocks;
CREATE TABLE contract_blocks (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  contract_id BIGINT NOT NULL,

  block_type ENUM('TITLE', 'CLAUSE', 'OBS') NOT NULL,

  clause_id BIGINT NULL,
  content LONGTEXT NULL,

  parent_block_id BIGINT NULL,
  sort_order INT NOT NULL,

  numbering VARCHAR(20) NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_blocks_contract (contract_id),
  INDEX idx_blocks_parent (parent_block_id),
  INDEX idx_blocks_type (block_type),

  CONSTRAINT fk_blocks_contract
    FOREIGN KEY (contract_id)
    REFERENCES contracts(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_blocks_clause
    FOREIGN KEY (clause_id)
    REFERENCES clauses(id)
    ON DELETE RESTRICT,

  CONSTRAINT fk_blocks_parent
    FOREIGN KEY (parent_block_id)
    REFERENCES contract_blocks(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- FIM DO DUMP
-- =========================================================