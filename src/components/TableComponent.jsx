// import React, { useState } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   flexRender,
// } from "@tanstack/react-table";

// const TableComponent = ({ data, columns }) => {
//   const [tableData, setTableData] = useState(data || []);
//   const [tableColumns, setTableColumns] = useState(columns || []);
//   const [showCheckboxes, setShowCheckboxes] = useState(false);
//   const [selectedRows, setSelectedRows] = useState(new Set());
//   const [selectedCell, setSelectedCell] = useState(null);
//   const [textColor, setTextColor] = useState("#000000");
//   const [bgColor, setBgColor] = useState("#ffffff");

//   const table = useReactTable({
//     data: tableData,
//     columns: tableColumns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   const handleCellEdit = (rowIndex, columnId, value) => {
//     const updatedData = [...tableData];
//     updatedData[rowIndex] = { ...updatedData[rowIndex], [columnId]: value };
//     setTableData(updatedData);
//   };

//   const addRow = () => {
//     const newRow = tableColumns.reduce((acc, col) => {
//       acc[col.accessorKey] = "";
//       return acc;
//     }, {});
//     setTableData([...tableData, newRow]);
//   };

//   const addColumn = () => {
//     const newColumnKey = `column${tableColumns.length + 1}`;
//     const newColumn = {
//       accessorKey: newColumnKey,
//       header: newColumnKey,
//     };
//     setTableColumns([...tableColumns, newColumn]);
//     setTableData(tableData.map(row => ({ ...row, [newColumnKey]: "" })));
//   };

//   const toggleRemoveMode = () => {
//     if (showCheckboxes) {
//       setTableData(tableData.filter((_, index) => !selectedRows.has(index)));
//       setSelectedRows(new Set());
//     }
//     setShowCheckboxes(!showCheckboxes);
//   };

//   const handleCheckboxChange = (index) => {
//     const updatedSelection = new Set(selectedRows);
//     if (updatedSelection.has(index)) {
//       updatedSelection.delete(index);
//     } else {
//       updatedSelection.add(index);
//     }
//     setSelectedRows(updatedSelection);
//   };

//   const handleCellClick = (rowIndex, columnId) => {
//     setSelectedCell({ rowIndex, columnId });
//   };

//   const applyTextColor = () => {
//     if (selectedCell) {
//       const { rowIndex, columnId } = selectedCell;
//       const updatedData = [...tableData];
//       updatedData[rowIndex] = {
//         ...updatedData[rowIndex],
//         [`${columnId}_textColor`]: textColor,
//       };
//       setTableData(updatedData);
//     }
//   };

//   const applyBgColor = () => {
//     if (selectedCell) {
//       const { rowIndex, columnId } = selectedCell;
//       const updatedData = [...tableData];
//       updatedData[rowIndex] = {
//         ...updatedData[rowIndex],
//         [`${columnId}_bgColor`]: bgColor,
//       };
//       setTableData(updatedData);
//     }
//   };

//   const handleColumnEdit = (index, value) => {
//     const updatedColumns = [...tableColumns];
//     updatedColumns[index] = { ...updatedColumns[index], header: value };
//     setTableColumns(updatedColumns);
//   };

//   return (
//     <div className="w-screen h-screen p-4 flex flex-col items-center bg-gray-100">
//       {/* Controls */}
//       <div className="mb-4 flex gap-4 border p-2">

//         <input
//           type="color"
//           value={textColor}
//           onChange={(e) => setTextColor(e.target.value)}
//           className="w-10 h-10 cursor-pointer border rounded-lg"
//         />
//         <button
//           onClick={applyTextColor}
//           className="bg-green-500 text-white px-4 py-2 rounded-lg shadow"
//         >
//           Apply Text Color
//         </button>
//         <input
//           type="color"
//           value={bgColor}
//           onChange={(e) => setBgColor(e.target.value)}
//           className="w-10 h-10 cursor-pointer border rounded-lg"
//         />
//         <button
//           onClick={applyBgColor}
//           className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow"
//         >
//           Apply Background Color
//         </button>
//         <button
//           onClick={addRow}
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow"
//         >
//           Add Row
//         </button>
//         <button
//           onClick={addColumn}
//           className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow"
//         >
//           Add Column
//         </button>
//         <button
//           onClick={toggleRemoveMode}
//           className={`px-4 py-2 rounded-lg shadow ${
//             showCheckboxes ? "bg-red-500 text-white" : "bg-gray-500 text-white"
//           }`}
//         >
//           {showCheckboxes ? "Confirm Remove" : "Remove Row"}
//         </button>
//       </div>

