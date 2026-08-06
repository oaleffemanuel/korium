# -*- coding: utf-8 -*-
"""
Fonte única do Catálogo de Serviços e Precificação da Korium.

Este arquivo é a ÚNICA fonte de verdade. O Markdown e o PDF em docs/ são
gerados a partir daqui por scripts/build_catalogo.py, justamente para que
os dois nunca fiquem com valores diferentes.

Para alterar preços, edite as tabelas abaixo e rode:

    python3 scripts/build_catalogo.py

Documento interno. Não publicar no site nem enviar a cliente sem revisão.
"""

VERSAO = "1.0"
DATA_REVISAO = "6 de agosto de 2026"

TITULO = "Catálogo de Serviços e Precificação"
SUBTITULO = "Documento interno de operação comercial"

AVISO = (
    "Documento interno. Os valores são referências comerciais provisórias e "
    "podem ser ajustados conforme complexidade, urgência, volume, "
    "responsabilidade técnica e despesas de terceiros."
)

# --------------------------------------------------------------------------
# 2. Serviços inclusos na mensalidade
# --------------------------------------------------------------------------

MENSAIS_COLS = [
    "Serviço",
    "Incluso?",
    "Limite",
    "Frequência",
    "Esforço estimado",
    "Complexidade",
    "Observações",
]

# Larguras em mm. A soma precisa fechar em 174 mm (A4 menos as margens).
MENSAIS_LARGURAS = [31, 14, 24, 21, 20, 25, 39]

MENSAIS_ROWS = [
    [
        "Atendimento via WhatsApp",
        "Sim",
        "Sem limite",
        "Contínuo",
        "Variável",
        "Baixa",
        "Canal principal de contato com o cliente.",
    ],
    [
        "Resposta em até 10 minutos",
        "Sim",
        "Horário comercial",
        "Contínuo",
        "Variável",
        "Baixa",
        "Compromisso contratual, não é meta interna.",
    ],
    [
        "Contabilidade mensal",
        "Sim",
        "Sem limite",
        "Mensal",
        "2 a 4 h",
        "Média",
        "Fechamento e conferência do período.",
    ],
    [
        "Escrita fiscal",
        "Sim",
        "Até o limite de notas",
        "Mensal",
        "1 a 3 h",
        "Média",
        "Ver limites na seção 3.",
    ],
    [
        "Escrituração contábil",
        "Sim",
        "Sem limite",
        "Mensal",
        "2 a 4 h",
        "Média",
        "Lançamentos e conciliação.",
    ],
    [
        "Apuração de impostos",
        "Sim",
        "Sem limite",
        "Mensal",
        "1 a 2 h",
        "Média",
        "Revisão dupla antes do envio.",
    ],
    [
        "Emissão de guias",
        "Sim",
        "Sem limite",
        "Mensal",
        "30 min",
        "Baixa",
        "Enviadas com antecedência do vencimento.",
    ],
    [
        "Obrigações acessórias",
        "Sim",
        "Sem limite",
        "Mensal e anual",
        "1 a 3 h",
        "Média",
        "Conforme regime e atividade da empresa.",
    ],
    [
        "Orientação tributária básica",
        "Sim",
        "Dúvidas pontuais",
        "Contínuo",
        "Variável",
        "Baixa",
        "Estudo estruturado é serviço extraordinário.",
    ],
    [
        "Organização documental",
        "Sim",
        "Sem limite",
        "Contínuo",
        "1 h",
        "Baixa",
        "Documentos e histórico em canal único.",
    ],
    [
        "Avisos de prazo",
        "Sim",
        "Sem limite",
        "Mensal",
        "30 min",
        "Baixa",
        "Comunicação ativa, antes do vencimento.",
    ],
    [
        "Reuniões quando necessário",
        "Sim",
        "Ver seção 3",
        "Sob demanda",
        "30 a 60 min",
        "Baixa",
        "Agendadas conforme necessidade razoável.",
    ],
]

# --------------------------------------------------------------------------
# 3. Serviços inclusos com limite de uso
# --------------------------------------------------------------------------

