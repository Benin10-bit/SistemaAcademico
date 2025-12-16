"use client";
import { useState, useEffect } from "react";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Calendar,
  Download,
  Filter,
  ChevronDown
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Area,
  AreaChart
} from "recharts";

// Declaração global para jsPDF
declare global {
  interface Window {
    jspdf: any;
  }
}

interface Materia {
  nome: string;
  nota1: number;
  nota2: number;
  nota3: number;
  nota4: number;
}

interface MediaData {
  materia: string;
  media: number;
}

interface EvolucaoData {
  bimestre: string;
  media: number;
}

interface DistribuicaoData {
  name: string;
  value: number;
  color: string;
}

interface RadarData {
  materia: string;
  desempenho: number;
  fullMark: number;
}

export default function Relatorios() {
  const [periodo, setPeriodo] = useState("2025");

  // Carregar biblioteca jsPDF
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Dados das matérias
  const materiasData: Materia[] = [
    { nome: "Matemática", nota1: 13, nota2: 100, nota3: 82, nota4: 1 },
    { nome: "Geografia", nota1: 84, nota2: 82, nota3: 75, nota4: 90 },
    { nome: "História", nota1: 68, nota2: 100, nota3: 82, nota4: 100 },
    { nome: "Sociologia", nota1: 100, nota2: 100, nota3: 86, nota4: 94 },
    { nome: "Português", nota1: 56, nota2: 82, nota3: 82, nota4: 92 },
    { nome: "Programação", nota1: 76, nota2: 100, nota3: 100, nota4: 100 },
    { nome: "Física", nota1: 1, nota2: 50, nota3: 89, nota4: 100 },
  ];

  // Calcula médias
  const calcularMedia = (materia: Materia): number => {
    const notas = [materia.nota1, materia.nota2, materia.nota3, materia.nota4];
    return notas.length > 0 ? notas.reduce((a, b) => a + b, 0) / notas.length : 0;
  };

  // Função para exportar relatório em PDF
  const exportarRelatorio = () => {
    const mediaGeral = materiasData.reduce((acc, m) => acc + calcularMedia(m), 0) / materiasData.length;
    const melhorNota = Math.max(...materiasData.map(m => calcularMedia(m)));
    const piorNota = Math.min(...materiasData.map(m => calcularMedia(m)));
    const melhorMateria = materiasData.find(m => calcularMedia(m) === melhorNota);
    const piorMateria = materiasData.find(m => calcularMedia(m) === piorNota);
    
    // Criar um novo canvas/documento
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configurações
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;
    
    // Cabeçalho com fundo colorido
    doc.setFillColor(59, 130, 246); // #3B82F6
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('RELATÓRIO ACADÊMICO', pageWidth / 2, 15, { align: 'center' });
    
    yPos = 45;
    
    // Restaurar cor do texto
    doc.setTextColor(0, 0, 0);
    
    // Seção: Estatísticas Gerais
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('Estatísticas Gerais', 14, yPos);
    yPos += 3;
    
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 10;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    // Cards de estatísticas
    const cardWidth = (pageWidth - 42) / 2;
    const cardHeight = 25;
    
    // Card 1: Média Geral
    doc.setFillColor(240, 242, 246);
    doc.roundedRect(14, yPos, cardWidth, cardHeight, 3, 3, 'F');
    doc.setFont(undefined, 'bold');
    doc.setFontSize(10);
    doc.text('Média Geral', 19, yPos + 7);
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text(mediaGeral.toFixed(1), 19, yPos + 18);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('de 100 pontos', 19, yPos + 22);
    
    // Card 2: Melhor Nota
    doc.setFillColor(240, 242, 246);
    doc.roundedRect(14 + cardWidth + 7, yPos, cardWidth, cardHeight, 3, 3, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(10);
    doc.text('Melhor Desempenho', 19 + cardWidth + 7, yPos + 7);
    doc.setFontSize(20);
    doc.setTextColor(22, 163, 74);
    doc.text(melhorNota.toFixed(1), 19 + cardWidth + 7, yPos + 18);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(melhorMateria?.nome || '-', 19 + cardWidth + 7, yPos + 22);
    
    yPos += cardHeight + 7;
    
    // Card 3: Pior Nota
    doc.setFillColor(240, 242, 246);
    doc.roundedRect(14, yPos, cardWidth, cardHeight, 3, 3, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(10);
    doc.text('Requer Atenção', 19, yPos + 7);
    doc.setFontSize(20);
    doc.setTextColor(220, 38, 38);
    doc.text(piorNota.toFixed(1), 19, yPos + 18);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(piorMateria?.nome || '-', 19, yPos + 22);
    
    // Card 4: Tendência
    const tendencia = evolucaoData[3].media > evolucaoData[0].media;
    doc.setFillColor(240, 242, 246);
    doc.roundedRect(14 + cardWidth + 7, yPos, cardWidth, cardHeight, 3, 3, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(10);
    doc.text('Tendência', 19 + cardWidth + 7, yPos + 7);
    doc.setFontSize(20);
    doc.setTextColor(tendencia ? 22 : 220, tendencia ? 163 : 38, tendencia ? 74 : 38);
    doc.text(`${tendencia ? '↑' : '↓'} ${Math.abs(evolucaoData[3].media - evolucaoData[0].media).toFixed(1)}`, 19 + cardWidth + 7, yPos + 18);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('vs. 1º bimestre', 19 + cardWidth + 7, yPos + 22);
    
    yPos += cardHeight + 15;
    
    // Seção: Desempenho por Disciplina
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('Desempenho por Disciplina', 14, yPos);
    yPos += 3;
    
    doc.setDrawColor(59, 130, 246);
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 10;
    
    // Cabeçalho da tabela
    doc.setFillColor(59, 130, 246);
    doc.rect(14, yPos - 5, pageWidth - 28, 8, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('Disciplina', 16, yPos);
    doc.text('1º Bim', 80, yPos, { align: 'center' });
    doc.text('2º Bim', 105, yPos, { align: 'center' });
    doc.text('3º Bim', 130, yPos, { align: 'center' });
    doc.text('4º Bim', 155, yPos, { align: 'center' });
    doc.text('Média', 180, yPos, { align: 'center' });
    
    yPos += 8;
    
    // Linhas da tabela
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    
    materiasData.forEach((materia, index) => {
      // Verificar se precisa de nova página
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 20;
      }
      
      // Fundo alternado
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(14, yPos - 5, pageWidth - 28, 8, 'F');
      }
      
      const media = calcularMedia(materia);
      
      doc.setTextColor(0, 0, 0);
      doc.text(materia.nome, 16, yPos);
      doc.text(materia.nota1.toString(), 80, yPos, { align: 'center' });
      doc.text(materia.nota2.toString(), 105, yPos, { align: 'center' });
      doc.text(materia.nota3.toString(), 130, yPos, { align: 'center' });
      doc.text(materia.nota4.toString(), 155, yPos, { align: 'center' });
      
      // Média com cor
      if (media >= 90) doc.setTextColor(22, 163, 74);
      else if (media >= 70) doc.setTextColor(96, 165, 250);
      else if (media >= 60) doc.setTextColor(250, 204, 21);
      else doc.setTextColor(220, 38, 38);
      
      doc.setFont(undefined, 'bold');
      doc.text(media.toFixed(1), 180, yPos, { align: 'center' });
      doc.setFont(undefined, 'normal');
      
      yPos += 8;
    });
    
    yPos += 10;
    
    // Rodapé
    const dataGeracao = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Relatório gerado em: ${dataGeracao}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
    doc.text('AcademicPro - Sistema de Gestão Acadêmica', pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Salvar PDF
    doc.save(`relatorio-academico.pdf`);
  };

  // Dados para gráfico de barras (médias por matéria)
  const mediasData: MediaData[] = materiasData.map(m => ({
    materia: m.nome.length > 10 ? m.nome.substring(0, 10) + '...' : m.nome,
    media: parseFloat(calcularMedia(m).toFixed(1))
  })).sort((a, b) => b.media - a.media);

  // Dados para gráfico de linha (evolução ao longo dos bimestres)
  const evolucaoData: EvolucaoData[] = [
    {
      bimestre: "1º Bim",
      media: materiasData.reduce((acc, m) => acc + m.nota1, 0) / materiasData.length
    },
    {
      bimestre: "2º Bim",
      media: materiasData.reduce((acc, m) => acc + m.nota2, 0) / materiasData.length
    },
    {
      bimestre: "3º Bim",
      media: materiasData.reduce((acc, m) => acc + m.nota3, 0) / materiasData.length
    },
    {
      bimestre: "4º Bim",
      media: materiasData.reduce((acc, m) => acc + m.nota4, 0) / materiasData.length
    }
  ];

  // Dados para gráfico de pizza (distribuição de desempenho)
  const distribuicaoData: DistribuicaoData[] = [
    { 
      name: "Excelente (90-100)", 
      value: materiasData.filter(m => calcularMedia(m) >= 90).length,
      color: "#16A34A"
    },
    { 
      name: "Bom (70-89)", 
      value: materiasData.filter(m => calcularMedia(m) >= 70 && calcularMedia(m) < 90).length,
      color: "#60A5FA"
    },
    { 
      name: "Regular (60-69)", 
      value: materiasData.filter(m => calcularMedia(m) >= 60 && calcularMedia(m) < 70).length,
      color: "#FACC15"
    },
    { 
      name: "Insuficiente (<60)", 
      value: materiasData.filter(m => calcularMedia(m) < 60).length,
      color: "#DC2626"
    }
  ].filter(item => item.value > 0);

  // Dados para gráfico radar (desempenho por matéria)
  const radarData: RadarData[] = materiasData.slice(0, 6).map(m => ({
    materia: m.nome.substring(0, 8),
    desempenho: parseFloat(calcularMedia(m).toFixed(1)),
    fullMark: 100
  }));

  // Dados para área (comparação de todas as matérias por bimestre)
  const comparacaoData = [
    { bimestre: "1º", ...Object.fromEntries(materiasData.map(m => [m.nome, m.nota1])) },
    { bimestre: "2º", ...Object.fromEntries(materiasData.map(m => [m.nome, m.nota2])) },
    { bimestre: "3º", ...Object.fromEntries(materiasData.map(m => [m.nome, m.nota3])) },
    { bimestre: "4º", ...Object.fromEntries(materiasData.map(m => [m.nome, m.nota4])) }
  ];

  // Estatísticas gerais
  const mediaGeral = materiasData.reduce((acc, m) => acc + calcularMedia(m), 0) / materiasData.length;
  const melhorNota = Math.max(...materiasData.map(m => calcularMedia(m)));
  const piorNota = Math.min(...materiasData.map(m => calcularMedia(m)));
  const tendencia = evolucaoData[3].media > evolucaoData[0].media ? "alta" : "baixa";

  const cores = ["#3B82F6", "#60A5FA", "#22D3EE", "#A78BFA", "#F472B6", "#FB7185", "#A3E635"];

  return (
    <div className="min-h-screen bg-[#0B1526] text-[#F3F4F6] p-4 md:p-8">
      {/* Background decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#3B82F6] rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#60A5FA] rounded-full opacity-5 blur-3xl"></div>
      </div>

      {/* Container principal */}
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] rounded-xl flex items-center justify-center shadow-lg shadow-[#3B82F6]/20">
                <BarChart3 className="w-6 h-6 text-[#F3F4F6]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F3F4F6] to-[#CBD5E1] bg-clip-text text-transparent">
                  Relatórios
                </h1>
                <p className="text-[#94A3B8]">Análise detalhada do desempenho acadêmico</p>
              </div>
            </div>

            <div className="flex items-center gap-3">

              {/* Botão Exportar */}
              <button 
                onClick={exportarRelatorio}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-[#F3F4F6] font-semibold rounded-lg hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all"
              >
                <Download className="w-5 h-5" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Média Geral */}
          <div className="bg-[#0F1B31] border border-[#243049] rounded-xl p-6 relative overflow-hidden group hover:border-[#3B82F6]/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#94A3B8] text-sm font-medium">Média Geral</p>
                <Target className="w-5 h-5 text-[#60A5FA]" />
              </div>
              <p className="text-3xl font-bold text-[#F3F4F6] mb-1">
                {mediaGeral.toFixed(1)}
              </p>
              <p className="text-xs text-[#64748B]">de 100 pontos</p>
            </div>
          </div>

          {/* Melhor Desempenho */}
          <div className="bg-[#0F1B31] border border-[#243049] rounded-xl p-6 relative overflow-hidden group hover:border-[#16A34A]/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#16A34A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#94A3B8] text-sm font-medium">Melhor Nota</p>
                <Award className="w-5 h-5 text-[#16A34A]" />
              </div>
              <p className="text-3xl font-bold text-[#16A34A] mb-1">
                {melhorNota.toFixed(1)}
              </p>
              <p className="text-xs text-[#64748B]">
                {materiasData.find(m => calcularMedia(m) === melhorNota)?.nome}
              </p>
            </div>
          </div>

          {/* Pior Desempenho */}
          <div className="bg-[#0F1B31] border border-[#243049] rounded-xl p-6 relative overflow-hidden group hover:border-[#DC2626]/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#DC2626]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#94A3B8] text-sm font-medium">Menor Nota</p>
                <TrendingDown className="w-5 h-5 text-[#DC2626]" />
              </div>
              <p className="text-3xl font-bold text-[#DC2626] mb-1">
                {piorNota.toFixed(1)}
              </p>
              <p className="text-xs text-[#64748B]">
                {materiasData.find(m => calcularMedia(m) === piorNota)?.nome}
              </p>
            </div>
          </div>

          {/* Tendência */}
          <div className="bg-[#0F1B31] border border-[#243049] rounded-xl p-6 relative overflow-hidden group hover:border-[#60A5FA]/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#60A5FA]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#94A3B8] text-sm font-medium">Tendência</p>
                {tendencia === "alta" ? (
                  <TrendingUp className="w-5 h-5 text-[#16A34A]" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-[#DC2626]" />
                )}
              </div>
              <p className={`text-3xl font-bold mb-1 ${tendencia === "alta" ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                {tendencia === "alta" ? "↑" : "↓"} {Math.abs(evolucaoData[3].media - evolucaoData[0].media).toFixed(1)}
              </p>
              <p className="text-xs text-[#64748B]">vs. 1º bimestre</p>
            </div>
          </div>
        </div>

        {/* Grid de Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Barras - Médias por Matéria */}
          <div className="bg-[#0F1B31] border border-[#243049] rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#F3F4F6] mb-1">Médias por Disciplina</h2>
              <p className="text-sm text-[#94A3B8]">Ranking de desempenho geral</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mediasData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243049" />
                <XAxis dataKey="materia" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#132040",
                    border: "1px solid #243049",
                    borderRadius: "8px",
                    color: "#F3F4F6"
                  }}
                  labelStyle={{ color: "#F3F4F6" }}
                />
                <Bar dataKey="media" fill="#3B82F6" radius={[8, 8, 0, 0]}>
                  {mediasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Linha - Evolução */}
          <div className="bg-[#0F1B31] border border-[#243049] rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#F3F4F6] mb-1">Evolução da Média</h2>
              <p className="text-sm text-[#94A3B8]">Progressão ao longo dos bimestres</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolucaoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243049" />
                <XAxis dataKey="bimestre" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#132040",
                    border: "1px solid #243049",
                    borderRadius: "8px",
                    color: "#F3F4F6"
                  }}
                  labelStyle={{ color: "#F3F4F6" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="media" 
                  stroke="#60A5FA" 
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Pizza - Distribuição */}
          <div className="bg-[#0F1B31] border border-[#243049] rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#F3F4F6] mb-1">Distribuição de Desempenho</h2>
              <p className="text-sm text-[#94A3B8]">Classificação por faixa de nota</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribuicaoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name.split(' ')[0]} ${(entry.percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distribuicaoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#132040",
                    border: "1px solid #243049",
                    borderRadius: "8px",
                    color: "#F3F4F6"
                  }}
                  labelStyle={{ color: "#F3F4F6" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico Radar - Desempenho */}
          <div className="bg-[#0F1B31] border border-[#243049] rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#F3F4F6] mb-1">Análise Multidimensional</h2>
              <p className="text-sm text-[#94A3B8]">Visão geral do desempenho</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#243049" />
                <PolarAngleAxis dataKey="materia" stroke="#94A3B8" fontSize={12} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94A3B8" fontSize={10} />
                <Radar
                  name="Desempenho"
                  dataKey="desempenho"
                  stroke="#60A5FA"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#132040",
                    border: "1px solid #243049",
                    borderRadius: "8px",
                    color: "#F3F4F6"
                  }}
                  labelStyle={{ color: "#F3F4F6" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Área - Comparação Detalhada */}
          <div className="bg-[#0F1B31] border border-[#243049] rounded-xl p-6 lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#F3F4F6] mb-1">Comparação por Bimestre</h2>
              <p className="text-sm text-[#94A3B8]">Evolução individual de cada disciplina</p>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={comparacaoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243049" />
                <XAxis dataKey="bimestre" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#132040",
                    border: "1px solid #243049",
                    borderRadius: "8px",
                    color: "#F3F4F6"
                  }}
                  labelStyle={{ color: "#F3F4F6" }}
                />
                <Legend wrapperStyle={{ color: "#94A3B8" }} />
                {materiasData.map((materia, index) => (
                  <Area
                    key={materia.nome}
                    type="monotone"
                    dataKey={materia.nome}
                    stackId="1"
                    stroke={cores[index % cores.length]}
                    fill={cores[index % cores.length]}
                    fillOpacity={0.6}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0F1B31] border border-[#243049] rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#16A34A]/10 border border-[#16A34A]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-[#16A34A]" />
              </div>
              <div>
                <h3 className="font-bold text-[#F3F4F6] mb-1">Destaque Positivo</h3>
                <p className="text-sm text-[#94A3B8]">
                  {mediasData.filter(m => m.media >= 90).length} disciplinas com desempenho excelente (≥90)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0F1B31] border border-[#243049] rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#FACC15]/10 border border-[#FACC15]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Filter className="w-5 h-5 text-[#FACC15]" />
              </div>
              <div>
                <h3 className="font-bold text-[#F3F4F6] mb-1">Atenção Necessária</h3>
                <p className="text-sm text-[#94A3B8]">
                  {mediasData.filter(m => m.media < 70).length} disciplinas precisam de mais dedicação
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0F1B31] border border-[#243049] rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#60A5FA]/10 border border-[#60A5FA]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-[#60A5FA]" />
              </div>
              <div>
                <h3 className="font-bold text-[#F3F4F6] mb-1">Progressão</h3>
                <p className="text-sm text-[#94A3B8]">
                  Média {tendencia === "alta" ? "aumentou" : "diminuiu"} {Math.abs(evolucaoData[3].media - evolucaoData[0].media).toFixed(1)} pontos desde o 1º bimestre
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}