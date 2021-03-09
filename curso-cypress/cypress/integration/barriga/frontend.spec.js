/// <reference types ='cypress' />

import "../../support/commandsContas";
import loc from "../../support/locators";
import buildEnv from "../../support/buildEnv";

describe("Should test at a functional level", () => {
  after(() => {
    cy.clearLocalStorage();
  });

  beforeEach(() => {
    buildEnv();
    cy.login("gt@gabriela.com", "gt6512");
    cy.get(loc.MENU.HOME).click();
  });

  it("Should create an account", () => {
    cy.route({
      method: "POST",
      url: "/contas",
      response: {
        id: 3,
        nome: "Conta de teste",
        visivel: true,
        usuario_id: 1,
      },
    }).as("saveConta");
    cy.acessarMenuConta();

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
        {
          id: 2,
          nome: "Conta de teste",
          visivel: true,
          usuario_id: 1,
        },
      ],
    }).as("contasSave");

    cy.inserirConta("Conta de teste");
    cy.mensagem("Conta inserida com sucesso");
  });

  it("Should update an account", () => {
    cy.route({
      method: "PUT",
      url: "/contas/**",
      response: {
        id: 1,
        nome: "Conta alterada",
        visivel: true,
        usuario_id: 1,
      },
    });

    cy.acessarMenuConta();
    cy.xpath(loc.CONTAS.FN_XP_BTN_ALT("Carteira")).click();
    cy.get(loc.CONTAS.NOME).clear().type("Conta alterada");
    cy.get(loc.CONTAS.BTN_SALVAR).click();
    cy.mensagem("Conta atualizada com sucesso");
  });

  it("Should not create an account with same name", () => {
    cy.route({
      method: "POST",
      url: "/contas",
      response: { error: "Já existe uma conta com esse nome!" },
      status: 400,
    }).as("saveContaMesmoNome");

    cy.acessarMenuConta();
    cy.inserirConta("Conta mesmo nome");
    cy.mensagem("code 400");
  });

  it("Should create a transaction", () => {
    cy.route({
      method: "POST",
      url: "/transacoes",
      response: {
        id: 423810,
        descricao: "Descrição",
        envolvido: "Teste",
        observacao: null,
        tipo: "REC",
        data_transacao: "2021-03-08T03:00:00.000Z",
        data_pagamento: "2021-03-08T03:00:00.000Z",
        valor: "12.00",
        status: false,
        conta_id: 459833,
        usuario_id: 13035,
        transferencia_id: null,
        parcelamento_id: null,
      },
    });

    cy.route({
        method: "GET",
        url: "/extrato/**",
        response: 'fixture:movimentacaoSalva'
      });

    cy.get(loc.MENU.MOVIMENTACAO).click();
    cy.get(loc.MOVIMENTACAO.DESCRICAO).type("Desc");
    cy.get(loc.MOVIMENTACAO.VALOR).type("123");
    cy.get(loc.MOVIMENTACAO.INTERESSADO).type("Interessado");
    cy.get(loc.MOVIMENTACAO.CONTA).select("Banco");
    cy.get(loc.MOVIMENTACAO.STATUS).click();
    cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click();
    cy.mensagem("sucesso");

   
    cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
 });

  it("Should get balance", () => {
    cy.route({
        method: "GET",
        url: "/transacoes/**",
        response: {
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
      });
      cy.route({
        method: "PUT",
        url: "/transacoes/**",
        response: {
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
      });
    cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA("Carteira")).should(
      "contain",
      "100,00"
    );

    cy.get(loc.MENU.EXTRATO).click();
    cy.xpath(
      loc.EXTRATO.FN_XP_EDITA_ELEMENTO("Movimentacao 1, calculo saldo")
    ).click();
    cy.get(loc.MOVIMENTACAO.DESCRICAO).should(
      "have.value",
      "Movimentacao 1, calculo saldo"
    );
    cy.get(loc.MOVIMENTACAO.STATUS).click();
    cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click();
    cy.mensagem("sucesso");

    cy.route({
        method: "GET",
        url: "/saldo",
        response: [
          {
            conta_id: 999,
            conta: "Carteira",
            saldo: "4034.00",
          },
          { conta_id: 9909, conta: "Banco", saldo: "10000000.00" },
        ],
      }).as("saldo");

    cy.get(loc.MENU.HOME).click();
    cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA("Carteira")).should(
      "contain",
      "4.034,00"
    );
  });

  it("Should remove a transaction", () => {

    cy.route({
        method: 'DELETE',
        url: '/transacoes/**',
        response: {}, status: 204
    }).as('delete')

    cy.get(loc.MENU.EXTRATO).click();
    cy.xpath(
      loc.EXTRATO.FN_XP_REMOVE_ELEMENTO("Movimentacao para exclusao")
    ).click();
    cy.mensagem("sucesso");
  });

  it.only("Should validate data and send it to create an account", () => {
    
    const reqStub = cy.stub();
    
    cy.route({
      method: "POST",
      url: "/contas",
      response: {
        id: 3,
        nome: "Conta de teste",
        visivel: true,
        usuario_id: 1,
      },
      onRequest: reqStub
      // onRequest: req => {
      //   expect(req.request.body.nome).to.be.empty
      //   expect(req.request.headers).to.have.property('Authorization')
      // }
    }).as("saveConta");
    cy.acessarMenuConta();

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
        {
          id: 2,
          nome: "Conta de teste",
          visivel: true,
          usuario_id: 1,
        },
      ],
    }).as("contasSave");

    cy.inserirConta("{CONTROL}");
    // cy.wait('@saveConta').its('request.body.nome').should('not.be.empty')
    cy.wait('@saveConta').then(() => {
      expect(reqStub.args[0][0].request.body.nome).to.be.empty
      expect(reqStub.args[0][0].request.headers).to.have.property('Authorization')
    })
    cy.mensagem("Conta inserida com sucesso");
  });




});
