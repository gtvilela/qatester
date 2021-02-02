/// <reference types ="cypress" />

describe('Esperas...', () => {

    before(() => {
        cy.visit('https://www.wcaquino.me/cypress/componentes.html')
    })

    beforeEach(() => {
        cy.reload()
    })

    it('Deve aguardar elemento estar disponível', () => {
        cy.get('#novoCampo').should('not.exist')
        cy.get('#buttonDelay').click()
        cy.get('#novoCampo').should('not.exist')
        cy.get('#novoCampo').should('exist')
        cy.get('#novoCampo').type('funciona')
    })

    it.only('Deve fazer novas tentativas', () => {
        cy.get('#buttonDelay').click()
        cy.get('#novoCampo')
            .should('not.exist')
        cy.get('#novoCampo')
            .should('exist')

    })

    it.only('Uso do find', () => {
        cy.get('#buttonList').click()
        cy.get('#lista li')
            .find('span')
            .should('contain', 'Item 1')
        cy.get('#lista li span').should('contain', 'Item 2')
    })

    it.only('Uso do find no botão que remove e adiciona o mesmo item da lista', () => {
        cy.get('#buttonListDOM').click()
        cy.get('#lista li')
            .find('span')
            .should('contain', 'Item 1')
        cy.get('#lista li span').should('contain', 'Item 2')
    })

    it.only('Uso do timeout', () => {
        cy.get('#buttonDelay').click()
        cy.get('#novoCampo', {timeout: 5000}).should('exist')

        cy.wait(5000)
        cy.get('#buttonList').click()
        cy.get('#lista li span', {timeout: 6000}).should('contain', 'Item 2')

        // cy.get('#buttonListDOM').click()
        // cy.get('#lista li span', {timeout: 30000})
        //     .should('have.length', 1)
        //     .should('have.length', 2)
        
        cy.get('#buttonListDOM').click()
        cy.get('#lista li span', {timeout: 30000})
            .should('have.length', 1)
        cy.get('#lista li span')
            .should('have.length', 2)
    })

    it.only('Click retry', () => {
        cy.get('#buttonCount')
            .click()
            .should('have.value', '11') //Ele fica tentando até o valor passar a ser verdadeiro
    })

    it.only('Should x Then', () => {
        cy.get('#buttonListDOM').then($el => { 
            //Should não espera o comando anterior terminar. O Then espera, por isso já retorna o resultado 1 vez. 
            //O should sempre ignora o retorno dele. O then sempre considera o return.
            //Caso você faça uma nova busca, opte pelo then
           // console.log($el)
            expect($el).to.have.length(1)
           // return 2
           cy.get('#buttonList')
        }) 
    })
    
})