const auth_config = require('../../src/auth_config.json')

it('Logs in with auth0', () => {
  cy.visit('http://localhost:3000/')
  cy.get('#qsLoginBtn').click()

  cy.origin(auth_config.domain, () => {
    cy.get('#username').type(Cypress.env('username'))
    cy.get('#password').type(Cypress.env('password'))
    cy.get("button[type='submit']").click()
  })

  cy.get('#qsLoginBtn').should('not.exist')
  cy.get('#profileDropDown').should('exist')
})

describe('with session', () => {

  // Custom login command that establishes a session
  Cypress.Commands.add("login",({username, password}) => {
    cy.session([username, password], () => {
      cy.visit('http://localhost:3000/')
      cy.get('#qsLoginBtn').click()
      cy.origin(auth_config.domain, { args: {username, password} }, ({username, password}) => {
        cy.get('#username').type(username)
        cy.get('#password').type(password)
        cy.get("button[type='submit']").click()
      })

      cy.get("h1").should("contain", "React.js Sample Project")
    }, {
      validate: () => {
        cy.visit('http://localhost:3000/')
        cy.get('#qsLoginBtn').should('not.exist')
      },
    })
  })

  beforeEach(() => {
    cy.login({
      username: Cypress.env('username'),
      password: Cypress.env('password')
    })
  })

  it('Logs in with auth0', () => {
    cy.visit('http://localhost:3000/')

    cy.get('#qsLoginBtn').should('not.exist')
    cy.get('#profileDropDown').should('exist')
  })

  it('visits the profile page', () => {
    cy.visit('http://localhost:3000/profile')

    cy.get('h2').contains('hatmankus@gmail.com')
  })

  it('visits the external-api page', () => {
    cy.visit('http://localhost:3000/external-api')
    cy.get('h1').contains('External API')
  })
})
