# 📚 GUIA PARA TCC - Sistema de Gestão Financeira para Igrejas

## 📋 ESTRUTURA DO TCC

Este documento orienta como estruturar seu Trabalho de Conclusão de Curso utilizando este projeto como base prática.

---

## 🎯 TÍTULO SUGERIDO

**"Sistema Web para Gestão Financeira de Igrejas: Desenvolvimento de uma Aplicação Completa com Node.js e SQLite"**

ou

**"Desenvolvimento de Sistema de Controle Financeiro para Instituições Religiosas: Uma Abordagem com Tecnologias Web Modernas"**

---

## 📖 ESTRUTURA COMPLETA DO TCC

### 1. ELEMENTOS PRÉ-TEXTUAIS

#### 1.1 Capa
- Nome da instituição
- Nome do curso
- Seu nome
- Título do trabalho
- Cidade e ano

#### 1.2 Folha de Rosto
- Dados completos do trabalho
- Natureza do trabalho (TCC de graduação/especialização)
- Nome do orientador

#### 1.3 Folha de Aprovação
- Banca examinadora
- Nota/Conceito
- Data da aprovação

#### 1.4 Dedicatória (opcional)

#### 1.5 Agradecimentos (opcional)

#### 1.6 Epígrafe (opcional)

#### 1.7 Resumo
```
Exemplo de estrutura:
"Este trabalho apresenta o desenvolvimento de um sistema web para gestão 
financeira de igrejas, com controle de dízimos, ofertas, campanhas e 
relatórios. O sistema foi desenvolvido utilizando Node.js no backend, 
SQLite como banco de dados e HTML5/CSS3/JavaScript no frontend. 
Implementa autenticação JWT com quatro níveis de permissão (Admin, 
Pastor, Tesoureiro e Membro), oferece funcionalidades de backup 
automático, envio de emails e geração de relatórios em PDF. Os 
resultados demonstram que a aplicação atende aos requisitos propostos, 
oferecendo uma solução completa, segura e de fácil utilização para 
gestão financeira de instituições religiosas."

Palavras-chave: Sistema Web. Gestão Financeira. Node.js. Igrejas. 
Controle de Dízimos.
```

#### 1.8 Abstract (Resumo em inglês)

#### 1.9 Lista de Figuras

#### 1.10 Lista de Tabelas

#### 1.11 Lista de Abreviaturas e Siglas
```
API – Application Programming Interface
CRUD – Create, Read, Update, Delete
CSS – Cascading Style Sheets
HTML – HyperText Markup Language
HTTP – HyperText Transfer Protocol
JWT – JSON Web Token
MVC – Model-View-Controller
PDF – Portable Document Format
REST – Representational State Transfer
SMTP – Simple Mail Transfer Protocol
SQL – Structured Query Language
```

#### 1.12 Sumário

---

### 2. CAPÍTULO 1 - INTRODUÇÃO (8-12 páginas)

#### 1.1 Contextualização
```
- Importância da gestão financeira em igrejas
- Dificuldades no controle manual de dízimos e ofertas
- Necessidade de transparência e prestação de contas
- Evolução tecnológica e digitalização de processos
```

#### 1.2 Problema de Pesquisa
```
"Como desenvolver um sistema web que facilite a gestão financeira 
de igrejas, oferecendo controle de dízimos, ofertas, relatórios e 
transparência administrativa de forma segura e acessível?"
```

#### 1.3 Objetivos

**Objetivo Geral:**
```
Desenvolver um sistema web completo para gestão financeira de igrejas, 
contemplando controle de dízimos, ofertas, campanhas, relatórios e 
administração de usuários.
```

**Objetivos Específicos:**
```
1. Implementar sistema de autenticação com diferentes níveis de acesso
2. Desenvolver módulo de controle de dízimos e ofertas
3. Criar sistema de campanhas financeiras com acompanhamento de metas
4. Implementar geração de relatórios em PDF e visualizações gráficas
5. Desenvolver sistema de notificações por email
6. Implementar backup automático dos dados
7. Criar interface responsiva e intuitiva
```

#### 1.4 Justificativa
```
- Ausência de sistemas específicos para igrejas de pequeno/médio porte
- Custo elevado de sistemas comerciais existentes
- Necessidade de transparência na gestão de recursos
- Facilitar o trabalho administrativo dos tesoureiros
- Modernização dos processos de controle financeiro
```

#### 1.5 Metodologia (resumo)
```
- Pesquisa bibliográfica sobre gestão financeira e tecnologias web
- Levantamento de requisitos junto a igrejas
- Desenvolvimento utilizando metodologia ágil
- Tecnologias: Node.js, Express, SQLite, HTML5, CSS3, JavaScript
- Testes unitários e de integração
```

