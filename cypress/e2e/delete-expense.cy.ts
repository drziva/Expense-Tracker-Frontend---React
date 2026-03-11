describe("Delete expense", () => {
    const expenseDescription = `Test expense ${Date.now()}`;

    beforeEach(() => {
        cy.login();
        cy.visit("/app/expenses");
        cy.createExpense(expenseDescription, 100);
    });

    it("deletes an expense", () => {
        cy.contains(expenseDescription).should("exist");
        cy.contains("100").should("exist");
        cy.contains("Group").should("exist");

        cy.get('[data-cy="toast-alert"]').should("exist");

        cy.get('[data-description="' + expenseDescription + '"]')
            .closest('[data-cy="table-row"]')
            .find('[data-cy="delete-expense-button"]')
            .click();
        cy.get('[data-cy="confirm-delete-button"]')
            .click();
        
        cy.contains(expenseDescription).should("not.exist");
        cy.get('[data-cy="toast-alert"]').should("exist");
    })
})