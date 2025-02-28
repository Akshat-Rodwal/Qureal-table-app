// import React from "react";
// import TableComponent from "./components/TableComponent";

// const sampleData = [
//   { id: 1, name: "John Doe", age: 28 },
//   { id: 2, name: "Jane Smith", age: 32 },
// ];

// const sampleColumns = [
//   {
//     accessorKey: "id",
//     header: "ID",
//     cell: (info) => info.getValue(),
//   },
//   {
//     accessorKey: "name",
//     header: "Name",
//     cell: (info) => info.getValue(),
//   },
//   {
//     accessorKey: "age",
//     header: "Age",
//     cell: (info) => info.getValue(),
//   },
// ];

// function App() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <TableComponent data={sampleData} columns={sampleColumns} />
//     </div>
//   );
// }

// export default App;


// import React, { useState } from "react";
// import TableComponent from "./components/TableComponent";

// const App = () => {
//   const [tableValue, setTableValue] = useState({
//     data: [
//       { id: 1, name: "John Doe", age: 28 },
//       { id: 2, name: "Jane Smith", age: 32 },
//     ],
//     columns: [
//       { accessorKey: "id", header: "ID" },
//       { accessorKey: "name", header: "Name" },
//       { accessorKey: "age", header: "Age" },
//     ],
//   });

//   const handleTableChange = (newTableValue) => {
//     setTableValue(newTableValue);
//   };

//   return (
//     <div>
//       <TableComponent value={tableValue} onChange={handleTableChange} />
//     </div>
//   );
// };

// export default App;







import React, { useState } from "react";
import TableComponent from "./components/TableComponent";

const App = () => {
  const [tableValue, setTableValue] = useState({
    data: [],
    columns: [],
  });

  const handleTableChange = (newTableValue) => {
    setTableValue(newTableValue);
  };

  return (
    <div>
      <TableComponent value={tableValue} onChange={handleTableChange} />
    </div>
  );
};

export default App;
