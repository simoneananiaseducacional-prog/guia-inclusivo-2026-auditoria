import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Accessibility,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  FileCheck2,
  FileText,
  Filter,
  FolderOpen,
  Info,
  Layers3,
  LifeBuoy,
  Menu,
  MessageCircle,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  PencilLine,
  Plus,
  Quote,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  WandSparkles,
  X,
} from "lucide-react";
import PdiModule from "../components/PdiModule";

const fictionalLabel = "CASO FICTÍCIO PARA DEMONSTRAÇÃO";
const officialCopy = "REDAÇÃO A CONFERIR NA FONTE OFICIAL.";
const curricularCopy = "EXEMPLO DEMONSTRATIVO — NÃO UTILIZAR COMO REFERÊNCIA CURRICULAR OFICIAL.";

type ViewKey =
  | "inicio"
  | "estudo"
  | "paee"
  | "pei"
  | "pdi"
  | "planejamento"
  | "adaptar"
  | "curriculo"
  | "base-legal"
  | "meus-casos";

const navItems: { key: ViewKey; label: string; icon: typeof FileText; group?: string }[] = [
  { key: "inicio", label: "Visão geral", icon: BarChart3 },
  { key: "estudo", label: "Estudo de Caso", icon: ClipboardList, group: "Construção colaborativa" },
  { key: "paee", label: "PAEE", icon: Network },
  { key: "pei", label: "PEI", icon: FileCheck2 },
  { key: "pdi", label: "PDI — Minas Gerais", icon: ClipboardCheck, group: "Prática pedagógica" },
  { key: "planejamento", label: "Planejamento e flexibilização", icon: Layers3, group: "Prática pedagógica" },
  { key: "adaptar", label: "Adaptar atividade", icon: WandSparkles },
  { key: "curriculo", label: "Currículo / CRMG", icon: BookOpen, group: "Referências" },
  { key: "base-legal", label: "Base legal", icon: ShieldCheck },
  { key: "meus-casos", label: "Meus casos", icon: FolderOpen, group: "Gestão" },
];

const modules = [
  { key: "estudo", title: "Estudo de Caso", description: "Organize potencialidades, barreiras e apoios a partir do que a equipe já observou.", icon: ClipboardList, tone: "blue", progress: 82, status: "Em construção" },
  { key: "paee", title: "PAEE", description: "Articule objetivos, recursos e indicadores com as contribuições de cada profissional.", icon: Network, tone: "teal", progress: 64, status: "Em construção" },
  { key: "pei", title: "PEI", description: "Conecte o planejamento pedagógico à habilidade da turma sem reduzir expectativas automaticamente.", icon: FileCheck2, tone: "amber", progress: 48, status: "Rascunho" },
  { key: "planejamento", title: "Planejamento", description: "Analise a barreira antes de decidir por apoio, recomposição ou flexibilização.", icon: Layers3, tone: "violet", progress: 35, status: "Não iniciado" },
  { key: "adaptar", title: "Adaptar atividade", description: "Compare a proposta original e uma versão acessível mantendo a habilidade sempre que possível.", icon: WandSparkles, tone: "coral", progress: 22, status: "Demonstração" },
];

const caseFields = [
  { label: "Potencialidades", value: "Interesse por situações-problema, boa memória visual e iniciativa para explicar estratégias quando dispõe de tempo." },
  { label: "Barreiras", value: "Enunciados extensos, excesso de informação visual e tempo reduzido para organizar a resposta escrita." },
  { label: "Interesses", value: "Mapas, jogos de estratégia, construção com blocos e desafios que tenham etapas claras." },
  { label: "Comunicação", value: "Comunica-se oralmente e utiliza esquemas visuais para planejar o que deseja registrar." },
  { label: "Autonomia e participação", value: "Participa com mais segurança quando conhece a sequência da atividade e pode escolher como responder." },
  { label: "Aprendizagens consolidadas", value: "Reconhece operações básicas em situações contextualizadas e compara diferentes estratégias de resolução." },
  { label: "Estratégias que funcionaram", value: "Segmentação do enunciado, destaque de dados relevantes, exemplo visual e checagem de compreensão." },
  { label: "Recursos e apoios", value: "Quadro de etapas, régua de leitura, tempo ampliado para organização e possibilidade de resposta oral mediada." },
  { label: "Família, professores e AEE", value: "INFORMAÇÃO A SER LEVANTADA PELA EQUIPE." },
];

const paeeSections = [
  { title: "Barreiras prioritárias", system: "Enunciados extensos e múltiplas informações competem com a organização da resposta.", hint: "Confirmar com a equipe em quais contextos a barreira aparece e quando não aparece." },
  { title: "Objetivos do AEE", system: "Ampliar o uso autônomo de estratégias visuais para compreender instruções e planejar respostas.", hint: "Registrar como o objetivo se articula ao planejamento da sala comum." },
  { title: "Recursos e Tecnologia Assistiva", system: "Organizador visual de etapas, régua de leitura e alternativas de registro.", hint: "Validar disponibilidade, preferência e eficácia com o estudante." },
  { title: "Articulação AEE / sala comum", system: "Combinar linguagem visual comum, sinais de retomada e formas de checagem de compreensão.", hint: "Definir responsáveis e momentos de troca." },
  { title: "Indicadores de acompanhamento", system: "Utiliza o organizador com menor mediação e explica qual estratégia escolheu.", hint: "Definir evidências observáveis e frequência de revisão." },
];

const peiRows = [
  ["Potencialidades", "Boa memória visual; interesse por desafios; explica estratégias oralmente.", "Professor regente + AEE"],
  ["Barreira curricular", "A extensão do enunciado dificulta acesso à situação-problema, sem evidência de barreira ao raciocínio matemático.", "Professor regente"],
  ["Habilidade da turma", curricularCopy, "A conferir no CRMG oficial"],
  ["Objetivo", "Resolver a situação-problema utilizando a mesma expectativa da turma, com acesso e expressão ajustados.", "Professor regente + equipe"],
  ["Participação e resposta", "Escolher entre registro escrito segmentado, esquema visual ou explicação oral mediada.", "Estudante + professor"],
  ["Avaliação", "Observar compreensão da situação, escolha da estratégia e justificativa da resposta; não penalizar a barreira de leitura quando não for o objeto avaliado.", "Professor regente"],
];

