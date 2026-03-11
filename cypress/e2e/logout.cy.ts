describe("logout", () => { 
    it("logs out", () => {
        cy.login(); 

        cy.logout();

        cy.visit("/app/dashboard");
        cy.url().should("include", "/login");
    })
})