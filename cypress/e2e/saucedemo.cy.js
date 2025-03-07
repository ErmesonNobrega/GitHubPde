describe('Testes do SauceDemo', () => {
    const baseUrl = 'https://www.saucedemo.com/';
    const username = 'standard_user';
    const password = 'secret_sauce';
  
    beforeEach(() => {
      cy.visit(baseUrl);
    });
  
    // 🔹 1. Teste de login com credenciais válidas
    it('Deve fazer login com sucesso', () => {
      cy.get('[data-test="username"]').type(username);
      cy.get('[data-test="password"]').type(password);
      cy.get('[data-test="login-button"]').click();
      cy.url().should('include', '/inventory.html');
    });
  
    // 🔹 2. Teste de login com senha incorreta
    it('Deve exibir erro ao inserir senha incorreta', () => {
      cy.get('[data-test="username"]').type(username);
      cy.get('[data-test="password"]').type('wrong_password');
      cy.get('[data-test="login-button"]').click();
      cy.get('[data-test="error"]').should('contain', 'Username and password do not match');
    });
  
    // 🔹 3. Teste de logout
    it('Deve fazer logout com sucesso', () => {
      cy.login(username, password);
      cy.get('#react-burger-menu-btn').click();
      cy.get('#logout_sidebar_link').click();
      cy.url().should('eq', baseUrl);
    });
  
    // 🔹 4. Teste de adição de produto ao carrinho
    it('Deve adicionar um produto ao carrinho', () => {
      cy.login(username, password);
      cy.get('.inventory_item').first().find('button').click();
      cy.get('.shopping_cart_badge').should('have.text', '1');
    });
  
    // 🔹 5. Teste de remoção de produto do carrinho
    it('Deve remover um produto do carrinho', () => {
      cy.login(username, password);
      cy.get('.inventory_item').first().find('button').click();
      cy.get('.shopping_cart_badge').should('have.text', '1');
      cy.get('.shopping_cart_link').click();
      cy.get('.cart_button').click();
      cy.get('.shopping_cart_badge').should('not.exist');
    });
  
    // 🔹 6. Teste de checkout
    it('Deve finalizar a compra', () => {
      cy.login(username, password);
      cy.addItemToCart();
      cy.get('.shopping_cart_link').click();
      cy.get('[data-test="checkout"]').click();
      cy.get('[data-test="firstName"]').type('João');
      cy.get('[data-test="lastName"]').type('Silva');
      cy.get('[data-test="postalCode"]').type('12345');
      cy.get('[data-test="continue"]').click();
      cy.get('[data-test="finish"]').click();
      cy.get('.complete-header').should('contain', 'Thank you for your order!');
    });
  
    // 🔹 7. Teste de ordenação A-Z
    it('Deve ordenar produtos de A-Z', () => {
      cy.login(username, password);
      cy.get('.product_sort_container').select('az');
      cy.get('.inventory_item_name').first().should('have.text', 'Sauce Labs Backpack');
    });
  
    // 🔹 8. Teste de ordenação Z-A
    it('Deve ordenar produtos de Z-A', () => {
      cy.login(username, password);
      cy.get('.product_sort_container').select('za');
      cy.get('.inventory_item_name').first().should('have.text', 'Test.allTheThings() T-Shirt (Red)');
    });
  
    // 🔹 9. Teste de ordenação por preço (Menor para Maior)
    it('Deve ordenar produtos do menor para o maior preço', () => {
      cy.login(username, password);
      cy.get('.product_sort_container').select('lohi');
      cy.get('.inventory_item_price').first().should('contain', '$7.99');
    });
  
    // 🔹 10. Teste de ordenação por preço (Maior para Menor)
    it('Deve ordenar produtos do maior para o menor preço', () => {
      cy.login(username, password);
      cy.get('.product_sort_container').select('hilo');
      cy.get('.inventory_item_price').first().should('contain', '$49.99');
    });
  
    // 🔹 11-20: Testes adicionais
    it('Deve exibir erro ao tentar login sem preencher os campos', () => {
      cy.get('[data-test="login-button"]').click();
      cy.get('[data-test="error"]').should('be.visible');
    });
  
    it('Deve adicionar múltiplos produtos ao carrinho', () => {
      cy.login(username, password);
      cy.get('.inventory_item').each(($el) => {
        cy.wrap($el).find('button').click();
      });
      cy.get('.shopping_cart_badge').should('have.text', '6');
    });
  
    it('Deve validar que o carrinho está vazio ao não adicionar produtos', () => {
      cy.login(username, password);
      cy.get('.shopping_cart_link').click();
      cy.get('.cart_item').should('not.exist');
    });
  
    it('Deve verificar se os botões de adicionar/remover funcionam corretamente', () => {
      cy.login(username, password);
      cy.get('.inventory_item').first().find('button').click().should('have.text', 'Remove');
      cy.get('.inventory_item').first().find('button').click().should('have.text', 'Add to cart');
    });
  
    it('Deve verificar se a página de erro aparece ao acessar uma URL inválida', () => {
      cy.visit(baseUrl + 'random-url');
      cy.get('h3').should('contain', 'Epic sadface');
    });
  
    it('Deve validar a responsividade do site', () => {
      cy.viewport('iphone-6');
      cy.visit(baseUrl);
      cy.get('[data-test="username"]').should('be.visible');
    });
  
    it('Deve verificar se os links de redes sociais estão presentes no rodapé', () => {
      cy.login(username, password);
      cy.get('.social_twitter').should('exist');
      cy.get('.social_facebook').should('exist');
      cy.get('.social_linkedin').should('exist');
    });
  
    it('Deve verificar se o menu lateral abre e fecha corretamente', () => {
      cy.login(username, password);
      cy.get('#react-burger-menu-btn').click();
      cy.get('.bm-menu-wrap').should('be.visible');
      cy.get('#react-burger-cross-btn').click();
      cy.get('.bm-menu-wrap').should('not.be.visible');
    });
  
    it('Deve verificar se o botão de reset do app limpa os produtos do carrinho', () => {
      cy.login(username, password);
      cy.get('.inventory_item').first().find('button').click();
      cy.get('.shopping_cart_badge').should('have.text', '1');
      cy.get('#react-burger-menu-btn').click();
      cy.get('#reset_sidebar_link').click();
      cy.get('.shopping_cart_badge').should('not.exist');
    });
  
    it('Deve exibir erro ao tentar checkout sem preencher os dados', () => {
      cy.login(username, password);
      cy.get('.shopping_cart_link').click();
      cy.get('[data-test="checkout"]').click();
      cy.get('[data-test="continue"]').click();
      cy.get('[data-test="error"]').should('be.visible');
    });
  });
  