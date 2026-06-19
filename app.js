/* ==========================================================================
   DASHBOARD MOTOR - DIAS GOMES ADVOCACIA
   Lógica e Interatividade de Dados e Componentes Visuais
   ========================================================================== */

// --- BASE DE DADOS SIMULADA POR PERÍODO ---
const DASHBOARD_DATA = {
    "hoje": {
        leadsQualificados: {
            total: 8,
            sparkline: [1, 2, 1, 3, 2, 2, 3]
        },
        leadsTrafegoPago: {
            total: 9,
            sparkline: [3, 4, 2, 5, 3, 4, 4]
        },
        leadsTrafegoQualificado: {
            total: 5,
            sparkline: [1, 1, 2, 2, 1, 2, 2]
        },
        leads: {
            total: 12,
            prevTotal: 10,
            percentChange: "+20%",
            trend: "up",
            sparkline: [5, 8, 4, 9, 7, 10, 12],
            details: [
                { id: 101, nome: "Renata Vasconcellos", contato: "(11) 98234-1100", origem: "Meta Ads", data: "Hoje, 10:14", status: "Novo" },
                { id: 102, nome: "Carlos Henrique Silva", contato: "(21) 97431-2900", origem: "Google Ads", data: "Hoje, 11:30", status: "Em Atendimento" },
                { id: 103, nome: "Mariana Costa Prado", contato: "(31) 99344-8811", origem: "Indicação", data: "Hoje, 13:05", status: "Qualificado" },
                { id: 104, nome: "José Roberto Mendes", contato: "(11) 98844-3322", origem: "Orgânico", data: "Hoje, 14:15", status: "Proposta Enviada" },
                { id: 105, nome: "Beatriz Nogueira", contato: "(19) 99122-4455", origem: "Meta Ads", data: "Hoje, 14:40", status: "Novo" },
                { id: 106, nome: "Fernando Gurgel", contato: "(85) 98177-3311", origem: "Google Ads", data: "Hoje, 15:20", status: "Em Atendimento" },
                { id: 107, nome: "Juliana Frota Siqueira", contato: "(11) 97555-4422", origem: "Meta Ads", data: "Hoje, 15:55", status: "Qualificado" },
                { id: 108, nome: "Roberto Alencar Jr", contato: "(11) 98444-1199", origem: "Indicação", data: "Hoje, 16:10", status: "Proposta Enviada" },
                { id: 109, nome: "Clara Mello Couto", contato: "(21) 99677-8899", origem: "Google Ads", data: "Hoje, 16:35", status: "Perdido" },
                { id: 110, nome: "Wagner de Souza", contato: "(41) 99233-4411", origem: "Meta Ads", data: "Hoje, 16:50", status: "Novo" },
                { id: 111, nome: "Patrícia Amarante", contato: "(31) 99877-2233", origem: "Meta Ads", data: "Hoje, 17:02", status: "Em Atendimento" },
                { id: 112, nome: "Luiz Felipe Castelo", contato: "(11) 97633-1122", origem: "Orgânico", data: "Hoje, 17:15", status: "Novo" }
            ]
        },
        ligacoes: {
            tentativas: 48,
            conexoes: 32,
            taxaConexao: "66.7%",
            hitRate: "25.0%",
            hitRateTrend: "up",
            sparkline: [2, 5, 3, 6, 4, 8, 8],
            details: [
                { id: 201, lead: "Carlos Henrique Silva", sdr: "Lucas Lima", duracao: "3m 15s", resultado: "Conectado - Qualificado", hora: "11:32" },
                { id: 202, lead: "Renata Vasconcellos", sdr: "Lucas Lima", duracao: "0m 45s", resultado: "Caixa Postal", hora: "10:15" },
                { id: 203, lead: "Mariana Costa Prado", sdr: "Amanda Souza", duracao: "5m 40s", resultado: "Conectado - Agendado", hora: "13:10" },
                { id: 204, lead: "José Roberto Mendes", sdr: "Lucas Lima", duracao: "8m 10s", resultado: "Conectado - Proposta Aceita", hora: "14:20" },
                { id: 205, lead: "Beatriz Nogueira", sdr: "Amanda Souza", duracao: "1m 10s", resultado: "Não Atendeu", hora: "14:42" },
                { id: 206, lead: "Fernando Gurgel", sdr: "Lucas Lima", duracao: "4m 20s", resultado: "Conectado - Em Qualificação", hora: "15:25" },
                { id: 207, lead: "Juliana Frota Siqueira", sdr: "Amanda Souza", duracao: "6m 02s", resultado: "Conectado - Agendado", hora: "16:02" },
                { id: 208, lead: "Clara Mello Couto", sdr: "Lucas Lima", duracao: "2m 15s", resultado: "Conectado - Fora do Escopo", hora: "16:40" }
            ]
        },
        qualificados: {
            total: 8,
            taxaConversao: "66.7%",
            trend: "up",
            sparkline: [1, 2, 1, 3, 2, 2, 3],
            details: [
                { id: 301, nome: "Mariana Costa Prado", produto: "Holding Check", faturamento: "Patrimônio: R$ 3,8M", closer: "Dr. Arthur", data: "Hoje" },
                { id: 302, nome: "José Roberto Mendes", produto: "Diagnóstico (DGE)", faturamento: "Faturamento: R$ 4,5M/ano", closer: "Dr. Bruno", data: "Hoje" },
                { id: 303, nome: "Juliana Frota Siqueira", produto: "Plano Formalização", faturamento: "Prestes a Abrir", closer: "Dra. Camila", data: "Hoje" },
                { id: 304, nome: "Roberto Alencar Jr", produto: "Holding Check", faturamento: "Patrimônio: R$ 2,1M", closer: "Dra. Daniela", data: "Hoje" },
                { id: 305, nome: "Carlos Henrique Silva", produto: "Plano Formalização", faturamento: "Nova Sociedade", closer: "Dr. Arthur", data: "Hoje" },
                { id: 306, nome: "Fernando Gurgel", produto: "Diagnóstico (DGE)", faturamento: "Faturamento: R$ 1,8M/ano", closer: "Dr. Bruno", data: "Hoje" },
                { id: 307, nome: "Marcus Vinícius Reis", produto: "Assessoria Jurídica", faturamento: "Faturamento: R$ 8,2M/ano", closer: "Dra. Camila", data: "Hoje" },
                { id: 308, nome: "Sônia Guimarães", produto: "Holding Check", faturamento: "Patrimônio: R$ 6,5M", closer: "Dra. Daniela", data: "Hoje" }
            ],
            distribuicao: [
                { nome: "Dr. Arthur", count: 2 },
                { nome: "Dr. Bruno", count: 2 },
                { nome: "Dra. Camila", count: 2 },
                { nome: "Dra. Daniela", count: 2 },
                { nome: "Direcionamento Robson", count: 1 }
            ]
        },
        propostas: {
            total: 6,
            valor: "R$ 38.500",
            sparkline: [1, 0, 2, 1, 1, 1, 6],
            details: [
                { id: 401, lead: "José Roberto Mendes", produto: "Diagnóstico (DGE)", valor: "R$ 7.500", closer: "Dr. Bruno", status: "Assinado" },
                { id: 402, lead: "Roberto Alencar Jr", produto: "Holding Check", valor: "R$ 9.500", closer: "Dra. Daniela", status: "Pendente" },
                { id: 403, lead: "Carlos Henrique Silva", produto: "Plano Formalização", valor: "R$ 4.750", closer: "Dr. Arthur", status: "Pendente" },
                { id: 404, lead: "Mariana Costa Prado", produto: "Holding Check", valor: "R$ 9.500", closer: "Dr. Arthur", status: "Assinado" },
                { id: 405, lead: "Juliana Frota Siqueira", produto: "Plano Formalização", valor: "R$ 4.750", closer: "Dra. Camila", status: "Assinado" },
                { id: 406, lead: "Claudio Albuquerque", produto: "Diagnóstico (DGE)", valor: "R$ 7.500", closer: "Dra. Camila", status: "Em Negociação" }
            ],
            divisao: [
                { nome: "Dr. Arthur", count: 2, valor: 14250, barWidth: "72%" },
                { nome: "Dr. Bruno", count: 1, valor: 7500, barWidth: "38%" },
                { nome: "Dra. Camila", count: 2, valor: 12250, barWidth: "62%" },
                { nome: "Dra. Daniela", count: 1, valor: 9500, barWidth: "48%" }
            ]
        }
    },
    "7dias": {
        leadsQualificados: {
            total: 52,
            sparkline: [5, 8, 10, 6, 9, 7, 7]
        },
        leadsTrafegoPago: {
            total: 55,
            sparkline: [6, 9, 11, 7, 9, 8, 8]
        },
        leadsTrafegoQualificado: {
            total: 32,
            sparkline: [3, 5, 7, 4, 6, 5, 5]
        },
        leads: {
            total: 84,
            prevTotal: 78,
            percentChange: "+7.7%",
            trend: "up",
            sparkline: [8, 12, 15, 10, 14, 13, 12],
            details: [
                { id: 113, nome: "Antônio Pires Machado", contato: "(11) 98722-1044", origem: "Meta Ads", data: "Ontem", status: "Qualificado" },
                { id: 114, nome: "Letícia Ribeiro Couto", contato: "(21) 99122-4455", origem: "Google Ads", data: "Ontem", status: "Proposta Enviada" },
                { id: 115, nome: "Márcio Fonseca Filho", contato: "(31) 97411-2299", origem: "Meta Ads", data: "Há 2 dias", status: "Qualificado" },
                { id: 116, nome: "Dra. Giselle Monteiro", contato: "(11) 98122-3300", origem: "Indicação", data: "Há 3 dias", status: "Proposta Enviada" },
                { id: 117, nome: "Pedro Ramos Assis", contato: "(47) 99611-3322", origem: "Meta Ads", data: "Há 3 dias", status: "Em Atendimento" },
                { id: 118, nome: "Cláudia Malta", contato: "(11) 97433-2211", origem: "Google Ads", data: "Há 4 dias", status: "Qualificado" },
                { id: 119, nome: "Felipe Drummond", contato: "(31) 98755-1122", origem: "Google Ads", data: "Há 5 dias", status: "Perdido" }
            ]
        },
        ligacoes: {
            tentativas: 340,
            conexoes: 220,
            taxaConexao: "64.7%",
            hitRate: "22.7%",
            hitRateTrend: "up",
            sparkline: [25, 32, 40, 28, 35, 30, 32],
            details: [
                { id: 210, lead: "Antônio Pires Machado", sdr: "Amanda Souza", duracao: "4m 50s", resultado: "Conectado - Qualificado", hora: "Ontem" },
                { id: 211, lead: "Letícia Ribeiro Couto", sdr: "Lucas Lima", duracao: "7m 10s", resultado: "Conectado - Agendado", hora: "Ontem" },
                { id: 212, lead: "Márcio Fonseca Filho", sdr: "Lucas Lima", duracao: "3m 30s", resultado: "Conectado - Qualificado", hora: "Há 2 dias" },
                { id: 213, lead: "Giselle Monteiro", sdr: "Amanda Souza", duracao: "6m 20s", resultado: "Conectado - Agendado", hora: "Há 3 dias" }
            ]
        },
        qualificados: {
            total: 52,
            taxaConversao: "61.9%",
            trend: "up",
            sparkline: [5, 8, 10, 6, 9, 7, 7],
            details: [
                { id: 310, nome: "Antônio Pires Machado", produto: "Holding Check", faturamento: "Patrimônio: R$ 4,2M", closer: "Dr. Arthur", data: "Ontem" },
                { id: 311, nome: "Márcio Fonseca Filho", produto: "Diagnóstico (DGE)", faturamento: "Faturamento: R$ 2,5M/ano", closer: "Dr. Bruno", data: "Há 2 dias" },
                { id: 312, nome: "Cláudia Malta", produto: "Assessoria Jurídica", faturamento: "Faturamento: R$ 5,0M/ano", closer: "Dra. Camila", data: "Há 4 dias" }
            ],
            distribuicao: [
                { nome: "Dr. Arthur", count: 13 },
                { nome: "Dr. Bruno", count: 14 },
                { nome: "Dra. Camila", count: 12 },
                { nome: "Dra. Daniela", count: 13 },
                { nome: "Direcionamento Robson", count: 7 }
            ]
        },
        propostas: {
            total: 38,
            valor: "R$ 265.000",
            sparkline: [3, 6, 8, 4, 7, 5, 5],
            details: [
                { id: 410, lead: "Letícia Ribeiro Couto", produto: "Diagnóstico (DGE)", valor: "R$ 7.500", closer: "Dr. Bruno", status: "Assinado" },
                { id: 411, lead: "Giselle Monteiro", produto: "Holding Check", valor: "R$ 9.500", closer: "Dra. Daniela", status: "Pendente" },
                { id: 412, lead: "Antônio Pires Machado", produto: "Holding Check", valor: "R$ 9.500", closer: "Dr. Arthur", status: "Assinado" },
                { id: 413, lead: "Márcio Fonseca Filho", produto: "Assessoria Jurídica", valor: "R$ 36.000", closer: "Dra. Camila", status: "Pendente" }
            ],
            divisao: [
                { nome: "Dr. Arthur", count: 10, valor: 75000, barWidth: "75%" },
                { nome: "Dr. Bruno", count: 9, valor: 58000, barWidth: "58%" },
                { nome: "Dra. Camila", count: 10, valor: 68000, barWidth: "68%" },
                { nome: "Dra. Daniela", count: 9, valor: 64000, barWidth: "64%" }
            ]
        }
    },
    "mes": {
        leadsQualificados: {
            total: 204,
            sparkline: [22, 28, 24, 30, 35, 31, 34]
        },
        leadsTrafegoPago: {
            total: 198,
            sparkline: [20, 26, 22, 28, 33, 30, 32]
        },
        leadsTrafegoQualificado: {
            total: 128,
            sparkline: [13, 17, 15, 19, 22, 20, 22]
        },
        leads: {
            total: 312,
            prevTotal: 290,
            percentChange: "+7.6%",
            trend: "up",
            sparkline: [35, 42, 38, 45, 52, 48, 52],
            details: [
                { id: 130, nome: "Joaquim Dutra Naves", contato: "(11) 98111-0022", origem: "Meta Ads", data: "08/06", status: "Qualificado" },
                { id: 131, nome: "Salgados Donizete Ltda", contato: "(19) 3244-1100", origem: "Google Ads", data: "07/06", status: "Proposta Enviada" },
                { id: 132, nome: "Luciana Guedes Pereira", contato: "(31) 99822-4411", origem: "Indicação", data: "05/06", status: "Qualificado" },
                { id: 133, nome: "Transportadora Express", contato: "(41) 99611-3322", origem: "Google Ads", data: "04/06", status: "Proposta Enviada" },
                { id: 134, nome: "Dr. Juliano Vasques", contato: "(11) 97511-9988", origem: "Meta Ads", data: "02/06", status: "Perdido" }
            ]
        },
        ligacoes: {
            tentativas: 1420,
            conexoes: 980,
            taxaConexao: "69.0%",
            hitRate: "23.4%",
            hitRateTrend: "up",
            sparkline: [120, 135, 118, 142, 155, 130, 180],
            details: [
                { id: 230, lead: "Joaquim Dutra Naves", sdr: "Lucas Lima", duracao: "5m 15s", resultado: "Conectado - Qualificado", hora: "08/06" },
                { id: 231, lead: "Salgados Donizete Ltda", sdr: "Amanda Souza", duracao: "8m 40s", resultado: "Conectado - Agendado", hora: "07/06" },
                { id: 232, lead: "Luciana Guedes Pereira", sdr: "Amanda Souza", duracao: "4m 20s", resultado: "Conectado - Qualificado", hora: "05/06" },
                { id: 233, lead: "Transportadora Express", sdr: "Lucas Lima", duracao: "6m 12s", resultado: "Conectado - Agendado", hora: "04/06" }
            ]
        },
        qualificados: {
            total: 204,
            taxaConversao: "65.3%",
            trend: "up",
            sparkline: [22, 28, 24, 30, 35, 31, 34],
            details: [
                { id: 330, nome: "Joaquim Dutra Naves", produto: "Holding Check", faturamento: "Patrimônio: R$ 8,5M", closer: "Dr. Arthur", data: "08/06" },
                { id: 331, nome: "Salgados Donizete Ltda", produto: "Plano Formalização", faturamento: "Faturamento: R$ 3,2M/ano", closer: "Dr. Bruno", data: "07/06" },
                { id: 332, nome: "Luciana Guedes Pereira", produto: "Holding Check", faturamento: "Patrimônio: R$ 3,0M", closer: "Dra. Camila", data: "05/06" },
                { id: 333, nome: "Transportadora Express", produto: "Diagnóstico (DGE)", faturamento: "Faturamento: R$ 6,8M/ano", closer: "Dra. Daniela", data: "04/06" }
            ],
            distribuicao: [
                { nome: "Dr. Arthur", count: 51 },
                { nome: "Dr. Bruno", count: 54 },
                { nome: "Dra. Camila", count: 48 },
                { nome: "Dra. Daniela", count: 51 },
                { nome: "Direcionamento Robson", count: 28 }
            ]
        },
        propostas: {
            total: 145,
            valor: "R$ 984.750",
            sparkline: [15, 20, 18, 22, 25, 21, 24],
            details: [
                { id: 430, lead: "Joaquim Dutra Naves", produto: "Holding Check", valor: "R$ 9.500", closer: "Dr. Arthur", status: "Assinado" },
                { id: 431, lead: "Salgados Donizete Ltda", produto: "Plano Formalização", valor: "R$ 4.750", closer: "Dr. Bruno", status: "Assinado" },
                { id: 432, lead: "Luciana Guedes Pereira", produto: "Holding Check", valor: "R$ 9.500", closer: "Dra. Camila", status: "Assinado" },
                { id: 433, lead: "Transportadora Express", produto: "Diagnóstico (DGE)", valor: "R$ 7.500", closer: "Dra. Daniela", status: "Assinado" }
            ],
            divisao: [
                { nome: "Dr. Arthur", count: 38, valor: 260000, barWidth: "100%" },
                { nome: "Dr. Bruno", count: 35, valor: 238000, barWidth: "91%" },
                { nome: "Dra. Camila", count: 36, valor: 242750, barWidth: "93%" },
                { nome: "Dra. Daniela", count: 36, valor: 244000, barWidth: "94%" }
            ]
        }
    },
    "ano": {
        leadsQualificados: {
            total: 1210,
            sparkline: [80, 110, 95, 125, 135, 115, 150]
        },
        leadsTrafegoPago: {
            total: 1150,
            sparkline: [75, 105, 90, 118, 130, 110, 145]
        },
        leadsTrafegoQualificado: {
            total: 745,
            sparkline: [48, 68, 58, 78, 85, 72, 96]
        },
        leads: {
            total: 1840,
            prevTotal: 1650,
            percentChange: "+11.5%",
            trend: "up",
            sparkline: [120, 180, 220, 260, 280, 380, 400],
            details: [
                { id: 180, nome: "Metalúrgica São João", contato: "(11) 3455-2233", origem: "Meta Ads", data: "15/05", status: "Qualificado" },
                { id: 181, nome: "Clínica Geral Médicos S/A", contato: "(11) 3211-5500", origem: "Google Ads", data: "10/05", status: "Proposta Enviada" },
                { id: 182, nome: "Alimentos Vovó Rosa", contato: "(81) 99311-2299", origem: "Indicação", data: "05/05", status: "Qualificado" },
                { id: 183, nome: "Imobiliária Prime Empreendimentos", contato: "(21) 98711-3344", origem: "Google Ads", data: "28/04", status: "Proposta Enviada" },
                { id: 184, nome: "Condomínio Edifício Miramar", contato: "(13) 3211-4400", origem: "Meta Ads", data: "22/04", status: "Perdido" }
            ]
        },
        ligacoes: {
            tentativas: 8200,
            conexoes: 5500,
            taxaConexao: "67.1%",
            hitRate: "21.8%",
            hitRateTrend: "up",
            sparkline: [600, 750, 680, 850, 920, 800, 900],
            details: [
                { id: 280, lead: "Metalúrgica São João", sdr: "Lucas Lima", duracao: "6m 30s", resultado: "Conectado - Qualificado", hora: "15/05" },
                { id: 281, lead: "Clínica Geral Médicos S/A", sdr: "Amanda Souza", duracao: "9m 10s", resultado: "Conectado - Agendado", hora: "10/05" },
                { id: 282, lead: "Alimentos Vovó Rosa", sdr: "Amanda Souza", duracao: "5m 20s", resultado: "Conectado - Qualificado", hora: "05/05" },
                { id: 283, lead: "Imobiliária Prime Empreendimentos", sdr: "Lucas Lima", duracao: "7m 45s", resultado: "Conectado - Agendado", hora: "28/04" }
            ]
        },
        qualificados: {
            total: 1210,
            taxaConversao: "65.7%",
            trend: "up",
            sparkline: [80, 110, 95, 125, 135, 115, 150],
            details: [
                { id: 380, nome: "Metalúrgica São João", produto: "Assessoria Jurídica", faturamento: "Faturamento: R$ 18M/ano", closer: "Dr. Arthur", data: "15/05" },
                { id: 381, nome: "Clínica Geral Médicos S/A", produto: "Diagnóstico (DGE)", faturamento: "Faturamento: R$ 9,5M/ano", closer: "Dr. Bruno", data: "10/05" },
                { id: 382, nome: "Alimentos Vovó Rosa", produto: "Holding Check", faturamento: "Patrimônio: R$ 12M", closer: "Dra. Camila", data: "05/05" },
                { id: 383, nome: "Imobiliária Prime Empreendimentos", produto: "Holding Check", faturamento: "Patrimônio: R$ 15M", closer: "Dra. Daniela", data: "28/04" }
            ],
            distribuicao: [
                { nome: "Dr. Arthur", count: 310 },
                { nome: "Dr. Bruno", count: 300 },
                { nome: "Dra. Camila", count: 295 },
                { nome: "Dra. Daniela", count: 305 },
                { nome: "Direcionamento Robson", count: 175 }
            ]
        },
        propostas: {
            total: 890,
            valor: "R$ 6.120.000",
            sparkline: [60, 85, 70, 90, 105, 80, 100],
            details: [
                { id: 480, lead: "Metalúrgica São João", produto: "Assessoria Jurídica", valor: "R$ 180.000", closer: "Dr. Arthur", status: "Assinado" },
                { id: 481, lead: "Clínica Geral Médicos S/A", produto: "Diagnóstico (DGE)", valor: "R$ 7.500", closer: "Dr. Bruno", status: "Assinado" },
                { id: 482, lead: "Alimentos Vovó Rosa", produto: "Holding Check", valor: "R$ 9.500", closer: "Dra. Camila", status: "Assinado" },
                { id: 483, lead: "Imobiliária Prime Empreendimentos", produto: "Holding Check", valor: "R$ 9.500", closer: "Dra. Daniela", status: "Assinado" }
            ],
            divisao: [
                { nome: "Dr. Arthur", count: 225, valor: 1550000, barWidth: "100%" },
                { nome: "Dr. Bruno", count: 220, valor: 1480000, barWidth: "95%" },
                { nome: "Dra. Camila", count: 222, valor: 1540000, barWidth: "99%" },
                { nome: "Dra. Daniela", count: 223, valor: 1550000, barWidth: "100%" }
            ]
        }
    }
};

