'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';

const USUARIOS_FUNIL = [
  { label: 'Todos', id: '' },
  { label: 'Fabíola', id: '3a297d14-abfb-43be-8db9-58a181e5d8cd' },
  { label: 'Robson', id: '25f8302c-cd3f-42bf-be73-f1af714c92cd' },
  { label: 'Vinicius', id: '84a3feea-1f99-48a9-82b8-e0a8540be503' },
];

interface MetricsData {
  periodo: { inicio: string; fim: string };
  periodoAnterior: { inicio: string; fim: string };
  novosLeads: { total: number; serie: Array<{ date: string; value: number }>; delta: number | null; erro: boolean };
  ligacoes: {
    tentativas: number; conexoes: number; hitRate: number;
    porUsuario: Array<{ nome: string; tentativas: number; conexoes: number }>;
    delta: number | null; erro: boolean;
  };
  qualificadosRobson: { total: number; delta: number | null; erro: boolean };
  leadsQualificados: { total: number; delta: number | null; erro: boolean };
  leadsTrafegoPago: { total: number; delta: number | null; erro: boolean };
  leadsTrafegoPagoQualificado: { total: number; delta: number | null; erro: boolean };
  propostas: { total: number; porUsuario: Array<{ nome: string; quantidade: number }>; delta: number | null; erro: boolean };
  conversao: {
    taxa: { valor: number; delta: number | null; erro: boolean };
    ciclo: { valor: number; delta: number | null; erro: boolean };
    perdidos: { value: number; delta: number | null; erro: boolean };
  };
  funilConversao: { etapas: Array<{ name: string; value: number }>; erro: boolean };
  diagnostico: {
    motivoPerda: { items: Array<{ name: string; value: number }>; erro: boolean };
    tempoEtapa: { etapas: Array<{ nome: string; tempo: number }>; erro: boolean };
  };
  desempenho: {
    taxaPorUsuario: { usuarios: Array<{ nome: string; taxa: number }>; erro: boolean };
    conversaoPorOrigem: { origens: Array<{ nome: string; taxa: number }>; erro: boolean };
  };
  vendas: { quantidade: number; valorTotal: number; serie: Array<{ date: string; value: number }>; delta: number | null; erro: boolean };
}

function toYMD(d: Date) { return d.toISOString().split('T')[0]; }

