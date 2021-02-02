/// <reference types ="cypress" />

it('A external test...', () => {

})

describe('Should group tests...', () => {

    describe.skip('Should group more specific tests...', () => {
        it('A specific test...', () => {

        })
    })

    describe('Should group more specific tests... 2', () => {
        it('A specific test... 2', () => {

        })
    })

    it.only('A internal test...', () => {

    })
    
})