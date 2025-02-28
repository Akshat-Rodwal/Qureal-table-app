import React from "react";
import TableComponent from "./components/TableComponent";

const sampleData = [
  { id: 1, name: "John Doe", age: 28 },
  { id: 2, name: "Jane Smith", age: 32 },
];

const sampleColumns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: (info) => info.getValue(),
  },
];

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <TableComponent data={sampleData} columns={sampleColumns} />
    </div>
  );
}

export default App;
