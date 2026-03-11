describe("Expense creation", () => {
    const expenseDescription = `Test expense ${Date.now()}`;

    afterEach(() => {
        cy.deleteExpense(expenseDescription);
    });

    it("creates an expense", () => {
        cy.login();
        cy.visit("/app/expenses");

        cy.get('[data-cy="add-expense-button"]').click();

        cy.get('[data-cy="expense-description-input"]').type(expenseDescription);
        cy.get('[data-cy="expense-amount-input"]').type("100");
        cy.get('[data-cy="expense-group-select"]')
            .find('[role="combobox"]')
            .should("be.visible")
            .click();

        cy.get('ul[role="listbox"]')
            .should("be.visible")
            .contains("Group")
            .click();

        cy.get('[data-cy="create-button"]').click();

        cy.contains(expenseDescription).should("exist");
        cy.contains("100").should("exist");
        cy.contains("Group").should("exist");

        cy.get('[data-cy="toast-alert"]').should("exist");
    })
});