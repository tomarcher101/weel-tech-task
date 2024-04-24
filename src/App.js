import React, { useEffect, useState } from "react";
import styled from "styled-components";

const PageContainer = styled.div`
  max-width: 1200px;
  padding: 24px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: sans-serif;
  font-size: 32px;
  font-weight: 600;
  text-align: center;
`;

const Search = styled.input`
  margin: 12px 0;
  padding: 4px;
  width: 300px;
`

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  display: table;
  border: 1px solid #ccc;
`;

const TableBody = styled.tbody`
  border: inherit;
`;

const TR = styled.tr`
  border: inherit;

  :nth-child(even) {
    background-color: #E7E9EB;
  }
`;

const TH = styled.th`
  font-size: 16px;
  background-color: #04aa6d;
  color: white;
  text-align: left;
  padding: 8px;
`;

const TD = styled.td`
  padding: 4px 8px 4px 8px  ;
  border: inherit;
`;

const tableHeaders = [
  "Status",
  "Date",
  "Merchant Name",
  "Team Member",
  "Category",
  "Amout",
  "GST",
  "Budget",
  "Receipt",
  "Billable",
];

const App = ({ categories, merchants, transactions }) => {
  const [searchInput, setSearchInput] = useState("");
  const [tableData, setTableData] = useState(
    transactions.map((row) => ({
      id: row.id,
      status: row.status[0].toUpperCase() + row.status.slice(1),
      date: row.date,
      merchant: merchants.find((merchant) => merchant.id === row.merchant).name,
      team_member: row.team_member,
      category: categories.find((category) => category.id === row.category)
        .name,
      amount: row.amount,
      gst: row.gst,
      budget: row.budget,
      receipt: row.receipt,
      billable: row.billable,
    }))
  );
  const [filteredTableData, setFilteredTableData] = useState(tableData);

  // Generic function that could technically be used for any column
  const updateCell = (transactionId, colKey, newValue) => {
    const newTableData = tableData.map((row) => {
      if (row.id === transactionId) {
        return {
          ...row,
          [colKey]: newValue,
        };
      }
      return row;
    });
    setTableData(newTableData);
  };

  // TODO: Implement sorting
  // const sortTable = (colKey) => {
  //   const newTableData = tableData.sort((a, b) => {
  //     if (a[colKey] < b[colKey]) {
  //       return -1;
  //     }
  //     if (a[colKey] > b[colKey]) {
  //       return 1;
  //     }
  //     return 0;
  //   });
  //   setTableData(newTableData);
  // }

  useEffect(() => {
    const filterTableData = (searchInput) => {
      const filteredTableData = tableData.filter(
        (row) =>
          row.merchant.toLowerCase().includes(searchInput.toLowerCase()) ||
          row.team_member.toLowerCase().includes(searchInput.toLowerCase()) ||
          row.category.toLowerCase().includes(searchInput.toLowerCase()) ||
          row.budget.toString().toLowerCase().includes(searchInput) ||
          row.amount.toString().toLowerCase().includes(searchInput) ||
          row.gst.toString().toLowerCase().includes(searchInput)
      );
      setFilteredTableData(filteredTableData);
    };
    filterTableData(searchInput);
  }, [searchInput, tableData]);

  return (
    <PageContainer>
      <Title>Transactions</Title>
        <Search
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search transactions..."
        />
      <Table>
        <thead>
          <tr>
            {tableHeaders.map((header, index) => {
              return <TH key={header.toLowerCase()}>{header}</TH>;
            })}
          </tr>
        </thead>
        <TableBody>
          {filteredTableData.map((row) => (
            <TR key={row.id} role="row">
              <TD role="cell">{row.status}</TD>
              <TD role="cell">{new Date(row.date).toLocaleDateString()}</TD>
              <TD role="cell">{row.merchant}</TD>
              <TD role="cell">{row.team_member}</TD>
              <TD role="cell">{row.category}</TD>
              <TD role="cell">${row.amount}</TD>
              <TD role="cell">${row.gst}</TD>
              <TD role="cell">{row.budget}</TD>
              <TD role="cell">
                <input type="checkbox" checked={row.receipt} readOnly />
              </TD>
              <TD role="cell">
                <input
                  type="checkbox"
                  checked={row.billable}
                  onChange={() => updateCell(row.id, "billable", !row.billable)}
                />
              </TD>
            </TR>
          ))}
        </TableBody>
      </Table>
    </PageContainer>
  );
};

export default App;
