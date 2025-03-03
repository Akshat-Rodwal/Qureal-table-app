// import React, { useState, useEffect, useRef } from "react";
// import { useReactTable, getCoreRowModel } from "@tanstack/react-table";

// const TableComponent = ({ value, onChange }) => {
//   const [tableData, setTableData] = useState(() => {
//     const savedData = sessionStorage.getItem("tableData");
//     return savedData
//       ? JSON.parse(savedData)
//       : value.data || [
//           { id: 1, name: "John Doe", age: 28 },
//           { id: 2, name: "Jane Smith", age: 32 },
//         ];
//   });

//   const [tableColumns, setTableColumns] = useState(() => {
//     const savedColumns = sessionStorage.getItem("tableColumns");
//     return savedColumns
//       ? JSON.parse(savedColumns)
//       : value.columns || [
//           { accessorKey: "id", header: "ID", width: 150 },
//           { accessorKey: "name", header: "Name", width: 150 },
//           { accessorKey: "age", header: "Age", width: 100 },
//         ];
//   });

//   const [cellStyles, setCellStyles] = useState(() => {
//     const savedStyles = sessionStorage.getItem("cellStyles");
//     return savedStyles ? JSON.parse(savedStyles) : {};
//   });

//   const [showRowCheckboxes, setShowRowCheckboxes] = useState(false);
//   const [showColumnCheckboxes, setShowColumnCheckboxes] = useState(false);
//   const [selectedRows, setSelectedRows] = useState(new Set());
//   const [selectedColumnsForRemoval, setSelectedColumnsForRemoval] = useState(
//     new Set()
//   );
//   const [selectedCell, setSelectedCell] = useState(null);
//   const [textColor, setTextColor] = useState("#000000");
//   const [bgColor, setBgColor] = useState("#ffffff");

//   const resizingColumn = useRef(null);
//   const startX = useRef(0);
//   const startWidth = useRef(0);

//   const [draggedColumn, setDraggedColumn] = useState(null);

//   // Handle column drag start
//   const handleDragStart = (e, index) => {
//     setDraggedColumn(index);
//     e.dataTransfer.effectAllowed = "move";
//     e.dataTransfer.setData("columnIndex", index);
//   };

//   const handleDragOver = (e, index) => {
//     e.preventDefault();
//     if (draggedColumn === index) return;
//   };

//   const handleDrop = (e, index) => {
//     const draggedIndex = draggedColumn;
//     if (draggedIndex === index) return;

//     const newColumns = [...tableColumns];

//     const [draggedColumnItem] = newColumns.splice(draggedIndex, 1);

//     newColumns.splice(index, 0, draggedColumnItem);

//     setTableColumns(newColumns);
//     setDraggedColumn(null);
//   };

