/// <reference types ="cypress" />

describe('Work with basic elements', () => {

    beforeEach(() => {
        cy.visit('https://www.wcaquino.me/cypress/componentes.html')
    })

    const foods = ['Carne', 'Frango', 'Pizza', 'Vegetariano']
    foods.forEach(food => {

        it(`Cadastro com a comida ${food}`, () => {
    
            cy.get('#formNome').type('Gabriela')
                cy.get('#formSobrenome').type('Vilela')
                cy.get(`[name=formSexo][value=F`).click()
                cy.xpath(`//label[contains(., '${food}')]/preceding-sibling::input`).click()
                cy.get('#formEscolaridade').select('2o grau completo')
                cy.get('#formEsportes').select('Natacao')
    
                cy.get('#formCadastrar').click()
                cy.get('#resultado > :nth-child(1)').should('contain', 'Cadastrado!')
       })
    })

    it.only('Deve selecionar todos usando o each', () => {

        cy.get('#formNome').type('Gabriela')
        cy.get('#formSobrenome').type('Vilela')
        cy.get(`[name=formSexo][value=F`).click()
        //cy.get('[name=formComidaFavorita]').click({multiple: true})
        cy.get('[name=formComidaFavorita]').each($el => {
            if($el.val() !== 'vegetariano') {
                cy.wrap($el).click()
            }
        })
        cy.get('#formEscolaridade').select('2o grau completo')
        cy.get('#formEsportes').select('Natacao')

        //cy.clickAlert('#formCadastrar', 'Tem certeza que voce eh vegetariano?')

        cy.get('#formCadastrar').click()
        cy.get('#resultado > :nth-child(1)').should('contain', 'Cadastrado!')
    })
   
})
