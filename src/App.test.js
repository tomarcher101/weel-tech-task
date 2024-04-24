import React from "react";
import App from "./App";
import { render, within, screen, fireEvent } from "@testing-library/react";
import categoriesData from "./data/categories.json";
import merchantsData from "./data/merchants.json";
import transactionsData from "./data/transactions.json";

const renderApp = ({
  categories = categoriesData,
  merchants = merchantsData,
  transactions = transactionsData,
} = {}) =>
  render(
    <App
      categories={categories}
      merchants={merchants}
      transactions={transactions}
    />
  );

const getRows = (screen) => screen.getAllByRole("row");
const getStatusCell = (row) => within(row).getAllByRole("cell")[0];
const getStatusCellInRow = (screen, rowNumber) =>
  getStatusCell(getRows(screen)[rowNumber]);

it("should show title", () => {
  renderApp();
  screen.getByRole("heading", { name: "Transactions" });
});

it("should be an empty table when there are no transactions", () => {
  renderApp({ transactions: [] });
  const rows = getRows(screen);
  expect(rows).toHaveLength(1); // Header row
});

it("should show all transactions", () => {
  renderApp();
  const rows = getRows(screen);
  expect(rows).toHaveLength(transactionsData.length + 1);
});

describe("status", () => {
  it("should show transaction status when it is complete", () => {
    const completeTransaction = transactionsData.find(
      ({ status }) => status === "complete"
    );
    renderApp({ transactions: [completeTransaction] });
    const statusCell = getStatusCellInRow(screen, 1);
    within(statusCell).getByText("Complete");
  });

  it("should show transaction status when it is incomplete", () => {
    const incompleteTransaction = transactionsData.find(
      ({ status }) => status === "incomplete"
    );
    renderApp({ transactions: [incompleteTransaction] });
    const statusCell = getStatusCellInRow(screen, 1);
    within(statusCell).getByText("Incomplete");
  });

  it("should show transaction status when it is exported", () => {
    const incompleteTransaction = transactionsData.find(
      ({ status }) => status === "exported"
    );
    renderApp({ transactions: [incompleteTransaction] });
    const statusCell = getStatusCellInRow(screen, 1);
    within(statusCell).getByText("Exported");
  });
});

describe("merchant", () => {
  it("should show merchant name when it is Intercom", () => {
    const intercomId = merchantsData.find(({ name }) => name === "Intercom").id;
    const intercomTransaction = transactionsData.find(
      ({ merchant }) => merchant === intercomId
    );
    renderApp({ transactions: [intercomTransaction] });
    const row = getRows(screen)[1];
    const merchantCell = within(row).getAllByRole("cell")[2];
    within(merchantCell).getByText("Intercom");
  });
});

// Can do this with every column, but you get the general idea.

// It's worth writing tests for receipt and billable columns, as they have unique functionality.
describe("receipt", () => {
  it("should be read-only", () => {
    const hasReceiptTransaction = transactionsData.find(
      ({ receipt }) => receipt === true
    );
    renderApp({ transactions: [hasReceiptTransaction] });
    const row = getRows(screen)[1];
    const receiptCell = within(row).getAllByRole("cell")[8];
    const checkbox = within(receiptCell).getByRole("checkbox");
    expect(checkbox.checked).toEqual(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toEqual(true);
  });
});

describe("billable", () => {
  it("should be changeable", () => {
    const billableTransaction = transactionsData.find(
      ({ billable }) => billable === true
    );
    renderApp({ transactions: [billableTransaction] });
    const row = getRows(screen)[1];
    const receiptCell = within(row).getAllByRole("cell")[9];
    const checkbox = within(receiptCell).getByRole("checkbox");
    expect(checkbox.checked).toEqual(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toEqual(false);
  });
});

describe("search", () => {
  it("should be shown", () => {
    renderApp();
    screen.getByPlaceholderText("Search transactions...");
  });

  it("should filter by merchant", () => {
    renderApp();
    const searchInput = screen.getByPlaceholderText("Search transactions...");
    fireEvent.change(searchInput, { target: { value: "Intercom" } });
    const rows = getRows(screen);
    expect(rows).toHaveLength(18);
  });

  it("should filter by team member", () => {
    renderApp();
    const searchInput = screen.getByPlaceholderText("Search transactions...");
    fireEvent.change(searchInput, { target: { value: "Casey Tran" } });
    const rows = getRows(screen);
    expect(rows).toHaveLength(2);
  });

  it("should filter by amount", () => {
    renderApp();
    const searchInput = screen.getByPlaceholderText("Search transactions...");
    fireEvent.change(searchInput, { target: { value: "2894" } });
    const rows = getRows(screen);
    expect(rows).toHaveLength(2);
  });

  // and so on...
});


// Think that is most of the unique functionality covered.