//       {/* Table */}
//       <div className="w-full overflow-x-auto">
//         <table className="w-full border-collapse border border-black">
//           <thead>
//             <tr className="bg-gray-200">
//               {showCheckboxes && <th className="border p-2">Select</th>}
//               {tableColumns.map((col, index) => (
//                 <th key={col.accessorKey} className="border p-2">
//                   <input
//                     type="text"
//                     value={col.header}
//                     onChange={(e) => handleColumnEdit(index, e.target.value)}
//                     className="w-full bg-transparent border-none focus:outline-none"
//                   />
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {tableData.length > 0 ? (
//               tableData.map((row, rowIndex) => (
//                 <tr key={rowIndex}>
//                   {showCheckboxes && (
//                     <td className="border p-2 text-center">
//                       <input
//                         type="checkbox"
//                         checked={selectedRows.has(rowIndex)}
//                         onChange={() => handleCheckboxChange(rowIndex)}
//                       />
//                     </td>
//                   )}
//                   {tableColumns.map((col) => (
//                     <td
//                       key={col.accessorKey}
//                       className="border p-2 cursor-pointer"
//                       onClick={() => handleCellClick(rowIndex, col.accessorKey)}
//                     >
//                       <input
//                         type="text"
//                         value={row[col.accessorKey] || ""}
//                         onChange={(e) => handleCellEdit(rowIndex, col.accessorKey, e.target.value)}
//                         className="w-full bg-transparent border-none focus:outline-none"
//                       />
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={tableColumns.length + (showCheckboxes ? 1 : 0)} className="text-center p-4">
//                   No data available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

import React, { useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";

const TableComponent = ({ data, columns }) => {
  const [tableData, setTableData] = useState(data || []);
  const [tableColumns, setTableColumns] = useState(columns || []);
  const [showRowCheckboxes, setShowRowCheckboxes] = useState(false); // Toggle for row checkboxes
  const [showColumnCheckboxes, setShowColumnCheckboxes] = useState(false); // Toggle for column checkboxes
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedColumnsForRemoval, setSelectedColumnsForRemoval] = useState(new Set());
  const [selectedCell, setSelectedCell] = useState(null);
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  const [cellStyles, setCellStyles] = useState({});

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleCellEdit = (rowIndex, columnId, value) => {
    const updatedData = [...tableData];
    updatedData[rowIndex] = { ...updatedData[rowIndex], [columnId]: value };
    setTableData(updatedData);
  };

  const addRow = () => {
    const newRow = tableColumns.reduce((acc, col) => {
      acc[col.accessorKey] = "";
      return acc;
    }, {});
    setTableData([...tableData, newRow]);
  };

  const addColumn = () => {
    const newColumnKey = `column${tableColumns.length + 1}`;
    const newColumn = {
      accessorKey: newColumnKey,
      header: newColumnKey,
    };
    setTableColumns([...tableColumns, newColumn]);
    setTableData(tableData.map((row) => ({ ...row, [newColumnKey]: "" })));
  };

  // Toggle row selection mode
  const toggleRowRemoveMode = () => {
    if (showRowCheckboxes) {
      setTableData(tableData.filter((_, index) => !selectedRows.has(index)));
      setSelectedRows(new Set());
    }
    setShowRowCheckboxes(!showRowCheckboxes);
  };

  // Handle checkbox change for rows to remove
  const handleRowCheckboxChange = (index) => {
    const updatedSelection = new Set(selectedRows);
    if (updatedSelection.has(index)) {
      updatedSelection.delete(index);
    } else {
      updatedSelection.add(index);
    }
    setSelectedRows(updatedSelection);
  };

  // Toggle column selection mode
  const toggleColumnRemoveMode = () => {
    setShowColumnCheckboxes(!showColumnCheckboxes);
    setSelectedColumnsForRemoval(new Set()); // Reset selected columns for removal
  };

  // Handle checkbox change for columns to remove
  const handleColumnCheckboxChange = (columnId) => {
    const updatedSelection = new Set(selectedColumnsForRemoval);
    if (updatedSelection.has(columnId)) {
      updatedSelection.delete(columnId);
    } else {
      updatedSelection.add(columnId);
    }
    setSelectedColumnsForRemoval(updatedSelection);
  };

  // Remove selected columns from tableColumns and tableData
  const removeSelectedColumns = () => {
    const columnsToRemove = Array.from(selectedColumnsForRemoval);

    // Remove the columns from tableColumns
    const updatedColumns = tableColumns.filter(
      (col) => !columnsToRemove.includes(col.accessorKey)
    );

    // Remove the corresponding columns from tableData
    const updatedData = tableData.map((row) => {
      const updatedRow = { ...row };
      columnsToRemove.forEach((colId) => {
        delete updatedRow[colId];
      });
      return updatedRow;
    });

    setTableColumns(updatedColumns);
    setTableData(updatedData);
    setSelectedColumnsForRemoval(new Set()); // Clear the selected columns after removal
  };

  const handleCellClick = (rowIndex, columnId) => {
    setSelectedCell({ rowIndex, columnId });
  };

  const applyTextColor = () => {
    if (selectedCell) {
      const { rowIndex, columnId } = selectedCell;

      // Update only the color (text) style without affecting borders
      const newStyles = { ...cellStyles };
      newStyles[`${rowIndex}-${columnId}`] = {
        ...newStyles[`${rowIndex}-${columnId}`],
        color: textColor, // Apply text color only
      };
      setCellStyles(newStyles);
    }
  };

  const applyBgColor = () => {
    if (selectedCell) {
      const { rowIndex, columnId } = selectedCell;

      // Update only the background color without affecting borders
      const newStyles = { ...cellStyles };
      newStyles[`${rowIndex}-${columnId}`] = {
        ...newStyles[`${rowIndex}-${columnId}`],
        backgroundColor: bgColor, // Apply background color only
      };
      setCellStyles(newStyles);
    }
  };

  const handleColumnHeaderEdit = (index, value) => {
    const updatedColumns = [...tableColumns];
    updatedColumns[index] = { ...updatedColumns[index], header: value };
    setTableColumns(updatedColumns);
  };

  return (
    <div className="w-screen h-screen p-4 flex flex-col items-center bg-gray-100">
      {/* Controls */}
      <div className="mb-4 flex gap-4 border p-2">
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          className="w-10 h-10 cursor-pointer border rounded-lg"
        />
        <button
          onClick={applyTextColor}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow"
        >
          Apply Text Color
        </button>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className="w-10 h-10 cursor-pointer border rounded-lg"
        />
        <button
          onClick={applyBgColor}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow"
        >
          Apply Background Color
        </button>
        <button
          onClick={addRow}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow"
        >
          Add Row
        </button>
        <button
          onClick={addColumn}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow"
        >
          Add Column
        </button>
        {/* Toggle for removing rows */}
        <button
          onClick={toggleRowRemoveMode}
          className={`px-4 py-2 rounded-lg shadow ${
            showRowCheckboxes ? "bg-red-500 text-white" : "bg-gray-500 text-white"
          }`}
        >
          {showRowCheckboxes ? "Confirm Remove Row" : "Remove Row"}
        </button>
        {/* Toggle for removing columns */}
        <button
          onClick={toggleColumnRemoveMode}
          className={`px-4 py-2 rounded-lg shadow ${
            showColumnCheckboxes ? "bg-red-500 text-white" : "bg-gray-500 text-white"
          }`}
        >
          {showColumnCheckboxes ? "Confirm Remove Column" : "Remove Column"}
        </button>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse border border-black">
          <thead>
            {/* Row for Column Selection Checkboxes */}
            {showColumnCheckboxes && (
              <tr className="bg-gray-200">
                {tableColumns.map((col) => (
                  <th key={col.accessorKey} className="border p-2">
                    <input
                      type="checkbox"
                      checked={selectedColumnsForRemoval.has(col.accessorKey)}
                      onChange={() => handleColumnCheckboxChange(col.accessorKey)}
                    />
                  </th>
                ))}
              </tr>
            )}
            {/* Editable Column Headers */}
            <tr className="bg-gray-200">
              {/* Add a header for row removal */}
              {showRowCheckboxes && (
                <th className="border p-2 text-center">
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                  />
                </th>
              )}
              {tableColumns.map((col, index) => (
                <th key={col.accessorKey} className="border p-2">
                  <input
                    type="text"
                    value={col.header}
                    onChange={(e) =>
                      handleColumnHeaderEdit(index, e.target.value)
                    }
                    className="w-full bg-transparent border-none focus:outline-none"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {/* Checkbox for row removal */}
                  {showRowCheckboxes && (
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => handleRowCheckboxChange(rowIndex)}
                      />
                    </td>
                  )}
                  {/* Table Data Cells */}
                  {tableColumns.map((col) => (
                    <td
                      key={col.accessorKey}
                      className="border p-2 cursor-pointer"
                      style={cellStyles[`${rowIndex}-${col.accessorKey}`] || {}}
                      onClick={() => handleCellClick(rowIndex, col.accessorKey)}
                    >
                      <input
                        type="text"
                        value={row[col.accessorKey] || ""}
                        onChange={(e) =>
                          handleCellEdit(rowIndex, col.accessorKey, e.target.value)
                        }
                        className="w-full bg-transparent border-none focus:outline-none"
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableColumns.length + 1} className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>  
      </div>
    </div>
  );
};

export default TableComponent;
