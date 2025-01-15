/// <reference types="cypress" />
import Quiz from '../../client/src/components/Quiz';
import { mount } from 'cypress/react';
import { getQuestions } from '../../client/src/services/questionApi';

describe('Quiz Component Tests', () => {
    beforeEach(() => {
      cy.fixture('questions.json').as('questions');
    });
  
    it('should display the start button initially', () => {
      mount(<Quiz />);
      cy.get('button').contains('Start Quiz').should('be.visible');
    });
  
    it('should render the first question after starting', function () {
      cy.stub(getQuestions).resolves(this.questions);
      mount(<Quiz />);
      cy.get('button').contains('Start Quiz').click();
      cy.get('h2').should('contain.text', "What's 2 + 2?");
    });
  
    it('should show final score after quiz completes', function () {
      cy.stub(getQuestions).resolves(this.questions);
      mount(<Quiz />);
      cy.get('button').contains('Start Quiz').click();
  
      // Finish quiz
      cy.get('button').contains('2').click(); // Correct answer
      cy.get('button').contains('2').click(); // Correct answer
      cy.get('h2').should('contain.text', 'Quiz Completed');
      cy.get('.alert').should('contain.text', 'Your score: 2/2');
    });
  });