export default function Home() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeQuick, setActiveQuick] = useState<number | null>(null);
  const [funnelUserId, setFunnelUserId] = useState('');

  const fetchMetrics = async (start = '', end = '', userId = funnelUserId) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (start) params.append('start', start);
      if (end) params.append('end', end);
      if (userId) params.append('funnel_user_id', userId);
      const response = await fetch(`/api/metrics?${params}`);
      setMetrics(await response.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMetrics(); }, []);

  const handleWeekNav = (offset: number) => {
    if (!metrics) return;
    setActiveQuick(null);
    const s = new Date(metrics.periodo.inicio + 'T12:00:00');
    s.setDate(s.getDate() + offset * 7);
    const e = new Date(s);
    e.setDate(e.getDate() + 6);
    fetchMetrics(toYMD(s), toYMD(e));
  };

  const handleQuick = (days: number) => {
    setActiveQuick(days);
    const e = new Date(); e.setDate(e.getDate() - 1);
    const s = new Date(e); s.setDate(s.getDate() - days + 1);
    fetchMetrics(toYMD(s), toYMD(e));
  };

  const handleCustomDate = () => {
    if (startDate && endDate) { setActiveQuick(null); fetchMetrics(startDate, endDate); }
  };

  const handleFunnelUser = (userId: string) => {
    setFunnelUserId(userId);
    if (metrics) fetchMetrics(metrics.periodo.inicio, metrics.periodo.fim, userId);
  };

  const fmtDate = (s: string) => {
    const [y, m, d] = s.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <p className={styles.eyebrow}>Dias Gomes Advocacia · Painel Comercial</p>
          <div className={styles.dateControls}>
            {/* Atalhos rápidos */}
            <div className={styles.quickButtons}>
              {[7, 15, 30].map(d => (
                <button key={d} onClick={() => handleQuick(d)}
                  className={`${styles.quickBtn} ${activeQuick === d ? styles.quickBtnActive : ''}`}>
                  {d}d
                </button>
              ))}
            </div>
            <div className={styles.dateSeparator} />
            {/* Navegação semanal */}
            <button onClick={() => handleWeekNav(-1)} className={styles.navButton} aria-label="Semana anterior">←</button>
            <span className={styles.dateRange}>
              {metrics ? `${fmtDate(metrics.periodo.inicio)} → ${fmtDate(metrics.periodo.fim)}` : '–'}
            </span>
            <button onClick={() => handleWeekNav(1)} className={styles.navButton} aria-label="Próxima semana">→</button>
            <div className={styles.dateSeparator} />
            {/* Intervalo customizado */}
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={styles.dateInput} />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={styles.dateInput} />
            <button onClick={handleCustomDate} className={styles.customButton}>Buscar</button>
          </div>
        </div>
        <h1 className={styles.title}>Relatório da Semana</h1>
        {metrics && (
          <p className={styles.periodoAnteriorLabel}>
            Comparando com {fmtDate(metrics.periodoAnterior.inicio)} → {fmtDate(metrics.periodoAnterior.fim)}
          </p>
        )}
        <div className={styles.divider} />
      </header>

      <main className={styles.main}>
        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : metrics ? (
          <>
            {/* KPIs */}
            <div className={styles.grid}>
              <MetricCard label="Novas Conversas" value={metrics.novosLeads.total}
                delta={metrics.novosLeads.delta} erro={metrics.novosLeads.erro}
                sparkline={metrics.novosLeads.serie} />
              <LigacoesCard ligacoes={metrics.ligacoes} />
              <MetricCard label="Direcionamento Robson" value={metrics.qualificadosRobson.total}
                delta={metrics.qualificadosRobson.delta} erro={metrics.qualificadosRobson.erro} />
              <MetricCard label="Leads Qualificados" value={metrics.leadsQualificados.total}
                delta={metrics.leadsQualificados.delta} erro={metrics.leadsQualificados.erro} />
              <MetricCard label="Leads Tráfego Pago" value={metrics.leadsTrafegoPago.total}
                delta={metrics.leadsTrafegoPago.delta} erro={metrics.leadsTrafegoPago.erro} />
              <MetricCard label="Tráfego Pago Qualificado" value={metrics.leadsTrafegoPagoQualificado.total}
                delta={metrics.leadsTrafegoPagoQualificado.delta} erro={metrics.leadsTrafegoPagoQualificado.erro} />
              <PropostasCard propostas={metrics.propostas} />
              <VendasCard vendas={metrics.vendas} />
            </div>

            {/* Conversão */}
            <Section title="Conversão">
              <div className={styles.grid3}>
                <SmallCard label="Taxa de conversão" value={metrics.conversao.taxa.valor}
                  unit="%" delta={metrics.conversao.taxa.delta} erro={metrics.conversao.taxa.erro} />
                <SmallCard label="Ciclo médio de venda" value={metrics.conversao.ciclo.valor}
                  unit="dias" delta={metrics.conversao.ciclo.delta} erro={metrics.conversao.ciclo.erro} />
                <SmallCard label="Total de perdidos" value={metrics.conversao.perdidos.value}
                  delta={metrics.conversao.perdidos.delta} erro={metrics.conversao.perdidos.erro}
                  deltaInvert />
              </div>
            </Section>

            {/* Vendas por Dia */}
            <Section title="Vendas por Dia">
              {metrics.vendas.erro
                ? <div className={styles.errorMessage}>Erro ao carregar gráfico</div>
                : <VendasChart serie={metrics.vendas.serie} />}
            </Section>

            {/* Funil */}
            <Section title="Funil de Conversão"
              action={
                <div className={styles.funnelUserFilter}>
                  {USUARIOS_FUNIL.map(u => (
                    <button key={u.id} onClick={() => handleFunnelUser(u.id)}
                      className={`${styles.funnelUserBtn} ${funnelUserId === u.id ? styles.funnelUserBtnActive : ''}`}>
                      {u.label}
                    </button>
                  ))}
                </div>
              }>
              {metrics.funilConversao.erro
                ? <div className={styles.errorMessage}>Erro ao carregar funil</div>
                : <Funnel data={metrics.funilConversao.etapas} />}
            </Section>

            {/* Diagnóstico */}
            <Section title="Diagnóstico">
              <div className={styles.twoColumns}>
                <div>
                  <h3 className={styles.subsectionTitle}>Motivo de perda</h3>
                  {metrics.diagnostico.motivoPerda.erro
                    ? <div className={styles.errorMessage}>Erro ao carregar</div>
                    : <DonutChart data={metrics.diagnostico.motivoPerda.items} />}
                </div>
                <div>
                  <h3 className={styles.subsectionTitle}>Tempo médio em cada etapa</h3>
                  {metrics.diagnostico.tempoEtapa.erro
                    ? <div className={styles.errorMessage}>Erro ao carregar</div>
                    : <BarChart data={metrics.diagnostico.tempoEtapa.etapas} />}
                </div>
              </div>
            </Section>

            {/* Desempenho */}
            <Section title="Desempenho">
              <div className={styles.twoColumns}>
                <div>
                  <h3 className={styles.subsectionTitle}>Taxa de conversão por usuário</h3>
                  {metrics.desempenho.taxaPorUsuario.erro
                    ? <div className={styles.errorMessage}>Erro ao carregar</div>
                    : <SimpleTable data={metrics.desempenho.taxaPorUsuario.usuarios} />}
                </div>
                <div>
                  <h3 className={styles.subsectionTitle}>Conversão por origem</h3>
                  {metrics.desempenho.conversaoPorOrigem.erro
                    ? <div className={styles.errorMessage}>Erro ao carregar</div>
                    : <SimpleTable data={metrics.desempenho.conversaoPorOrigem.origens} />}
                </div>
              </div>
            </Section>
          </>
        ) : (
          <div className={styles.error}>Erro ao carregar dados</div>
        )}
      </main>
    </div>
  );
}

