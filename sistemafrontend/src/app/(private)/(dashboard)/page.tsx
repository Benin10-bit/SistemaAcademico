"use client";
import { useState } from "react";
import {
  BookOpen,
  TrendingUp,
  Award,
  Target,
  ChevronDown,
  Search,
  Filter,
  Edit,
  Plus,
  X,
  Save,
  Trash2,
} from "lucide-react";

export default function Dashboard() {
  type Materia = {
    id: number;
    nome: string;
    nota1: number | null;
    nota2: number | null;
    nota3: number | null;
    nota4: number | null;
    userId?: string;
  };

  const materias: Materia[] = [
    {
      id: 1,
      nome: "Matemática",
      nota1: 100,
      nota2: 100,
      nota3: 82,
      nota4: null,
    },
    { id: 2, nome: "Geografia", nota1: 84, nota2: 82, nota3: 75, nota4: 90 },
    { id: 3, nome: "História", nota1: 100, nota2: 100, nota3: 82, nota4: null },
    { id: 4, nome: "Sociologia", nota1: 100, nota2: 100, nota3: 86, nota4: 94 },
    { id: 5, nome: "Português", nota1: 88, nota2: 82, nota3: 82, nota4: 92 },
    {
      id: 6,
      nome: "Programação",
      nota1: 100,
      nota2: 100,
      nota3: 100,
      nota4: 100,
    },
    { id: 7, nome: "Física", nota1: 0, nota2: 50, nota3: null, nota4: null },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"nome" | "media">("nome");
  const [materiasState, setMateriasState] = useState<Materia[]>(materias);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMateria, setCurrentMateria] = useState<Materia>({
    id: 0,
    nome: "",
    nota1: null,
    nota2: null,
    nota3: null,
    nota4: null,
  });

  // Calcula a média de cada matéria (inclui 0, mas ignora null)
  const calcularMedia = (materia: Materia) => {
    const notas = [materia.nota1, materia.nota2, materia.nota3, materia.nota4];
    const notasValidas = notas.filter((n) => n !== null) as number[];
    return notasValidas.length > 0
      ? notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length
      : 0;
  };

  // Calcula a média geral
  const mediaGeral =
    materiasState.reduce((acc, mat) => acc + calcularMedia(mat), 0) /
    materiasState.length;

  // Filtra e ordena matérias
  const materiasFiltradas = materiasState
    .filter((m) => m.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "nome") return a.nome.localeCompare(b.nome);
      return calcularMedia(b) - calcularMedia(a);
    });

  // Funções do Modal
  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentMateria({
      id: Math.max(...materiasState.map((m) => m.id), 0) + 1,
      nome: "",
      nota1: null,
      nota2: null,
      nota3: null,
      nota4: null,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (materia: Materia) => {
    setIsEditMode(true);
    setCurrentMateria({ ...materia });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMateria({
      id: 0,
      nome: "",
      nota1: null,
      nota2: null,
      nota3: null,
      nota4: null,
    });
  };

  const handleSave = () => {
    if (!currentMateria.nome.trim()) {
      alert("Por favor, insira o nome da disciplina");
      return;
    }

    if (isEditMode) {
      setMateriasState(
        materiasState.map((m) =>
          m.id === currentMateria.id ? currentMateria : m
        )
      );
    } else {
      setMateriasState([...materiasState, currentMateria]);
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta disciplina?")) {
      setMateriasState(materiasState.filter((m) => m.id !== id));
    }
  };

  const handleInputChange = (field: keyof Materia, value: string) => {
    if (field === "nome") {
      setCurrentMateria({ ...currentMateria, [field]: value });
    } else {
      const numValue = value === "" ? null : parseFloat(value);
      setCurrentMateria({ ...currentMateria, [field]: numValue });
    }
  };

  // Status da nota (cor) - agora aceita null
  const getNotaStatus = (nota: number | null) => {
    if (nota === null) return "text-[#64748B]";
    if (nota === 0) return "text-[#DC2626]";
    if (nota >= 90) return "text-[#16A34A]";
    if (nota >= 70) return "text-[#60A5FA]";
    if (nota >= 60) return "text-[#FACC15]";
    return "text-[#DC2626]";
  };

  const getMediaStatus = (media: number) => {
    if (media >= 90)
      return {
        color: "text-[#16A34A]",
        bg: "bg-[#16A34A]/10",
        border: "border-[#16A34A]/30",
        label: "Excelente",
      };
    if (media >= 70)
      return {
        color: "text-[#60A5FA]",
        bg: "bg-[#60A5FA]/10",
        border: "border-[#60A5FA]/30",
        label: "Bom",
      };
    if (media >= 60)
      return {
        color: "text-[#FACC15]",
        bg: "bg-[#FACC15]/10",
        border: "border-[#FACC15]/30",
        label: "Regular",
      };
    return {
      color: "text-[#DC2626]",
      bg: "bg-[#DC2626]/10",
      border: "border-[#DC2626]/30",
      label: "Insuficiente",
    };
  };

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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] rounded-xl flex items-center justify-center shadow-lg shadow-[#3B82F6]/20">
              <BookOpen className="w-6 h-6 text-[#F3F4F6]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F3F4F6] to-[#CBD5E1] bg-clip-text text-transparent">
                Dashboard Acadêmico
              </h1>
              <p className="text-[#94A3B8]">Acompanhe seu desempenho</p>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Média Geral */}
          <div className="bg-[#0F1B31] border border-[#243049] rounded-xl p-6 relative overflow-hidden group hover:border-[#3B82F6]/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#94A3B8] text-sm font-medium">
                  Média Geral
                </p>
                <TrendingUp className="w-5 h-5 text-[#60A5FA]" />
              </div>
              <p className="text-4xl font-bold text-[#F3F4F6] mb-1">
                {mediaGeral.toFixed(1)}
              </p>
              <div
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                  getMediaStatus(mediaGeral).bg
                } ${getMediaStatus(mediaGeral).color} border ${
                  getMediaStatus(mediaGeral).border
                }`}
              >
                {getMediaStatus(mediaGeral).label}
              </div>
            </div>
          </div>

          {/* Total de Disciplinas */}
          <div className="bg-[#0F1B31] border border-[#243049] rounded-xl p-6 relative overflow-hidden group hover:border-[#3B82F6]/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#60A5FA]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#94A3B8] text-sm font-medium">
                  Disciplinas
                </p>
                <BookOpen className="w-5 h-5 text-[#60A5FA]" />
              </div>
              <p className="text-4xl font-bold text-[#F3F4F6] mb-1">
                {materiasState.length}
              </p>
              <p className="text-xs text-[#64748B]">Matrículas ativas</p>
            </div>
          </div>

          {/* Melhor Desempenho */}
          <div className="bg-[#0F1B31] border border-[#243049] rounded-xl p-6 relative overflow-hidden group hover:border-[#3B82F6]/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#16A34A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#94A3B8] text-sm font-medium">
                  Melhor Nota
                </p>
                <Award className="w-5 h-5 text-[#16A34A]" />
              </div>
              <p className="text-4xl font-bold text-[#F3F4F6] mb-1">
                {materiasState.length > 0
                  ? Math.max(
                      ...materiasState.map((m) => calcularMedia(m))
                    ).toFixed(1)
                  : "0.0"}
              </p>
              <p className="text-xs text-[#64748B]">
                {materiasState.find(
                  (m) =>
                    calcularMedia(m) ===
                    Math.max(...materiasState.map((m) => calcularMedia(m)))
                )?.nome || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-[#0F1B31] border border-[#243049] rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Buscar disciplina..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#132040] border border-[#243049] rounded-lg text-[#F3F4F6] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
              />
            </div>

            {/* Ordenar */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "nome" | "media")}
                className="pl-10 pr-10 py-2.5 bg-[#132040] border border-[#243049] rounded-lg text-[#F3F4F6] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all appearance-none cursor-pointer"
              >
                <option value="nome">Ordenar por Nome</option>
                <option value="media">Ordenar por Média</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] pointer-events-none" />
            </div>

            {/* Botão Criar */}
            <button
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-[#F3F4F6] font-semibold rounded-lg hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all"
            >
              <Plus className="w-5 h-5" />
              Nova Disciplina
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-[#0F1B31] border border-[#243049] rounded-xl overflow-hidden">
          {/* Header da tabela */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#132040] border-b border-[#243049]">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">
                    Disciplina
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">
                    1º Bim
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">
                    2º Bim
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">
                    3º Bim
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">
                    4º Bim
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">
                    Média
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#243049]">
                {materiasFiltradas.map((materia) => {
                  const media = calcularMedia(materia);
                  const status = getMediaStatus(media);

                  return (
                    <tr
                      key={materia.id}
                      className="hover:bg-[#132040] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] rounded-lg flex items-center justify-center text-sm font-bold text-[#F3F4F6] shadow-lg shadow-[#3B82F6]/20">
                            {materia.nome.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[#F3F4F6]">
                              {materia.nome}
                            </p>
                            <p className="text-xs text-[#64748B]">
                              Código: {materia.id.toString().padStart(3, "0")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 text-center font-semibold ${getNotaStatus(
                          materia.nota1
                        )}`}
                      >
                        {materia.nota1 === null ? "-" : materia.nota1}
                      </td>
                      <td
                        className={`px-6 py-4 text-center font-semibold ${getNotaStatus(
                          materia.nota2
                        )}`}
                      >
                        {materia.nota2 === null ? "-" : materia.nota2}
                      </td>
                      <td
                        className={`px-6 py-4 text-center font-semibold ${getNotaStatus(
                          materia.nota3
                        )}`}
                      >
                        {materia.nota3 === null ? "-" : materia.nota3}
                      </td>
                      <td
                        className={`px-6 py-4 text-center font-semibold ${getNotaStatus(
                          materia.nota4
                        )}`}
                      >
                        {materia.nota4 === null ? "-" : materia.nota4}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-16 h-8 rounded-lg font-bold ${status.bg} ${status.color} border ${status.border}`}
                        >
                          {media.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg} ${status.color} border ${status.border}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${status.color.replace(
                              "text-",
                              "bg-"
                            )}`}
                          ></div>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(materia)}
                            className="p-2 bg-[#132040] border border-[#243049] rounded-lg text-[#60A5FA] hover:bg-[#243049] hover:border-[#3B82F6] transition-all group"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(materia.id)}
                            className="p-2 bg-[#132040] border border-[#243049] rounded-lg text-[#DC2626] hover:bg-[#DC2626]/10 hover:border-[#DC2626] transition-all"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer da tabela */}
          <div className="bg-[#132040] border-t border-[#243049] px-6 py-4">
            <div className="flex items-center justify-between text-sm">
              <p className="text-[#94A3B8]">
                Mostrando{" "}
                <span className="font-semibold text-[#CBD5E1]">
                  {materiasFiltradas.length}
                </span>{" "}
                de{" "}
                <span className="font-semibold text-[#CBD5E1]">
                  {materiasState.length}
                </span>{" "}
                disciplinas
              </p>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#60A5FA]" />
                <p className="text-[#94A3B8]">
                  Média do semestre:{" "}
                  <span
                    className={`font-bold ${getMediaStatus(mediaGeral).color}`}
                  >
                    {mediaGeral.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Criação/Edição */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0F1B31] border border-[#243049] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header do Modal */}
              <div className="sticky top-0 bg-[#132040] border-b border-[#243049] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] rounded-lg flex items-center justify-center">
                    {isEditMode ? (
                      <Edit className="w-5 h-5 text-[#F3F4F6]" />
                    ) : (
                      <Plus className="w-5 h-5 text-[#F3F4F6]" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#F3F4F6]">
                      {isEditMode ? "Editar Disciplina" : "Nova Disciplina"}
                    </h2>
                    <p className="text-sm text-[#94A3B8]">
                      {isEditMode
                        ? "Atualize as informações da disciplina"
                        : "Preencha os dados da nova disciplina"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-[#243049] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#94A3B8]" />
                </button>
              </div>

              {/* Body do Modal */}
              <div className="p-6 space-y-6">
                {/* Nome da Disciplina */}
                <div>
                  <label className="block text-sm font-semibold text-[#CBD5E1] mb-2">
                    Nome da Disciplina *
                  </label>
                  <input
                    type="text"
                    value={currentMateria.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Ex: Matemática"
                    className="w-full px-4 py-3 bg-[#132040] border border-[#243049] rounded-lg text-[#F3F4F6] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
                  />
                </div>

                {/* Grid de Notas */}
                <div>
                  <label className="block text-sm font-semibold text-[#CBD5E1] mb-3">
                    Notas dos Bimestres
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((bim) => {
                      const notaKey = `nota${bim}` as keyof Materia;
                      const notaValue = currentMateria[notaKey] ?? ""; // null ou undefined vira string vazia

                      return (
                        <div key={bim}>
                          <label className="block text-xs text-[#94A3B8] mb-2">
                            {bim}º Bimestre
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={0.1}
                            value={notaValue}
                            onChange={(e) =>
                              handleInputChange(notaKey, e.target.value)
                            }
                            placeholder="0-100"
                            className="w-full px-3 py-2.5 bg-[#132040] border border-[#243049] rounded-lg text-[#F3F4F6] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all text-center"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-[#64748B] mt-2">
                    * Deixe em branco para notas ainda não atribuídas
                  </p>
                </div>

                {/* Preview da Média */}
                {currentMateria.nome && (
                  <div className="bg-[#132040] border border-[#243049] rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#94A3B8]">
                        Média Calculada:
                      </span>
                      <span
                        className={`text-2xl font-bold ${
                          getMediaStatus(calcularMedia(currentMateria)).color
                        }`}
                      >
                        {calcularMedia(currentMateria).toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer do Modal */}
              <div className="sticky bottom-0 bg-[#132040] border-t border-[#243049] px-6 py-4 flex items-center justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 bg-[#0F1B31] border border-[#243049] text-[#CBD5E1] font-semibold rounded-lg hover:bg-[#132040] hover:border-[#3B82F6]/50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-[#F3F4F6] font-semibold rounded-lg hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all"
                >
                  <Save className="w-4 h-4" />
                  {isEditMode ? "Salvar Alterações" : "Criar Disciplina"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mensagem quando não há resultados */}
        {materiasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#132040] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#64748B]" />
            </div>
            <p className="text-[#94A3B8]">Nenhuma disciplina encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