LIMITES_COLS = ["Serviço", "Limite provisório incluso", "Excedente", "Observações"]
LIMITES_LARGURAS = [42, 42, 40, 50]

LIMITES_ROWS = [
    [
        "Notas fiscais emitidas pela Korium",
        "20 notas por mês",
        "R$ 1 por nota",
        "Emissão feita pelo cliente não consome o limite.",
    ],
    [
        "Funcionários em folha",
        "1 funcionário",
        "R$ 80 por mês, por funcionário",
        "Admissão e demissão são cobradas à parte.",
    ],
    [
        "Folhas ou pró-labores",
        "1 pró-labore",
        "R$ 50 por mês, por folha adicional",
        "Vale para sócios e retiradas adicionais.",
    ],
    [
        "Reuniões agendadas",
        "1 por mês",
        "R$ 200 por hora",
        "Conversas rápidas no WhatsApp não contam.",
    ],
    [
        "Declaração anual do MEI",
        "1 por ano",
        "R$ 150 fora do pacote",
        "Inclusa para clientes MEI ativos.",
    ],
]

# --------------------------------------------------------------------------
# 5. Preços-base provisórios (serviços extraordinários)
# --------------------------------------------------------------------------

PRECOS_COLS = ["Serviço", "Preço-base", "Observações"]
PRECOS_LARGURAS = [62, 40, 72]

PRECOS_ROWS = [
    ["Abertura de MEI", "R$ 40", ""],
    ["Abertura de empresa no Simples", "R$ 200 + taxas", ""],
    ["Baixa de MEI", "R$ 150", ""],
    ["Baixa de empresa", "R$ 600 + taxas", ""],
    ["Alteração cadastral simples", "R$ 250 + taxas", ""],
    ["Alteração contratual", "R$ 500 + taxas", ""],
    ["Desenquadramento ou transformação de MEI", "R$ 450 + taxas", ""],
    ["Regularização de pendências simples", "A partir de R$ 250", ""],
    ["Parcelamento tributário", "R$ 200", ""],
    ["Declaração anual do MEI fora do pacote", "R$ 150", ""],
    ["IRPF simples", "A partir de R$ 200", ""],
    ["IRPF complexo", "A partir de R$ 400", ""],
    ["Admissão de funcionário", "R$ 150", ""],
    [
        "Demissão de funcionário",
        "R$ 250",
        "Quando solicitado pelo cliente, a Korium poderá conduzir "
        "diretamente a comunicação da demissão com o colaborador, além de "
        "realizar todos os procedimentos trabalhistas e fiscais "
        "relacionados ao desligamento.",
    ],
    ["Funcionário adicional", "R$ 80 por mês", ""],
    ["Folha ou pró-labore adicional", "R$ 50 por mês", ""],
    ["Nota fiscal excedente emitida pela Korium", "R$ 1 por nota", ""],
    ["Certificado digital", "Custo do certificado + R$ 100", ""],
    ["Consultoria extraordinária", "R$ 200 por hora", ""],
    ["Planejamento tributário pontual", "A partir de R$ 600", ""],
    ["Recuperação tributária", "Sob análise", ""],
]

# --------------------------------------------------------------------------
# 6. Regras de ajuste
# --------------------------------------------------------------------------

AJUSTE_COLS = ["Situação", "Multiplicador", "Quando aplicar"]
AJUSTE_LARGURAS = [46, 30, 98]

AJUSTE_ROWS = [
    ["Solicitação padrão", "1,0 ×", "Caso comum, sem complicação e dentro do prazo normal."],
    [
        "Complexidade intermediária",
        "1,5 ×",
        "Mais documentos, mais de um órgão envolvido ou histórico desorganizado.",
    ],
    [
        "Complexidade alta ou urgência",
        "2,0 ×",
        "Prazo curto por necessidade do cliente, passivo relevante ou risco técnico maior.",
    ],
]

# --------------------------------------------------------------------------
# 8. Histórico de revisões
# --------------------------------------------------------------------------

HISTORICO_COLS = ["Versão", "Data", "Alterações"]
HISTORICO_LARGURAS = [22, 38, 114]

HISTORICO_ROWS = [
    ["1.0", "06/08/2026", "Versão inicial do catálogo."],
]