// Components
// ── Delta Badge ──────────────────────────────────────────────
function DeltaBadge({ delta, invert = false }: { delta: number | null; invert?: boolean }) {
  if (delta === null) return null;
  const positive = invert ? delta < 0 : delta > 0;
  const cls = positive ? styles.deltaUp : styles.deltaDown;
  const arrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '→';
  return (
    <span className={`${styles.delta} ${cls}`}>
      {arrow} {Math.abs(delta).toFixed(1)}%
    </span>
  );
}

interface MetricCardProps {
  label: string;
  value: number;
  secondary?: string;
  tertiary?: string;
  split?: string;
  delta?: number | null;
  erro: boolean;
  sparkline?: Array<{ date: string; value: number }>;
}

function MetricCard({ label, value, secondary, tertiary, split, delta, erro, sparkline }: MetricCardProps) {
  return (
    <div className={`${styles.card} ${erro ? styles.cardError : ''}`}>
      <p className={styles.cardLabel}>{label}</p>
      {erro ? (
        <div className={styles.errorMessage}>Erro ao carregar dados</div>
      ) : (
        <>
          <div className={styles.cardContent}>
            <p className={styles.cardValue}>{value.toLocaleString('pt-BR')}</p>
            {sparkline && sparkline.length > 0 && <Sparkline data={sparkline} />}
          </div>
          {delta !== undefined && <DeltaBadge delta={delta ?? null} />}
          {secondary && <p className={styles.cardSecondary}>{secondary}</p>}
          {tertiary && <p className={styles.cardTertiary}>{tertiary}</p>}
          {split && <p className={styles.cardSplit}>{split}</p>}
        </>
      )}
    </div>
  );
}

interface SmallCardProps {
  label: string;
  value: number;
  unit?: string;
  delta?: number | null;
  deltaInvert?: boolean;
  erro: boolean;
}

function SmallCard({ label, value, unit, delta, deltaInvert, erro }: SmallCardProps) {
  return (
    <div className={`${styles.smallCard} ${erro ? styles.cardError : ''}`}>
      <p className={styles.cardLabel}>{label}</p>
      {erro ? (
        <div className={styles.errorMessage}>Erro</div>
      ) : (
        <>
          <p className={styles.smallCardValue}>
            {value.toLocaleString('pt-BR')}
            {unit && <span className={styles.unit}>{unit}</span>}
          </p>
          {delta !== undefined && <DeltaBadge delta={delta ?? null} invert={deltaInvert} />}
        </>
      )}
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

function Section({ title, children, action }: SectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionTitle}>{title}</p>
        {action && <div>{action}</div>}
      </div>
      {children}
    </section>
  );
}

interface SparklineProps {
  data: Array<{ date: string; value: number }>;
}

function Sparkline({ data }: SparklineProps) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  return (
    <svg className={styles.sparkline} viewBox={`0 0 ${data.length * 10} 30`}>
      {data.map((point, i) => {
        const x = i * 10 + 5;
        const normalized = (point.value - minValue) / range;
        const y = 25 - normalized * 20;
        return (
          <circle key={i} cx={x} cy={y} r="1.5" fill="var(--gold)" />
        );
      })}
    </svg>
  );
}

