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
    cy.request({
      method: "GET",
      headers: { Authorization: `JWT ${token}` },
      url: "/contas",
      qs: {
        nome: "Conta para alterar",
      },
    }).then((res) => {
      cy.request({
        method: "PUT",
        headers: { Authorization: `JWT ${token}` },
        url: `/contas/${res.body[0].id}`,
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
        failOnStatusCode: false
      }).as("response");
  
      cy.get("@response").then((res) => {
          console.log(res)
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.property("error", "Já existe uma conta com esse nome!");
      });
  });

  it("Should create a transaction", () => {});

  it("Should get balance", () => {});

  it("Should remove a transaction", () => {});
});
