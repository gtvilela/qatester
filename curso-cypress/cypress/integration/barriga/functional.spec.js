/// <reference types ="cypress" />

import '../../support/commandsContas';
import loc from '../../support/locators'

describe('Should test at a functional level', () => {

    before(function () {
        cy.visit('http://barrigareact.wcaquino.me/')
        

        cy.fixture('userData').as('usuario').then( () => {
            cy.login(this.usuario.login, this.usuario.senha)
        })
    })
    
    beforeEach(() => {
        cy.get(loc.MENU.HOME).click();
        cy.resetApp()
    })

    it('Should create an account', () => {
        cy.acessarMenuConta();
        cy.inserirConta('Conta de teste');
        cy.mensagem('Conta inserida com sucesso')
    })

    it('Should update an account', () => {
        cy.acessarMenuConta();
        cy.xpath(loc.CONTAS.FN_XP_BTN_ALT('Conta para alterar')).click()
        cy.get(loc.CONTAS.NOME)
            .clear()
            .type('Conta alterada')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.mensagem('Conta atualizada com sucesso')
    })

    it('Should not create an account with same name', () => {
        cy.acessarMenuConta();
        cy.inserirConta('Conta mesmo nome')
        cy.mensagem('code 400')
    })

    it('Should create a transaction', () => {
        cy.get(loc.MENU.MOVIMENTACAO).click();
        cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Desc')
        cy.get(loc.MOVIMENTACAO.VALOR).type('123')
        cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Interessado')
        cy.get(loc.MOVIMENTACAO.CONTA).select('Conta para movimentacoes')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click();
        cy.mensagem('sucesso')
        cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Desc', '123')).should('exist')
    })

    it('Should get balance', () => {
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '534,00');

        cy.get(loc.MENU.EXTRATO).click();
        cy.xpath(loc.EXTRATO.FN_XP_EDITA_ELEMENTO('Movimentacao 1, calculo saldo')).click();
        cy.get(loc.MOVIMENTACAO.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click();
        cy.mensagem('sucesso')
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click();
        cy.get(loc.MENU.HOME).click();
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '4.034,00');


    })

    it('Should remove a transaction', () => {
        cy.get(loc.MENU.EXTRATO).click();
        cy.xpath(loc.EXTRATO.FN_XP_REMOVE_ELEMENTO('Movimentacao para exclusao')).click();
        cy.mensagem('sucesso')
    })
})