const legalGroups = [
  { title: "Normas federais", count: 9, entries: ["Constituição Federal", "LDB — Lei nº 9.394/1996", "LBI — Lei nº 13.146/2015", "Lei nº 12.764/2012", "Lei nº 14.254/2021", "Decreto nº 12.686/2025", "Decreto nº 12.773/2025", "Portaria MEC nº 421/2026", "Portaria MEC nº 550/2026"] },
  { title: "Minas Gerais", count: 3, entries: ["Resolução SEE/MG nº 4.256/2020", "PDI", "Outras normas aplicáveis"] },
  { title: "Transtornos de aprendizagem", count: 3, entries: ["TDAH", "Dislexia", "Outros transtornos de aprendizagem"] },
  { title: "Orientações oficiais", count: 3, entries: ["Cadernos da PNEEI", "MEC", "Inep"] },
  { title: "Currículo", count: 3, entries: ["BNCC", "CRMG", "Planos de Curso SEE/MG"] },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function StatusPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "teal" | "amber" | "blue" | "coral" | "violet" }) {
  return <span className={cx("status-pill", `status-${tone}`)}>{children}</span>;
}

function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="section-description">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function DemoBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cx("demo-banner", compact && "demo-banner-compact")} role="note">
      <div className="demo-icon"><ShieldCheck size={17} /></div>
      <div>
        <strong>FERRAMENTA DE FORMAÇÃO</strong>
        <span>{compact ? "Caso fictício para discussão — nada é salvo ou enviado." : "Este simulador usa somente dados fictícios. O que você escreve não é salvo nem enviado; as decisões pertencem à equipe."}</span>
      </div>
    </div>
  );
}

function TrainingNotice() {
  return <span className="form-helper">Ferramenta de formação: nada do que você escreve é salvo ou enviado.</span>;
}

function Sidebar({ view, onClose }: { view: ViewKey; onClose: () => void }) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark"><Accessibility size={24} strokeWidth={2.4} /></div>
        <div>
          <div className="brand-name">GUIA INCLUSIVO</div>
          <div className="brand-year">2026 <span>•</span> EDUCAÇÃO ESPECIAL</div>
        </div>
        <button className="mobile-close" onClick={onClose} aria-label="Fechar menu"><X size={18} /></button>
      </div>

      <div className="case-switcher">
        <div className="case-avatar">F1</div>
        <div className="case-meta"><small>CASO ATIVO</small><strong>Estudante F-01</strong></div>
      </div>

      <nav className="side-nav" aria-label="Navegação principal">
        {navItems.map((item, index) => {
          const previous = navItems[index - 1];
          const showGroup = item.group && item.group !== previous?.group;
          const Icon = item.icon;
          return (
            <div key={item.key}>
              {showGroup && <div className="nav-group-label">{item.group}</div>}
              <Link href={item.key === "inicio" ? "/" : `/${item.key}`} onClick={onClose} className={cx("nav-item", view === item.key && "nav-item-active")}>
                <Icon size={18} strokeWidth={view === item.key ? 2.4 : 1.9} />
                <span>{item.label}</span>
                {item.key === "estudo" && <span className="nav-dot" />}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="privacy-mini"><ShieldCheck size={16} /><div><strong>Ambiente de protótipo</strong><span>Sem dados reais · Fase 1</span></div></div>
        <button className="settings-button" disabled><Settings2 size={17} /> Preferências · em breve</button>
        <div className="profile-row"><div className="profile-avatar">EC</div><div><strong>Equipe colaborativa</strong><span>Acesso demonstrativo</span></div><ChevronRight size={15} /></div>
      </div>
    </aside>
  );
}

function Topbar({ title, onMenu }: { title: string; onMenu: () => void }) {
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenu} aria-label="Abrir menu"><Menu size={21} /></button>
      <div className="breadcrumb"><span>Guia Inclusivo</span><ChevronRight size={14} /><strong>{title}</strong></div>
      <div className="topbar-actions">
        <button className="icon-button" aria-label="Pesquisar · em breve" disabled><Search size={18} /></button>
        <button className="icon-button" aria-label="Ajuda · em breve" disabled><LifeBuoy size={18} /></button>
        <div className="topbar-divider" />
        <div className="topbar-user"><div className="profile-avatar profile-avatar-small">EC</div><span>Equipe</span><ChevronDown size={14} /></div>
      </div>
    </header>
  );
}

function FlowRail({ current }: { current: number }) {
  const steps = ["Estudo de caso", "PAEE", "PEI", "Planejamento", "Atividade"];
  return (
    <div className="flow-rail" aria-label="Percurso pedagógico demonstrativo">
      {steps.map((step, index) => <div className={cx("flow-step", index <= current && "flow-step-done", index === current && "flow-step-current")} key={step}>
        <div className="flow-dot">{index < current ? <Check size={13} /> : index + 1}</div><span>{step}</span>{index < steps.length - 1 && <div className="flow-line" />}
      </div>)}
    </div>
  );
}