# --------------------------------------------------------------------------
# Textos corridos
# --------------------------------------------------------------------------

FINALIDADE = [
    "Este catálogo existe para que qualquer pessoa da Korium consiga responder "
    "a duas perguntas sem depender de ninguém: o que já está incluso na "
    "mensalidade do cliente e quanto cobrar quando o pedido sai do combinado. "
    "Sem uma referência escrita, cada orçamento vira uma decisão pessoal, e "
    "clientes parecidos acabam pagando valores diferentes pelo mesmo trabalho.",
    "Os valores aqui são ponto de partida, e não tabela fechada. Servem para "
    "que a conversa comece de um lugar razoável e para que ninguém precise "
    "improvisar um número no meio de um atendimento. O preço final de um "
    "serviço extraordinário sempre depende do caso concreto e sempre passa "
    "pela aprovação do cliente antes da execução.",
    "O documento é interno. Não é lista de preços pública, não vai para o "
    "site e não é enviado ao cliente como se fosse um cardápio. O que o "
    "cliente recebe é uma proposta escrita para a situação dele.",
]

NOTA_LIMITES = (
    "Os limites desta seção são as informações mais provisórias do documento. "
    "Foram definidos por estimativa, antes de termos volume real de "
    "atendimento, e devem ser revisados assim que houver alguns meses de "
    "operação para comparar. Se um limite estiver sendo estourado por quase "
    "todos os clientes, ele está errado e o certo é corrigir o limite, não "
    "cobrar excedente de todo mundo."
)

EXTRAORDINARIOS = [
    "Serviço extraordinário é todo trabalho que não faz parte da rotina "
    "mensal contratada. Regularização de passivo herdado, abertura e "
    "encerramento de empresa, alterações societárias, parcelamento, "
    "declarações de pessoa física e projetos pontuais entram nessa "
    "categoria.",
    "A razão de separar não é cobrar mais, é deixar visível o que é rotina e "
    "o que é exceção. Contabilidade que embute tudo numa mensalidade genérica "
    "precisa cobrar de todos, todo mês, por aquilo que só alguns vão usar.",
    "Nenhum serviço desta seção é executado sem aprovação prévia do cliente. "
    "Quando o trabalho extraordinário decorre de erro nosso, não é cobrado.",
]

REGRAS_EXTRAS = [
    "Taxas de órgãos públicos, custo de certificado digital e despesas de "
    "terceiros são cobrados à parte, pelo valor real, sem acréscimo nosso.",
    "Todo serviço extraordinário precisa ser aprovado pelo cliente antes da "
    "execução, com escopo e valor informados por escrito.",
    "O preço pode ser revisto quando o volume real de trabalho se mostrar "
    "diferente do previsto. Nesse caso, avisamos antes de continuar, e não "
    "depois de concluir.",
    "Nunca surpreender o cliente com cobrança não aprovada. Fatura com item "
    "que o cliente não reconhece é falha nossa de comunicação, mesmo quando o "
    "serviço era devido.",
]

PRINCIPIOS = [
    "Não cobramos por dúvida simples. Perguntar faz parte do serviço e um "
    "cliente que evita perguntar para não gerar custo é um cliente que vamos "
    "perder por outro motivo, mais tarde.",
    "Não executamos serviço extraordinário sem aprovação, mesmo quando temos "
    "certeza de que o cliente aprovaria.",
    "Não damos de graça trabalho claramente extraordinário. Regalia pontual "
    "vira expectativa permanente e depois vira discussão.",
    "Explicamos o motivo de toda cobrança adicional. O cliente precisa "
    "entender o que gerou o valor, não apenas ver o valor.",
    "Revisamos este catálogo com dados reais de operação, e não por intuição. "
    "Tempo gasto por tipo de serviço é a informação que mais falta hoje e a "
    "primeira que devemos passar a registrar.",
]

PRINCIPIOS_RODAPE = (
    "As decisões comerciais deste catálogo seguem os Princípios Comerciais da "
    "Korium (docs/PRINCIPIOS_COMERCIAIS.md). Em caso de conflito entre os dois "
    "documentos, prevalece o de princípios."
)
