/// <reference types="cypress" />

describe('Quiz Component', () => {
    beforeEach(() => {
      // Stub API responses
      cy.intercept('GET', '**/questions', {
        statusCode: 200,
        body: [
          {
            question: "What's 2 + 2?",
            answers: [
              { text: '3', isCorrect: false },
              { text: '4', isCorrect: true },
              { text: '5', isCorrect: false },
            ],
          },
          {
            question: "What's the capital of France?",
            answers: [
              { text: 'Berlin', isCorrect: false },
              { text: 'Paris', isCorrect: true },
              { text: 'Rome', isCorrect: false },
            ],
          },
        ],
      }).as('getQuestions');
      cy.visit('/');
    });
  
    it('should display the start button on initial load', () => {
      cy.get('button').contains('Start Quiz').should('be.visible');
    });
  
    it('should fetch and display the first question when the quiz starts', () => {
      cy.get('button').contains('Start Quiz').click();
      cy.wait('@getQuestions');
      cy.get('h2').should('contain.text', "What's 2 + 2?");
      cy.get('.alert').should('have.length', 3); // 3 answer choices
    });
  
    it('should update the score and proceed to the next question on correct answer', () => {
      cy.get('button').contains('Start Quiz').click();
      cy.wait('@getQuestions');
  
      // Click the correct answer for the first question
      cy.get('button').contains('2').click();
      cy.get('h2').should('contain.text', "What's the capital of France?");
    });
  
    it('should display the final score after the last question', () => {
      cy.get('button').contains('Start Quiz').click();
      cy.wait('@getQuestions');
  
      // Answer both questions
      cy.get('button').contains('2').click(); // Correct answer for Q1
      cy.get('button').contains('2').click(); // Correct answer for Q2
  
      cy.get('h2').should('contain.text', 'Quiz Completed');
      cy.get('.alert').should('contain.text', 'Your score: 2/2');
    });
  
    it('should allow the user to restart the quiz', () => {
      cy.get('button').contains('Start Quiz').click();
      cy.wait('@getQuestions');
  
      // Complete the quiz
      cy.get('button').contains('2').click(); // Correct answer for Q1
      cy.get('button').contains('2').click(); // Correct answer for Q2
  
      cy.get('button').contains('Take New Quiz').click();
      cy.wait('@getQuestions');
  
      cy.get('h2').should('contain.text', "What's 2 + 2?");
      cy.get('.alert').should('have.length', 3); // 3 answer choices
    });
  
    it('should show a loading spinner while fetching questions', () => {
      cy.intercept('GET', '**/questions', (req) => {
        req.reply((res) => {
          setTimeout(() => res.send(), 2000); // Delay response to simulate loading
        });
      }).as('delayedGetQuestions');
  
      cy.get('button').contains('Start Quiz').click();
      cy.get('.spinner-border').should('be.visible');
      cy.wait('@delayedGetQuestions');
      cy.get('h2').should('contain.text', "What's 2 + 2?");
    });
  });