// --- FUNÇÃO AUXILIAR PARA DESENHAR SPARKLINE EM SVG DINA MICAMENTE ---
function renderSparkline(elementId, values, isSuccess = true) {
    const svg = document.getElementById(elementId);
    if (!svg) return;
    
    // Dimensões do SVG
    const width = 90;
    const height = 36;
    const padding = 3;
    
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const valRange = maxVal - minVal || 1;
    
    const points = values.map((val, idx) => {
        const x = padding + (idx / (values.length - 1)) * (width - padding * 2);
        const y = height - padding - ((val - minVal) / valRange) * (height - padding * 2);
        return { x, y };
    });
    
    // Gerar string do Path
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        // Interpolação cúbica suave para gráficos premium
        const cpX1 = points[i-1].x + (points[i].x - points[i-1].x) / 2;
        const cpY1 = points[i-1].y;
        const cpX2 = points[i-1].x + (points[i].x - points[i-1].x) / 2;
        const cpY2 = points[i].y;
        pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
    }
    
    // Área sombreada sob a linha
    const areaD = `${pathD} L ${points[points.length-1].x} ${height} L ${points[0].x} ${height} Z`;
    
    const lineClass = isSuccess ? 'spark-line spark-line-success' : 'spark-line';
    const areaClass = isSuccess ? 'spark-area spark-area-success' : 'spark-area';
    
    svg.innerHTML = `
        <defs>
            <linearGradient id="spark-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--brand-accent)" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="var(--brand-accent)" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="spark-gradient-success" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--status-success-border)" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="var(--status-success-border)" stop-opacity="0"/>
            </linearGradient>
        </defs>
        <path d="${areaD}" class="${areaClass}" />
        <path d="${pathD}" class="${lineClass}" />
    `;
}

