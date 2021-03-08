const buildEnv = () => {
  cy.server();
  cy.route({
    method: "POST",
    url: "/signin",
    response: {
      id: 1000,
      nome: "Usuário falso",
      token:
        "Uma string muito grande que não deveria ser aceito mas na verdade, vai.",
    },
  }).as("login");
  
  cy.route({
    method: "GET",
    url: "/saldo",
    response: [
      {
        conta_id: 999,
        conta: "Carteira",
        saldo: "100.00",
      },
      { conta_id: 9909, conta: "Banco", saldo: "10000000.00" },
    ],
  }).as("saldo");

  cy.route({
    method: "GET",
    url: "/contas",
    response: [
      {
        id: 1,
        nome: "Carteira",
        visivel: true,
        usuario_id: 13035,
      },
      {
        id: 2,
        nome: "Banco",
        visivel: true,
        usuario_id: 13035,
      },
    ],
  }).as("contas");

  cy.route({
    method: "GET",
    url: "/extrato/**",
    response: [
      {
        conta: "Conta para movimentacoes",
        id: 423811,
        descricao: "Movimentacao para exclusao",
        envolvido: "AAA",
        observacao: null,
        tipo: "DESP",
        data_transacao: "2021-03-08T03:00:00.000Z",
        data_pagamento: "2021-03-08T03:00:00.000Z",
        valor: "-1500.00",
        status: true,
        conta_id: 460241,
        usuario_id: 13035,
        transferencia_id: null,
        parcelamento_id: null,
      },
      {
        conta: "Conta com movimentacao",
        id: 423812,
        descricao: "Movimentacao de conta",
        envolvido: "BBB",
        observacao: null,
        tipo: "DESP",
        data_transacao: "2021-03-08T03:00:00.000Z",
        data_pagamento: "2021-03-08T03:00:00.000Z",
        valor: "-1500.00",
        status: true,
        conta_id: 460242,
        usuario_id: 13035,
        transferencia_id: null,
        parcelamento_id: null,
      },
      {
        conta: "Conta para saldo",
        id: 423813,
        descricao: "Movimentacao 1, calculo saldo",
        envolvido: "CCC",
        observacao: null,
        tipo: "REC",
        data_transacao: "2021-03-08T03:00:00.000Z",
        data_pagamento: "2021-03-08T03:00:00.000Z",
        valor: "3500.00",
        status: false,
        conta_id: 460243,
        usuario_id: 13035,
        transferencia_id: null,
        parcelamento_id: null,
      },
      {
        conta: "Conta para saldo",
        id: 423814,
        descricao: "Movimentacao 2, calculo saldo",
        envolvido: "DDD",
        observacao: null,
        tipo: "DESP",
        data_transacao: "2021-03-08T03:00:00.000Z",
        data_pagamento: "2021-03-08T03:00:00.000Z",
        valor: "-1000.00",
        status: true,
        conta_id: 460243,
        usuario_id: 13035,
        transferencia_id: null,
        parcelamento_id: null,
      },
      {
        conta: "Conta para saldo",
        id: 423815,
        descricao: "Movimentacao 3, calculo saldo",
        envolvido: "EEE",
        observacao: null,
        tipo: "REC",
        data_transacao: "2021-03-08T03:00:00.000Z",
        data_pagamento: "2021-03-08T03:00:00.000Z",
        valor: "1534.00",
        status: true,
        conta_id: 460243,
        usuario_id: 13035,
        transferencia_id: null,
        parcelamento_id: null,
      },
      {
        conta: "Conta para extrato",
        id: 423816,
        descricao: "Movimentacao para extrato",
        envolvido: "FFF",
        observacao: null,
        tipo: "DESP",
        data_transacao: "2021-03-08T03:00:00.000Z",
        data_pagamento: "2021-03-08T03:00:00.000Z",
        valor: "-220.00",
        status: true,
        conta_id: 460244,
        usuario_id: 13035,
        transferencia_id: null,
        parcelamento_id: null,
      },
    ],
  });
};

export default buildEnv;