function Overview({ go }: { go: (view: ViewKey) => void }) {
  return <>
    <div className="welcome-row">
      <div><p className="eyebrow">TERÇA-FEIRA, 22 DE SETEMBRO DE 2026</p><h1>Bom trabalho, equipe.</h1><p className="section-description">Continue a construção colaborativa do <strong>Estudante F-01</strong> a partir das evidências já levantadas.</p></div>
      <div className="welcome-actions"><button className="button button-ghost" disabled><MessageCircle size={16} /> Ver contribuições · em breve <span className="count-badge">3</span></button><button className="button button-primary" onClick={() => go("estudo")}><Plus size={17} /> Nova anotação</button></div>
    </div>
    <DemoBanner />
    <div className="overview-grid">
      <section className="focus-card">
        <div className="card-topline"><div><span className="label-caps">CASO ATIVO</span><h2>Estudante F-01</h2></div><StatusPill tone="teal">Em construção</StatusPill></div>
        <p className="focus-summary">Caso fictício para acompanhar como uma barreira de leitura pode ser enfrentada sem reduzir automaticamente a habilidade matemática da turma.</p>
        <div className="focus-stats"><div><span>Progresso do percurso</span><strong>3 de 5 etapas</strong></div><div className="progress-track"><div className="progress-fill teal-fill" style={{ width: "62%" }} /></div><div className="stat-split"><span>Última atualização</span><strong>há 2 dias</strong></div></div>
        <div className="focus-footer"><div className="avatar-stack"><div className="avatar avatar-blue">PR</div><div className="avatar avatar-teal">AEE</div><div className="avatar avatar-amber">EQ</div><span>3 contribuições</span></div><button className="text-button" onClick={() => go("estudo")}>Abrir caso <ArrowUpRight size={15} /></button></div>
      </section>
      <section className="principle-card"><div className="principle-icon"><Quote size={21} /></div><p className="label-caps">PRINCÍPIO CENTRAL</p><blockquote>“Qual é a barreira que este material impõe a este estudante?”</blockquote><p>Antes de adaptar, compreenda o acesso. A habilidade da turma continua sendo o ponto de partida.</p><button className="link-button" onClick={() => go("planejamento")}>Ver análise de barreira <ArrowRight size={15} /></button></section>
    </div>
    <div className="section-heading section-heading-modules"><div><p className="eyebrow">PERCURSO DO CASO</p><h2>Onde a equipe está trabalhando</h2></div><button className="button button-ghost" onClick={() => go("meus-casos")}>Ver todos os casos <ArrowRight size={15} /></button></div>
    <FlowRail current={2} />
    <div className="module-grid">{modules.map((module) => { const Icon = module.icon; return <button className="module-card" key={module.key} onClick={() => go(module.key as ViewKey)}><div className="module-card-top"><div className={cx("module-icon", `module-${module.tone}`)}><Icon size={20} /></div><ArrowUpRight size={17} className="module-arrow" /></div><h3>{module.title}</h3><p>{module.description}</p><div className="module-card-bottom"><StatusPill tone={module.tone === "teal" ? "teal" : module.tone === "amber" ? "amber" : module.tone === "coral" ? "coral" : "neutral"}>{module.status}</StatusPill><span className="module-progress">{module.progress}%</span></div><div className="progress-track"><div className={cx("progress-fill", `${module.tone}-fill`)} style={{ width: `${module.progress}%` }} /></div></button>; })}</div>
    <div className="bottom-grid"><section className="recent-card"><div className="card-title-row"><div><p className="eyebrow">ATIVIDADE RECENTE</p><h2>Últimas movimentações</h2></div><button className="icon-button" disabled aria-label="Filtrar · em breve"><Filter size={17} /></button></div><div className="timeline"><div className="timeline-item"><div className="timeline-icon teal-icon"><CheckCircle2 size={16} /></div><div><strong>Barreiras revisadas pela equipe</strong><span>Estudo de Caso · há 2 dias</span></div><span className="timeline-time">14:32</span></div><div className="timeline-item"><div className="timeline-icon blue-icon"><PencilLine size={16} /></div><div><strong>Contribuição adicionada ao PAEE</strong><span>Profissional do AEE · há 3 dias</span></div><span className="timeline-time">09:18</span></div><div className="timeline-item"><div className="timeline-icon amber-icon"><Info size={16} /></div><div><strong>Ponto marcado para validação</strong><span>PEI · há 4 dias</span></div><span className="timeline-time">16:05</span></div></div></section><section className="next-card"><div className="next-card-header"><div className="next-icon"><Target size={19} /></div><div><p className="eyebrow">PRÓXIMO PASSO SUGERIDO</p><h2>Registrar a habilidade da turma</h2></div></div><p>O CRMG ainda não está integrado. Use o campo demonstrativo para documentar a análise sem criar uma habilidade curricular.</p><div className="next-alert"><AlertCircle size={16} /><span>{curricularCopy}</span></div><button className="button button-primary button-full" onClick={() => go("planejamento")}>Continuar planejamento <ArrowRight size={16} /></button></section></div>
  </>;
}

