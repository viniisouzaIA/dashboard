import { NextRequest, NextResponse } from 'next/server';

const CLINT_API_TOKEN = process.env.CLINT_API_TOKEN;
const CLINT_BASE_URL = 'https://api.clint.digital';
const TIMEZONE = 'America/Sao_Paulo';

const CHART_IDS = {
  novos_leads_total: 'cc776bf9-d33d-4579-a411-d6153ca314f1',
  novos_leads_por_dia: 'e0981df9-25be-4107-ae56-8303740092d3',
  ligacoes: '8a1e8d6e-07f9-47c2-a5ec-527b25d55a6c',
  conexoes_tendencia: '8da52c67-b595-4abd-89a6-b0e42017cdb6',
  qualificados_robson: 'fd156141-11e3-4f80-bede-31bc9b5a3f12',
  propostas: '85c27e01-cf5e-4ac5-9c9d-de8e668a09bc',
  taxa_conversao_geral: 'f6d3301f-3226-443f-9521-70a6bcd9deb1',
  ciclo_venda_medio: '413dc6d2-9023-4e04-84a8-3d14378f6aea',
  total_perdidos: 'ef0302b1-536e-433f-bc58-b1049a5d6a80',
  funil_conversao: 'e728c454-6718-4474-8b32-b3ac11a52022',
  motivo_perda: '10f66b3f-2f09-4d63-ac51-ef492a323b9e',
  tempo_etapa: '0b51848f-4c50-47fb-933a-595b0b6b6593',
  taxa_por_usuario: 'bbf44bfb-9b9c-4316-9b9b-920316d5a719',
  conversao_por_origem: '01d46cf2-fc0d-4c64-8f02-585b71bee204',
  vendas_por_dia: '456b4e5b-c67c-4ee2-a181-6c0de831527f',
  vendas_totais: 'f2b0dab2-349e-49f0-9d0a-180546d8563b',
  leads_qualificados: '093f9249-0dff-4c28-b5a4-59ac6198eaf7',
  leads_trafego_pago: 'c0199330-83cd-46ce-a2fc-9b7746bd14b8',
  leads_trafego_pago_qualificado: '08349bcb-97ee-420f-a224-b06f77a10f66',
};

interface DateRange { start: string; end: string; }

function getWeekRange(referenceDate: Date): DateRange {
  const date = new Date(referenceDate);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  return { start: fmt(monday), end: fmt(sunday) };
}

function getPreviousPeriod(start: string, end: string): DateRange {
  const s = new Date(start + 'T12:00:00');
  const e = new Date(end + 'T12:00:00');
  const duration = Math.round((e.getTime() - s.getTime()) / 86400000) + 1;
  const prevEnd = new Date(s);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - duration + 1);
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  return { start: fmt(prevStart), end: fmt(prevEnd) };
}

function calcDelta(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return parseFloat(((current - previous) / previous * 100).toFixed(1));
}

