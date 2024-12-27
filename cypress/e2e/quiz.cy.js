describe("Tech Quiz E2E Tests", () => {
  beforeEach(() => {
    cy.fixture("questions").then((mockQuestions) => {
      cy.intercept("GET", "/api/questions", {
        statusCode: 200,
        body: mockQuestions,
      }).as("getQuestions");
    });
  });

  it("should start the quiz when the start button is clicked", () => {
    cy.visit("/");
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getQuestions");
    cy.fixture("questions").then((mockQuestions) => {
      cy.get("h2").should("contain", mockQuestions[0].question);
    });
  });

  it("should display the next question when an answer is clicked", () => {
    cy.visit("/");
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getQuestions");
    cy.get("button").contains("2").click(); // Click the correct answer for the first question
    cy.fixture("questions").then((mockQuestions) => {
      cy.get("h2").should("contain", mockQuestions[1].question);
    });
  });

  it("should display the quiz completed message when all questions are answered", () => {
    cy.visit("/");
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getQuestions");
    cy.fixture("questions").then((mockQuestions) => {
      // Answer all questions
      mockQuestions.forEach((question, index) => {
        cy.get("button")
          .contains(index + 1)
          .click();
      });
      cy.get("h2").should("contain", "Quiz Completed");
      cy.get(".alert-success").should(
        "contain",
        `Your score: ${mockQuestions.length}/${mockQuestions.length}`,
      );
    });
  });

  it("should restart the quiz when the take new quiz button is clicked", () => {
    cy.visit("/");
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getQuestions");
    cy.fixture("questions").then((mockQuestions) => {
      // Answer all questions
      mockQuestions.forEach((question, index) => {
        cy.get("button")
          .contains(index + 1)
          .click();
      });
      cy.get("button").contains("Take New Quiz").click();
      cy.wait("@getQuestions");
      cy.get("h2").should("contain", mockQuestions[0].question);
    });
  });
});
