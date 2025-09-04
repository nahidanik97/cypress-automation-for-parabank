import { data, elements, messages } from './account-open-data'
import { interceptUrls, } from '../../cypress/support/urls'
import { filePath } from '../support/paths'

describe('ACCOUNT OPEN AND BALANCE ASSERTION', function () {
    beforeEach(function () {
        cy.wait(500)
        cy.visit(Cypress.env('baseUrl'))
        cy.wait(500)
    })

    it('Retrieve customer info', function () {

        // login
        cy.readFile(filePath.basePath + filePath.loginInfo + filePath.fileExtension).then((info) => {
            cy.get(elements.userNameInLogIn).should('be.visible').type(info.username)
            cy.get(elements.passwordInLogIn).should('be.visible').type(info.password)
        })

        // intercepting api to get customer info
        cy.intercept('GET', interceptUrls.accountsInfo).as('accInfo')
        cy.get(elements.loginButton).click()
        cy.wait('@accInfo', { timeout: 50000 }).its('response.body').then((data) => {
            cy.writeFile(filePath.basePath + filePath.customerInfo + filePath.fileExtension, {
                initialAccountId: data[0].id,
                customerId: data[0].customerId,
                initialAccountBalance: data[0].balance,
            })
        })

        // logout
        cy.get(elements.accountServicesPanel).contains(data.logoutButtonText).click()

    })

    it("Account open", () => {

        // login
        cy.readFile(filePath.basePath + filePath.loginInfo + filePath.fileExtension).then((info) => {
            cy.get(elements.userNameInLogIn).should('be.visible').type(info.username)
            cy.get(elements.passwordInLogIn).should('be.visible').type(info.password)
            cy.get(elements.loginButton).click()
        })

        // open new account
        // cy.get(elements.accountServicesPanel).find('ul').within(() => {
        //     cy.contains('li', data.openNewAccountButton).click()
        // })
        cy.get(elements.accountServicesPanel).contains('li', data.openNewAccountButton).click()

        // account type
        cy.get(elements.accountTypeDropdown).select(data.accountType)

        // payee account
        cy.readFile(filePath.basePath + filePath.customerInfo + filePath.fileExtension).then((info) => {
            cy.get(elements.accountSelectDropdown).select(info.initialAccountId.toString())
        })

        cy.get(elements.openNewAccountButton).click()
        // assertion
        cy.get(elements.commonTitle).should("contain", data.accountOpenedText).wait(1000)

        cy.get(elements.newAccountNumber).invoke('text').then((newAcc) => {
            cy.writeFile(filePath.basePath + filePath.newAccountInfo + filePath.fileExtension, { account: newAcc.trim() })
        })

        // account overview [assertion]
        // cy.get(elements.accountServicesPanel).find('ul').within(() => {
        //     cy.contains('li', data.accountOverviewButton).click()
        // })
        cy.get(elements.accountServicesPanel).contains('li', data.accountOverviewButton).click()

        // balance assertion
        cy.readFile(filePath.basePath + filePath.newAccountInfo + filePath.fileExtension).then((info) => {
            cy.get(elements.accOverviewTable)
                .find('tbody')
                .find('tr').find('a')
                .contains(info.account)
                .parent('td').parent('tr')
                .within(() => {
                    cy.get('td').eq(1).should('contain', data.accountOpeningBalance)
                    cy.get('td').eq(2).should('contain', data.accountOpeningBalance)
                })
        })

        // logout
        cy.get(elements.accountServicesPanel).contains(data.logoutButtonText).click()


    })
})
