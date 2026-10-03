import { useRef, useState, type KeyboardEvent } from "react";
import { AlertCircle, BookOpenCheck, CheckCircle2, ClipboardList, Info, ShieldCheck } from "lucide-react";

const steps = [
  { label: "Histórico de vida do estudante", responsible: "Especialista da Educação Básica, com a família" },
  { label: "Avaliação pedagógica diagnóstica", responsible: "Professor regente, professor do AEE e professor ACLTA" },
  { label: "Planejamento (bimestral)", responsible: "Professor regente de cada componente" },
  { label: "Acompanhamento", responsible: "Professor regente, com ACLTA e AEE" },
  { label: "Avaliação final", responsible: "Equipe, articulada pelo Especialista" },
];

const historySections = [
  { title: "I. Dados institucionais", fields: ["Data da elaboração", "SRE", "Escola", "Código", "Endereço", "Etapas ofertadas", "Acessibilidade física", "Sala de Recursos", "Diretor(a)", "Vice-diretor(a)", "Responsáveis pela elaboração"] },
  { title: "II. Dados do(a) estudante", fields: ["Nome", "Idade", "Ano de escolaridade", "Deficiência informada", "Acompanhamento profissional externo", "Uso contínuo de medicamento", "Necessidade específica", "Tipo de atendimento", "Recurso de acessibilidade utilizado", "Como gosta de se divertir"] },
  { title: "III. Considerações da família", fields: ["Considerações da família"] },
  { title: "IV. Histórico de escolarização", fields: ["Histórico de escolarização"] },
  { title: "V. Limites e agressividade", fields: ["Observações"] },
];

const diagnosticGroups = [
  { title: "Aspectos psicomotores", items: ["Esquema corporal", "Consciência corporal", "Expressão corporal", "Imagem corporal", "Tônus", "Coordenação motora ampla", "Coordenação motora fina", "Equilíbrio dinâmico", "Equilíbrio estático", "Lateralidade", "Percepções (gustativa, olfativa, tátil, visual)", "Postura"] },
  { title: "Aspectos cognitivos", items: ["Memória", "Percepção", "Atenção", "Raciocínio lógico", "Pensamento"] },
  { title: "Comunicação e linguagem", items: ["Intenção comunicativa", "Usos da comunicação", "Recursos de comunicação alternativa", "Formas de expressão", "Escrita", "Leitura"] },
];

const options = ["apresenta", "apresenta com ajuda", "não apresenta", "não observado"];
const fictionalSummary = {
  "Potencialidades.": "Curiosidade e envolvimento quando compreende o que será feito e a atividade tem sequência organizada. Boa memória visual; usa imagens, esquemas, exemplos e modelos para compreender e organizar informações. Interesse por jogos de estratégia, desafios com regras claras, situações concretas e recursos digitais. Expressa oralmente ideias, preferências e conhecimentos quando tem tempo para organizar a resposta. Participa melhor em conversas mediadas, duplas e pequenos grupos com papéis definidos.",
  "Matemática.": "Compreende os conceitos trabalhados pela turma quando acessa adequadamente a situação. A barreira aparece em enunciados longos, com informações secundárias ou muitos estímulos visuais. Com enunciado segmentado, dados destacados, checagem de compreensão e possibilidade de usar desenho, esquema, material concreto ou explicação oral, realiza o raciocínio esperado.",
  "Língua Portuguesa.": "Com adaptações, lê textos curtos, localiza informações explícitas, responde perguntas objetivas e produz frases simples a partir de imagens, banco de palavras ou modelo. Mesmo com antecipação da tarefa, sequência de imagens, organização oral das ideias, banco de palavras, modelo de texto, frases iniciadoras e mediação do professor, ainda não produz de forma autônoma um texto curto em sequência lógica. Registra frases isoladas e pouco conectadas e depende do adulto para ordenar começo, desenvolvimento e encerramento. A dificuldade permanece mesmo quando as barreiras de apresentação da atividade são reduzidas.",
  "Comunicação, participação e autonomia.": "Comunica necessidades e preferências oralmente; em situações muito abertas, precisa de perguntas mais objetivas. Realiza tarefas conhecidas com boa autonomia quando compreende objetivo e sequência. Em tarefas novas, beneficia-se de divisão em partes, roteiro visual, exemplo inicial e checagem de compreensão.",
};

function slug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function PdiField({ label, value, onChange, multiline = false, placeholder = "[INFORMAÇÃO A SER LEVANTADA PELA EQUIPE]" }: { label: string; value?: string; onChange?: (value: string) => void; multiline?: boolean; placeholder?: string }) {
  const id = `pdi-${slug(label)}`;
  return <div className="pdi-field"><label htmlFor={id}>{label}</label>{multiline ? <textarea id={id} value={value ?? ""} readOnly={!onChange} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} /> : <input id={id} value={value ?? ""} readOnly={!onChange} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} />}</div>;
}