//   const handleMouseDown = (e, columnIndex) => {
//     e.preventDefault();
//     resizingColumn.current = columnIndex;
//     startX.current = e.clientX;
//     startWidth.current = tableColumns[columnIndex].width;
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   const handleMouseMove = (e) => {
//     if (resizingColumn.current === null) return;

//     const diff = e.clientX - startX.current;
//     const newWidth = startWidth.current + diff;
//     if (newWidth > 10) {
//       const updatedColumns = [...tableColumns];
//       updatedColumns[resizingColumn.current] = {
//         ...updatedColumns[resizingColumn.current],
//         width: newWidth,
//       };
//       setTableColumns(updatedColumns);
//     }
//   };

//   const handleMouseUp = () => {
//     resizingColumn.current = null;
//     document.removeEventListener("mousemove", handleMouseMove);
//     document.removeEventListener("mouseup", handleMouseUp);
//   };

//   useEffect(() => {
//     sessionStorage.setItem("tableData", JSON.stringify(tableData));
//     sessionStorage.setItem("tableColumns", JSON.stringify(tableColumns));
//     sessionStorage.setItem("cellStyles", JSON.stringify(cellStyles));

//     if (onChange) {
//       onChange({ data: tableData, columns: tableColumns });
//     }
//   }, [tableData, tableColumns, onChange]);

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
//       width: 150,
//     };
//     setTableColumns([...tableColumns, newColumn]);
//     setTableData(tableData.map((row) => ({ ...row, [newColumnKey]: "" })));
//   };

//   const toggleRowRemoveMode = () => {
//     if (showRowCheckboxes) {
//       setTableData(tableData.filter((_, index) => !selectedRows.has(index)));
//       setSelectedRows(new Set());
//     }
//     setShowRowCheckboxes(!showRowCheckboxes);
//   };

//   const handleRowCheckboxChange = (index) => {
//     const updatedSelection = new Set(selectedRows);
//     if (updatedSelection.has(index)) {
//       updatedSelection.delete(index);
//     } else {
//       updatedSelection.add(index);
//     }
//     setSelectedRows(updatedSelection);
//   };

//   const toggleColumnRemoveMode = () => {
//     setShowColumnCheckboxes(!showColumnCheckboxes);
//     setSelectedColumnsForRemoval(new Set());
//   };

//   const handleColumnCheckboxChange = (columnId) => {
//     const updatedSelection = new Set(selectedColumnsForRemoval);
//     if (updatedSelection.has(columnId)) {
//       updatedSelection.delete(columnId);
//     } else {
//       updatedSelection.add(columnId);
//     }
//     setSelectedColumnsForRemoval(updatedSelection);
//   };

//   const removeSelectedColumns = () => {
//     const columnsToRemove = Array.from(selectedColumnsForRemoval);

//     const updatedColumns = tableColumns.filter(
//       (col) => !columnsToRemove.includes(col.accessorKey)
//     );

//     const updatedData = tableData.map((row) => {
//       const updatedRow = { ...row };
//       columnsToRemove.forEach((colId) => {
//         delete updatedRow[colId];
//       });
//       return updatedRow;
//     });

//     setTableColumns(updatedColumns);
//     setTableData(updatedData);
//     setSelectedColumnsForRemoval(new Set());
//   };

//   const handleCellClick = (rowIndex, columnId) => {
//     setSelectedCell({ rowIndex, columnId });
//   };

//   const applyTextColor = () => {
//     if (selectedCell) {
//       const { rowIndex, columnId } = selectedCell;
//       const newStyles = { ...cellStyles };
//       newStyles[`${rowIndex}-${columnId}`] = {
//         ...newStyles[`${rowIndex}-${columnId}`],
//         color: textColor,
//       };
//       setCellStyles(newStyles);
//     }
//   };

//   const applyBgColor = () => {
//     if (selectedCell) {
//       const { rowIndex, columnId } = selectedCell;
//       const newStyles = { ...cellStyles };
//       newStyles[`${rowIndex}-${columnId}`] = {
//         ...newStyles[`${rowIndex}-${columnId}`],
//         backgroundColor: bgColor,
//       };
//       setCellStyles(newStyles);
//     }
//   };

//   const handleColumnHeaderEdit = (index, value) => {
//     const updatedColumns = [...tableColumns];
//     updatedColumns[index] = { ...updatedColumns[index], header: value };
//     setTableColumns(updatedColumns);
//   };

//   return (
//     <div className="p-4" style={{ position: "absolute", top: "0", left: "0" }}>
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
//           onClick={toggleRowRemoveMode}
//           className={`px-4 py-2 rounded-lg shadow ${
//             showRowCheckboxes
//               ? "bg-red-500 text-white"
//               : "bg-gray-500 text-white"
//           }`}
//         >
//           {showRowCheckboxes ? "Confirm Remove Row" : "Remove Row"}
//         </button>
//         <button
//           onClick={() => {
//             setShowColumnCheckboxes(!showColumnCheckboxes);
//             if (showColumnCheckboxes) {
//               removeSelectedColumns();
//             }
//           }}
//           className={`px-4 py-2 rounded-lg shadow ${
//             showColumnCheckboxes
//               ? "bg-red-500 text-white"
//               : "bg-gray-500 text-white"
//           }`}
//         >
//           {showColumnCheckboxes ? "Confirm Remove Column" : "Remove Column"}
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto w-full">
//         <table
//           className="table-auto border-collapse border border-black"
//           style={{ minWidth: "max-content" }}
//         >
//           <thead>
//             {showColumnCheckboxes && (
//               <tr className="bg-gray-200">
//                 {tableColumns.map((col) => (
//                   <th key={col.accessorKey} className="border p-2">
//                     <input
//                       type="checkbox"
//                       checked={selectedColumnsForRemoval.has(col.accessorKey)}
//                       onChange={() =>
//                         handleColumnCheckboxChange(col.accessorKey)
//                       }
//                     />
//                   </th>
//                 ))}
//               </tr>
//             )}
//             <tr className="bg-gray-200">
//               {showRowCheckboxes && (
//                 <th className="border p-2 text-center">
//                   <input type="checkbox" className="cursor-pointer" />
//                 </th>
//               )}
//               {tableColumns.map((col, index) => (
//                 <th
//                   key={col.accessorKey}
//                   className="border p-2 relative"
//                   style={{ width: `${col.width}px` }}
//                   draggable
//                   onDragStart={(e) => handleDragStart(e, index)}
//                   onDragOver={(e) => handleDragOver(e, index)}
//                   onDrop={(e) => handleDrop(e, index)}
//                 >
//                   <input
//                     type="text"
//                     value={col.header}
//                     onChange={(e) =>
//                       handleColumnHeaderEdit(index, e.target.value)
//                     }
//                     className="w-full bg-transparent border-none focus:outline-none"
//                   />
//                   <div
//                     className="absolute right-0 top-0 bottom-0 cursor-ew-resize"
//                     style={{
//                       width: "5px",
//                       backgroundColor: "transparent",
//                     }}
//                     onMouseDown={(e) => handleMouseDown(e, index)}
//                   />
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {tableData.length > 0 ? (
//               tableData.map((row, rowIndex) => (
//                 <tr key={rowIndex}>
//                   {showRowCheckboxes && (
//                     <td className="border p-2 text-center">
//                       <input
//                         type="checkbox"
//                         checked={selectedRows.has(rowIndex)}
//                         onChange={() => handleRowCheckboxChange(rowIndex)}
//                       />
//                     </td>
//                   )}
//                   {tableColumns.map((col) => (
//                     <td
//                       key={col.accessorKey}
//                       className={`border p-2 cursor-pointer ${
//                         selectedCell &&
//                         selectedCell.rowIndex === rowIndex &&
//                         selectedCell.columnId === col.accessorKey
//                           ? "bg-blue-100"
//                           : ""
//                       }`}
//                       style={cellStyles[`${rowIndex}-${col.accessorKey}`] || {}}
//                       onClick={() => handleCellClick(rowIndex, col.accessorKey)}
//                     >
//                       <input
//                         type="text"
//                         value={row[col.accessorKey] || ""}
//                         onChange={(e) =>
//                           handleCellEdit(
//                             rowIndex,
//                             col.accessorKey,
//                             e.target.value
//                           )
//                         }
//                         className="w-full bg-transparent border-none focus:outline-none"
//                       />
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={tableColumns.length + 1} className="text-center">
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

// export default TableComponent;





import React, { useState, useEffect, useRef } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";

const TableComponent = ({ value, onChange }) => {
  const [tableData, setTableData] = useState(() => {
    const savedData = sessionStorage.getItem("tableData");
    return savedData
      ? JSON.parse(savedData)
      : value.data || [
          { id: 1, name: "John Doe", age: 28 },
          { id: 2, name: "Jane Smith", age: 32 },
        ];
  });

  const [tableColumns, setTableColumns] = useState(() => {
    const savedColumns = sessionStorage.getItem("tableColumns");
    return savedColumns
      ? JSON.parse(savedColumns)
      : value.columns || [
          { accessorKey: "id", header: "ID", width: 150 },
          { accessorKey: "name", header: "Name", width: 150 },
          { accessorKey: "age", header: "Age", width: 100 },
        ];
  });

  const [cellStyles, setCellStyles] = useState(() => {
    const savedStyles = sessionStorage.getItem("cellStyles");
    return savedStyles ? JSON.parse(savedStyles) : {};
  });

  const [showRowCheckboxes, setShowRowCheckboxes] = useState(false);
  const [showColumnCheckboxes, setShowColumnCheckboxes] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedColumnsForRemoval, setSelectedColumnsForRemoval] = useState(
    new Set()
  );
  const [selectedCell, setSelectedCell] = useState(null);
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  const resizingColumn = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const [draggedColumn, setDraggedColumn] = useState(null);

  // Handle column drag start
  const handleDragStart = (e, index) => {
    setDraggedColumn(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("columnIndex", index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedColumn === index) return;
  };

  const handleDrop = (e, index) => {
    const draggedIndex = draggedColumn;
    if (draggedIndex === index) return;

    const newColumns = [...tableColumns];

    const [draggedColumnItem] = newColumns.splice(draggedIndex, 1);

    newColumns.splice(index, 0, draggedColumnItem);

    setTableColumns(newColumns);
    setDraggedColumn(null);
  };

  const handleMouseDown = (e, columnIndex) => {
    e.preventDefault();
    resizingColumn.current = columnIndex;
    startX.current = e.clientX;
    startWidth.current = tableColumns[columnIndex].width;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (resizingColumn.current === null) return;

    const diff = e.clientX - startX.current;
    const newWidth = startWidth.current + diff;
    if (newWidth > 10) {
      const updatedColumns = [...tableColumns];
      updatedColumns[resizingColumn.current] = {
        ...updatedColumns[resizingColumn.current],
        width: newWidth,
      };
      setTableColumns(updatedColumns);
    }
  };

  const handleMouseUp = () => {
    resizingColumn.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    sessionStorage.setItem("tableData", JSON.stringify(tableData));
    sessionStorage.setItem("tableColumns", JSON.stringify(tableColumns));
    sessionStorage.setItem("cellStyles", JSON.stringify(cellStyles));

    if (onChange) {
      onChange({ data: tableData, columns: tableColumns });
    }
  }, [tableData, tableColumns, onChange]);

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
      width: 150,
    };
    setTableColumns([...tableColumns, newColumn]);
    setTableData(tableData.map((row) => ({ ...row, [newColumnKey]: "" })));
  };

  const toggleRowRemoveMode = () => {
    if (showRowCheckboxes) {
      setTableData(tableData.filter((_, index) => !selectedRows.has(index)));
      setSelectedRows(new Set());
    }
    setShowRowCheckboxes(!showRowCheckboxes);
  };

  const handleRowCheckboxChange = (index) => {
    const updatedSelection = new Set(selectedRows);
    if (updatedSelection.has(index)) {
      updatedSelection.delete(index);
    } else {
      updatedSelection.add(index);
    }
    setSelectedRows(updatedSelection);
  };

  const toggleColumnRemoveMode = () => {
    setShowColumnCheckboxes(!showColumnCheckboxes);
    setSelectedColumnsForRemoval(new Set());
  };

  const handleColumnCheckboxChange = (columnId) => {
    const updatedSelection = new Set(selectedColumnsForRemoval);
    if (updatedSelection.has(columnId)) {
      updatedSelection.delete(columnId);
    } else {
      updatedSelection.add(columnId);
    }
    setSelectedColumnsForRemoval(updatedSelection);
  };

  const removeSelectedColumns = () => {
    const columnsToRemove = Array.from(selectedColumnsForRemoval);

    const updatedColumns = tableColumns.filter(
      (col) => !columnsToRemove.includes(col.accessorKey)
    );

    const updatedData = tableData.map((row) => {
      const updatedRow = { ...row };
      columnsToRemove.forEach((colId) => {
        delete updatedRow[colId];
      });
      return updatedRow;
    });

    setTableColumns(updatedColumns);
    setTableData(updatedData);
    setSelectedColumnsForRemoval(new Set());
  };

  const handleCellClick = (rowIndex, columnId) => {
    setSelectedCell({ rowIndex, columnId });
  };

  const applyTextColor = () => {
    if (selectedCell) {
      const { rowIndex, columnId } = selectedCell;
      const newStyles = { ...cellStyles };
      newStyles[`${rowIndex}-${columnId}`] = {
        ...newStyles[`${rowIndex}-${columnId}`],
        color: textColor,
      };
      setCellStyles(newStyles);
    }
  };

  const applyBgColor = () => {
    if (selectedCell) {
      const { rowIndex, columnId } = selectedCell;
      const newStyles = { ...cellStyles };
      newStyles[`${rowIndex}-${columnId}`] = {
        ...newStyles[`${rowIndex}-${columnId}`],
        backgroundColor: bgColor,
      };
      setCellStyles(newStyles);
    }
  };

  const handleColumnHeaderEdit = (index, value) => {
    const updatedColumns = [...tableColumns];
    updatedColumns[index] = { ...updatedColumns[index], header: value };
    setTableColumns(updatedColumns);
  };

  // Add input box to edit the selected cell's value at the top
  const handleInputChange = (e) => {
    if (selectedCell) {
      const { rowIndex, columnId } = selectedCell;
      const newData = [...tableData];
      newData[rowIndex][columnId] = e.target.value;
      setTableData(newData);
    }
  };

  return (
    <div className="p-4" style={{ position: "absolute", top: "0", left: "0" }}>
      {/* Input Box for Editing */}
      

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
        <button
          onClick={toggleRowRemoveMode}
          className={`px-4 py-2 rounded-lg shadow ${
            showRowCheckboxes
              ? "bg-red-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          {showRowCheckboxes ? "Confirm Remove Row" : "Remove Row"}
        </button>
        <button
          onClick={() => {
            setShowColumnCheckboxes(!showColumnCheckboxes);
            if (showColumnCheckboxes) {
              removeSelectedColumns();
            }
          }}
          className={`px-4 py-2 rounded-lg shadow ${
            showColumnCheckboxes
              ? "bg-red-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          {showColumnCheckboxes ? "Confirm Remove Column" : "Remove Column"}
        </button>
      </div>

      {selectedCell && (
        <div className="mb-4 flex gap-4 ">
          <input
            type="text"
            value={tableData[selectedCell.rowIndex][selectedCell.columnId] || ""}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            placeholder="Edit cell"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table
          className="table-auto border-collapse border border-black"
          style={{ minWidth: "max-content" }}
        >
          <thead>
            {showColumnCheckboxes && (
              <tr className="bg-gray-200">
                {tableColumns.map((col) => (
                  <th key={col.accessorKey} className="border p-2">
                    <input
                      type="checkbox"
                      checked={selectedColumnsForRemoval.has(col.accessorKey)}
                      onChange={() =>
                        handleColumnCheckboxChange(col.accessorKey)
                      }
                    />
                  </th>
                ))}
              </tr>
            )}
            <tr className="bg-gray-200">
              {showRowCheckboxes && (
                <th className="border p-2 text-center">
                  <input type="checkbox" className="cursor-pointer" />
                </th>
              )}
              {tableColumns.map((col, index) => (
                <th
                  key={col.accessorKey}
                  className="border p-2 relative"
                  style={{ width: `${col.width}px` }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <input
                    type="text"
                    value={col.header}
                    onChange={(e) =>
                      handleColumnHeaderEdit(index, e.target.value)
                    }
                    className="w-full bg-transparent border-none focus:outline-none"
                  />
                  <div
                    className="absolute right-0 top-0 bottom-0 cursor-ew-resize"
                    style={{
                      width: "5px",
                      backgroundColor: "transparent",
                    }}
                    onMouseDown={(e) => handleMouseDown(e, index)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {showRowCheckboxes && (
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => handleRowCheckboxChange(rowIndex)}
                      />
                    </td>
                  )}
                  {tableColumns.map((col) => (
                    <td
                      key={col.accessorKey}
                      className={`border p-2 cursor-pointer ${
                        selectedCell &&
                        selectedCell.rowIndex === rowIndex &&
                        selectedCell.columnId === col.accessorKey
                          ? "bg-blue-100"
                          : ""
                      }`}
                      style={cellStyles[`${rowIndex}-${col.accessorKey}`] || {}}
                      onClick={() => handleCellClick(rowIndex, col.accessorKey)}
                    >
                      <input
                        type="text"
                        value={row[col.accessorKey] || ""}
                        onChange={(e) =>
                          handleCellEdit(
                            rowIndex,
                            col.accessorKey,
                            e.target.value
                          )
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
