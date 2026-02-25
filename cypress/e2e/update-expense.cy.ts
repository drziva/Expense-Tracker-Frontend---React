describe("Update expense", () => {
    const expenseDescription = "Test expense " + Date.now();
    const updatedExpenseDescription = "Updated expense " + Date.now();

    afterEach(() => {
        cy.deleteExpense(updatedExpenseDescription);
    });
    
    it("updates an expense", () => {
        cy.login();
        cy.visit("/app/expenses");

        cy.get('[data-cy="add-expense-button"]').click();

        cy.get('[data-cy="expense-description-input"]').type(expenseDescription);
        cy.get('[data-cy="expense-amount-input"]').type("100");
        cy.get('[data-cy="expense-group-select"]').click()
            .find('[role="combobox"]')
            .click({ force: true });
        cy.get('ul[role="listbox"]').contains("Group").click();

        cy.get('[data-cy="create-button"]').click();

        cy.contains(expenseDescription).should("exist");
        cy.contains("100").should("exist");
        cy.contains("Group").should("exist");

        cy.get('[data-cy="toast-alert"]').should("exist");

        cy.get('[data-description="' + expenseDescription + '"]')
            .closest('[data-cy="table-row"]')
            .find('[data-cy="update-expense-button"]')
            .click()
    
        cy.get('[data-cy="expense-description-input"]').clear().type(updatedExpenseDescription);
        cy.get('[data-cy="expense-amount-input"]').clear().type("123123");
        cy.get('[data-cy="create-button"]').click();

        cy.contains(updatedExpenseDescription).should("exist");
        cy.get('[data-cy="toast-alert"]').should("exist");
    })
})