function StudyCase() {
  const [note, setNote] = useState("Observações da equipe sobre participação em situações de resolução de problemas:\n\nO estudante demonstra interesse por desafios e costuma explicar oralmente como pensou. Em atividades com enunciado extenso, inicia a tarefa depois de observar um exemplo ou receber o texto segmentado. Responde melhor quando pode usar um esquema visual e quando sabe quais etapas precisa percorrer.");
  const [activeTab, setActiveTab] = useState("organizado");
  const studyTabs = ["organizado", "texto", "contribuicoes"];
  const focusStudyTab = (index: number) => {
    const nextIndex = (index + studyTabs.length) % studyTabs.length;
    setActiveTab(studyTabs[nextIndex]);
    document.getElementById(`study-tab-${studyTabs[nextIndex]}`)?.focus();
  };
  const handleStudyTabKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") { event.preventDefault(); focusStudyTab(index + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); focusStudyTab(index - 1); }
    if (event.key === "Home") { event.preventDefault(); focusStudyTab(0); }
    if (event.key === "End") { event.preventDefault(); focusStudyTab(studyTabs.length - 1); }
  };
  return <>
    <SectionHeading eyebrow="01 / CONSTRUÇÃO COLABORATIVA" title="Estudo de Caso" description="Organize o que a equipe já conhece. O aplicativo não diagnostica o estudante nem substitui a escuta profissional." action={<StatusPill tone="blue">{fictionalLabel}</StatusPill>} />
    <DemoBanner />
    <div className="case-header-card"><div className="case-header-main"><div className="big-case-avatar">F1</div><div><span className="label-caps">IDENTIFICAÇÃO DEMONSTRATIVA</span><h2>Estudante F-01</h2><p>Turma de referência: exemplo de anos iniciais · sem dados reais</p></div></div><div className="case-header-meta"><div><span>Colaboração</span><strong>3 profissionais</strong></div><div><span>Última revisão</span><strong>22 set. 2026</strong></div></div></div>
    <div className="tab-bar" role="tablist" aria-label="Seções do estudo de caso">{studyTabs.map((tab, index) => <button key={tab} id={`study-tab-${tab}`} type="button" role="tab" aria-selected={activeTab === tab} aria-controls="study-panel" tabIndex={activeTab === tab ? 0 : -1} className={cx(activeTab === tab && "tab-active")} onClick={() => setActiveTab(tab)} onKeyDown={(event) => handleStudyTabKey(event, index)}>{tab === "organizado" ? "Visão organizada" : tab === "texto" ? "Texto de origem" : <>Contribuições <span className="tab-count">3</span></>}</button>)}</div>
    {activeTab === "organizado" && <div id="study-panel" role="tabpanel" aria-labelledby={`study-tab-${activeTab}`} tabIndex={0} className="case-layout"><div className="case-content"><div className="content-title-row"><div><p className="eyebrow">LEITURA E ORGANIZAÇÃO</p><h2>O que a equipe já observou</h2></div><button className="button button-secondary" disabled><Sparkles size={16} /> Organizar demonstração · em breve</button></div><div className="field-grid">{caseFields.map((field) => <div className="info-field" key={field.label}><div className="info-field-label"><span>{field.label}</span>{field.label.includes("Família") ? <StatusPill>pendente</StatusPill> : <CheckCircle2 size={15} className="field-check" />}</div><p>{field.value}</p></div>)}</div></div><aside className="case-side-panel"><div className="side-panel-title"><div className="mini-icon violet-icon"><Users size={17} /></div><div><span className="label-caps">PARTICIPAÇÃO</span><h3>Quem contribuiu</h3></div></div><div className="contributor"><div className="avatar avatar-blue">PR</div><div><strong>Professor regente</strong><span>6 contribuições</span></div><CheckCircle2 size={15} /></div><div className="contributor"><div className="avatar avatar-teal">AEE</div><div><strong>Profissional do AEE</strong><span>4 contribuições</span></div><CheckCircle2 size={15} /></div><div className="contributor"><div className="avatar avatar-amber">EQ</div><div><strong>Equipe escolar</strong><span>2 contribuições</span></div><Clock3 size={15} /></div><div className="side-panel-note"><Info size={15} /><span>As contribuições permanecem separadas até a validação da equipe.</span></div></aside></div>}
    {activeTab === "texto" && <div id="study-panel" role="tabpanel" aria-labelledby={`study-tab-${activeTab}`} tabIndex={0} className="source-text-card"><div className="content-title-row"><div><p className="eyebrow">REGISTRO DE ORIGEM</p><h2>Texto digitado pela equipe</h2></div><StatusPill tone="neutral">Somente nesta sessão</StatusPill></div><label className="field-label" htmlFor="case-note">Cole ou digite o Estudo de Caso</label><textarea id="case-note" className="large-textarea" value={note} onChange={(event) => setNote(event.target.value)} /><div className="source-text-footer"><TrainingNotice /></div></div>}
    {activeTab === "contribuicoes" && <div id="study-panel" role="tabpanel" aria-labelledby={`study-tab-${activeTab}`} tabIndex={0} className="contrib-grid">{["Professor regente", "Profissional do AEE", "Equipe escolar"].map((name, index) => <div className="contrib-card" key={name}><div className="contrib-card-header"><div className={cx("avatar", index === 0 ? "avatar-blue" : index === 1 ? "avatar-teal" : "avatar-amber")}>{index === 0 ? "PR" : index === 1 ? "AEE" : "EQ"}</div><div><strong>{name}</strong><span>{index === 0 ? "Atualizado hoje" : index === 1 ? "Atualizado há 2 dias" : "Pendente de revisão"}</span></div></div><p>{index === 2 ? "INFORMAÇÃO A SER LEVANTADA PELA EQUIPE." : "A equipe registra que o estudante participa mais quando a instrução é previsível, visual e pode ser retomada sem exposição."}</p><StatusPill tone={index === 2 ? "amber" : "teal"}>{index === 2 ? "Aguardando" : "Recebido"}</StatusPill></div>)}</div>}
  </>;
}

