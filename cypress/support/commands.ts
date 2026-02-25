/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      logout(): Chainable<void>;
      createExpense(description: string, amount: number): Chainable<void>;
      deleteExpense(description: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", () => {
  cy.visit("/login");
  cy.get('[data-cy="login-email"]').type("nikolazivaljevic15@gmail.com");
  cy.get('[data-cy="login-password"]').type("password123");
  cy.get('[data-cy="login-submit"]').click();
  cy.url().should("include", "/app");
});

Cypress.Commands.add("logout", () => {
  cy.visit("/dashboard");

  cy.get('[data-cy="user-button"]').click();
  cy.get('[data-cy="logout-button"]').click();
  cy.url().should("include", "/login");
});

Cypress.Commands.add("createExpense", (description: string, amount: number) => {
  cy.get('[data-cy="add-expense-button"]').click();

  cy.get('[data-cy="expense-description-input"]').type(description);
  cy.get('[data-cy="expense-amount-input"]').type(amount.toString());
  cy.get('[data-cy="expense-group-select"]')
      .find('[role="combobox"]')
      .should("be.visible")
      .click();

  cy.get('ul[role="listbox"]')
      .should("be.visible")
      .contains("Group")
      .click();

  cy.get('[data-cy="create-button"]').click();

  cy.contains(description).should("exist");
  cy.contains(amount.toString()).should("exist");
  cy.contains("Group").should("exist");
  cy.get('[data-cy="toast-alert"]').should("exist");
});

Cypress.Commands.add("deleteExpense", (description: string) => {
  if(!cy.contains(description).should("exist")) {
    return;
  }
  cy.contains(description)
      .closest('[data-cy="table-row"]')
      .find('[data-cy="delete-expense-button"]')
      .click();
  
  cy.get('[data-cy="confirm-delete-button"]')
      .click();
  
  cy.contains(description).should("not.exist");
  cy.get('[data-cy="toast-alert"]').should("exist");
});