// --- FUNÇÃO PARA DESENHAR O GRÁFICO DE CONVERSÃO FUNIL ---
function updateFunnel(data) {
    const leadsCount = data.leads.total;
    const callsCount = data.ligacoes.conexoes;
    const qualifiedCount = data.qualificados.total;
    const proposalsCount = data.propostas.total;
    
    // Stages widths
    document.getElementById('funnel-bar-leads').style.width = '100%';
    document.getElementById('funnel-val-leads').innerText = `${leadsCount} Leads`;
    
    const callPct = Math.round((callsCount / leadsCount) * 100) || 0;
    document.getElementById('funnel-bar-calls').style.width = `${callPct}%`;
    document.getElementById('funnel-val-calls').innerText = `${callsCount} Conexões`;
    document.getElementById('funnel-pct-calls').innerText = `${callPct}% do total`;
    
    const qualPct = Math.round((qualifiedCount / callsCount) * 100) || 0;
    document.getElementById('funnel-bar-qual').style.width = `${Math.min(callPct, Math.round((qualifiedCount / leadsCount) * 100))}%`;
    document.getElementById('funnel-val-qual').innerText = `${qualifiedCount} Qualificados`;
    document.getElementById('funnel-pct-qual').innerText = `${qualPct}% das conexões`;
    
    const propPct = Math.round((proposalsCount / qualifiedCount) * 100) || 0;
    document.getElementById('funnel-bar-prop').style.width = `${Math.min(callPct, Math.round((proposalsCount / leadsCount) * 100))}%`;
    document.getElementById('funnel-val-prop').innerText = `${proposalsCount} Enviadas`;
    document.getElementById('funnel-pct-prop').innerText = `${propPct}% dos qualificados`;
}

