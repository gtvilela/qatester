/// <reference types ="cypress" />

describe('Work with locators', () => {

    before(() => {
        cy.visit('https://www.wcaquino.me/cypress/componentes.html')
    })

    beforeEach(() => {
        cy.reload()
    })

    it('Using jquery selector', () => {
        cy.get(':nth-child(1) > :nth-child(3) > [type="button"]')
        cy.get('table#tabelaUsuarios > tbody tr:eq(0) > td:nth-child(3) > input').click() 
        cy.get('[onClick*="Francisco"]')
        cy.get('#tabelaUsuarios td:contains(\'Doutorado\'):eq(0) ~ td:eq(3) > input')
        cy.get("#tabelaUsuarios tr:contains('Doutorado'):eq(0) td:eq(6) > input ")
    })

    it('Using xpath', () => {
        cy.xpath('//input[contains(@onclick, \'Francisco\')]')
        cy.xpath('//table[@id=\'tabelaUsuarios\']//td[contains(., \'Francisco\')]/following-sibling::td/input')
        cy.xpath("//table[@id='tabelaUsuarios']//td[contains(., 'Francisco')]/..//input[@type='text']")
        cy.xpath("(//table[@id='tabelaUsuarios']//td[contains(., 'Doutorado')])[2]/..//input[@type='checkbox']")
        cy.xpath("//td[contains(., 'Usuario A')]/following-sibling::td[contains(., 'Mestrado')]/..//input[@type='text']").type('Funciona')
    })
})