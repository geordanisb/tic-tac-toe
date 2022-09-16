describe('empty spec', () => {
  it('shoul exist home page', () => {
    cy.visit('/')
  })
  it('should have a board',()=>{
    cy.get('[data-cy="board"]').within(()=>{
      cy.get('[type="button"]').should('have.length',9)
    })
  })
  it('should have a button "Create new game" and works correctly',()=>{
    cy.intercept('/api/tic-tac-toe/play').as('createNew')
    cy.contains('Create new game').click({force:true});
    cy.wait('@createNew').then((inter)=>{
      cy.wrap(inter).its('response').its('body').should('have.a.property','historial')
      cy.wrap(inter).its('response').its('body').should('have.a.property','estadoTablero')
    })

  })


})

export {}