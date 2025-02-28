



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
