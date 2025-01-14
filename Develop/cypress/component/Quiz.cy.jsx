import React from "react";
import Quiz from "../../client/src/components/Quiz";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Quiz Component", () => {
    it("should render without throwing an error", () => {
        cy.visit("http://localhost:3000/quiz");
        cy.get("h1").should("have.text", "Quiz");
    });

    it("should render a button", () => {
        cy.get("button").should("exist");
    });
});