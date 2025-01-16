import Quiz from '../../client/src/components/Quiz'; // Adjust path as needed

describe('Quiz Component Tests', () => {
  beforeEach(() => {
    // Mock the API response using Cypress fixture
    cy.fixture('questions.json').then((questions) => {
      cy.intercept('GET', '/api/questions/random', { statusCode: 200, body: questions }).as('getQuestions');
    });
  });

  it('should display the start button on initial load', () => {
    // Mount the Quiz component
    cy.mount(<Quiz />);

    // Check if the start button is visible
    cy.get('button').contains('Start Quiz').should('be.visible');
  });

  it('should fetch and display the first question when the quiz starts', () => {
    // Mount the Quiz component
    cy.mount(<Quiz />);

    // Click "Start Quiz" and wait for the API call
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Verify the first question and its answers
    cy.get('h2').should('contain.text', "What's 2 + 2?");
    cy.get('.alert').should('have.length', 3);
  });

  it('should show the final score after quiz completion', () => {
    cy.mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Answer the first question
    cy.get('button').contains('2').click();

    // Verify quiz completion
    cy.get('h2').should('contain.text', 'Quiz Completed');
    cy.get('.alert').should('contain.text', 'Your score: 1/1');
  });
});