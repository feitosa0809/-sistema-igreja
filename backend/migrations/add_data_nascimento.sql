-- Script para adicionar coluna data_nascimento na tabela usuarios existente
-- Execute este arquivo caso o banco já exista

-- Verificar se a coluna já existe antes de adicionar
ALTER TABLE usuarios ADD COLUMN data_nascimento DATE;

-- Atualizar alguns registros de teste (opcional)
UPDATE usuarios SET data_nascimento = '1990-05-15' WHERE id = 1;
UPDATE usuarios SET data_nascimento = '1985-03-20' WHERE id = 2;
UPDATE usuarios SET data_nascimento = '1992-11-25' WHERE id = 3;