function PlanningCase({ language }: { language: boolean }) {
  const languageRow = {
    content: "Produção de narrativas ficcionais",
    classSkill: "EF35LP25 – Criar narrativas ficcionais, com certa autonomia, utilizando detalhes descritivos, sequências de eventos e imagens apropriadas para sustentar o sentido do texto, e marcadores de tempo, espaço e de fala de personagens.",
    pdiSkill: "EF12LP05 – Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, (re)contagens de histórias, poemas e outros textos versificados (letras de canção, quadrinhas, cordel), poemas visuais, tiras e histórias em quadrinhos, dentre outros gêneros do campo artístico-literário, considerando a situação comunicativa e a finalidade do texto.",
    adaptation: "Sequência de imagens; organização oral das ideias antes da escrita; banco de palavras; modelo de texto; frases iniciadoras; mediação do professor.",
  };
  const mathRow = {
    content: "Divisão – repartição equitativa",
    classSkill: "EF04MA07 – Resolver e elaborar problemas de divisão cujo divisor tenha no máximo dois algarismos, envolvendo os significados de repartição equitativa e de medida, utilizando estratégias diversas, como cálculo por estimativa, cálculo mental e algoritmos.",
    pdiSkill: "Mantém a habilidade da turma",
    adaptation: "Enunciado segmentado; dados destacados; checagem de compreensão; resposta por cálculo, desenho, esquema, material concreto ou explicação oral. Exemplo: o problema já existente dos 248 livros para 8 turmas.",
  };
  const row = language ? languageRow : mathRow;
  return <section className="pdi-component-case" aria-labelledby={language ? "pdi-language-title" : "pdi-math-title"}>
    <div className="pdi-component-heading"><div><span className="pdi-overline">COMPONENTE</span><h3 id={language ? "pdi-language-title" : "pdi-math-title"}>{language ? "Língua Portuguesa" : "Matemática"}</h3></div><span className="pdi-session-label">Caso fictício · uso formativo</span></div>
    <div className="pdi-table-scroll"><table className="pdi-plan-table"><thead><tr><th scope="col">CONTEÚDO</th><th scope="col">HABILIDADES DA TURMA</th><th scope="col">HABILIDADES FLEXIBILIZADAS – PDI</th><th scope="col">ADAPTAÇÃO DE MATERIAIS E METODOLOGIAS</th></tr></thead><tbody><tr><td>{row.content}</td><td>{row.classSkill}</td><td>{row.pdiSkill}</td><td>{row.adaptation}</td></tr></tbody></table></div>
    {language ? <div className="pdi-justification"><AlertCircle size={17} /><p>Mesmo com os apoios de acesso, o estudante ainda não produz de forma autônoma um texto curto em sequência lógica. A habilidade intermediária foi selecionada pedagogicamente neste PDI, a partir da avaliação do estudante. Ela não é uma versão simplificada oficial da habilidade da turma.</p></div> : <div className="pdi-justification pdi-justification-access"><CheckCircle2 size={17} /><p>Retiradas as barreiras de acesso, o estudante realiza o raciocínio esperado. Mantém-se a habilidade da turma; mudam as condições de acesso, mediação e expressão.</p></div>}
  </section>;
}

