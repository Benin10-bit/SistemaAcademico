"use client";
import { useState } from "react";
import { 
  Menu, 
  X, 
  Home,
  BookOpen,
  BarChart3,
  Settings,
  User,
  LogOut,
  GraduationCap,
  Calendar,
  Bell
} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: "Início", href: "/" },
    { icon: BarChart3, label: "Relatórios", href: "/relatorios" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Header Principal */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B1526]/95 backdrop-blur-md border-b border-[#243049]">
        <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-0">
          <div className="flex items-center justify-between h-16">
            {/* Logo e Título */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] rounded-lg flex items-center justify-center shadow-lg shadow-[#3B82F6]/30">
                <GraduationCap className="w-6 h-6 text-[#F3F4F6]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#F3F4F6]">
                  Academic<span className="text-[#60A5FA]">Pro</span>
                </h1>
                <p className="text-xs text-[#94A3B8] hidden sm:block">Sistema de Gestão Acadêmica</p>
              </div>
            </div>

            {/* Ações do Header */}
            <div className="flex items-center gap-3">
              {/* Botão Menu Hambúrguer */}
              <button
                onClick={toggleMenu}
                className="p-2.5 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-lg text-[#F3F4F6] hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={toggleMenu}
        />
      )}

      {/* Menu Lateral */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-[#0B1526] border-l border-[#243049] z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header do Menu */}
        <div className="bg-[#132040] border-b border-[#243049] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] rounded-xl flex items-center justify-center shadow-lg shadow-[#3B82F6]/30">
                <User className="w-6 h-6 text-[#F3F4F6]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F3F4F6]">Estudante</h3>
                <p className="text-xs text-[#94A3B8]">estudante@email.com</p>
              </div>
            </div>
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-[#1C2E59] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#94A3B8]" />
            </button>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#1C2E59] border border-[#243049] rounded-lg">
            <div className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse"></div>
            <span className="text-xs text-[#CBD5E1] font-medium">Online</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-[#CBD5E1] hover:text-[#F3F4F6] hover:bg-[#132040] border border-transparent hover:border-[#243049] transition-all group"
                onClick={toggleMenu}
              >
                <Icon className="w-5 h-5 text-[#94A3B8] group-hover:text-[#60A5FA] transition-colors" />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}

          {/* Divider */}
          <div className="my-4 border-t border-[#243049]"></div>

          {/* Logout Button */}
          <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-[#DC2626] hover:bg-[#DC2626]/10 border border-transparent hover:border-[#DC2626]/30 transition-all group">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </nav>

        {/* Footer do Menu */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#132040] border-t border-[#243049] p-4">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>v1.0.0</span>
            <span>© 2025 AcademicPro</span>
          </div>
        </div>
      </aside>

      {/* Spacer para compensar o header fixo */}
      <div className="h-16"></div>
    </>
  );
}