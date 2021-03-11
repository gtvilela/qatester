// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import loc from "./locators";

Cypress.Commands.add("clickAlert", (locator, message) => {
  cy.get(locator).click();
  cy.on("window:alert", (msg) => {
    console.log(msg);
    expect(msg).to.be.equal(message);
  });
});

Cypress.Commands.add("login", (user, password) => {
  cy.visit("http://barrigareact.wcaquino.me/");
  cy.get(loc.LOGIN.USER).type(user);
  cy.get(loc.LOGIN.PASSWORD).type(password);
  cy.get(loc.LOGIN.BTN_LOGIN).click();
  cy.get(loc.MSG).should("contain", "Bem vindo");
});

Cypress.Commands.add("resetApp", () => {
  cy.get(loc.MENU.SETTINGS).click();
  cy.get(loc.MENU.RESET).click();
});

Cypress.Commands.add("mensagem", (msg) => {
  cy.get(loc.MSG).should("contain", msg);
});

Cypress.Commands.add("getToken", (user, pwd) => {
  cy.request({
    method: "POST",
    url: "/signin",
    body: {
      email: user,
      redirecionar: false,
      senha: pwd,
    },
  })
    .its("body.token")
    .should("not.be.empty")
    .then((token) => {
      Cypress.env('token', token)
    });
});

Cypress.Commands.add("resetRest", () => {
  cy.request({
    method: "GET",
    url: "/reset",
  })
    .its("status")
    .should("be.equal", 200);
});

Cypress.Commands.add("getAccountByName", (name) => {
  cy.fixture('userData').as('usuario').then( function() {
    
    cy.getToken(this.usuario.login, this.usuario.senha).then((token) => {
      cy.request({
        method: "GET",
        headers: { Authorization: `JWT ${token}` }, 
        url: "/contas",
        qs: {
          nome: name,
        },
      }).then(res => {
        return res.body[0].id
      })
    });
  })
});


Cypress.Commands.overwrite('request', (originalFn, ...options) => {
  if(options.length === 1) {
    if(Cypress.env('token')) {
    options[0].headers = { Authorization: `JWT ${Cypress.env('token')}`}
    }
  }

  return originalFn(...options)
})