// Ordem canônica do funil — etapas que não aparecem nos dados são omitidas
const FUNIL_ORDER = [
  'captação e direcionamento',
  'atendimento inicial e qualificação',
  'qualificação humana',
  'qualificação humana pela sdr',
  'direcionamento robson',
  'oferta e apresentação dos escopos',
  'ligar para clientes',
  'follow up',
  'follow-up',
  'agendamento de call com especialista',
  'no show',
  'em negociação',
  'venda realizada',
];

const FUNIL_COLORS = [
  '#7B5EA7', '#5E81B5', '#4A9D8F', '#5BAD72',
  '#A8C05A', '#D4A843', '#D4843A', '#C9634A',
  '#B04A6A', '#8B3A8A', '#C9A96E', '#3D2B1F',
  '#1A1A1A',
];

const FUNIL_EMOJIS: Record<string, string> = {
  'captação': '🎯',
  'atendimento': '👋',
  'qualificação': '🔍',
  'direcionamento': '➡️',
  'oferta': '📋',
  'ligar': '📞',
  'follow': '🔄',
  'agendamento': '📅',
  'no show': '❌',
  'negociação': '🤝',
  'venda': '🏆',
};

function getEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(FUNIL_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return '•';
}

interface FunnelProps {
  data: Array<{ name: string; value: number }>;
}

