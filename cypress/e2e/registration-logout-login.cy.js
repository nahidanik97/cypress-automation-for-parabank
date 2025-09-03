import { data, elements, messages } from '../e2e/registration-logout-login-data'
import { interceptUrls, } from '../../cypress/support/urls'

describe('REGISTRATION > LOGOUT > LOGIN', function () {
    beforeEach(function () {
        cy.visit(Cypress.env('baseUrl'))
    })

    it('Registratiom and logout', function () {

        // click on register
        // cy.intercept('GET', interceptUrls.footerBgInOpeningPage).as('footerBg')
        cy.get(elements.loginPanelInOpeningPage).contains('a', 'Register').click()
        // cy.wait('@footerBg', { timeout: 50000 }).its('response.statusCode').should('eq', 200)

        // registration
        cy.get(elements.firstNameField).should('be.visible').type(data.firstName)
        cy.get(elements.lastNameField).should('be.visible').type(data.lastName)
        cy.get(elements.addressField).should('be.visible').type(data.address)
        cy.get(elements.cityField).should('be.visible').type(data.city)
        cy.get(elements.stateField).should('be.visible').type(data.state)
        cy.get(elements.zipCodeField).should('be.visible').type(data.zipCode)
        cy.get(elements.phoneNumberField).should('be.visible').type(data.phone)
        cy.get(elements.ssnField).should('be.visible').type(data.SSN)
        cy.get(elements.userNameField).should('be.visible').type(data.username)
        cy.get(elements.passwordField).should('be.visible').type(data.password)
        cy.get(elements.confirmfield).should('be.visible').type(data.password)

        cy.get(elements.registerButton).should('be.visible').click()

        // confirmation
        cy.get(elements.registratiomConfirmation).should('be.visible').contains(messages.registrationConfirmation)

        // logout
        cy.get(elements.accountServicesPanel).contains(data.logoutButtonText).click()

    })


    it('Login', function () {

        cy.get(elements.userNameInLogIn).should('be.visible').type(data.username)
        cy.get(elements.passwordInLogIn).should('be.visible').type(data.password)
        cy.get(elements.loginButton).click()

        // assertion
        // cy.get(elements.accountOverviewDiv).find('h1').should('be.visible').and('contains', data.accountOverviewText)
        cy.get(elements.commonTitle).filter(':visible').contains(data.accountOverviewText)

        // logout
        cy.get(elements.accountServicesPanel).contains(data.logoutButtonText).click()

    })

})