#### 1.6 Organização do Trabalho
```
Descrever brevemente o conteúdo de cada capítulo
```

---

### 3. CAPÍTULO 2 - FUNDAMENTAÇÃO TEÓRICA (20-30 páginas)

#### 2.1 Gestão Financeira em Instituições Religiosas
```
- 2.1.1 Conceitos de gestão financeira
- 2.1.2 Dízimos e ofertas na administração eclesiástica
- 2.1.3 Transparência e prestação de contas
- 2.1.4 Desafios na gestão financeira de igrejas
```

#### 2.2 Sistemas de Informação
```
- 2.2.1 Conceitos fundamentais
- 2.2.2 Sistemas de gestão financeira
- 2.2.3 Arquitetura de sistemas web
- 2.2.4 Modelos de desenvolvimento de software
```

#### 2.3 Tecnologias Web Modernas
```
- 2.3.1 HTML5 e CSS3
- 2.3.2 JavaScript e programação assíncrona
- 2.3.3 Node.js e ambiente de execução JavaScript
- 2.3.4 Express.js - Framework para aplicações web
- 2.3.5 SQLite - Banco de dados relacional leve
```

#### 2.4 Segurança em Aplicações Web
```
- 2.4.1 Autenticação e autorização
- 2.4.2 JSON Web Token (JWT)
- 2.4.3 Criptografia de senhas (bcrypt)
- 2.4.4 Proteção contra vulnerabilidades (CORS, Helmet)
```

#### 2.5 Padrões de Desenvolvimento
```
- 2.5.1 RESTful API
- 2.5.2 Arquitetura MVC
- 2.5.3 Boas práticas de programação
- 2.5.4 Versionamento de código (Git)
```

#### 2.6 Trabalhos Relacionados
```
- Análise de sistemas similares existentes
- Comparativo de funcionalidades
- Gaps identificados
```

---

### 4. CAPÍTULO 3 - DESENVOLVIMENTO DO SISTEMA (30-40 páginas)

#### 3.1 Levantamento de Requisitos
```
- 3.1.1 Requisitos funcionais
  RF01 - Cadastro de usuários
  RF02 - Autenticação de usuários
  RF03 - Controle de permissões
  RF04 - Registro de dízimos
  RF05 - Registro de ofertas
  RF06 - Upload de comprovantes
  RF07 - Confirmação de pagamentos
  RF08 - Gestão de campanhas
  RF09 - Dashboard com estatísticas
  RF10 - Geração de relatórios PDF
  RF11 - Envio de emails
  RF12 - Backup automático
  RF13 - Configurações da igreja
  
- 3.1.2 Requisitos não funcionais
  RNF01 - Segurança (autenticação JWT)
  RNF02 - Usabilidade (interface intuitiva)
  RNF03 - Performance (resposta < 2s)
  RNF04 - Disponibilidade (24/7)
  RNF05 - Responsividade (mobile-first)
  RNF06 - Escalabilidade
```

#### 3.2 Modelagem do Sistema
```
- 3.2.1 Diagrama de casos de uso
- 3.2.2 Diagrama de classes
- 3.2.3 Diagrama de sequência
- 3.2.4 Modelo entidade-relacionamento (MER)
```

#### 3.3 Arquitetura do Sistema
```
- 3.3.1 Arquitetura geral (camadas)
- 3.3.2 Estrutura de diretórios
- 3.3.3 Fluxo de dados
- 3.3.4 Comunicação cliente-servidor
```

#### 3.4 Banco de Dados
```
- 3.4.1 Escolha do SQLite (justificativa)
- 3.4.2 Modelo de dados
- 3.4.3 Tabelas e relacionamentos
  - usuarios
  - dizimos
  - ofertas
  - campanhas
  - contribuicoes_campanha
  - configuracoes
  - configuracoes_igreja
- 3.4.4 Triggers e constraints
```

#### 3.5 Backend - API REST
```
- 3.5.1 Estrutura do servidor Express
- 3.5.2 Rotas da API
  - /api/auth - Autenticação
  - /api/users - Usuários
  - /api/donations - Dízimos e ofertas
  - /api/dashboard - Estatísticas
  - /api/relatorios - Relatórios
  - /api/backup - Backup
  - /api/notificacoes - Emails
- 3.5.3 Middleware de autenticação
- 3.5.4 Tratamento de erros
```

#### 3.6 Frontend - Interface do Usuário
```
- 3.6.1 Estrutura HTML5
- 3.6.2 Estilização CSS3 (Bootstrap 5)
- 3.6.3 JavaScript (AJAX, Promises)
- 3.6.4 Páginas desenvolvidas:
  - Login (index.html)
  - Dashboard (dashboard.html)
  - Pagamentos (pagamentos.html)
  - Relatórios (relatorios.html)
  - Aniversariantes (aniversariantes.html)
  - Notificações (notificacoes.html)
  - Configurações (configuracoes.html)
  - Perfil (perfil.html)
  - Gerenciar Usuários (gerenciar-usuarios.html)
```

