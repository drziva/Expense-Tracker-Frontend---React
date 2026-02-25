describe("login", () => {
    it("logs in", () => {
        cy.login();

        cy.url().should("include","/app")
    })
})