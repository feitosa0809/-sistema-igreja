const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Criar diretório de relatórios se não existir
const reportsDir = path.join(__dirname, '..', 'relatorios');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

/**
 * Gera relatório de dízimos em PDF
 */
async function gerarRelatorioDizimos(dados, periodo, configIgreja = {}) {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `dizimos-${periodo.replace(/\//g, '-')}-${Date.now()}.pdf`;
      const filePath = path.join(reportsDir, fileName);
      
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);

      // Cabeçalho
      doc.fontSize(20)
         .fillColor('#667eea')
         .text(configIgreja.nome_igreja || 'Igreja', { align: 'center' });
      
      doc.fontSize(16)
         .fillColor('#333')
         .text('Relatório de Dízimos', { align: 'center' });
      
      doc.fontSize(12)
         .fillColor('#666')
         .text(`Período: ${periodo}`, { align: 'center' });
      
      doc.moveDown(2);

      // Linha divisória
      doc.moveTo(50, doc.y)
         .lineTo(550, doc.y)
         .strokeColor('#667eea')
         .lineWidth(2)
         .stroke();
      
      doc.moveDown();

      // Resumo
      doc.fontSize(14)
         .fillColor('#667eea')
         .text('Resumo Financeiro', { underline: true });
      
      doc.moveDown(0.5);
      
      const totalDizimos = dados.dizimos.reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);
      const totalConfirmados = dados.dizimos.filter(d => d.status === 'confirmado').length;
      const totalPendentes = dados.dizimos.filter(d => d.status === 'pendente').length;

      doc.fontSize(11)
         .fillColor('#333')
         .text(`Total de Dízimos: ${dados.dizimos.length}`, { indent: 20 })
         .text(`Confirmados: ${totalConfirmados}`, { indent: 20 })
         .text(`Pendentes: ${totalPendentes}`, { indent: 20 })
         .text(`Valor Total: R$ ${totalDizimos.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, { indent: 20 });
      
      doc.moveDown(2);

      // Tabela de dízimos
      doc.fontSize(14)
         .fillColor('#667eea')
         .text('Detalhamento dos Dízimos', { underline: true });
      
      doc.moveDown(0.5);

      // Cabeçalho da tabela
      const tableTop = doc.y;
      const colWidths = {
        data: 70,
        dizimista: 150,
        valor: 80,
        tipo: 80,
        status: 70
      };

      doc.fontSize(10)
         .fillColor('#fff')
         .rect(50, tableTop, 500, 20)
         .fill('#667eea');

      doc.fillColor('#fff')
         .text('Data', 55, tableTop + 5, { width: colWidths.data, align: 'left' })
         .text('Dizimista', 125, tableTop + 5, { width: colWidths.dizimista, align: 'left' })
         .text('Valor', 275, tableTop + 5, { width: colWidths.valor, align: 'right' })
         .text('Tipo', 355, tableTop + 5, { width: colWidths.tipo, align: 'center' })
         .text('Status', 435, tableTop + 5, { width: colWidths.status, align: 'center' });

      let yPos = tableTop + 25;

      // Linhas da tabela
      dados.dizimos.forEach((dizimo, index) => {
        // Verificar se precisa de nova página
        if (yPos > 700) {
          doc.addPage();
          yPos = 50;
        }

        const bgColor = index % 2 === 0 ? '#f8f9fa' : '#ffffff';
        
        doc.rect(50, yPos - 5, 500, 20)
           .fill(bgColor);

        const data = new Date(dizimo.data_pagamento);
        const dataFormatada = data.toLocaleDateString('pt-BR');

        doc.fontSize(9)
           .fillColor('#333')
           .text(dataFormatada, 55, yPos, { width: colWidths.data, align: 'left' })
           .text(dizimo.nome_usuario, 125, yPos, { width: colWidths.dizimista, align: 'left' })
           .fillColor('#28a745')
           .text(`R$ ${parseFloat(dizimo.valor).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 275, yPos, { width: colWidths.valor, align: 'right' })
           .fillColor('#333')
           .text(dizimo.tipo_pagamento, 355, yPos, { width: colWidths.tipo, align: 'center' });

        // Status com cor
        const statusColor = dizimo.status === 'confirmado' ? '#28a745' : '#ffc107';
        doc.fillColor(statusColor)
           .text(dizimo.status.toUpperCase(), 435, yPos, { width: colWidths.status, align: 'center' });

        yPos += 20;
      });

      // Rodapé
      doc.fontSize(8)
         .fillColor('#999')
         .text(
           `${configIgreja.rodape_recibo || 'Relatório gerado automaticamente'} - ${new Date().toLocaleString('pt-BR')}`,
           50,
           750,
           { align: 'center', width: 500 }
         );

      doc.end();

      stream.on('finish', () => {
        resolve({ fileName, filePath });
      });

      stream.on('error', reject);

    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Gera relatório de ofertas em PDF
 */
