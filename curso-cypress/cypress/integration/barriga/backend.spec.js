/// <reference types ="cypress" />

describe("Should test at a functional level", () => {
  let token;

  before(() => {
    cy.fixture("userData")
      .as("usuario")
      .then(function () {
        cy.getToken(this.usuario.login, this.usuario.senha).then((tkn) => {
          token = tkn;
        });
      });
  });

  beforeEach(() => {
    cy.resetRest(token);
  });

  it("Should create an account", () => {
    //fazer login pelo backend
    cy.request({
      method: "POST",
      headers: { Authorization: `JWT ${token}` }, //Novas apis precisam mandar Baerer + token
      url: "/contas",
      body: {
        nome: "Conta Teste Novo 4",
      },
    }).as("response");

    cy.get("@response").then((res) => {
      expect(res.status).to.be.equal(201);
      expect(res.body).to.have.property("id");
      expect(res.body).to.have.property("nome", "Conta Teste Novo 4");
    });
  });

  it("Should update an account", () => {
    cy.getAccountByName("Conta para alterar").then((contaId) => {
      cy.request({
        method: "PUT",
        headers: { Authorization: `JWT ${token}` },
        url: `/contas/${contaId}`,
        body: {
          nome: "Conta teste update",
        },
      })
        .as("response")
        .its("status")
        .should("be.equal", 200);
    });
  });

  it("Should not create an account with same name", () => {
    cy.request({
      method: "POST",
      headers: { Authorization: `JWT ${token}` }, //Novas apis precisam mandar Baerer + token
      url: "/contas",
      body: {
        nome: "Conta mesmo nome",
      },
      failOnStatusCode: false,
    }).as("response");

    cy.get("@response").then((res) => {
      expect(res.status).to.be.equal(400);
      expect(res.body).to.have.property(
        "error",
        "Já existe uma conta com esse nome!"
      );
    });
  });

  it("Should create a transaction", () => {
    cy.getAccountByName("Conta para movimentacoes").then((contaId) => {
      cy.request({
        method: "POST",
        url: "/transacoes",
        headers: { Authorization: `JWT ${token}` },
        body: {
          conta_id: contaId,
          data_pagamento: Cypress.moment()
            .add({ days: 1 })
            .format("DD/MM/YYYY"),
          data_transacao: Cypress.moment().format("DD/MM/YYYY"),
          descricao: "Descrição",
          envolvido: "Teste",
          status: true,
          tipo: "REC",
          valor: "7777.00",
        },
      }).as("response");
    });

    cy.get("@response").its("status").should("be.equal", 201);
    cy.get("@response").its("body.id").should("exist");
  });

  it.only("Should get balance", () => {
    cy.request({
      url: "/saldo",
      method: "GET",
      headers: { Authorization: `JWT ${token}` },
    }).then((res) => {
      let saldoConta;
      res.body.forEach((c) => {
        if (c.conta === "Conta para saldo") saldoConta = c.saldo;
      });
      expect(saldoConta).to.be.equal("534.00");
    });

    cy.request({
      method: "GET",
      url: "/transacoes",
      headers: { Authorization: `JWT ${token}` },
      qs: {
        descricao: "Movimentacao 1, calculo saldo",
      },
    }).then((res) => {
      cy.request({
        url: `/transacoes/${res.body[0].id}`,
        method: "PUT",
        headers: { Authorization: `JWT ${token}` },
        body: {
          status: true,
          data_transacao: Cypress.moment(res.body[0].data_transacao).format(
            "DD/MM/YYYY"
          ),
          data_pagamento: Cypress.moment(res.body[0].data_transacao).format(
            "DD/MM/YYYY"
          ),
          descricao: res.body[0].descricao,
          envolvido: res.body[0].envolvido,
          valor: res.body[0].valor,
          conta_id: res.body[0].conta_id,
        },
      })
        .its("status")
        .should("be.equal", 200);
    });

    cy.request({
      url: "/saldo",
      method: "GET",
      headers: { Authorization: `JWT ${token}` },
    }).then((res) => {
      let saldoConta;
      res.body.forEach((c) => {
        if (c.conta === "Conta para saldo") saldoConta = c.saldo;
      });
      expect(saldoConta).to.be.equal("4034.00");
    });
  });

  it("Should remove a transaction", () => {
   
  });
});
