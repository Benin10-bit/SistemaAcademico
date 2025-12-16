"use client";
import { useState, ChangeEvent, MouseEvent } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Loader2,
  User,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ⚙️ CONFIGURAÇÃO DA API - Altere aqui
const API_BASE_URL = "/api";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  token?: string;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

interface ErrorResponse {
  message?: string;
  errors?: {
    field: string;
    message: string;
  }[];
  statusCode?: number;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Limpa os erros quando o usuário começa a digitar
    setError("");
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "O nome é obrigatório";
    } else if (formData.name.trim().length < 3) {
      errors.name = "O nome deve ter pelo menos 3 caracteres";
    }

    if (!formData.email) {
      errors.email = "O e-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "E-mail inválido";
    }

    if (!formData.password) {
      errors.password = "A senha é obrigatória";
    } else if (formData.password.length < 8) {
      errors.password = "A senha deve ter pelo menos 8 caracteres";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = "A senha deve conter maiúsculas, minúsculas e números";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirme sua senha";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
    }

    if (!acceptTerms) {
      setError("Você precisa aceitar os termos e condições");
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0 && acceptTerms;
  };

  const autoLogin = async (email: string, password: string): Promise<boolean> => {
    setIsAutoLoggingIn(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          senha: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Falha no login automático");
      }

      // Salvar token se necessário
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      return true;
    } catch (err) {
      console.error("Erro no auto-login:", err);
      return false;
    }
  };

  const handleSubmit = async (
    e: MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    // Validação do formulário antes de enviar
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          nome: formData.name,
          email: formData.email,
          senha: formData.password,
        }),
      });

      const data: RegisterResponse & ErrorResponse = await response.json();

      if (!response.ok) {
        // Tratamento específico por código de status
        switch (response.status) {
          case 400:
            // Erros de validação do backend
            if (data.errors && Array.isArray(data.errors)) {
              const newFieldErrors: Record<string, string> = {};
              data.errors.forEach((err) => {
                newFieldErrors[err.field] = err.message;
              });
              setFieldErrors(newFieldErrors);
              setError("Por favor, corrija os erros nos campos");
            } else {
              setError(data.message || "Dados inválidos. Verifique os campos.");
            }
            break;

          case 409:
            setError("Este e-mail já está cadastrado. Tente fazer login.");
            setFieldErrors({ email: "E-mail já cadastrado" });
            break;

          case 422:
            setError("Dados inválidos. Verifique as informações e tente novamente.");
            break;

          case 429:
            setError("Muitas tentativas. Tente novamente em alguns minutos.");
            break;

          case 500:
          case 502:
          case 503:
            setError("Erro no servidor. Tente novamente mais tarde.");
            break;

          default:
            setError(
              data.message || "Erro ao criar conta. Tente novamente."
            );
        }
        return;
      }

      // Registro bem-sucedido
      setSuccess(true);

      // Tentar fazer login automático
      const loginSuccess = await autoLogin(formData.email, formData.password);

      if (!loginSuccess) {
        // Se o auto-login falhar, apenas redireciona para o login
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      // Login automático bem-sucedido, redireciona para o dashboard
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err) {
      // Erros de rede ou outros erros não capturados
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError(
          "Não foi possível conectar ao servidor. Verifique sua conexão."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Erro inesperado. Tente novamente."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-[#0B1526] justify-center p-4 py-12">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#3B82F6] rounded-full opacity-8 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#60A5FA] rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#0EA5E9] rounded-full opacity-3 blur-3xl"></div>
      </div>

      {/* Card de Registro */}
      <div className="relative w-full max-w-md">
        {/* Borda gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] rounded-2xl blur-sm opacity-30"></div>

        <div className="relative bg-[#0F1B31] rounded-2xl shadow-2xl p-8 border border-[#243049]">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#3B82F6] via-[#60A5FA] to-[#0EA5E9] rounded-xl mb-4 shadow-lg shadow-[#3B82F6]/20">
              <User className="w-8 h-8 text-[#F3F4F6]" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F3F4F6] to-[#CBD5E1] bg-clip-text text-transparent mb-2">
              Criar uma conta
            </h1>
            <p className="text-[#94A3B8]">
              Preencha os dados abaixo para começar
            </p>
          </div>

          {/* Formulário */}
          <div className="space-y-4">
            {/* Mensagem de Sucesso */}
            {success && (
              <div className="bg-gradient-to-r from-[#16A34A]/10 to-[#16A34A]/5 border border-[#16A34A]/30 rounded-lg p-3 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                  <p className="text-[#16A34A] text-sm font-medium">
                    {isAutoLoggingIn
                      ? "Conta criada! Fazendo login..."
                      : "Conta criada com sucesso! Redirecionando..."}
                  </p>
                </div>
              </div>
            )}

            {/* Mensagem de Erro Geral */}
            {error && !success && (
              <div className="bg-gradient-to-r from-[#DC2626]/10 to-[#DC2626]/5 border border-[#DC2626]/30 rounded-lg p-3 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-[#DC2626] mt-0.5 flex-shrink-0" />
                  <p className="text-[#DC2626] text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Nome */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#CBD5E1]"
              >
                Nome completo
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/0 via-[#3B82F6]/5 to-[#60A5FA]/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] group-focus-within:text-[#60A5FA] transition-colors z-10" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading || success}
                  className={`relative w-full pl-11 pr-4 py-3 bg-[#132040] border ${
                    fieldErrors.name
                      ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20"
                      : "border-[#243049] focus:border-[#3B82F6] focus:ring-[#3B82F6]/20"
                  } rounded-lg text-[#F3F4F6] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:bg-[#1A2847] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="João Silva"
                />
              </div>
              {fieldErrors.name && (
                <p className="text-[#DC2626] text-xs mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#CBD5E1]"
              >
                E-mail
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/0 via-[#3B82F6]/5 to-[#60A5FA]/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] group-focus-within:text-[#60A5FA] transition-colors z-10" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading || success}
                  className={`relative w-full pl-11 pr-4 py-3 bg-[#132040] border ${
                    fieldErrors.email
                      ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20"
                      : "border-[#243049] focus:border-[#3B82F6] focus:ring-[#3B82F6]/20"
                  } rounded-lg text-[#F3F4F6] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:bg-[#1A2847] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="seu@email.com"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[#DC2626] text-xs mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#CBD5E1]"
              >
                Senha
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/0 via-[#3B82F6]/5 to-[#60A5FA]/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] group-focus-within:text-[#60A5FA] transition-colors z-10" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading || success}
                  className={`relative w-full pl-11 pr-12 py-3 bg-[#132040] border ${
                    fieldErrors.password
                      ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20"
                      : "border-[#243049] focus:border-[#3B82F6] focus:ring-[#3B82F6]/20"
                  } rounded-lg text-[#F3F4F6] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:bg-[#1A2847] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || success}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#60A5FA] transition-colors z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[#DC2626] text-xs mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#CBD5E1]"
              >
                Confirmar senha
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/0 via-[#3B82F6]/5 to-[#60A5FA]/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] group-focus-within:text-[#60A5FA] transition-colors z-10" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading || success}
                  className={`relative w-full pl-11 pr-12 py-3 bg-[#132040] border ${
                    fieldErrors.confirmPassword
                      ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20"
                      : "border-[#243049] focus:border-[#3B82F6] focus:ring-[#3B82F6]/20"
                  } rounded-lg text-[#F3F4F6] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:bg-[#1A2847] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading || success}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#60A5FA] transition-colors z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-[#DC2626] text-xs mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Termos e condições */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  if (e.target.checked) setError("");
                }}
                disabled={isLoading || success}
                className="mt-1 w-4 h-4 bg-[#132040] border-[#243049] rounded text-[#3B82F6] focus:ring-[#3B82F6] focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label
                htmlFor="terms"
                className="text-sm text-[#94A3B8] leading-relaxed"
              >
                Eu aceito os{" "}
                <a
                  href="/termos-e-privacidade"
                  className="text-[#60A5FA] hover:text-[#3B82F6] transition-colors"
                >
                  termos e condições
                </a>{" "}
                e a{" "}
                <a
                  href="/termos-e-privacidade"
                  className="text-[#60A5FA] hover:text-[#3B82F6] transition-colors"
                >
                  política de privacidade
                </a>
              </label>
            </div>

            {/* Botão Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || success}
              className="relative w-full bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#0EA5E9] hover:from-[#1D4ED8] hover:via-[#3B82F6] hover:to-[#0284C7] text-[#F3F4F6] font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg shadow-[#3B82F6]/25 hover:shadow-xl hover:shadow-[#3B82F6]/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              {success ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  {isAutoLoggingIn ? "Fazendo login..." : "Sucesso!"}
                </>
              ) : isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar conta"
              )}
            </button>
          </div>

          {/* Divisor */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#243049]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0F1B31] text-[#64748B]"></span>
            </div>
          </div>

          {/* Rodapé */}
          <p className="text-center text-sm text-[#94A3B8] mt-6">
            Já tem uma conta?{" "}
            <a
              href="/sign-in"
              className="text-[#60A5FA] hover:text-[#3B82F6] font-medium transition-colors"
            >
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}