async function gerarRelatorioOfertas(dados, periodo, configIgreja = {}) {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `ofertas-${periodo.replace(/\//g, '-')}-${Date.now()}.pdf`;
      const filePath = path.join(reportsDir, fileName);
      
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);

      // Cabeçalho
      doc.fontSize(20)
         .fillColor('#764ba2')
         .text(configIgreja.nome_igreja || 'Igreja', { align: 'center' });
      
      doc.fontSize(16)
         .fillColor('#333')
         .text('Relatório de Ofertas', { align: 'center' });
      
      doc.fontSize(12)
         .fillColor('#666')
         .text(`Período: ${periodo}`, { align: 'center' });
      
      doc.moveDown(2);

      // Linha divisória
      doc.moveTo(50, doc.y)
         .lineTo(550, doc.y)
         .strokeColor('#764ba2')
         .lineWidth(2)
         .stroke();
      
      doc.moveDown();

      // Resumo por tipo
      doc.fontSize(14)
         .fillColor('#764ba2')
         .text('Resumo por Tipo', { underline: true });
      
      doc.moveDown(0.5);

      const tipos = {};
      dados.ofertas.forEach(oferta => {
        const tipo = oferta.tipo || 'outros';
        if (!tipos[tipo]) {
          tipos[tipo] = { quantidade: 0, total: 0 };
        }
        tipos[tipo].quantidade++;
        tipos[tipo].total += parseFloat(oferta.valor || 0);
      });

      doc.fontSize(11)
         .fillColor('#333');

      Object.entries(tipos).forEach(([tipo, dados]) => {
        doc.text(
          `${tipo.charAt(0).toUpperCase() + tipo.slice(1)}: ${dados.quantidade} ofertas - R$ ${dados.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
          { indent: 20 }
        );
      });

      const totalOfertas = dados.ofertas.reduce((sum, o) => sum + parseFloat(o.valor || 0), 0);
      
      doc.moveDown()
         .fontSize(12)
         .fillColor('#764ba2')
         .text(`TOTAL GERAL: R$ ${totalOfertas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, { indent: 20 });

      doc.moveDown(2);

      // Tabela de ofertas
      doc.fontSize(14)
         .fillColor('#764ba2')
         .text('Detalhamento das Ofertas', { underline: true });
      
      doc.moveDown(0.5);

      // Cabeçalho da tabela
      const tableTop = doc.y;
      const colWidths = {
        data: 70,
        tipo: 90,
        campanha: 130,
        valor: 80,
        ofertante: 100
      };

      doc.fontSize(10)
         .fillColor('#fff')
         .rect(50, tableTop, 500, 20)
         .fill('#764ba2');

      doc.fillColor('#fff')
         .text('Data', 55, tableTop + 5, { width: colWidths.data, align: 'left' })
         .text('Tipo', 125, tableTop + 5, { width: colWidths.tipo, align: 'left' })
         .text('Campanha/Descrição', 215, tableTop + 5, { width: colWidths.campanha, align: 'left' })
         .text('Valor', 345, tableTop + 5, { width: colWidths.valor, align: 'right' })
         .text('Ofertante', 425, tableTop + 5, { width: colWidths.ofertante, align: 'left' });

      let yPos = tableTop + 25;

      // Linhas da tabela
      dados.ofertas.forEach((oferta, index) => {
        // Verificar se precisa de nova página
        if (yPos > 700) {
          doc.addPage();
          yPos = 50;
        }

        const bgColor = index % 2 === 0 ? '#f8f9fa' : '#ffffff';
        
        doc.rect(50, yPos - 5, 500, 20)
           .fill(bgColor);

        const data = new Date(oferta.data);
        const dataFormatada = data.toLocaleDateString('pt-BR');

        doc.fontSize(9)
           .fillColor('#333')
           .text(dataFormatada, 55, yPos, { width: colWidths.data, align: 'left' })
           .text(oferta.tipo || 'outros', 125, yPos, { width: colWidths.tipo, align: 'left' })
           .text(oferta.campanha_nome || oferta.descricao || '-', 215, yPos, { width: colWidths.campanha, align: 'left' })
           .fillColor('#28a745')
           .text(`R$ ${parseFloat(oferta.valor).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 345, yPos, { width: colWidths.valor, align: 'right' })
           .fillColor('#333')
           .text(oferta.nome_usuario || 'Anônimo', 425, yPos, { width: colWidths.ofertante, align: 'left' });

        yPos += 20;
      });

      // Rodapé
      doc.fontSize(8)
         .fillColor('#999')
         .text(
           `${configIgreja.rodape_recibo || 'Relatório gerado automaticamente'} - ${new Date().toLocaleString('pt-BR')}`,
           50,
           750,
           { align: 'center', width: 500 }
         );

      doc.end();

      stream.on('finish', () => {
        resolve({ fileName, filePath });
      });

      stream.on('error', reject);

    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Gera relatório financeiro consolidado em PDF
 */
async function gerarRelatorioFinanceiro(dados, periodo, configIgreja = {}) {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `financeiro-${periodo.replace(/\//g, '-')}-${Date.now()}.pdf`;
      const filePath = path.join(reportsDir, fileName);
      
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);

      // Cabeçalho
      doc.fontSize(20)
         .fillColor('#4facfe')
         .text(configIgreja.nome_igreja || 'Igreja', { align: 'center' });
      
      doc.fontSize(16)
         .fillColor('#333')
         .text('Relatório Financeiro Consolidado', { align: 'center' });
      
      doc.fontSize(12)
         .fillColor('#666')
         .text(`Período: ${periodo}`, { align: 'center' });
      
      doc.moveDown(2);

      // Linha divisória
      doc.moveTo(50, doc.y)
         .lineTo(550, doc.y)
         .strokeColor('#4facfe')
         .lineWidth(2)
         .stroke();
      
      doc.moveDown();

      // Resumo Geral
      doc.fontSize(14)
         .fillColor('#4facfe')
         .text('Resumo Geral', { underline: true });
      
      doc.moveDown(0.5);

      const totalDizimos = dados.dizimos.reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);
      const totalOfertas = dados.ofertas.reduce((sum, o) => sum + parseFloat(o.valor || 0), 0);
      const totalGeral = totalDizimos + totalOfertas;

      // Boxes de resumo
      const boxY = doc.y;
      
      // Box Dízimos
      doc.rect(50, boxY, 150, 80)
         .fillAndStroke('#667eea', '#667eea');
      
      doc.fontSize(10)
         .fillColor('#fff')
         .text('DÍZIMOS', 60, boxY + 10, { width: 130 });
      
      doc.fontSize(18)
         .text(`R$ ${totalDizimos.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 60, boxY + 30, { width: 130 });
      
      doc.fontSize(9)
         .text(`${dados.dizimos.length} registros`, 60, boxY + 60, { width: 130 });

      // Box Ofertas
      doc.rect(220, boxY, 150, 80)
         .fillAndStroke('#764ba2', '#764ba2');
      
      doc.fontSize(10)
         .fillColor('#fff')
         .text('OFERTAS', 230, boxY + 10, { width: 130 });
      
      doc.fontSize(18)
         .text(`R$ ${totalOfertas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 230, boxY + 30, { width: 130 });
      
      doc.fontSize(9)
         .text(`${dados.ofertas.length} registros`, 230, boxY + 60, { width: 130 });

      // Box Total
      doc.rect(390, boxY, 150, 80)
         .fillAndStroke('#4facfe', '#4facfe');
      
      doc.fontSize(10)
         .fillColor('#fff')
         .text('TOTAL', 400, boxY + 10, { width: 130 });
      
      doc.fontSize(18)
         .text(`R$ ${totalGeral.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 400, boxY + 30, { width: 130 });
      
      doc.fontSize(9)
         .text(`${dados.dizimos.length + dados.ofertas.length} registros`, 400, boxY + 60, { width: 130 });

      doc.moveDown(6);

      // Distribuição de Ofertas por Tipo
      if (dados.ofertas.length > 0) {
        doc.fontSize(14)
           .fillColor('#4facfe')
           .text('Distribuição de Ofertas por Tipo', { underline: true });
        
        doc.moveDown(0.5);

        const tipos = {};
        dados.ofertas.forEach(oferta => {
          const tipo = oferta.tipo || 'outros';
          if (!tipos[tipo]) {
            tipos[tipo] = 0;
          }
          tipos[tipo] += parseFloat(oferta.valor || 0);
        });

        doc.fontSize(11)
           .fillColor('#333');

        Object.entries(tipos).forEach(([tipo, total]) => {
          const percentual = totalOfertas > 0 ? ((total / totalOfertas) * 100).toFixed(1) : 0;
          doc.text(
            `${tipo.charAt(0).toUpperCase() + tipo.slice(1)}: R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})} (${percentual}%)`,
            { indent: 20 }
          );
        });

        doc.moveDown();
      }

      // Status dos Dízimos
      doc.fontSize(14)
         .fillColor('#4facfe')
         .text('Status dos Dízimos', { underline: true });
      
      doc.moveDown(0.5);

      const confirmados = dados.dizimos.filter(d => d.status === 'confirmado');
      const pendentes = dados.dizimos.filter(d => d.status === 'pendente');
      const totalConfirmados = confirmados.reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);
      const totalPendentes = pendentes.reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);

      doc.fontSize(11)
         .fillColor('#333')
         .text(`Confirmados: ${confirmados.length} (R$ ${totalConfirmados.toLocaleString('pt-BR', {minimumFractionDigits: 2})})`, { indent: 20 })
         .text(`Pendentes: ${pendentes.length} (R$ ${totalPendentes.toLocaleString('pt-BR', {minimumFractionDigits: 2})})`, { indent: 20 });

      // Rodapé
      doc.fontSize(8)
         .fillColor('#999')
         .text(
           `${configIgreja.rodape_recibo || 'Relatório gerado automaticamente'} - ${new Date().toLocaleString('pt-BR')}`,
           50,
           750,
           { align: 'center', width: 500 }
         );

      doc.end();

      stream.on('finish', () => {
        resolve({ fileName, filePath });
      });

      stream.on('error', reject);

    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  gerarRelatorioDizimos,
  gerarRelatorioOfertas,
  gerarRelatorioFinanceiro,
  reportsDir
};
