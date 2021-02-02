/// <reference types ="cypress" />

describe('Work with basic elements', () => {

    before(() => {
        cy.visit('https://www.wcaquino.me/cypress/componentes.html')
    })

    beforeEach(() => {
        cy.reload()
    })

    it('Cadastro', () => {
        cy.get('#formNome').type('Gabriela')
        cy.get('[data-cy=dataSobrenome]').type('Vilela')
        cy.get('#formSexoMasc')
            .click()
            .should('be.checked')


        cy.get('#formCadastrar').click()

        cy.get('#resultado').should('contain', 'Cadastrado!')
    })

    it.only('Forma realizada pelo instrutor', () => {
        const stub = cy.stub().as('cadastro')

        cy.on('window:alert', stub)
        cy.get('#formCadastrar')
            .click()
            .then(() => expect(stub.getCall(0)).to.be.calledWith('Nome eh obrigatorio'))

        cy.get('#formNome').type('Gabriela')
        cy.get('#formCadastrar')
            .click()
            .then(() => expect(stub.getCall(1)).to.be.calledWith('Sobrenome eh obrigatorio'))
        
        cy.get('[data-cy=dataSobrenome]').type('Vilela')
        cy.get('#formCadastrar')
            .click()
            .then(() => expect(stub.getCall(2)).to.be.calledWith('Sexo eh obrigatorio'))
        
        cy.get('#formSexoFem').click()

        cy.get('#formCadastrar').click()

        cy.get('#resultado').should('contain', 'Cadastrado!')

    })
})