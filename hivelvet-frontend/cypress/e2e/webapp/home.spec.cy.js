describe('Test render of home page', () => {
    it('should render to login page if user not logged in', () => {
        cy.visit('/home');
        cy.location('pathname').should('eq', '/login');
    });
});