// --- FUNÇÃO PARA FORMATAR VALORES EM MOEDA BRL ---
function formatCurrency(val) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
}

// --- FUNÇÃO PARA RENDERIZAR PROPOSTAS POR SOCIO/CLOSER ---
function updateClosersBreakdown(data) {
    const list = document.getElementById('closers-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    data.propostas.divisao.forEach(row => {
        const div = document.createElement('div');
        div.className = 'closer-row';
        div.innerHTML = `
            <div class="closer-info">
                <span class="closer-name">${row.nome}</span>
                <span class="closer-role">Advogado Closer</span>
            </div>
            <div class="closer-bar-container">
                <div class="closer-bar" style="width: ${row.barWidth}"></div>
            </div>
            <div class="closer-stats">
                <span class="closer-value">${formatCurrency(row.valor)}</span>
                <span class="closer-count">${row.count} propostas</span>
            </div>
        `;
        list.appendChild(div);
    });
}

// --- TABELA PRINCIPAL DE LOGS DE ATIVIDADES NO FUNDO ---
function updateRecentActivitiesTable(data) {
    const tbody = document.getElementById('recent-activities-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Mesclar dados de novos leads e propostas de forma fictícia para compor as últimas atividades
    const activities = [];
    
    data.leads.details.slice(0, 5).forEach(l => {
        activities.push({
            tipo: "Lead Recebido",
            detalhe: `Lead <strong>${l.nome}</strong> recebido via ${l.origem}`,
            statusClass: "badge-success",
            statusText: "Entrada",
            data: l.data
        });
    });
    
    data.propostas.details.slice(0, 3).forEach(p => {
        let statusBadge = "badge-warning";
        if (p.status === "Assinado") statusBadge = "badge-success";
        if (p.status === "Perdido") statusBadge = "badge-error";
        
        activities.push({
            tipo: "Proposta Comercial",
            detalhe: `Proposta de <strong>${p.produto}</strong> enviada por ${p.closer} (${p.valor})`,
            statusClass: statusBadge,
            statusText: p.status,
            data: "Há pouco"
        });
    });
    
    // Ordenar de forma fictícia e preencher a tabela
    activities.forEach(act => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${act.tipo}</strong></td>
            <td>${act.detalhe}</td>
            <td><span class="badge ${act.statusClass}">${act.statusText}</span></td>
            <td>${act.data}</td>
        `;
        tbody.appendChild(tr);
    });
}

// --- ATUALIZAR TODOS OS DADOS DO DASHBOARD COM BASE NO PERÍODO ---
function refreshDashboard(periodKey) {
    const data = DASHBOARD_DATA[periodKey];
    if (!data) return;
    
    // 1. KPI 1: Novos Leads Recebidos
    document.getElementById('kpi-leads-value').innerText = data.leads.total;
    const leadsBadge = document.getElementById('kpi-leads-badge');
    leadsBadge.innerText = data.leads.percentChange;
    leadsBadge.className = `badge ${data.leads.trend === 'up' ? 'badge-success' : 'badge-error'}`;
    renderSparkline('sparkline-leads', data.leads.sparkline, data.leads.trend === 'up');
    
    // 2. KPI 2: Ligações Realizadas (Conexões / Taxa / Hit Rate)
    document.getElementById('kpi-calls-value').innerText = data.ligacoes.tentativas;
    document.getElementById('kpi-calls-ratio').innerText = `${data.ligacoes.conexoes} conexões (${data.ligacoes.taxaConexao})`;
    const callsBadge = document.getElementById('kpi-calls-badge');
    callsBadge.innerText = `Hit Rate: ${data.ligacoes.hitRate}`;
    callsBadge.className = `badge ${data.ligacoes.hitRateTrend === 'up' ? 'badge-success' : 'badge-warning'}`;
    renderSparkline('sparkline-calls', data.ligacoes.sparkline, data.ligacoes.hitRateTrend === 'up');
    
    // 3. KPI 3: Leads Qualificados direcionados ao Closer
    document.getElementById('kpi-qual-value').innerText = data.qualificados.total;
    document.getElementById('kpi-qual-ratio').innerText = `Conversão: ${data.qualificados.taxaConversao}`;
    renderSparkline('sparkline-qual', data.qualificados.sparkline, true);
    
    // 4. KPI 4: Propostas Enviadas (Valor acumulado)
    document.getElementById('kpi-prop-value').innerText = data.propostas.total;
    document.getElementById('kpi-prop-value-brl').innerText = `Volume: ${data.propostas.valor}`;
    renderSparkline('sparkline-prop', data.propostas.sparkline, true);

    // 5. KPI 5: Leads Qualificados
    document.getElementById('kpi-leads-qual-value').innerText = data.leadsQualificados.total;
    renderSparkline('sparkline-leads-qual', data.leadsQualificados.sparkline, true);

    // 6. KPI 6: Leads Tráfego Pago
    document.getElementById('kpi-trafego-pago-value').innerText = data.leadsTrafegoPago.total;
    renderSparkline('sparkline-trafego-pago', data.leadsTrafegoPago.sparkline, true);

    // 7. KPI 7: Leads Tráfego Pago Qualificado
    document.getElementById('kpi-trafego-qual-value').innerText = data.leadsTrafegoQualificado.total;
    renderSparkline('sparkline-trafego-qual', data.leadsTrafegoQualificado.sparkline, true);

    // 8. Gráficos detalhados
    updateFunnel(data);
    updateClosersBreakdown(data);
    updateRecentActivitiesTable(data);
}

// --- SISTEMA DE MODAIS INTERATIVOS (DETALHES DOS KPIS) ---
let currentPeriodKey = "mes";

function openKpiModal(kpiType) {
    const data = DASHBOARD_DATA[currentPeriodKey];
    const overlay = document.getElementById('kpi-modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalTableHead = document.getElementById('modal-table-head');
    const modalTableBody = document.getElementById('modal-table-body');
    const modalSummary = document.getElementById('modal-summary');
    
    if (!data || !overlay) return;
    
    overlay.classList.add('open');
    modalTableBody.innerHTML = '';
    modalSummary.innerHTML = '';
    
    if (kpiType === 'leads') {
        modalTitle.innerText = "Auditoria Comercial: Novos Leads Recebidos";
        modalSubtitle.innerText = `Leads que entraram no funil durante o período selecionado (${currentPeriodKey})`;
        
        modalSummary.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Leads Recebidos</span>
                <span class="summary-value">${data.leads.total}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Crescimento vs Prev.</span>
                <span class="summary-value">${data.leads.percentChange}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Principais Origens</span>
                <span class="summary-value" style="font-size: 14px; font-family: 'Inter';">Meta Ads, Google Ads</span>
            </div>
        `;
        
        modalTableHead.innerHTML = `
            <tr>
                <th>Nome do Lead</th>
                <th>Contato</th>
                <th>Origem</th>
                <th>Data Cadastro</th>
                <th>Status Interno</th>
            </tr>
        `;
        
        data.leads.details.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.nome}</strong></td>
                <td>${item.contato}</td>
                <td><span class="lead-source">🌐 ${item.origem}</span></td>
                <td>${item.data}</td>
                <td><span class="badge ${item.status === 'Qualificado' || item.status === 'Proposta Enviada' ? 'badge-success' : 'badge-warning'}">${item.status}</span></td>
            `;
            modalTableBody.appendChild(tr);
        });
        
    } else if (kpiType === 'calls') {
        modalTitle.innerText = "Auditoria Comercial: Ligações e Conexões (SDR)";
        modalSubtitle.innerText = `Auditoria de tentativas de chamada e agendamentos realizados pela equipe de SDR`;
        
        modalSummary.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Tentativas de Ligação</span>
                <span class="summary-value">${data.ligacoes.tentativas}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Ligações Conectadas</span>
                <span class="summary-value">${data.ligacoes.conexoes} (${data.ligacoes.taxaConexao})</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Hit Rate Comercial</span>
                <span class="summary-value">${data.ligacoes.hitRate}</span>
            </div>
        `;
        
        modalTableHead.innerHTML = `
            <tr>
                <th>Nome do Lead</th>
                <th>SDR Responsável</th>
                <th>Duração Chamada</th>
                <th>Resultado Operacional</th>
                <th>Hora/Data</th>
            </tr>
        `;
        
        data.ligacoes.details.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.lead}</strong></td>
                <td>${item.sdr}</td>
                <td>${item.duracao}</td>
                <td><span class="badge ${item.resultado.includes('Qualificado') || item.resultado.includes('Agendado') || item.resultado.includes('Aceita') ? 'badge-success' : 'badge-error'}">${item.resultado}</span></td>
                <td>${item.hora}</td>
            `;
            modalTableBody.appendChild(tr);
        });
        
    } else if (kpiType === 'qualificados') {
        modalTitle.innerText = "Auditoria Comercial: Leads Qualificados e Distribuição";
        modalSubtitle.innerText = `Leads validados pela qualificação de SDR e direcionados para agendamento com os Closers`;
        
        modalSummary.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Total Qualificados</span>
                <span class="summary-value">${data.qualificados.total}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Aproveitamento</span>
                <span class="summary-value">${data.qualificados.taxaConversao}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Closers Acionados</span>
                <span class="summary-value" style="font-size: 14px; font-family: 'Inter';">4 Profissionais Ativos</span>
            </div>
        `;
        
        modalTableHead.innerHTML = `
            <tr>
                <th>Nome do Lead</th>
                <th>Produto Interesse</th>
                <th>Faturamento/Patrimônio</th>
                <th>Closer Direcionado</th>
                <th>Data Distribuição</th>
            </tr>
        `;
        
        data.qualificados.details.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.nome}</strong></td>
                <td><span class="badge badge-success">${item.produto}</span></td>
                <td>${item.faturamento}</td>
                <td><strong>${item.closer}</strong></td>
                <td>${item.data}</td>
            `;
            modalTableBody.appendChild(tr);
        });
        
    } else if (kpiType === 'propostas') {
        modalTitle.innerText = "Auditoria Comercial: Propostas Comerciais Emitidas";
        modalSubtitle.innerText = `Volume financeiro e distribuição de propostas enviadas aos clientes qualificados`;
        
        modalSummary.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Propostas Emitidas</span>
                <span class="summary-value">${data.propostas.total}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Volume Financeiro</span>
                <span class="summary-value">${data.propostas.valor}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Média por Proposta</span>
                <span class="summary-value" style="font-size: 14px; font-family: 'Inter';">Aprox. ${formatCurrency(parseInt(data.propostas.valor.replace(/[^0-9]/g, '')) / data.propostas.total)}</span>
            </div>
        `;
        
        modalTableHead.innerHTML = `
            <tr>
                <th>Cliente Lead</th>
                <th>Estudo/Produto</th>
                <th>Valor Proposta</th>
                <th>Advogado Closer</th>
                <th>Status Atual</th>
            </tr>
        `;
        
        data.propostas.details.forEach(item => {
            let badgeClass = "badge-warning";
            if (item.status === 'Assinado') badgeClass = "badge-success";
            if (item.status === 'Perdido') badgeClass = "badge-error";
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.lead}</strong></td>
                <td>${item.produto}</td>
                <td><strong>${item.valor}</strong></td>
                <td>${item.closer}</td>
                <td><span class="badge ${badgeClass}">${item.status}</span></td>
            `;
            modalTableBody.appendChild(tr);
        });
    }
}

function closeModal() {
    const overlay = document.getElementById('kpi-modal-overlay');
    if (overlay) {
        overlay.classList.remove('open');
    }
}

// --- FILTRO DE PESQUISA NA TABELA DE ÚLTIMAS ATIVIDADES ---
function filterActivitiesTable() {
    const input = document.getElementById('search-activities');
    if (!input) return;
    
    const filter = input.value.toLowerCase();
    const tbody = document.getElementById('recent-activities-body');
    const rows = tbody.getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const textCell = rows[i].getElementsByTagName('td')[1];
        if (textCell) {
            const textValue = textCell.textContent || textCell.innerText;
            if (textValue.toLowerCase().indexOf(filter) > -1) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

// --- EVENTO DE CARREGAMENTO INICIAL DO DASHBOARD ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializar o dashboard com o período padrão ("Este Mês")
    refreshDashboard("mes");
    
    // 2. Configurar o evento de mudança de período
    const periodSelect = document.getElementById('period-select');
    if (periodSelect) {
        periodSelect.addEventListener('change', (e) => {
            currentPeriodKey = e.target.value;
            refreshDashboard(currentPeriodKey);
        });
    }
    
    // 3. Vincular modais aos KPI Cards
    const cards = [
        { id: 'kpi-leads', type: 'leads' },
        { id: 'kpi-calls', type: 'calls' },
        { id: 'kpi-qualified', type: 'qualificados' },
        { id: 'kpi-proposals', type: 'propostas' }
    ];
    
    cards.forEach(card => {
        const el = document.getElementById(card.id);
        if (el) {
            el.addEventListener('click', () => {
                openKpiModal(card.type);
            });
        }
    });
    
    // 4. Vincular botão de fechar modal
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    const overlay = document.getElementById('kpi-modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }
    
    // 5. Vincular filtro de busca
    const searchInput = document.getElementById('search-activities');
    if (searchInput) {
        searchInput.addEventListener('keyup', filterActivitiesTable);
    }
});
