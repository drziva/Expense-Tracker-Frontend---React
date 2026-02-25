import { renderApp } from "./render";
import ExpensesPage from "../pages/ExpensesPage";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("renders the expenses page", async () => {
    renderApp(<ExpensesPage/>);

    expect(await screen.findByText("Expenses")).toBeInTheDocument();

    expect(await screen.findByText("Gym Membership")).toBeInTheDocument();

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
});

test("creates a new expense", async () => {
  renderApp(<ExpensesPage/>);

  // Wait for page load
  await screen.findByText("Expenses");

  // Open modal
  await userEvent.click(screen.getByRole("button", { name: /add expense/i }));

  // Wait for modal fields
  const descInput = await screen.findByTestId("expense-description-input");
  const amountInput = screen.getByTestId("expense-amount-input");
  const groupSelect = screen.getByTestId("expense-group-select");

  // Fill fields
  await userEvent.type(descInput, "New Expense");
  await userEvent.type(amountInput, "25");

  // Select group
  await userEvent.click(groupSelect);
  await userEvent.click(await screen.findByText(/Health/i));

  // SUBMIT — IMPORTANT FIX
  await userEvent.click(screen.getByRole("button", { name: /create/i }));

  // Mutation triggers → Query invalidates → MSW returns updated list
  expect(await screen.findByText("New Expense")).toBeInTheDocument();
});