function Paee() {
  const [section, setSection] = useState(0);
  const [validated, setValidated] = useState<Record<number, boolean>>({});
  const [contributions, setContributions] = useState<Record<number, { aee: string; regent: string; team: string; validated: string }>>({
    0: { aee: "Registrar contexto, frequência e situações em que a barreira se apresenta.", regent: "", team: "", validated: "" },
  });
  const current = contributions[section] ?? { aee: "", regent: "", team: "", validated: "" };
  const update = (field: keyof typeof current, value: string) => setContributions((previous) => ({
    ...previous,
    [section]: { ...(previous[section] ?? { aee: "", regent: "", team: "", validated: "" }), [field]: value },
  }));
  const markValidated = () => setValidated((previous) => ({ ...previous, [section]: true }));
  return <>
    <SectionHeading eyebrow="02 / CONSTRUÇÃO COLABORATIVA" title="PAEE — Plano de Atendimento Educacional Especializado" description="O PAEE é o documento que faz o registro do estudo de caso (Portaria MEC nº 421/2026, art. 10)." action={<StatusPill tone="teal">{fictionalLabel}</StatusPill>} />
    <DemoBanner />
    <div className="notice-strip"><Info size={17} /><span><strong>PROPOSTA PARA ANÁLISE DA EQUIPE.</strong> Nenhuma sugestão deve ser convertida automaticamente em decisão pedagógica.</span></div>
    <div className="paee-layout">
      <div className="section-list">
        {paeeSections.map((item, index) => <button key={item.title} className={cx("section-list-item", section === index && "section-list-active")} onClick={() => setSection(index)}><span className="section-number">0{index + 1}</span><span>{item.title}</span><ChevronRight size={16} /></button>)}
        <div className="section-list-footer"><ClipboardCheck size={17} /><span>5 blocos independentes</span></div>
      </div>
      <div className="paee-main">
        <div className="paee-title-row"><div><p className="eyebrow">BLOCO 0{section + 1}</p><h2>{paeeSections[section].title}</h2></div><StatusPill tone="amber">Proposta</StatusPill></div>
        <div className="suggestion-card"><div className="suggestion-label"><div className="ai-spark"><Sparkles size={15} /></div><span>SUGESTÃO ILUSTRATIVA · EXEMPLO FIXO</span></div><p>{paeeSections[section].system}</p><div className="suggestion-hint"><Info size={15} /><span>{paeeSections[section].hint}</span></div></div>
        <div className="contribution-form-grid">
          <div className="contribution-form"><label htmlFor={`aee-contribution-${section}`}>Contribuição do professor do AEE</label><textarea id={`aee-contribution-${section}`} value={current.aee} onChange={(event) => update("aee", event.target.value)} placeholder="Escreva a contribuição profissional..." /><TrainingNotice /></div>
          <div className="contribution-form"><label htmlFor={`regent-contribution-${section}`}>Contribuição do regente</label><textarea id={`regent-contribution-${section}`} value={current.regent} onChange={(event) => update("regent", event.target.value)} placeholder="Como isso se articula ao planejamento da sala comum?" /><TrainingNotice /></div>
          <div className="contribution-form"><label htmlFor={`team-contribution-${section}`}>Contribuição da equipe</label><textarea id={`team-contribution-${section}`} value={current.team} onChange={(event) => update("team", event.target.value)} placeholder="Inclua família, coordenação ou outros profissionais..." /><TrainingNotice /></div>
          <div className="validated-form"><div className="validated-header"><label htmlFor={`validated-version-${section}`}>Versão validada</label><StatusPill tone={validated[section] ? "teal" : "amber"}>{validated[section] ? "Marcada nesta sessão" : "Pendente"}</StatusPill></div><textarea id={`validated-version-${section}`} value={current.validated} onChange={(event) => update("validated", event.target.value)} placeholder="A versão validada só deve ser preenchida após discussão da equipe." /><TrainingNotice /></div>
        </div>
        <div className="paee-footer"><button className={cx("button", validated[section] ? "button-saved" : "button-primary")} onClick={markValidated}>{validated[section] ? <Check size={16} /> : <ClipboardCheck size={16} />}{validated[section] ? "Marcada nesta sessão" : "Marcar para discussão"}</button><TrainingNotice /></div>
      </div>
    </div>
  </>;
}
function Pei() {
  const [showContributors, setShowContributors] = useState(true);
  const [objectives, setObjectives] = useState([true, false, false]);
  return <>
    <SectionHeading eyebrow="03 / PLANEJAMENTO ARTICULADO" title="PEI — Plano Educacional Individualizado" description="O PEI é o documento que contempla o plano de acessibilização curricular (Portaria MEC nº 421/2026, art. 11). Inclui as atividades do AEE e sua articulação com o professor regente; as medidas de acessibilidade curricular, didático-pedagógica e avaliativa, quando indicadas pelo estudo de caso; as estratégias de acompanhamento e monitoramento; e o registro das devolutivas às famílias." action={<StatusPill tone="amber">Rascunho colaborativo</StatusPill>} />
    <DemoBanner compact />
    <div className="pei-meta-row"><div className="pei-meta-card"><span className="label-caps">CASO</span><strong>Estudante F-01</strong><span>Exemplo demonstrativo</span></div><div className="pei-meta-card"><span className="label-caps">PERÍODO DE ACOMPANHAMENTO</span><strong>Definir com a equipe</strong><span>Campo sem data real</span></div><div className="pei-meta-card"><span className="label-caps">PARTICIPAÇÃO</span><strong>3 profissionais</strong><span>Contribuições separadas</span></div></div>
    <div className="pei-toolbar"><div><p className="eyebrow">MATRIZ COLABORATIVA</p><h2>Plano pedagógico em construção</h2></div><button className="button button-ghost" onClick={() => setShowContributors(!showContributors)}><Users size={16} /> {showContributors ? "Ocultar contribuições" : "Mostrar contribuições"}</button></div>
    <div className="pei-table">{peiRows.map(([label, value, contributor]) => <div className="pei-row" key={label}><div className="pei-label">{label}</div><div className="pei-value"><p>{value}</p><span className="pei-edit"><PencilLine size={14} /> Campo demonstrativo · edição futura</span></div>{showContributors && <div className="pei-contributor"><div className="avatar avatar-small avatar-blue">{contributor.includes("AEE") ? "A" : contributor.includes("equipe") ? "E" : "R"}</div><span>{contributor}</span></div>}</div>)}</div>
    <div className="two-col-cards"><div className="review-card"><div className="card-title-row"><div><p className="eyebrow">ACOMPANHAMENTO</p><h2>Objetivos intermediários</h2></div><button className="icon-button" disabled aria-label="Adicionar objetivo · em breve"><Plus size={17} /></button></div>{["Usa o quadro de etapas com menor mediação", "Explica a estratégia escolhida", "Escolhe uma forma de resposta adequada"].map((objective, index) => <label className="check-row" key={objective}><input type="checkbox" checked={objectives[index]} onChange={() => setObjectives((previous) => previous.map((checked, itemIndex) => itemIndex === index ? !checked : checked))} /><span>{objective}</span><StatusPill tone={objectives[index] ? "teal" : "neutral"}>{objectives[index] ? "Em observação" : "Não iniciado"}</StatusPill></label>)}</div><div className="review-card review-card-accent"><div className="next-icon"><Clock3 size={18} /></div><div><p className="eyebrow">REVISÃO</p><h2>Momento a definir</h2><p>O critério e a data de revisão precisam ser combinados pela equipe responsável.</p><span className="link-button disabled-link">Adicionar combinado · em breve <ArrowRight size={15} /></span></div></div></div>
    <TrainingNotice />
  </>;
}
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange?: (value: string) => void }) {
  return <label className="select-field"><span>{label}{onChange ? "" : " · em breve"}</span><select disabled={!onChange} value={value} onChange={(event) => onChange?.(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={15} /></label>;
}

function Planning() {
  const [decision, setDecision] = useState("acessibilidade");
  const [registered, setRegistered] = useState(false);
  const [stage, setStage] = useState("Anos iniciais · exemplo");
  return <>
    <SectionHeading eyebrow="04 / PRÁTICA PEDAGÓGICA" title="Planejamento e flexibilização" description="A decisão começa pela barreira: só depois de verificar os apoios é que a equipe avalia recomposição ou flexibilização." action={<StatusPill tone="violet">Análise guiada</StatusPill>} />
    <DemoBanner compact />
    <div className="decision-quote"><div className="decision-quote-icon"><Quote size={20} /></div><div><strong>Habilidade da turma → Barreira identificada → Potencialidades → Acessibilidade / apoios</strong><span>Verificar se a habilidade pode ser mantida antes de avaliar recomposição ou flexibilização.</span></div></div>
    <div className="planning-filters"><SelectField label="Etapa" value={stage} onChange={setStage} options={["Anos iniciais · exemplo", "Anos finais · exemplo", "Educação infantil · exemplo"]} /><SelectField label="Ano" value="Ano fictício" options={["Ano fictício", "Outro ano fictício"]} /><SelectField label="Componente curricular" value="Matemática · exemplo" options={["Matemática · exemplo", "Língua Portuguesa · exemplo", "Ciências · exemplo"]} /><SelectField label="Unidade temática" value="Situações-problema · exemplo" options={["Situações-problema · exemplo", "Grandezas · exemplo"]} /></div>
    <div className="curricular-placeholder"><div className="placeholder-icon"><BookOpen size={20} /></div><div><span className="label-caps">HABILIDADE DA TURMA</span><h3>{curricularCopy}</h3><p>A arquitetura está pronta para receber o CRMG após importação e conferência de fonte oficial.</p></div><button className="button button-ghost" disabled>Selecionar no CRMG · em breve <ArrowUpRight size={15} /></button></div>
    <div className="planning-workspace"><div className="decision-panel"><div className="card-title-row"><div><p className="eyebrow">REGRA DE DECISÃO</p><h2>Qual é a hipótese de trabalho?</h2></div><Info size={18} /></div><p className="panel-intro">Escolha uma hipótese apenas para organizar a conversa da equipe. O protótipo não recomenda uma decisão final.</p>{[{ id: "acessibilidade", title: "Acessibilidade", copy: "A habilidade pode ser mantida; a barreira está no acesso, na apresentação ou na forma de resposta.", badge: "MANTER A HABILIDADE" }, { id: "recomposicao", title: "Recomposição", copy: "Faltam aprendizagens anteriores necessárias; documente a habilidade de suporte e como avançar.", badge: "HABILIDADE DE SUPORTE" }, { id: "flexibilizacao", title: "Flexibilização individualizada", copy: "Considerar somente quando as informações pedagógicas justificarem, com vínculo curricular e revisão.", badge: "JUSTIFICATIVA NECESSÁRIA" }].map((item) => <button className={cx("decision-option", decision === item.id && "decision-option-active")} onClick={() => { setDecision(item.id); setRegistered(false); }} key={item.id}><div className="radio-dot">{decision === item.id && <div />}</div><div><strong>{item.title}</strong><p>{item.copy}</p><span>{item.badge}</span></div></button>)}</div><div className="analysis-panel"><div className="analysis-header"><div><p className="eyebrow">ANÁLISE EM CONSTRUÇÃO</p><h2>{decision === "acessibilidade" ? "Acesso antes de reduzir" : decision === "recomposicao" ? "Construir a ponte" : "Documentar a excepcionalidade"}</h2></div><StatusPill tone={decision === "acessibilidade" ? "teal" : "amber"}>{decision === "acessibilidade" ? "Manter habilidade" : "Exige justificativa"}</StatusPill></div><div className="analysis-list"><div><span>Potencialidades relacionadas</span><p>Interesse por situações-problema, boa memória visual e explicação oral de estratégias.</p></div><div><span>Barreira</span><p>Leitura de enunciados extensos e organização de múltiplas informações.</p></div><div><span>Recursos necessários</span><p>Segmentação, destaque de dados, apoio visual, leitura mediada e tempo para organizar a resposta.</p></div><div><span>Forma de resposta</span><p>Registro escrito segmentado, esquema visual ou explicação oral mediada.</p></div><div><span>{decision === "acessibilidade" ? "Proposta de apoio" : decision === "recomposicao" ? "Habilidade de suporte" : "Objetivo individualizado"}</span><p>{decision === "acessibilidade" ? "Manter a habilidade da turma e modificar apenas acesso, mediação e expressão." : decision === "recomposicao" ? "INFORMAÇÃO A SER LEVANTADA PELA EQUIPE." : "INFORMAÇÃO A SER JUSTIFICADA E VALIDADA PELA EQUIPE."}</p></div></div><div className="analysis-footer"><div className="next-alert"><AlertCircle size={16} /><span>{decision === "acessibilidade" ? "Acessibilidade não é sinônimo de conteúdo mais fácil." : "Esta hipótese requer registro pedagógico, vínculo curricular e revisão."}</span></div><button className={cx("button", registered ? "button-saved" : "button-primary")} onClick={() => setRegistered(true)}>{registered ? <Check size={16} /> : <ClipboardCheck size={16} />}{registered ? "Análise registrada" : "Registrar para discussão"}</button></div></div></div>
    <div className="planning-footer-note"><Info size={15} /><span>{stage} · Seletores e habilidades são dados demonstrativos, sem vínculo com o currículo oficial.</span></div>
  </>;
}

function AdaptActivity() {
  return <>
    <SectionHeading eyebrow="05 / PRÁTICA PEDAGÓGICA" title="Exemplo comentado de adaptação" description="Percorra um caso fictício e discuta como uma barreira pode ser reduzida sem alterar automaticamente a habilidade da turma." action={<StatusPill tone="coral">Formação · exemplo fixo</StatusPill>} />
    <DemoBanner />
    <div className="adapt-filters"><SelectField label="Caso fictício" value="Estudante F-01" options={["Estudante F-01"]} /><SelectField label="Documento articulado" value="PEI · rascunho" options={["PEI · rascunho", "PAEE · proposta"]} /><SelectField label="Ano" value="Ano fictício" options={["Ano fictício"]} /><SelectField label="Componente" value="Matemática · exemplo" options={["Matemática · exemplo"]} /></div>
    <div className="notice-strip"><Info size={17} /><span><strong>EXEMPLO FIXO — NÃO É GERADO A PARTIR DE TEXTO INSERIDO.</strong> Use esta tela para discutir a rastreabilidade pedagógica durante a formação.</span></div>
    <div className="adapt-result"><div className="result-column"><div className="result-head"><div className="result-number">01</div><div><p className="eyebrow">ORIGINAL DO CASO</p><h2>Atividade original</h2></div></div><div className="result-paper"><p>Leia o problema e responda: uma escola recebeu 248 livros para distribuir igualmente entre 8 turmas. Quantos livros cada turma receberá? Explique como você descobriu a resposta e registre os cálculos necessários.</p></div></div><div className="result-divider"><ArrowRight size={19} /></div><div className="result-column result-column-highlight"><div className="result-head"><div className="result-number result-number-teal">02</div><div><p className="eyebrow">EXEMPLO COMENTADO</p><h2>Versão acessível</h2></div><StatusPill tone="teal">Para discutir</StatusPill></div><div className="result-paper result-paper-highlight"><p><strong>Resolva a situação-problema.</strong></p><p>Uma escola recebeu <mark>248 livros</mark> para distribuir igualmente entre <mark>8 turmas</mark>.</p><ol><li>Descubra quantos livros cada turma receberá.</li><li>Use um esquema, cálculo ou explique oralmente como pensou.</li><li>Registre sua resposta.</li></ol></div><div className="response-options"><span>FORMAS DE RESPOSTA</span><div><StatusPill tone="teal">Cálculo</StatusPill><StatusPill tone="teal">Esquema visual</StatusPill><StatusPill tone="teal">Oral mediada</StatusPill></div></div></div></div>
    <div className="adapt-explanation"><div className="explanation-header"><div className="mini-icon teal-icon"><Accessibility size={17} /></div><div><p className="eyebrow">RASTREABILIDADE DA DECISÃO</p><h2>Como discutir este exemplo?</h2></div></div><div className="explanation-grid"><div><span>Qual barreira foi identificada</span><p>Enunciado extenso e muitas instruções em sequência podem dificultar a organização da leitura.</p></div><div><span>O que foi alterado</span><p>Texto segmentado, informações relevantes destacadas, instruções numeradas e forma de resposta ampliada.</p></div><div><span>Por que foi alterado</span><p>Para ampliar o acesso e a expressão sem mudar o objeto matemático da situação.</p></div><div><span>Qual habilidade foi mantida</span><p>{curricularCopy}</p></div><div><span>Qual recurso foi utilizado</span><p>Segmentação, destaque visual, apoio de esquema e leitura mediada.</p></div><div><span>Como avaliar</span><p>Observar a compreensão da situação, a estratégia e a resposta; validar critérios com o regente.</p></div></div><div className="validation-bar"><AlertCircle size={17} /><strong>Discussão necessária:</strong><span>este exemplo não é uma adaptação automática e não deve ser usado como registro de estudante.</span></div></div>
    <TrainingNotice />
  </>;
}
function Curriculum() {
  const [sourceOpen, setSourceOpen] = useState(false);
  return <>
    <SectionHeading eyebrow="06 / REFERÊNCIAS" title="Currículo / CRMG" description="Estrutura preparada para receber dados oficiais após importação, conferência de fonte e versionamento." action={<StatusPill tone="amber">Conteúdo não integrado</StatusPill>} />
    <div className="warning-card"><div className="warning-card-icon"><AlertCircle size={19} /></div><div><strong>Nenhuma habilidade oficial foi preenchida nesta Fase 1.</strong><p>O protótipo não inventa códigos, redações ou relações curriculares. Campos demonstrativos são marcados de forma explícita.</p></div><button className="button button-ghost" onClick={() => setSourceOpen(!sourceOpen)}>{sourceOpen ? "Fechar" : "Ver estrutura"} <ArrowRight size={15} /></button></div>
    <div className="curriculum-toolbar"><div className="search-field" aria-label="Busca curricular indisponível"><Search size={17} /><input placeholder="Buscar por código ou habilidade · em breve" disabled /><span>Em breve</span></div><button className="button button-ghost" disabled><Filter size={16} /> Filtros · em breve</button><button className="button button-secondary" disabled><ArrowUpRight size={16} /> Ver fonte oficial · em breve</button></div>
    {sourceOpen && <div className="source-structure"><div className="structure-header"><div><p className="eyebrow">ARQUITETURA DE DADOS</p><h2>Campos preparados para o CRMG</h2></div><StatusPill tone="blue">Importação futura</StatusPill></div><div className="structure-grid">{["Etapa", "Ano", "Componente", "Unidade temática", "Objeto de conhecimento", "Código", "Habilidade", "Habilidade anterior relacionada", "Habilidade posterior relacionada", "Fonte", "Versão"].map((field) => <div className="structure-field" key={field}><span>{field}</span><strong>{field === "Fonte" || field === "Versão" ? "A preencher na importação" : "—"}</strong></div>)}</div><div className="structure-footer"><Info size={15} /><span>O botão “Ver fonte oficial” será conectado somente após a definição da fonte e da versão a conferir.</span></div></div>}
    <div className="curriculum-selectors"><SelectField label="Etapa" value="Todos · vazio" options={["Todos · vazio", "Anos iniciais · exemplo"]} /><SelectField label="Ano" value="Todos · vazio" options={["Todos · vazio", "Ano fictício"]} /><SelectField label="Componente" value="Todos · vazio" options={["Todos · vazio", "Matemática · exemplo"]} /><SelectField label="Unidade temática" value="Todos · vazio" options={["Todos · vazio", "Exemplo demonstrativo"]} /></div>
    <div className="curriculum-empty"><div className="empty-book"><BookOpen size={26} /></div><h2>Banco curricular aguardando fonte</h2><p>{curricularCopy}</p><span>Quando o CRMG oficial for importado, os registros poderão ser consultados e vinculados aos planejamentos.</span></div>
    <div className="future-grid"><div><div className="future-icon"><Network size={18} /></div><h3>Relacionamentos curriculares</h3><p>Habilidade anterior e posterior serão campos da base, não inferências automáticas.</p></div><div><div className="future-icon"><FileText size={18} /></div><h3>Fonte e versão</h3><p>Cada registro deverá manter a origem e a data de conferência.</p></div><div><div className="future-icon"><ShieldCheck size={18} /></div><h3>Validação de conteúdo</h3><p>Importação oficial e revisão por responsável antes de uso pedagógico.</p></div></div>
  </>;
}

function LegalBase() {
  const [openGroup, setOpenGroup] = useState(0);
  const [selected, setSelected] = useState("LDB — Lei nº 9.394/1996");
  return <>
    <SectionHeading eyebrow="07 / REFERÊNCIAS" title="Base legal" description="Catálogo estrutural para consulta futura. Nesta Fase 1, nenhum artigo é redigido de memória." action={<StatusPill tone="amber">Conferência pendente</StatusPill>} />
    <div className="legal-disclaimer"><ShieldCheck size={19} /><div><strong>Use a fonte oficial antes de citar qualquer norma.</strong><p>Os nomes abaixo seguem o escopo do protótipo. A redação vigente, artigos, parágrafos, incisos e links deverão ser conferidos e inseridos em etapa própria.</p></div></div>
    <div className="legal-layout"><div className="legal-groups">{legalGroups.map((group, index) => <div className={cx("legal-group", openGroup === index && "legal-group-open")} key={group.title}><button onClick={() => setOpenGroup(openGroup === index ? -1 : index)}><div><span>{group.title}</span><small>{group.count} entradas estruturais</small></div><ChevronDown size={17} /></button>{openGroup === index && <div className="legal-entries">{group.entries.map((entry) => <button className={cx(selected === entry && "legal-entry-active")} key={entry} onClick={() => setSelected(entry)}><span>{entry}</span><ChevronRight size={14} /></button>)}</div>}</div>)}</div><div className="legal-detail"><div className="legal-detail-header"><div className="legal-file-icon"><FileText size={20} /></div><div><p className="eyebrow">REGISTRO ESTRUTURAL</p><h2>{selected}</h2></div><StatusPill tone="amber">A conferir</StatusPill></div><div className="official-copy-box"><AlertCircle size={18} /><div><strong>{officialCopy}</strong><p>Não há texto normativo preenchido neste protótipo.</p></div></div><div className="legal-fields">{["Norma", "Artigo", "Parágrafo", "Inciso", "Redação vigente", "Norma alteradora", "Link oficial", "Data da conferência"].map((field) => <div className="legal-field" key={field}><span>{field}</span><strong>{field === "Norma" ? selected : officialCopy}</strong></div>)}</div><button className="button button-secondary button-full" disabled><ArrowUpRight size={16} /> Ver fonte oficial · em breve</button><div className="legal-note"><Info size={15} /> Transtornos de aprendizagem possuem área própria e não são classificados automaticamente como público da Educação Especial.</div></div></div>
  </>;
}

function MyCases({ go }: { go: (view: ViewKey) => void }) {
  return <>
    <SectionHeading eyebrow="08 / GESTÃO" title="Meus casos" description="Apenas casos fictícios estão disponíveis neste protótipo. Autenticação, permissões e dados reais entram em fase futura." action={<button className="button button-primary" disabled><Plus size={16} /> Criar caso fictício · em breve</button>} />
    <div className="privacy-banner"><div className="privacy-big-icon"><ShieldCheck size={22} /></div><div><strong>Ambiente seguro para prototipagem</strong><p>Não insira nomes, documentos, diagnósticos ou qualquer dado de estudante real. Este protótipo não possui autenticação ou controle de acesso.</p></div><StatusPill tone="teal">Somente demonstração</StatusPill></div>
    <div className="cases-toolbar"><div className="search-field"><Search size={17} /><input placeholder="Busca de casos · em breve" disabled /></div><button className="button button-ghost" disabled><Filter size={16} /> Filtrar · em breve</button></div>
    <div className="case-list-card"><div className="case-list-header"><span>Caso</span><span>Etapa atual</span><span>Contribuições</span><span>Atualizado</span><span /></div><button className="case-list-row" onClick={() => go("estudo")}><div className="case-list-name"><div className="big-case-avatar big-case-avatar-small">F1</div><div><strong>Estudante F-01</strong><span>{fictionalLabel}</span></div></div><div><StatusPill tone="teal">PEI em construção</StatusPill></div><div className="case-contribs"><div className="avatar-stack"><div className="avatar avatar-blue">PR</div><div className="avatar avatar-teal">A</div><div className="avatar avatar-amber">E</div></div><span>3</span></div><div className="case-updated">22 set. 2026</div><ArrowUpRight size={17} /></button></div>
    <div className="future-security-grid"><div><ShieldCheck size={19} /><div><h3>Perfis e permissões</h3><p>Professor do AEE, regente, especialista, gestão e administrador.</p></div><StatusPill>Fase 5</StatusPill></div><div><Network size={19} /><div><h3>Histórico colaborativo</h3><p>Registro de acessos e alterações por estudante autorizado.</p></div><StatusPill>Fase 5</StatusPill></div><div><FolderOpen size={19} /><div><h3>Proteção documental</h3><p>Minimização, exclusão e proteção de documentos.</p></div><StatusPill>Fase 5</StatusPill></div></div>
  </>;
}

function Home() {
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentView = useMemo<ViewKey>(() => {
    const path = location.replace(/^\//, "").split("/")[0] as ViewKey;
    return navItems.some((item) => item.key === path) ? path : "inicio";
  }, [location]);
  const go = (view: ViewKey) => { navigate(view === "inicio" ? "/" : `/${view}`); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const title = navItems.find((item) => item.key === currentView)?.label ?? "Visão geral";
  return <div className="app-shell"><a className="skip-link" href="#main-content">Pular para o conteúdo</a><div className={cx("mobile-overlay", sidebarOpen && "mobile-overlay-visible")} onClick={() => setSidebarOpen(false)} /><div className={cx("sidebar-wrap", sidebarOpen && "sidebar-wrap-open")}><Sidebar view={currentView} onClose={() => setSidebarOpen(false)} /></div><main id="main-content" className="main-area"><Topbar title={title} onMenu={() => setSidebarOpen(true)} /><div className="page-content">{currentView === "inicio" && <Overview go={go} />}{currentView === "estudo" && <StudyCase />}{currentView === "paee" && <Paee />}{currentView === "pei" && <Pei />}{currentView === "pdi" && <PdiModule />}{currentView === "planejamento" && <Planning />}{currentView === "adaptar" && <AdaptActivity />}{currentView === "curriculo" && <Curriculum />}{currentView === "base-legal" && <LegalBase />}{currentView === "meus-casos" && <MyCases go={go} />}</div><footer className="app-footer"><span>Guia Inclusivo 2026 · Simulador de formação</span><span>Planejamento pedagógico com validação profissional</span></footer></main></div>;
}

export default Home;