export default function PdiModule() {
  const [activeStep, setActiveStep] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const setDraft = (key: string, value: string) => setDrafts((previous) => ({ ...previous, [key]: value }));
  const moveStep = (index: number) => { const next = (index + steps.length) % steps.length; setActiveStep(next); tabsRef.current[next]?.focus(); };
  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") { event.preventDefault(); moveStep(index + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); moveStep(index - 1); }
    if (event.key === "Home") { event.preventDefault(); moveStep(0); }
    if (event.key === "End") { event.preventDefault(); moveStep(steps.length - 1); }
  };
  return <>
    <header className="pdi-page-heading"><div><p className="eyebrow">REFERÊNCIA DA REDE ESTADUAL DE MINAS GERAIS</p><h1>PDI — Plano de Desenvolvimento Individual</h1><p className="section-description">Resolução SEE/MG nº 4.256/2020</p></div><span className="pdi-formative-badge"><ShieldCheck size={16} /> CASO FICTÍCIO PARA FORMAÇÃO</span></header>
    <div className="demo-banner" role="note"><div className="demo-icon"><ShieldCheck size={17} /></div><div><strong>FERRAMENTA DE FORMAÇÃO</strong><span>Ferramenta de formação: nada do que você escreve é salvo ou enviado.</span></div></div>
    <div className="pdi-document-note"><Info size={18} /><p>O PDI é o documento utilizado na rede estadual de Minas Gerais. PAEE e PEI são os documentos previstos na política nacional. Nesta formação, os três aparecem para que a escola compreenda a relação entre eles.</p></div>
    <div className="pdi-student-summary"><div><span>IDADE</span><strong>9 anos</strong></div><div><span>ANO</span><strong>4º ano do Ensino Fundamental</strong></div><div><span>CONDIÇÃO INFORMADA</span><strong>TEA</strong></div><div><span>ATENDIMENTOS</span><strong>AEE e professor ACLTA</strong></div></div>
    <div className="pdi-steps" role="tablist" aria-label="Etapas do PDI">{steps.map((step, index) => <button key={step.label} ref={(element) => { tabsRef.current[index] = element; }} id={`pdi-tab-${index + 1}`} type="button" role="tab" aria-selected={activeStep === index} aria-controls="pdi-panel" tabIndex={activeStep === index ? 0 : -1} className={activeStep === index ? "pdi-step pdi-step-active" : "pdi-step"} onClick={() => setActiveStep(index)} onKeyDown={(event) => handleTabKey(event, index)}><span className="pdi-step-number">0{index + 1}</span><span className="pdi-step-name">{step.label}</span></button>)}</div>
    <section id="pdi-panel" role="tabpanel" aria-labelledby={`pdi-tab-${activeStep + 1}`} tabIndex={0} className="pdi-panel">
      <div className="pdi-panel-heading"><div><p className="eyebrow">ETAPA {activeStep + 1} DE 5</p><h2>{steps[activeStep].label}</h2></div><div className="pdi-responsible"><span>RESPONSÁVEL</span><strong>{steps[activeStep].responsible}</strong></div></div>
      {activeStep === 0 && <div className="pdi-history">{historySections.map((section) => <section className="pdi-form-section" key={section.title}><h3>{section.title}</h3><div className="pdi-fields-grid">{section.fields.map((field) => {
        const fixed: Record<string, string> = { Idade: "9 anos", "Ano de escolaridade": "4º ano do Ensino Fundamental", "Deficiência informada": "TEA", "Tipo de atendimento": "AEE e professor ACLTA" };
        if (field === "Observações") return <div className="pdi-field pdi-field-wide" key={field}><label htmlFor="pdi-limits">Descreva a situação</label><textarea id="pdi-limits" value={drafts["Observações"] ?? ""} onChange={(event) => setDraft("Observações", event.target.value)} placeholder="[INFORMAÇÃO A SER LEVANTADA PELA EQUIPE]" /><span className="pdi-field-help">Descreva a situação, o contexto e o que ajudou, sem adjetivar o estudante.</span></div>;
        return <PdiField key={field} label={field} value={fixed[field] ?? drafts[field] ?? ""} onChange={fixed[field] ? undefined : (value) => setDraft(field, value)} multiline={field === "Considerações da família" || field === "Histórico de escolarização"} />;
      })}</div></section>)}</div>}
      {activeStep === 1 && <><p className="pdi-intro">Para o caso fictício, os itens abaixo permanecem sem marcação.</p>{diagnosticGroups.map((group) => <fieldset className="pdi-checklist-group" key={group.title}><legend>{group.title}</legend><div className="pdi-checklist">{group.items.map((item) => <fieldset className="pdi-checklist-item" key={item}><legend>{item}</legend><div>{options.map((option) => { const key = `diagnostico-${group.title}-${item}`; return <label key={option}><input type="radio" name={key} value={option} checked={drafts[key] === option} onChange={() => setDraft(key, option)} /><span>{option}</span></label>; })}</div></fieldset>)}</div></fieldset>)}<section className="pdi-synthesis"><div className="pdi-section-title"><BookOpenCheck size={19} /><h3>Síntese da avaliação (caso fictício)</h3></div>{Object.entries(fictionalSummary).map(([title, text]) => <div className="pdi-summary-item" key={title}><h4>{title}</h4><p>{text}</p></div>)}</section></>}
      {activeStep === 2 && <><div className="pdi-head-fields">{[["Estudante", "9 anos · 4º ano do Ensino Fundamental"], ["Turma", "4º ano do Ensino Fundamental"], ["Componente", "Preenchido por componente abaixo"], ["Professor(a)", ""], ["Bimestre", ""], ["Objetivo geral para a turma", ""], ["Objetivo geral para o(a) estudante", ""]].map(([label, fixed]) => <PdiField key={label} label={label} value={fixed || drafts[label] || ""} onChange={fixed ? undefined : (value) => setDraft(label, value)} multiline={label.startsWith("Objetivo")} />)}</div><div className="pdi-concept-contrast"><div><strong>O QUE se pretende desenvolver</strong><p>Flexibilizar a habilidade muda O QUE se pretende desenvolver.</p></div><div><strong>COMO o estudante acessa, participa e responde</strong><p>Adaptar materiais e metodologias muda COMO o estudante acessa, participa e responde.</p></div></div><div className="pdi-decision-question"><Info size={18} /><strong>A dificuldade permanece mesmo depois de reduzidas as barreiras de acesso? Quais apoios já foram usados?</strong></div><PlanningCase language={true} /><PlanningCase language={false} /><div className="pdi-aclta-field"><PdiField label="Contribuições/observações do ACLTA em articulação com o professor regente" value={drafts.aclta ?? ""} onChange={(value) => setDraft("aclta", value)} multiline placeholder="Registre observações sobre participação, acesso, resposta às estratégias e necessidades percebidas." /><p>Registre observações sobre participação, acesso, resposta às estratégias e necessidades percebidas. A definição ou alteração das habilidades curriculares cabe ao professor regente, em articulação com a equipe pedagógica e conforme o PDI.</p></div><p className="pdi-content-note">Os textos da coluna CONTEÚDO identificam o conteúdo do caso. Não são códigos nem habilidades curriculares.</p><p className="pdi-source-note">Textos conferidos na BNCC. Validação final pendente no CRMG – versão atualizada de maio de 2026.</p><p className="pdi-prototype-note">O planejamento bimestral é o formato adotado neste protótipo.</p><div className="pdi-principle"><strong>Barreira de acesso não é sinônimo de flexibilização curricular. Antes de flexibilizar, pergunte se a dificuldade permanece depois que as barreiras de acesso foram reduzidas.</strong></div></>}
      {activeStep === 3 && <><div className="pdi-table-scroll"><table className="pdi-review-table"><thead><tr>{["bimestre", "valor", "nota alcançada", "grau de autonomia", "metodologia utilizada", "diagnóstico pedagógico na habilidade"].map((label) => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody><tr><td><input aria-label="bimestre" value={drafts.bimestre ?? ""} onChange={(event) => setDraft("bimestre", event.target.value)} /></td><td><input aria-label="valor" value={drafts.valor ?? ""} onChange={(event) => setDraft("valor", event.target.value)} /></td><td><input aria-label="nota alcançada" value={drafts.nota ?? ""} onChange={(event) => setDraft("nota", event.target.value)} /></td><td><label className="pdi-exclusive-label">Campo exclusivo do professor</label><select aria-label="grau de autonomia" value={drafts.autonomia ?? ""} onChange={(event) => setDraft("autonomia", event.target.value)}><option value=""></option>{["muito suporte", "pouco suporte", "alta compreensão", "pouca compreensão"].map((option) => <option key={option}>{option}</option>)}</select></td><td><textarea aria-label="metodologia utilizada" value={drafts.metodologia ?? ""} onChange={(event) => setDraft("metodologia", event.target.value)} /></td><td><label className="pdi-exclusive-label">Campo exclusivo do professor</label><textarea aria-label="diagnóstico pedagógico na habilidade" value={drafts.diagnostico ?? ""} onChange={(event) => setDraft("diagnostico", event.target.value)} /></td></tr></tbody></table></div><TrainingNotice /></>}
      {activeStep === 4 && <div className="pdi-final-report"><label htmlFor="pdi-report">Relatório pedagógico</label><p>Lembrete: aspectos cognitivos, sociais, comunicacionais e motores.</p><span className="pdi-exclusive-label">Campo exclusivo do professor · até uma lauda</span><textarea id="pdi-report" value={drafts.relatorio ?? ""} onChange={(event) => setDraft("relatorio", event.target.value)} placeholder="[INFORMAÇÃO A SER LEVANTADA PELA EQUIPE]" /><TrainingNotice /></div>}
    </section>
    <nav className="pdi-step-navigation" aria-label="Navegação entre etapas"><button type="button" className="button button-ghost" onClick={() => setActiveStep((step) => Math.max(0, step - 1))} disabled={activeStep === 0}>Etapa anterior</button><span>Etapa {activeStep + 1} de 5 · somente nesta sessão</span><button type="button" className="button button-primary" onClick={() => setActiveStep((step) => Math.min(4, step + 1))} disabled={activeStep === 4}>Próxima etapa</button></nav>
    <div className="pdi-privacy"><ClipboardList size={16} /> Ferramenta de formação: nada do que você escreve é salvo ou enviado.</div>
  </>;
}

function TrainingNotice() { return <span className="training-notice">Ferramenta de formação: nada do que você escreve é salvo ou enviado.</span>; }