async function fetchChartData(chartId: string, start: string, end: string, userId?: string) {
  try {
    const params = new URLSearchParams({ date_start: start, date_end: end, timezone: TIMEZONE });
    if (userId) params.set('user_id', userId);
    const url = `${CLINT_BASE_URL}/v2/charts/${chartId}/data?${params}`;
    const response = await fetch(url, { headers: { 'api-token': CLINT_API_TOKEN || '' } });
    if (!response.ok) {
      console.error(`Chart ${chartId} failed:`, response.status);
      return null;
    }
    const json = await response.json();
    return json.data || null;
  } catch (error) {
    console.error(`Error fetching chart ${chartId}:`, error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const funnelUserId = searchParams.get('funnel_user_id') || undefined;

  let range: DateRange;
  if (start && end) {
    range = { start, end };
  } else {
    range = getWeekRange(new Date());
  }

  const prev = getPreviousPeriod(range.start, range.end);

  // Fetch período atual + período anterior (para comparação) em paralelo
  const [
    novosLeadsTotalData,    novosLeadsPorDiaData,
    ligacoesData,           conexoesTendenciaData,
    qualificadosData,       propostasData,
    taxaConversaoData,      cicloVendaData,
    perdidosData,           funilData,
    motivoPerdasData,       tempoEtapaData,
    taxaPorUsuarioData,     conversaoPorOrigemData,
    vendasPorDiaData,       vendasTotaisData,
    leadsQualificadosData,  leadsTrafegoPagoData,
    leadsTrafegoPagoQualData,
    // Período anterior (somente KPIs numéricos)
    prevNovosLeadsData,     prevLigacoesData,
    prevQualificadosData,   prevPropostasData,
    prevTaxaConversaoData,  prevCicloVendaData,
    prevPerdidosData,       prevVendasTotaisData,
    prevLeadsQualificadosData, prevLeadsTrafegoPagoData,
    prevLeadsTrafegoPagoQualData,
  ] = await Promise.all([
    fetchChartData(CHART_IDS.novos_leads_total, range.start, range.end),
    fetchChartData(CHART_IDS.novos_leads_por_dia, range.start, range.end),
    fetchChartData(CHART_IDS.ligacoes, range.start, range.end),
    fetchChartData(CHART_IDS.conexoes_tendencia, range.start, range.end),
    fetchChartData(CHART_IDS.qualificados_robson, range.start, range.end),
    fetchChartData(CHART_IDS.propostas, range.start, range.end),
    fetchChartData(CHART_IDS.taxa_conversao_geral, range.start, range.end),
    fetchChartData(CHART_IDS.ciclo_venda_medio, range.start, range.end),
    fetchChartData(CHART_IDS.total_perdidos, range.start, range.end),
    fetchChartData(CHART_IDS.funil_conversao, range.start, range.end, funnelUserId),
    fetchChartData(CHART_IDS.motivo_perda, range.start, range.end),
    fetchChartData(CHART_IDS.tempo_etapa, range.start, range.end),
    fetchChartData(CHART_IDS.taxa_por_usuario, range.start, range.end),
    fetchChartData(CHART_IDS.conversao_por_origem, range.start, range.end),
    fetchChartData(CHART_IDS.vendas_por_dia, range.start, range.end),
    fetchChartData(CHART_IDS.vendas_totais, range.start, range.end),
    fetchChartData(CHART_IDS.leads_qualificados, range.start, range.end),
    fetchChartData(CHART_IDS.leads_trafego_pago, range.start, range.end),
    fetchChartData(CHART_IDS.leads_trafego_pago_qualificado, range.start, range.end),
    // Anteriores
    fetchChartData(CHART_IDS.novos_leads_total, prev.start, prev.end),
    fetchChartData(CHART_IDS.ligacoes, prev.start, prev.end),
    fetchChartData(CHART_IDS.qualificados_robson, prev.start, prev.end),
    fetchChartData(CHART_IDS.propostas, prev.start, prev.end),
    fetchChartData(CHART_IDS.taxa_conversao_geral, prev.start, prev.end),
    fetchChartData(CHART_IDS.ciclo_venda_medio, prev.start, prev.end),
    fetchChartData(CHART_IDS.total_perdidos, prev.start, prev.end),
    fetchChartData(CHART_IDS.vendas_totais, prev.start, prev.end),
    fetchChartData(CHART_IDS.leads_qualificados, prev.start, prev.end),
    fetchChartData(CHART_IDS.leads_trafego_pago, prev.start, prev.end),
    fetchChartData(CHART_IDS.leads_trafego_pago_qualificado, prev.start, prev.end),
  ]);

  // Helpers
  const num = (data: any): number => {
    try { return data?.result?.value || 0; } catch { return 0; }
  };
  const tableRows = (data: any): any[] => {
    try { return data?.result?.rows || []; } catch { return []; }
  };

  const processLineChart = (data: any) => {
    if (!data) return { total: 0, serie: [], erro: true };
    try {
      const series = data.result || [];
      let total = 0;
      const serie: Array<{ date: string; value: number }> = [];
      for (const s of series) {
        for (const p of s.data || []) { total += p.value || 0; serie.push({ date: p.date, value: p.value || 0 }); }
      }
      return { total, serie, erro: false };
    } catch { return { total: 0, serie: [], erro: true }; }
  };

  // ── Novos Leads ──
  const novosLeadsTotal = num(novosLeadsTotalData);
  const prevNovosLeadsTotal = num(prevNovosLeadsData);
  const novosLeadsSerie = processLineChart(novosLeadsPorDiaData);
  const novosLeads = {
    total: novosLeadsTotal,
    serie: novosLeadsSerie.serie,
    delta: calcDelta(novosLeadsTotal, prevNovosLeadsTotal),
    erro: !novosLeadsTotalData,
  };

  // ── Ligações ──
  type LigacoesType = { tentativas: number; conexoes: number; hitRate: number; porUsuario: Array<{ nome: string; tentativas: number; conexoes: number }>; delta: number | null; erro: boolean };
  const buildLigacoes = (data: any): Omit<LigacoesType, 'delta' | 'erro'> & { erro: boolean } => {
    const rows = tableRows(data);
    let tentativas = 0; let conexoes = 0;
    const porUsuario: LigacoesType['porUsuario'] = [];
    for (const row of rows) {
      const t = row.user_call_call_attempts || 0;
      const c = row.user_call_call_connections || 0;
      tentativas += t; conexoes += c;
      porUsuario.push({ nome: row.user_name || '', tentativas: t, conexoes: c });
    }
    const hitRate = tentativas > 0 ? Math.round((conexoes / tentativas) * 1000) / 10 : 0;
    return { tentativas, conexoes, hitRate, porUsuario, erro: !data };
  };
  const ligacoesAtual = buildLigacoes(ligacoesData);
  const ligacoesPrev = buildLigacoes(prevLigacoesData);
  const ligacoes: LigacoesType = { ...ligacoesAtual, delta: calcDelta(ligacoesAtual.tentativas, ligacoesPrev.tentativas) };

  // ── Qualificados Robson ──
  const qualTotal = num(qualificadosData);
  const prevQualTotal = num(prevQualificadosData);
  const qualificadosRobson = { total: qualTotal, delta: calcDelta(qualTotal, prevQualTotal), erro: !qualificadosData };

  // ── Novos KPIs numéricos ──
  const leadsQualificadosVal = num(leadsQualificadosData);
  const leadsQualificados = {
    total: leadsQualificadosVal,
    delta: calcDelta(leadsQualificadosVal, num(prevLeadsQualificadosData)),
    erro: !leadsQualificadosData,
  };

  const leadsTrafegoPagoVal = num(leadsTrafegoPagoData);
  const leadsTrafegoPago = {
    total: leadsTrafegoPagoVal,
    delta: calcDelta(leadsTrafegoPagoVal, num(prevLeadsTrafegoPagoData)),
    erro: !leadsTrafegoPagoData,
  };

  const leadsTrafegoPagoQualVal = num(leadsTrafegoPagoQualData);
  const leadsTrafegoPagoQualificado = {
    total: leadsTrafegoPagoQualVal,
    delta: calcDelta(leadsTrafegoPagoQualVal, num(prevLeadsTrafegoPagoQualData)),
    erro: !leadsTrafegoPagoQualData,
  };

  // ── Propostas ──
  type PropostasType = { total: number; porUsuario: Array<{ nome: string; quantidade: number }>; delta: number | null; erro: boolean };
  const buildPropostas = (data: any) => {
    const rows = tableRows(data);
    const porUsuario = rows.map((row: any) => ({ nome: (row.user_name || '').trim(), quantidade: row.deal_count || 0 }));
    const total = porUsuario.reduce((s: number, u: { quantidade: number }) => s + u.quantidade, 0);
    return { total, porUsuario, erro: !data };
  };
  const propostasAtual = buildPropostas(propostasData);
  const propostasPrev = buildPropostas(prevPropostasData);
  const propostas: PropostasType = { ...propostasAtual, delta: calcDelta(propostasAtual.total, propostasPrev.total) };

  // ── Conversão ──
  const taxaVal = num(taxaConversaoData);
  const prevTaxaVal = num(prevTaxaConversaoData);
  const taxaConversao = {
    valor: parseFloat((taxaVal * 100).toFixed(1)),
    delta: calcDelta(taxaVal, prevTaxaVal),
    erro: !taxaConversaoData,
  };

  const cicloVal = num(cicloVendaData);
  const prevCicloVal = num(prevCicloVendaData);
  const cicloVenda = {
    valor: parseFloat((cicloVal / 86400).toFixed(1)),
    delta: calcDelta(cicloVal, prevCicloVal),
    erro: !cicloVendaData,
  };

  const perdidosVal = num(perdidosData);
  const prevPerdidosVal = num(prevPerdidosData);
  const totalPerdidos = { value: perdidosVal, delta: calcDelta(perdidosVal, prevPerdidosVal), erro: !perdidosData };

  // ── Funil ──
  const funilConversao = (() => {
    if (!funilData) return { etapas: [], erro: true };
    try {
      const etapas = (funilData.result || []).filter((i: any) => !['Total', 'Base', 'NoShow'].includes(i.name));
      return { etapas, erro: false };
    } catch { return { etapas: [], erro: true }; }
  })();

  // ── Diagnóstico ──
  const motivoPerda = (() => {
    if (!motivoPerdasData) return { items: [], erro: true };
    try {
      const items = (motivoPerdasData.result || []).map((i: any) => ({
        name: i.name === 'Total' ? 'Sem motivo informado' : i.name,
        value: i.value,
      }));
      return { items, erro: false };
    } catch { return { items: [], erro: true }; }
  })();

  const tempoEtapaProcessado = (() => {
    const rows = tableRows(tempoEtapaData);
    if (!tempoEtapaData) return { etapas: [], erro: true };
    try {
      const etapas = rows.map((row: any) => ({ nome: row.track_stage_old_stage, tempo: row.track_stage_stage_time || 0 }))
        .sort((a: any, b: any) => b.tempo - a.tempo);
      return { etapas, erro: false };
    } catch { return { etapas: [], erro: true }; }
  })();

  // ── Desempenho ──
  const taxaPorUsuarioProcessado = (() => {
    const rows = tableRows(taxaPorUsuarioData);
    if (!taxaPorUsuarioData) return { usuarios: [], erro: true };
    try {
      return { usuarios: rows.map((r: any) => ({ nome: r.user_name || '', taxa: parseFloat(((r.deal_conversion_rate || 0) * 100).toFixed(1)) })), erro: false };
    } catch { return { usuarios: [], erro: true }; }
  })();

  const conversaoPorOrigemProcessado = (() => {
    const rows = tableRows(conversaoPorOrigemData);
    if (!conversaoPorOrigemData) return { origens: [], erro: true };
    try {
      return { origens: rows.map((r: any) => ({ nome: r.origin_name || '', taxa: parseFloat(((r.deal_conversion_rate || 0) * 100).toFixed(1)) })), erro: false };
    } catch { return { origens: [], erro: true }; }
  })();

  // ── Vendas ──
  const vendasSerie = processLineChart(vendasPorDiaData);
  const vendas = (() => {
    if (!vendasTotaisData) return { quantidade: 0, valorTotal: 0, serie: vendasSerie.serie, delta: null as number | null, erro: true };
    try {
      const r = vendasTotaisData.result || {};
      const quantidade = r.deal_count || 0;
      const valorTotal = (r.deal_sum_value || 0) / 100;
      const prevR = prevVendasTotaisData?.result || {};
      const prevQtd = prevR.deal_count || 0;
      return { quantidade, valorTotal, serie: vendasSerie.serie, delta: calcDelta(quantidade, prevQtd), erro: false };
    } catch { return { quantidade: 0, valorTotal: 0, serie: vendasSerie.serie, delta: null as number | null, erro: true }; }
  })();

  return NextResponse.json({
    periodo: { inicio: range.start, fim: range.end },
    periodoAnterior: { inicio: prev.start, fim: prev.end },
    novosLeads,
    ligacoes,
    qualificadosRobson,
    leadsQualificados,
    leadsTrafegoPago,
    leadsTrafegoPagoQualificado,
    propostas,
    conversao: { taxa: taxaConversao, ciclo: cicloVenda, perdidos: totalPerdidos },
    funilConversao,
    diagnostico: { motivoPerda, tempoEtapa: tempoEtapaProcessado },
    desempenho: { taxaPorUsuario: taxaPorUsuarioProcessado, conversaoPorOrigem: conversaoPorOrigemProcessado },
    vendas,
  });
}