function Funnel({ data }: FunnelProps) {
  if (data.length === 0) return <p>Sem dados</p>;

  // Ordena conforme a ordem canônica
  const sorted = [...data].sort((a, b) => {
    const ai = FUNIL_ORDER.findIndex(o => a.name.trim().toLowerCase().includes(o) || o.includes(a.name.trim().toLowerCase()));
    const bi = FUNIL_ORDER.findIndex(o => b.name.trim().toLowerCase().includes(o) || o.includes(b.name.trim().toLowerCase()));
    const aIdx = ai === -1 ? 999 : ai;
    const bIdx = bi === -1 ? 999 : bi;
    return aIdx - bIdx;
  });

  const maxValue = sorted[0]?.value || 1;
  const firstValue = sorted[0]?.value || 1;

  return (
    <div className={styles.funnel}>
      {sorted.map((item, i) => {
        const pct = Math.max((item.value / maxValue) * 100, 8);
        const convPct = ((item.value / firstValue) * 100).toFixed(0);
        const color = FUNIL_COLORS[i % FUNIL_COLORS.length];
        const emoji = getEmoji(item.name);
        const isLast = item.name.toLowerCase().includes('venda');

        return (
          <div key={i} className={styles.funnelStep} style={{ '--pct': `${pct}%`, '--color': color } as React.CSSProperties}>
            <div className={styles.funnelStepInner} style={{ width: `${pct}%`, background: color }}>
              <span className={styles.funnelEmoji}>{emoji}</span>
              <span className={styles.funnelStepName}>{item.name.trim()}</span>
              <span className={styles.funnelStepValue}>{item.value.toLocaleString('pt-BR')}</span>
            </div>
            <span className={`${styles.funnelPct} ${isLast ? styles.funnelPctWin : ''}`}>
              {convPct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Gráfico de área — vendas por dia
interface VendasChartProps {
  serie: Array<{ date: string; value: number }>;
}

function VendasChart({ serie }: VendasChartProps) {
  if (serie.length === 0) return (
    <div className={styles.chartEmpty}>Sem vendas registradas no período</div>
  );

  const W = 800;
  const H = 200;
  const PAD = { top: 20, right: 24, bottom: 40, left: 80 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  // Valor em centavos → reais
  const pontos = serie.map(d => ({ date: d.date, value: d.value / 100 }));
  const maxVal = Math.max(...pontos.map(p => p.value), 1);
  const n = pontos.length;

  const x = (i: number) => PAD.left + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v: number) => PAD.top + innerH - (v / maxVal) * innerH;

  const linePath = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p.value)}`).join(' ');
  const areaPath = `${linePath} L ${x(n - 1)} ${PAD.top + innerH} L ${x(0)} ${PAD.top + innerH} Z`;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const formatBRL = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

  return (
    <div className={styles.vendasChartWrap}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.vendasChart}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#C9A96E" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* Grid horizontal */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const yy = PAD.top + innerH - t * innerH;
          return (
            <g key={i}>
              <line x1={PAD.left} x2={PAD.left + innerW} y1={yy} y2={yy}
                stroke="#E3D4B4" strokeWidth="1" strokeDasharray="4 4" />
              <text x={PAD.left - 8} y={yy + 4} textAnchor="end"
                fill="#3D2B1F" fontSize="10" fontFamily="Inter, sans-serif">
                {formatBRL(maxVal * t)}
              </text>
            </g>
          );
        })}

        {/* Área preenchida */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Linha */}
        <path d={linePath} fill="none" stroke="#C9A96E" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Pontos e labels */}
        {pontos.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.value)} r="5" fill="#C9A96E" stroke="#FBF8F3" strokeWidth="2" />
            <text x={x(i)} y={y(p.value) - 10} textAnchor="middle"
              fill="#1A1A1A" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600">
              {formatBRL(p.value)}
            </text>
            {/* Label eixo X */}
            <text x={x(i)} y={PAD.top + innerH + 18} textAnchor="middle"
              fill="#3D2B1F" fontSize="11" fontFamily="Inter, sans-serif">
              {formatDate(p.date)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

interface VendasCardProps {
  vendas: {
    quantidade: number;
    valorTotal: number;
    serie: Array<{ date: string; value: number }>;
    delta: number | null;
    erro: boolean;
  };
}

function VendasCard({ vendas }: VendasCardProps) {
  const valorFormatado = vendas.valorTotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

  return (
    <div className={`${styles.card} ${vendas.erro ? styles.cardError : ''}`}>
      <p className={styles.cardLabel}>Vendas</p>
      {vendas.erro ? (
        <div className={styles.errorMessage}>Erro ao carregar dados</div>
      ) : (
        <>
          <div className={styles.cardContent}>
            <p className={styles.cardValue}>{vendas.quantidade.toLocaleString('pt-BR')}</p>
            {vendas.serie.length > 0 && <Sparkline data={vendas.serie} />}
          </div>
          <DeltaBadge delta={vendas.delta} />
          <p className={styles.cardSecondary}>{valorFormatado}</p>
          <p className={styles.cardTertiary}>valor total no período</p>
        </>
      )}
    </div>
  );
}

interface PropostasCardProps {
  propostas: {
    total: number;
    porUsuario: Array<{ nome: string; quantidade: number }>;
    delta: number | null;
    erro: boolean;
  };
}

function PropostasCard({ propostas }: PropostasCardProps) {
  return (
    <div className={`${styles.card} ${propostas.erro ? styles.cardError : ''}`}>
      <p className={styles.cardLabel}>Em Oferta / Proposta</p>
      {propostas.erro ? (
        <div className={styles.errorMessage}>Erro ao carregar dados</div>
      ) : (
        <>
          <div className={styles.cardContent}>
            <p className={styles.cardValue}>{propostas.total.toLocaleString('pt-BR')}</p>
          </div>
          <DeltaBadge delta={propostas.delta} />
          {propostas.porUsuario.length > 0 && (
            <div className={styles.ligacoesBreakdown}>
              {propostas.porUsuario.map((u, i) => (
                <div key={i} className={styles.ligacoesRow}>
                  <span className={styles.ligacoesNome}>{u.nome.split(' ')[0]}</span>
                  <span className={styles.ligacoesNumero}>{u.quantidade} {u.quantidade === 1 ? 'proposta' : 'propostas'}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface LigacoesCardProps {
  ligacoes: {
    tentativas: number;
    conexoes: number;
    hitRate: number;
    porUsuario: Array<{ nome: string; tentativas: number; conexoes: number }>;
    delta: number | null;
    erro: boolean;
  };
}

function LigacoesCard({ ligacoes }: LigacoesCardProps) {
  return (
    <div className={`${styles.card} ${ligacoes.erro ? styles.cardError : ''}`}>
      <p className={styles.cardLabel}>Ligações</p>
      {ligacoes.erro ? (
        <div className={styles.errorMessage}>Erro ao carregar dados</div>
      ) : (
        <>
          <div className={styles.cardContent}>
            <p className={styles.cardValue}>{ligacoes.tentativas.toLocaleString('pt-BR')}</p>
          </div>
          <DeltaBadge delta={ligacoes.delta} />
          <p className={styles.cardSecondary}>{ligacoes.conexoes} conexões · {ligacoes.hitRate.toFixed(1)}% hit rate</p>
          {ligacoes.porUsuario.length > 0 && (
            <div className={styles.ligacoesBreakdown}>
              {ligacoes.porUsuario.map((u, i) => (
                <div key={i} className={styles.ligacoesRow}>
                  <span className={styles.ligacoesNome}>{u.nome.trim().split(' ')[0]}</span>
                  <span className={styles.ligacoesNumero}>{u.tentativas} tentativas</span>
                  <span className={styles.ligacoesConexoes}>{u.conexoes} conexões</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface DonutChartProps {
  data: Array<{ name: string; value: number }>;
}

function DonutChart({ data }: DonutChartProps) {
  if (data.length === 0) return <p>Sem dados</p>;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90; // começa no topo
  const slices = data.map((item) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += sliceAngle;
    return { ...item, startAngle, sliceAngle };
  });

  const colors = ['#C9A96E', '#E3D4B4', '#3D2B1F', '#A0826D', '#D4AF8F'];

  const handleMouseMove = (e: React.MouseEvent<SVGPathElement>, i: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHoveredIndex(i);
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className={styles.donutContainer}>
      <div className={styles.donutTotal}>
        <span className={styles.donutTotalLabel}>Total de perdas</span>
        <span className={styles.donutTotalValue}>{total.toLocaleString('pt-BR')}</span>
      </div>
      <div className={styles.donutWrapper}>
        <svg
          ref={svgRef}
          viewBox="0 0 200 200"
          className={styles.donutChart}
          onMouseLeave={() => { setHoveredIndex(null); setTooltip(null); }}
        >
          {slices.map((slice, i) => {
            const startRad = (slice.startAngle * Math.PI) / 180;
            const endRad = ((slice.startAngle + slice.sliceAngle) * Math.PI) / 180;
            const x1 = 100 + 60 * Math.cos(startRad);
            const y1 = 100 + 60 * Math.sin(startRad);
            const x2 = 100 + 60 * Math.cos(endRad);
            const y2 = 100 + 60 * Math.sin(endRad);
            const largeArc = slice.sliceAngle > 180 ? 1 : 0;
            const isHovered = hoveredIndex === i;

            return (
              <path
                key={i}
                d={`M 100 100 L ${x1} ${y1} A 60 60 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={colors[i % colors.length]}
                stroke="var(--card-bg)"
                strokeWidth="2"
                opacity={hoveredIndex !== null && !isHovered ? 0.6 : 1}
                style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
                onMouseMove={(e) => handleMouseMove(e, i)}
              />
            );
          })}
          {/* buraco do donut */}
          <circle cx="100" cy="100" r="32" fill="var(--card-bg)" />
        </svg>

        {/* Tooltip */}
        {tooltip && hoveredIndex !== null && (
          <div
            className={styles.donutTooltip}
            style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
          >
            <span className={styles.donutTooltipName}>{slices[hoveredIndex].name}</span>
            <span className={styles.donutTooltipValue}>
              {slices[hoveredIndex].value.toLocaleString('pt-BR')} casos
            </span>
            <span className={styles.donutTooltipPct}>
              {((slices[hoveredIndex].value / total) * 100).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      <div className={styles.donutLegend}>
        {slices.map((item, i) => (
          <div
            key={i}
            className={`${styles.legendItem} ${hoveredIndex === i ? styles.legendItemActive : ''}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span
              className={styles.legendColor}
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            <span className={styles.legendName}>{item.name}</span>
            <span className={styles.legendValue}>{item.value.toLocaleString('pt-BR')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface BarChartProps {
  data: Array<{ nome: string; tempo: number }>;
}

function BarChart({ data }: BarChartProps) {
  if (data.length === 0) return <p>Sem dados</p>;

  const maxTempo = Math.max(...data.map((d) => d.tempo));

  return (
    <div className={styles.barChart}>
      {data.map((item, i) => {
        const width = (item.tempo / maxTempo) * 100;
        return (
          <div key={i} className={styles.barRow}>
            <span className={styles.barLabel}>{item.nome}</span>
            <div className={styles.barContainer}>
              <div
                className={styles.barFill}
                style={{ width: `${width}%` }}
              />
              <span className={styles.barValue}>{item.tempo.toFixed(1)}h</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface SimpleTableProps {
  data: Array<{ nome: string; taxa: number }>;
}

function SimpleTable({ data }: SimpleTableProps) {
  if (data.length === 0) return <p>Sem dados</p>;

  return (
    <table className={styles.simpleTable}>
      <tbody>
        {data.map((item, i) => (
          <tr key={i}>
            <td>{item.nome}</td>
            <td className={styles.tableValue}>{item.taxa.toFixed(1)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
