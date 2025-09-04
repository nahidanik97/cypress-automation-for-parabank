import { data, elements, messages } from '../e2e/login-info-retrieval-data'
import { interceptUrls, } from '../../cypress/support/urls'
import { filePath } from '../support/paths'

describe('LOGIN INFO RETRIEVAL', function () {
    beforeEach(function () {
        cy.wait(500)
        cy.visit(Cypress.env('baseUrl'))
        cy.wait(500)
    })

    it('Retrieve login info', function () {

        cy.get(elements.loginPanelInOpeningPage).contains('a', 'Forgot login info?').click()

        // customer lookup
        cy.get(elements.firstNameField).should('be.visible').type(data.firstName)
        cy.get(elements.lastNameField).should('be.visible').type(data.lastName)
        cy.get(elements.addressField).should('be.visible').type(data.address)
        cy.get(elements.cityField).should('be.visible').type(data.city)
        cy.get(elements.stateField).should('be.visible').type(data.state)
        cy.get(elements.zipCodeField).should('be.visible').type(data.zipCode)
        cy.get(elements.ssnField).should('be.visible').type(data.SSN)

        cy.get(elements.findMyLoginInfoButton).should('be.visible').click()

        cy.wait(1000)
        // title assertion
        cy.get(elements.title).should("contain.text", data.title)

        cy.get(elements.customerLookupPanel).within(() => {
            cy.contains('Username').then(($el) => {
                const username = $el[0].nextSibling.textContent.replace(':', '').trim()
                cy.log(username).wait(500)

                cy.contains('Password').then(($el2) => {
                    const password = $el2[0].nextSibling.textContent.replace(':', '').trim()
                    cy.log(password).wait(500)

                    cy.writeFile(filePath.basePath + filePath.loginInfo + filePath.fileExtension, {
                        username: username,
                        password: password
                    })
                })
            })
        })

    })

    it('Login ', function () {

        cy.readFile(filePath.basePath + filePath.loginInfo + filePath.fileExtension).then((info) => {
            cy.get(elements.userNameInLogIn).should('be.visible').type(info.username)
            cy.get(elements.passwordInLogIn).should('be.visible').type(info.password)
        })
        cy.get(elements.loginButton).click()

        // assertion
        cy.get(elements.commonTitle).filter(':visible').contains(data.accountOverviewText)

        // logout
        cy.get(elements.accountServicesPanel).contains(data.logoutButtonText).click()

    })

})