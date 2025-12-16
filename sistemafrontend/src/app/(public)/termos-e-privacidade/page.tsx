"use client";
import { useState } from "react";
import { FileText, Shield, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";

export default function TermsAndPrivacyPage() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-[#0B1526] text-[#F3F4F6]">
      {/* Background decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#3B82F6] rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#60A5FA] rounded-full opacity-5 blur-3xl"></div>
      </div>

      {/* Container principal */}
      <div className="relative max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-[#94A3B8] hover:text-[#60A5FA] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Voltar
          </button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F3F4F6] to-[#CBD5E1] bg-clip-text text-transparent mb-4">
              Documentos Legais
            </h1>
            <p className="text-[#94A3B8] text-lg">
              Sistema Acadêmico - Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 bg-[#132040] p-2 rounded-xl border border-[#243049] max-w-md mx-auto">
            <button
              onClick={() => setActiveTab("terms")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === "terms"
                  ? "bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-[#F3F4F6] shadow-lg"
                  : "text-[#94A3B8] hover:text-[#CBD5E1]"
              }`}
            >
              <FileText className="w-5 h-5" />
              Termos de Uso
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === "privacy"
                  ? "bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-[#F3F4F6] shadow-lg"
                  : "text-[#94A3B8] hover:text-[#CBD5E1]"
              }`}
            >
              <Shield className="w-5 h-5" />
              Privacidade
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="bg-[#0F1B31] rounded-2xl shadow-2xl border border-[#243049] overflow-hidden">
          {activeTab === "terms" ? <TermsContent toggleSection={toggleSection} expandedSection={expandedSection} /> : <PrivacyContent toggleSection={toggleSection} expandedSection={expandedSection} />}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-[#64748B] text-sm">
          <p>
            Se você tiver alguma dúvida sobre estes termos, entre em contato conosco através de{" "}
            <a href="mailto:contato@sistema.edu" className="text-[#60A5FA] hover:text-[#3B82F6] transition-colors">
              contato@sistema.edu
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function TermsContent({ toggleSection, expandedSection }: { toggleSection: (section: string) => void; expandedSection: string | null }) {
  const sections = [
    {
      id: "acceptance",
      title: "1. Aceitação dos Termos",
      content: `Ao acessar e utilizar o Sistema Acadêmico, você concorda em estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossa plataforma. O uso contínuo do sistema após quaisquer modificações nestes termos constituirá sua aceitação de tais alterações.`
    },
    {
      id: "services",
      title: "2. Descrição dos Serviços",
      content: `O Sistema Acadêmico é uma plataforma educacional que oferece ferramentas para gestão acadêmica, incluindo, mas não se limitando a: matrícula em disciplinas, acompanhamento de notas, consulta de histórico escolar, comunicação com professores e instituição, acesso a materiais didáticos e gerenciamento de calendário acadêmico. Reservamo-nos o direito de modificar ou descontinuar, temporária ou permanentemente, o serviço (ou qualquer parte dele) com ou sem aviso prévio.`
    },
    {
      id: "account",
      title: "3. Conta de Usuário",
      content: `Para utilizar determinadas funcionalidades do sistema, você deve criar uma conta fornecendo informações precisas e completas. Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades que ocorrem em sua conta. Você concorda em notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta. Não compartilhe suas credenciais com terceiros e utilize senhas fortes para proteger sua conta.`
    },
    {
      id: "conduct",
      title: "4. Conduta do Usuário",
      content: `Ao utilizar o sistema, você concorda em não: (a) violar quaisquer leis ou regulamentos aplicáveis; (b) infringir os direitos de propriedade intelectual de terceiros; (c) transmitir vírus, malware ou qualquer código malicioso; (d) tentar obter acesso não autorizado a qualquer parte do sistema; (e) interferir ou interromper o funcionamento do sistema; (f) usar o sistema para fins comerciais não autorizados; (g) coletar informações de outros usuários sem consentimento; (h) publicar conteúdo ofensivo, difamatório ou inadequado.`
    },
    {
      id: "content",
      title: "5. Conteúdo e Propriedade Intelectual",
      content: `Todo o conteúdo disponibilizado no Sistema Acadêmico, incluindo textos, gráficos, logotipos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, é de propriedade da instituição ou de seus fornecedores de conteúdo e é protegido por leis de direitos autorais. O conteúdo que você envia ao sistema permanece de sua propriedade, mas você nos concede uma licença para utilizá-lo conforme necessário para a prestação dos serviços. Você declara possuir todos os direitos necessários sobre o conteúdo que compartilha.`
    },
    {
      id: "academic",
      title: "6. Responsabilidades Acadêmicas",
      content: `Os alunos são responsáveis por: verificar regularmente prazos e calendários acadêmicos, cumprir os requisitos de frequência estabelecidos, submeter trabalhos e avaliações dentro dos prazos, manter contato regular com professores e coordenadores, e informar-se sobre mudanças em programas e políticas acadêmicas. A instituição não se responsabiliza por perdas de prazos ou oportunidades decorrentes da falta de acompanhamento do sistema pelo aluno.`
    },
    {
      id: "termination",
      title: "7. Suspensão e Encerramento",
      content: `Reservamo-nos o direito de suspender ou encerrar sua conta a qualquer momento, com ou sem aviso prévio, se acreditarmos que você violou estes Termos de Uso ou se envolveu em conduta inadequada. Você pode encerrar sua conta a qualquer momento, sujeito às políticas acadêmicas aplicáveis. Após o encerramento, você perderá o acesso ao sistema e aos dados associados à sua conta, embora possamos reter certas informações conforme exigido por lei.`
    },
    {
      id: "disclaimer",
      title: "8. Isenção de Garantias",
      content: `O sistema é fornecido "como está" e "conforme disponível", sem garantias de qualquer tipo, expressas ou implícitas. Não garantimos que o sistema será ininterrupto, livre de erros ou seguro. Você utiliza o sistema por sua conta e risco. Não nos responsabilizamos por quaisquer danos diretos, indiretos, incidentais, consequenciais ou punitivos decorrentes do uso ou da incapacidade de usar o sistema, incluindo perda de dados ou lucros cessantes.`
    },
    {
      id: "changes",
      title: "9. Modificações dos Termos",
      content: `Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no sistema. É sua responsabilidade revisar periodicamente estes termos. O uso contínuo do sistema após quaisquer alterações constitui sua aceitação dos novos termos. Alterações significativas serão notificadas através do sistema ou por e-mail.`
    },
    {
      id: "law",
      title: "10. Lei Aplicável",
      content: `Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer disputa decorrente destes termos será resolvida exclusivamente nos tribunais competentes do Brasil. Você concorda com a jurisdição exclusiva desses tribunais e renuncia a quaisquer objeções baseadas em local inadequado ou foro não conveniente.`
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#F3F4F6]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#F3F4F6]">Termos de Uso</h2>
            <p className="text-[#94A3B8] text-sm">Sistema Acadêmico</p>
          </div>
        </div>
        <p className="text-[#CBD5E1] leading-relaxed">
          Bem-vindo ao Sistema Acadêmico. Estes Termos de Uso estabelecem as regras e condições para o uso de nossa plataforma educacional. Por favor, leia atentamente antes de utilizar nossos serviços.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-[#132040] border border-[#243049] rounded-xl overflow-hidden transition-all"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1A2847] transition-colors group"
            >
              <h3 className="text-lg font-semibold text-[#CBD5E1] group-hover:text-[#60A5FA] transition-colors">
                {section.title}
              </h3>
              {expandedSection === section.id ? (
                <ChevronUp className="w-5 h-5 text-[#60A5FA]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#64748B] group-hover:text-[#60A5FA] transition-colors" />
              )}
            </button>
            {expandedSection === section.id && (
              <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="pt-4 border-t border-[#243049]">
                  <p className="text-[#94A3B8] leading-relaxed">{section.content}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PrivacyContent({ toggleSection, expandedSection }: { toggleSection: (section: string) => void; expandedSection: string | null }) {
  const sections = [
    {
      id: "collection",
      title: "1. Informações que Coletamos",
      content: `Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços. Isso inclui: (a) Informações de Cadastro: nome completo, CPF, RG, data de nascimento, endereço, telefone, e-mail e foto; (b) Informações Acadêmicas: histórico escolar, notas, frequência, disciplinas matriculadas, trabalhos submetidos e desempenho acadêmico; (c) Informações de Uso: dados de acesso ao sistema, endereço IP, tipo de navegador, páginas visitadas e tempo de permanência; (d) Informações de Comunicação: mensagens trocadas com professores, coordenadores e suporte técnico.`
    },
    {
      id: "usage",
      title: "2. Como Utilizamos suas Informações",
      content: `Utilizamos as informações coletadas para: fornecer, operar e manter nossos serviços educacionais; processar matrículas e gerenciar seu histórico acadêmico; comunicar informações importantes sobre sua vida acadêmica; enviar notificações sobre prazos, eventos e atualizações; personalizar sua experiência no sistema; melhorar nossos serviços através de análises e pesquisas; cumprir obrigações legais e regulatórias; prevenir fraudes e garantir a segurança do sistema; gerar relatórios estatísticos e agregados que não identificam indivíduos.`
    },
    {
      id: "sharing",
      title: "3. Compartilhamento de Informações",
      content: `Podemos compartilhar suas informações nas seguintes circunstâncias: (a) Com professores e coordenadores para fins acadêmicos; (b) Com o Ministério da Educação e órgãos reguladores quando exigido por lei; (c) Com prestadores de serviços que auxiliam na operação do sistema, sob rigorosos acordos de confidencialidade; (d) Com sua autorização expressa para finalidades específicas; (e) Para proteger nossos direitos legais ou responder a processos judiciais. Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing sem seu consentimento explícito.`
    },
    {
      id: "security",
      title: "4. Segurança das Informações",
      content: `Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui: criptografia de dados em trânsito e em repouso, controles de acesso baseados em funções, monitoramento contínuo de atividades suspeitas, backups regulares, auditorias de segurança periódicas e treinamento de equipe sobre proteção de dados. No entanto, nenhum método de transmissão pela internet é 100% seguro, e não podemos garantir segurança absoluta.`
    },
    {
      id: "retention",
      title: "5. Retenção de Dados",
      content: `Retemos suas informações pessoais pelo tempo necessário para cumprir os propósitos descritos nesta política, salvo quando um período de retenção mais longo for exigido ou permitido por lei. Dados acadêmicos são mantidos conforme exigências do Ministério da Educação e regulamentos educacionais. Após o término do período de retenção, suas informações serão excluídas ou anonimizadas de forma segura. Você pode solicitar a exclusão de seus dados a qualquer momento, sujeito às nossas obrigações legais de retenção.`
    },
    {
      id: "rights",
      title: "6. Seus Direitos",
      content: `De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a: acessar suas informações pessoais; corrigir dados incompletos, inexatos ou desatualizados; solicitar a anonimização, bloqueio ou eliminação de dados desnecessários; solicitar a portabilidade de seus dados; obter informações sobre o compartilhamento de seus dados; revogar seu consentimento; e apresentar reclamações à Autoridade Nacional de Proteção de Dados (ANPD). Para exercer esses direitos, entre em contato através dos canais indicados nesta política.`
    },
    {
      id: "cookies",
      title: "7. Cookies e Tecnologias Similares",
      content: `Utilizamos cookies e tecnologias similares para melhorar sua experiência no sistema. Cookies são pequenos arquivos de texto armazenados em seu dispositivo que nos ajudam a: manter sua sessão ativa, lembrar suas preferências, analisar o uso do sistema e melhorar a funcionalidade. Você pode configurar seu navegador para recusar cookies, mas isso pode afetar algumas funcionalidades do sistema. Utilizamos cookies essenciais (necessários para o funcionamento), cookies de desempenho (análise de uso) e cookies de funcionalidade (preferências do usuário).`
    },
    {
      id: "minors",
      title: "8. Proteção de Menores",
      content: `Nosso sistema pode ser utilizado por menores de idade devidamente matriculados na instituição. Quando o usuário é menor de 18 anos, requeremos o consentimento dos pais ou responsáveis legais para coleta e processamento de dados pessoais. Tomamos precauções especiais para proteger a privacidade de menores, incluindo limitações no compartilhamento de informações e controles adicionais de segurança. Pais e responsáveis têm o direito de acessar, corrigir ou solicitar a exclusão de informações de seus filhos.`
    },
    {
      id: "international",
      title: "9. Transferências Internacionais",
      content: `Seus dados são armazenados e processados principalmente no Brasil. Em alguns casos, podemos utilizar serviços de terceiros que podem envolver transferência internacional de dados. Quando isso ocorrer, garantimos que medidas adequadas de proteção estejam em vigor, incluindo cláusulas contratuais padrão, certificações de privacidade e outras salvaguardas reconhecidas pela LGPD. Você será informado sobre qualquer transferência internacional significativa de seus dados.`
    },
    {
      id: "changes-privacy",
      title: "10. Alterações nesta Política",
      content: `Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas ou por razões legais, operacionais ou regulatórias. Notificaremos você sobre alterações significativas através do sistema ou por e-mail. A data da última atualização será sempre indicada no topo desta política. Recomendamos que você revise esta política regularmente para se manter informado sobre como protegemos suas informações. O uso contínuo do sistema após as alterações constitui sua aceitação da política atualizada.`
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#F3F4F6]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#F3F4F6]">Política de Privacidade</h2>
            <p className="text-[#94A3B8] text-sm">Proteção de Dados - LGPD</p>
          </div>
        </div>
        <p className="text-[#CBD5E1] leading-relaxed">
          Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-[#132040] border border-[#243049] rounded-xl overflow-hidden transition-all"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1A2847] transition-colors group"
            >
              <h3 className="text-lg font-semibold text-[#CBD5E1] group-hover:text-[#60A5FA] transition-colors">
                {section.title}
              </h3>
              {expandedSection === section.id ? (
                <ChevronUp className="w-5 h-5 text-[#60A5FA]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#64748B] group-hover:text-[#60A5FA] transition-colors" />
              )}
            </button>
            {expandedSection === section.id && (
              <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="pt-4 border-t border-[#243049]">
                  <p className="text-[#94A3B8] leading-relaxed">{section.content}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-[#3B82F6]/10 to-[#60A5FA]/10 border border-[#3B82F6]/30 rounded-xl">
        <h3 className="text-lg font-semibold text-[#F3F4F6] mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#60A5FA]" />
          Encarregado de Proteção de Dados (DPO)
        </h3>
        <p className="text-[#94A3B8] mb-3">
          Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato com nosso DPO:
        </p>
        <div className="space-y-1 text-sm text-[#CBD5E1]">
          <p><strong>E-mail:</strong> dpo@sistema.edu</p>
          <p><strong>Telefone:</strong> (11) 1234-5678</p>
          <p><strong>Endereço:</strong> Rua Exemplo, 123 - São Paulo, SP</p>
        </div>
      </div>
    </div>
  );
}