/// <reference types ="cypress" />


describe('Helpers', () => {

    before(() => {
        cy.visit('https://www.wcaquino.me/cypress/componentes.html')
    })


    it('Wrap', () => {
        const obj = {nome: 'Gabriela', idade: 26}
        expect(obj).to.have.property('nome')
        cy.wrap(obj).should('have.property', 'nome')

        
         // cy.get('#formNome').then($el => {
        //   // $el.val('funciona via jQuery')
        //   cy.wrap($el).type('funciona via cypress')
        // })

        const promise = new Promise((res, rej) => {
            setTimeout(() => {
                res(10)
            }, 500)
        })

        cy.get('#buttonSimple').then(() => {
            console.log('Encontrei o primeiro botão')
        })

        //promise.then(num => console.log(num))
        cy.wrap(promise).then(retorno => console.log(retorno)) //Com o wrap ele retorna o resultado síncrono.
        cy.get('#buttonList').then(() => {
            console.log('Encontrei o segundo botão')
        })

        cy.wrap(1).then(num => {
            return 2 //Se fosse should, ele ignoraria e daria erro
        }).should('be.equal', 2)
    })

    it('Its', () => {
        const obj = {nome: 'Gabriela', idade: 26}
        //cy.wrap(obj).should('have.property', 'nome', 'Gabriela') //Terceiro parâmetro é o valor da propriedade
        cy.wrap(obj).its('nome').should('be.equal', 'Gabriela') //No its você não está mais a nível objeto, mas sim nível propriedade

        const obj2 = {nome: 'Nikolas', idade: 27, endereco: {rua: 'Otávio Barreto'}}
        cy.wrap(obj2).its('endereco').should('have.property', 'rua')
        cy.wrap(obj2).its('endereco').its('rua').should('be.equal', 'Otávio Barreto')
        cy.wrap(obj2).its('endereco').its('rua').should('contain', ' Barreto')
        cy.wrap(obj2).its('endereco.rua').should('contain', ' Barreto')


        cy.title().its('length').should('be.equal', 20)
    })

    it.only('Invoke', () => {
        const getValue = () => 1;
        const soma = (a, b) => a + b

        cy.wrap({fn: getValue}).invoke('fn').should('be.equal', 1)
        cy.wrap({fn: soma}).invoke('fn', 2, 5).should('be.equal', 7)

        cy.get('#formNome').invoke('val', 'Texto via invoke')
        cy.window().invoke('alert', 'Dá pra ver?')

        cy.get('#resultado')
            .invoke('html', '<input type="button" value="Gabriela invadindo seu HTML!"/>')

    })
})