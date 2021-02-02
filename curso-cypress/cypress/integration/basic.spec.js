/// <reference types ="cypress" />

describe('Cypress basics', () => {
    it.only('Should visit a page and assert title', () => {
        cy.visit('https://www.wcaquino.me/cypress/componentes.html')

       
       // cy.pause()
       
        cy.title()  
            .should('be.equal', 'Campo de Treinamento')
            .and('contain', 'Campo') //.debug()

        let syncTitle 

        cy.title().then(title => {
            console.log(title)

            cy.get('#formNome').type(title)

            syncTitle = title
        }) //then e should retornam promises

        cy.get('[data-cy=dataSobrenome]').then($el => {
            $el.val(syncTitle) //pelo jQuery
        })

        cy.get('#elementosForm\\:sugestoes').then($el => {
            cy.wrap($el).type(syncTitle) //pelo Cypress
        })
        
    })

    it('Should find and interact with an element', () => {
        cy.visit('https://www.wcaquino.me/cypress/componentes.html')
        cy.get('#buttonSimple')
            .click()
            .should('have.value', 'Obrigado!')
    })
})