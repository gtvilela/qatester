/// <reference types ="cypress" />

import loc from '../../support/locators'

describe('Should test at a functional level', () => {

    before(function () {
        cy.visit('http://barrigareact.wcaquino.me/')
        

        cy.fixture('userData').as('usuario').then( () => {
            cy.login(this.usuario.login, this.usuario.senha)
        })
        cy.resetApp()
    })

    it('Should create an account', () => {
        cy.get(loc.MENU.SETTINGS).click()
        cy.get(loc.MENU.CONTAS).click()
        cy.get(loc.CONTAS.NOME).type('Conta de teste')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MSG).should('contain', 'Conta inserida com sucesso')
    })

    it('Should update an account', () => {
        cy.get(loc.MENU.SETTINGS).click()
        cy.get(loc.MENU.CONTAS).click()
        cy.xpath(loc.CONTAS.XP_BTN_ALT).click()
        cy.get(loc.CONTAS.NOME)
            .clear()
            .type('Conta alterada')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MSG).should('contain', 'Conta atualizada com sucesso')
    })
})