#### 3.7 Funcionalidades Implementadas
```
- 3.7.1 Sistema de autenticação (JWT)
- 3.7.2 Níveis de permissão
- 3.7.3 Controle de dízimos e ofertas
- 3.7.4 Upload de comprovantes
- 3.7.5 Dashboard interativo (Chart.js)
- 3.7.6 Relatórios em PDF (PDFKit)
- 3.7.7 Sistema de emails (Nodemailer)
- 3.7.8 Backup automático
- 3.7.9 Gerenciamento de usuários
```

#### 3.8 Segurança
```
- 3.8.1 Criptografia de senhas (bcrypt)
- 3.8.2 Tokens JWT
- 3.8.3 Validação de entrada
- 3.8.4 Proteção contra ataques (Helmet, CORS)
- 3.8.5 Sanitização de dados
```

---

### 5. CAPÍTULO 4 - RESULTADOS E DISCUSSÕES (15-20 páginas)

#### 4.1 Apresentação do Sistema Desenvolvido
```
- 4.1.1 Telas e funcionalidades
- 4.1.2 Fluxo de navegação
- 4.1.3 Screenshots comentados
```

#### 4.2 Testes Realizados
```
- 4.2.1 Testes de funcionalidade
- 4.2.2 Testes de segurança
- 4.2.3 Testes de usabilidade
- 4.2.4 Testes de performance
- 4.2.5 Resultados dos testes
```

#### 4.3 Validação com Usuários
```
- 4.3.1 Perfil dos participantes
- 4.3.2 Questionário de avaliação
- 4.3.3 Análise das respostas
- 4.3.4 Feedback recebido
```

#### 4.4 Análise dos Resultados
```
- 4.4.1 Objetivos alcançados
- 4.4.2 Comparação com trabalhos relacionados
- 4.4.3 Limitações identificadas
- 4.4.4 Pontos fortes do sistema
```

#### 4.5 Discussão
```
- Análise crítica dos resultados
- Contribuições do trabalho
- Aplicabilidade prática
```

---

### 6. CAPÍTULO 5 - CONCLUSÃO (5-8 páginas)

#### 5.1 Considerações Finais
```
- Resumo do trabalho realizado
- Objetivos alcançados
- Contribuições técnicas e práticas
```

#### 5.2 Dificuldades Encontradas
```
- Desafios técnicos
- Problemas de implementação
- Como foram superados
```

#### 5.3 Trabalhos Futuros
```
- Integração com APIs de pagamento (PIX automático)
- App mobile nativo (React Native)
- Relatórios avançados com Business Intelligence
- Integração com sistemas bancários
- Sistema de notificações push
- Multi-tenancy (múltiplas igrejas)
- Dashboard para membros com histórico
- Sistema de doações online
- Controle de patrimônio
- Gestão de eventos
```

---

## 📊 ELEMENTOS DE APOIO

### Tabela 1: Comparativo de Tecnologias
| Tecnologia | Vantagens | Desvantagens |
|------------|-----------|--------------|
| Node.js | Performance, JavaScript full-stack | Curva de aprendizado |
| SQLite | Leve, sem servidor | Limite de concorrência |
| Express | Simples, flexível | Requer configuração |

### Tabela 2: Requisitos Funcionais x Implementação
| ID | Requisito | Status | Observações |
|----|-----------|--------|-------------|
| RF01 | Cadastro usuários | ✅ | Completo |
| RF02 | Autenticação | ✅ | JWT implementado |

### Figura 1: Arquitetura do Sistema
```
[Criar diagrama mostrando camadas: Frontend -> API -> Backend -> Database]
```

### Figura 2: Diagrama de Casos de Uso
```
[Criar diagrama UML com atores: Admin, Pastor, Tesoureiro, Membro]
```

### Figura 3: Modelo Entidade-Relacionamento
```
[Criar MER mostrando todas as tabelas e relacionamentos]
```

### Figura 4: Fluxo de Autenticação
```
[Criar diagrama de sequência do login]
```

### Figura 5-15: Screenshots do Sistema
```
- Tela de login
- Dashboard principal
- Listagem de dízimos
- Formulário de cadastro
- Relatórios
- Gráficos
- Configurações
- Gerenciar usuários
- Upload de comprovante
- Email de confirmação
- Backup
```

---

## 📝 REFERÊNCIAS BIBLIOGRÁFICAS (exemplos)

