describe('SauceDemo Login Test', () => {
    it('Should login with standard user and logout', () => {
      // Acessa o site
      cy.visit('https://www.saucedemo.com/');
      
      // Preenche o login
      cy.get('#user-name').type('standard_user');
      cy.get('#password').type('secret_sauce');
      
      // Clica no botão de login
      cy.get('#login-button').click();
      
      // Verifica se a URL mudou para a página de inventário
      cy.url().should('include', '/inventory.html');
      
      // Faz logout
      cy.get('#react-burger-menu-btn').click();
      cy.get('#logout_sidebar_link').click();
  
      // Verifica que voltou à página inicial
      cy.url().should('eq', 'https://www.saucedemo.com/');
    });
  });