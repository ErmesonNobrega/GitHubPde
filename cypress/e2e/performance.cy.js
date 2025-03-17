import '../support/commands'

describe("Testes de Performance - SauceDemo", () => {
    const baseUrl = "https://www.saucedemo.com";
  
    beforeEach(() => {
      cy.visit(baseUrl);
    });
  
    it("🔹 Login deve ser rápido (abaixo de 2s)", () => {
      cy.intercept("POST", "**/login").as("loginRequest");
      
      cy.get('[data-test="username"]').type("standard_user");
      cy.get('[data-test="password"]').type("secret_sauce");
      cy.get('[data-test="login-button"]').click();
  
      cy.wait("@loginRequest").its("response.duration").should("be.lessThan", 2000);
    });
  
    it("🔹 Carregamento da Página Inicial deve ser rápido", () => {
      cy.visit(baseUrl);
      cy.window().its("performance.timing.loadEventEnd").should("be.greaterThan", 0);
    });
  
    it("🔹 Tempo de resposta da API de produtos deve ser menor que 2s", () => {
      cy.intercept("GET", "**/inventory.json").as("inventoryRequest");
      
      cy.visit(baseUrl);
      cy.wait("@inventoryRequest").its("response.duration").should("be.lessThan", 2000);
    });
  
    it("🔹 Adicionar um produto ao carrinho deve ser rápido (abaixo de 1.5s)", () => {
      cy.intercept("POST", "**/cart").as("addToCart");
  
      cy.get('[data-test="username"]').type("standard_user");
      cy.get('[data-test="password"]').type("secret_sauce");
      cy.get('[data-test="login-button"]').click();
  
      cy.get(".inventory_item").first().find("button").click();
      cy.wait("@addToCart").its("response.duration").should("be.lessThan", 1500);
    });
  
    it("🔹 Tempo de logout deve ser menor que 1.5s", () => {
      cy.intercept("POST", "**/logout").as("logoutRequest");
  
      cy.get('[data-test="username"]').type("standard_user");
      cy.get('[data-test="password"]').type("secret_sauce");
      cy.get('[data-test="login-button"]').click();
  
      cy.get("#react-burger-menu-btn").click();
      cy.get("#logout_sidebar_link").click();
  
      cy.wait("@logoutRequest").its("response.duration").should("be.lessThan", 1500);
    });
  });
  