### Livros:
```
PRESSMAN, R. S. Engenharia de Software: Uma Abordagem Profissional. 
8. ed. Porto Alegre: AMGH, 2016.

SOMMERVILLE, I. Engenharia de Software. 10. ed. São Paulo: Pearson, 2018.

FLANAGAN, D. JavaScript: O Guia Definitivo. 6. ed. Porto Alegre: 
Bookman, 2013.

SILBERSCHATZ, A.; KORTH, H. F.; SUDARSHAN, S. Sistema de Banco de Dados. 
6. ed. Rio de Janeiro: Elsevier, 2012.
```

### Artigos:
```
NODEJS FOUNDATION. Node.js: Plataforma de desenvolvimento. Disponível em: 
<https://nodejs.org>. Acesso em: [data].

MOZILLA DEVELOPER NETWORK. HTML5: Guia de referência. Disponível em: 
<https://developer.mozilla.org>. Acesso em: [data].
```

### Documentação Técnica:
```
EXPRESS. Express.js Documentation. Disponível em: 
<https://expressjs.com>. Acesso em: [data].

SQLITE. SQLite Documentation. Disponível em: 
<https://sqlite.org/docs.html>. Acesso em: [data].
```

---

## 📐 FORMATAÇÃO ABNT

### Margens:
- Superior: 3 cm
- Inferior: 2 cm
- Esquerda: 3 cm
- Direita: 2 cm

### Fonte:
- Corpo do texto: Arial ou Times New Roman, tamanho 12
- Citações longas: tamanho 10
- Notas de rodapé: tamanho 10

### Espaçamento:
- Texto: 1,5 linhas
- Citações longas: espaço simples
- Títulos: sem espaçamento anterior

### Paginação:
- Elementos pré-textuais: algarismos romanos (i, ii, iii)
- Elementos textuais: algarismos arábicos (1, 2, 3)

---

## 🎯 DICAS IMPORTANTES

### 1. Documentação Técnica
- Mantenha comentários no código
- Documente decisões de arquitetura
- Registre problemas e soluções

### 2. Capturas de Tela
- Use imagens de alta qualidade
- Adicione legendas descritivas
- Destaque funcionalidades importantes

### 3. Diagramas
- Use ferramentas como Draw.io, Lucidchart
- Mantenha padrão visual
- Seja claro e objetivo

### 4. Revisão
- Revise gramática e ortografia
- Verifique formatação ABNT
- Peça feedback do orientador

### 5. Defesa
- Prepare apresentação (15-20 slides)
- Destaque contribuições do trabalho
- Antecipe perguntas da banca

---

## 📦 ANEXOS SUGERIDOS

### Anexo A: Código-fonte principal (trechos)
```javascript
// Exemplo de autenticação
router.post('/login', async (req, res) => {
  // Código comentado
});
```

### Anexo B: Modelo do banco de dados (SQL)
```sql
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  -- etc
);
```

### Anexo C: Manual do usuário

### Anexo D: Manual de instalação

### Anexo E: Questionário de avaliação

### Anexo F: Termo de consentimento (testes)

---

## ⏱️ CRONOGRAMA SUGERIDO

| Atividade | Prazo | Status |
|-----------|-------|--------|
| Pesquisa bibliográfica | 2 semanas | |
| Levantamento de requisitos | 1 semana | |
| Modelagem do sistema | 1 semana | |
| Desenvolvimento (já feito!) | - | ✅ |
| Testes e validação | 2 semanas | |
| Escrita Cap. 1-2 | 3 semanas | |
| Escrita Cap. 3-4 | 4 semanas | |
| Escrita Cap. 5 | 1 semana | |
| Revisão geral | 2 semanas | |
| Ajustes finais | 1 semana | |
| Entrega | - | |

---

## ✅ CHECKLIST FINAL

- [ ] Todos os capítulos escritos
- [ ] Referências completas e formatadas
- [ ] Diagramas criados
- [ ] Screenshots inseridos
- [ ] Código comentado
- [ ] Formatação ABNT revisada
- [ ] Resumo e abstract prontos
- [ ] Sumário automático gerado
- [ ] Numeração de páginas correta
- [ ] Aprovação do orientador
- [ ] Apresentação preparada

---

## 🎓 OBSERVAÇÕES FINAIS

1. **Seu projeto JÁ ESTÁ PRONTO!** A parte mais difícil (desenvolvimento) você já fez.

2. **Foco na documentação:** Agora é escrever sobre o que você desenvolveu.

3. **Use este documento como guia:** Siga a estrutura sugerida.

4. **Adapte à sua instituição:** Cada universidade tem suas normas específicas.

5. **Consulte seu orientador:** Tire dúvidas durante o processo.

---

**BOA SORTE NO SEU TCC! 🎉**

O sistema está completo e funcional. Agora é só documentar todo o processo
de desenvolvimento e apresentar para a banca!
