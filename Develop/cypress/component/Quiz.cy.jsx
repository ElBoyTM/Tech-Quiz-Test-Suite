/// <reference types="cypress" />
import Quiz from '../../client/src/components/Quiz';
import { mount } from 'cypress/react';
import { getQuestions } from '../../client/src/services/questionApi';

describe('Quiz Component Tests', () => {
  beforeEach(() => {
    
    cy.stub(getQuestions).resolves([
      {
        question: "What's 2 + 2?",
        answers: [
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: true },
          { text: '5', isCorrect: false },
        ],
      },
    ]);
  });

  it('should display the start button initially', () => {
    mount(<Quiz />);
    cy.get('button').contains('Start Quiz').should('be.visible');
  });

  it('should render the first question after starting', () => {
    mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
    cy.get('h2').should('contain.text', "What's 2 + 2?");
  });

  it('should handle correct and incorrect answers', () => {
    mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();

    // Click incorrect answer
    cy.get('button').contains('1').click();
    cy.get('h2').should('not.exist');

    // Restart and click correct answer
    cy.get('button').contains('Take New Quiz').click();
    cy.get('button').contains('2').click();
    cy.get('h2').should('not.exist');
  });

  it('should show final score after quiz completes', () => {
    mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();

    // Finish quiz
    cy.get('button').contains('2').click();
    cy.get('h2').should('contain.text', 'Quiz Completed');
    cy.get('.alert').should('contain.text', 'Your score: 1/1');
  });
});