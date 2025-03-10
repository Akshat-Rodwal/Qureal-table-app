// import React, { useState, useEffect, useRef } from "react";
// import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
// import styles from './TableComponent.module.css';

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

//   const tableRef = useRef(null);
//   const resizing = useRef(false);
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

//   // Add the following logic for the X-direction resizing
// const handleMouseDown2 = (e) => {
//   resizing.current = true;
//   startX.current = e.clientX;
//   startWidth.current = tableRef.current.offsetWidth;
//   document.addEventListener("mousemove", handleMouseMove2);
//   document.addEventListener("mouseup", handleMouseUp2);
// };

// const handleMouseMove2 = (e) => {
//   if (resizing.current) {
//     const diff = e.clientX - startX.current;
//     const newWidth = Math.max(400, startWidth.current + diff); // Ensure a minimum width of 400px
//     tableRef.current.style.width = `${newWidth}px`;
//   }
// };

// const handleMouseUp2 = () => {
//   resizing.current = false;
//   document.removeEventListener("mousemove", handleMouseMove2);
//   document.removeEventListener("mouseup", handleMouseUp2);
// };

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

//   const handleInputChange = (e) => {
//     if (selectedCell) {
//       const { rowIndex, columnId } = selectedCell;
//       const newData = [...tableData];
//       newData[rowIndex][columnId] = e.target.value;
//       setTableData(newData);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       {/* Controls */}
//       <div className={styles.controls}>
//         <input
//           type="color"
//           value={textColor}
//           onChange={(e) => setTextColor(e.target.value)}
//           className={styles.colorPicker}
//         />
//         <button
//           onClick={applyTextColor}
//           className={`${styles.button} ${styles.buttonGreen}`}
//         >
//           Apply Text Color
//         </button>
//         <input
//           type="color"
//           value={bgColor}
//           onChange={(e) => setBgColor(e.target.value)}
//           className={styles.colorPicker}
//         />
//         <button
//           onClick={applyBgColor}
//           className={`${styles.button} ${styles.buttonYellow}`}
//         >
//           Apply Background Color
//         </button>
//         <button
//           onClick={addRow}
//           className={`${styles.button} ${styles.buttonBlue}`}
//         >
//           Add Row
//         </button>
//         <button
//           onClick={addColumn}
//           className={`${styles.button} ${styles.buttonPurple}`}
//         >
//           Add Column
//         </button>
//         <button
//           onClick={toggleRowRemoveMode}
//           className={`${styles.button} ${
//             showRowCheckboxes ? styles.buttonGray : ""
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
//           className={`${styles.button} ${
//             showColumnCheckboxes ? styles.buttonGray : ""
//           }`}
//         >
//           {showColumnCheckboxes ? "Confirm Remove Column" : "Remove Column"}
//         </button>
//       </div>

//       {/* Input Box for Editing */}
//       {selectedCell && (
//         <div className={styles.controls}>
//           <input
//             type="text"
//             value={tableData[selectedCell.rowIndex][selectedCell.columnId] || ""}
//             onChange={handleInputChange}
//             className={styles.input}
//             placeholder="Edit cell"
//           />
//         </div>
//       )}

//       {/* Table */}
//       <div className={styles.tableContainer} ref={tableRef}>
//         <table className={styles.table}>
//           <thead>
//             {showColumnCheckboxes && (
//               <tr className={styles.tableHeader}>
//                 {tableColumns.map((col) => (
//                   <th key={col.accessorKey} className={styles.tableHeaderCell}>
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
//             <tr className={styles.tableHeader}>
//               {showRowCheckboxes && (
//                 <th className={`${styles.tableHeaderCell} ${styles.checkboxContainer}`}>
//                   <input type="checkbox" className={styles.checkbox} />
//                 </th>
//               )}
//               {tableColumns.map((col, index) => (
//                 <th
//                   key={col.accessorKey}
//                   className={styles.tableHeaderCell}
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
//                     className={styles.cellInput}
//                   />
//                   <div
//                     className={styles.resizeHandle}
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
//                     <td className={styles.checkboxContainer}>
//                       <input
//                         type="checkbox"
//                         checked={selectedRows.has(rowIndex)}
//                         onChange={() => handleRowCheckboxChange(rowIndex)}
//                         className={styles.checkbox}
//                       />
//                     </td>
//                   )}
//                   {tableColumns.map((col) => (
//                     <td
//                       key={col.accessorKey}
//                       className={`${styles.tableCell} ${
//                         selectedCell &&
//                         selectedCell.rowIndex === rowIndex &&
//                         selectedCell.columnId === col.accessorKey
//                           ? styles.cellSelected
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
//                         className={styles.cellInput}
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
//         <div
//           className={styles.tableResizeHandle}
//           onMouseDown={handleMouseDown2}
//         />
//       </div>
//     </div>
//   );
// };

// export default TableComponent;






import React, { useState, useEffect, useCallback } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";
import styles from "./TableComponent.module.css";

const TableComponent = ({ value, onChange }) => {
  const columnHelper = createColumnHelper();

  // Initialize table data
  const [tableData, setTableData] = useState(() => {
    const savedData = sessionStorage.getItem("tableData");
    return savedData
      ? JSON.parse(savedData)
      : value.data || [
          { id: 1, name: "John Doe", age: 28 },
          { id: 2, name: "Jane Smith", age: 32 },
        ];
  });

  // Initialize table columns
  const [tableColumns, setTableColumns] = useState(() => {
    const savedColumns = sessionStorage.getItem("tableColumns");
    return savedColumns
      ? JSON.parse(savedColumns)
      : value.columns || [
          columnHelper.accessor("id", {
            header: "ID",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("name", {
            header: "Name",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("age", {
            header: "Age",
            cell: (info) => info.getValue(),
          }),
        ];
  });

  const [showRowCheckboxes, setShowRowCheckboxes] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [showColumnCheckboxes, setShowColumnCheckboxes] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(new Set());
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedValue, setSelectedValue] = useState(""); // Synchronize with input editor
  const [cellStyles, setCellStyles] = useState({});
  const [tableWidth, setTableWidth] = useState("100%");

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true, // Enable column resizing
  });

  // Handle resizing the entire table
  const handleTableResize = useCallback((e) => {
    const newWidth = `${e.clientX}px`;
    setTableWidth(newWidth);
  }, []);

  const stopResize = () => {
    document.removeEventListener("mousemove", handleTableResize);
    document.removeEventListener("mouseup", stopResize);
  };

  const startResize = (e) => {
    document.addEventListener("mousemove", handleTableResize);
    document.addEventListener("mouseup", stopResize);
  };

  // Handle cell editing (update both table data and selectedValue)
  const handleCellEdit = (rowIndex, columnId, value) => {
    const updatedData = [...tableData];
    updatedData[rowIndex] = { ...updatedData[rowIndex], [columnId]: value };
    setTableData(updatedData);

    // If the selected cell is the same as the one being edited, update the input editor too
    if (selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.columnId === columnId) {
      setSelectedValue(value);
    }
  };

  // Handle input change (input editor below the table)
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);

    if (selectedCell) {
      const { rowIndex, columnId } = selectedCell;
      handleCellEdit(rowIndex, columnId, newValue);
    }
  };

  // Handle cell click (select the cell)
  const handleCellClick = (rowIndex, columnId) => {
    setSelectedCell({ rowIndex, columnId });
    setSelectedValue(tableData[rowIndex][columnId] || ""); // Sync input editor with selected cell value
  };

  // Add row to the table
  const addRow = () => {
    const newRow = tableColumns.reduce((acc, col) => {
      acc[col.id] = "";
      return acc;
    }, {});
    setTableData([...tableData, newRow]);
  };

  // Add column to the table
  const addColumn = () => {
    const newColumnKey = `column${tableColumns.length + 1}`;
    const newColumn = columnHelper.accessor(newColumnKey, {
      header: newColumnKey,
      cell: (info) => info.getValue(),
    });
    setTableColumns([...tableColumns, newColumn]);
    setTableData(tableData.map((row) => ({ ...row, [newColumnKey]: "" })));
  };

  // Toggle row removal mode
  const toggleRowRemoveMode = () => {
    if (showRowCheckboxes) {
      setTableData(tableData.filter((_, index) => !selectedRows.has(index)));
      setSelectedRows(new Set());
    }
    setShowRowCheckboxes(!showRowCheckboxes);
  };

  // Handle row checkbox change
  const handleRowCheckboxChange = (index) => {
    const updatedSelection = new Set(selectedRows);
    if (updatedSelection.has(index)) {
      updatedSelection.delete(index);
    } else {
      updatedSelection.add(index);
    }
    setSelectedRows(updatedSelection);
  };

  // Toggle column removal mode
  const toggleColumnRemoveMode = () => {
    if (showColumnCheckboxes) {
      const newColumns = tableColumns.filter(
        (col) => !selectedColumns.has(col.id)
      );
      setTableColumns(newColumns);

      setTableData((prevData) =>
        prevData.map((row) =>
          Object.fromEntries(
            Object.entries(row).filter(([key]) => !selectedColumns.has(key))
          )
        )
      );
      setSelectedColumns(new Set());
    }
    setShowColumnCheckboxes(!showColumnCheckboxes);
  };

  // Handle column checkbox change
  const handleColumnCheckboxChange = (columnId) => {
    const updatedSelection = new Set(selectedColumns);
    if (updatedSelection.has(columnId)) {
      updatedSelection.delete(columnId);
    } else {
      updatedSelection.add(columnId);
    }
    setSelectedColumns(updatedSelection);
  };

  // Apply Text Color to selected cell
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

  // Apply Background Color to selected cell
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

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        {/* Text color picker */}
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          className={styles.colorPicker}
        />
        <button onClick={applyTextColor} className={styles.button}>
          Apply Text Color
        </button>

        {/* Background color picker */}
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className={styles.colorPicker}
        />
        <button onClick={applyBgColor} className={styles.button}>
          Apply Background Color
        </button>

        <button
          onClick={addRow}
          className={`${styles.button} ${styles.buttonBlue}`}
        >
          Add Row
        </button>
        <button
          onClick={addColumn}
          className={`${styles.button} ${styles.buttonPurple}`}
        >
          Add Column
        </button>

        <button onClick={toggleRowRemoveMode} className={styles.button}>
          {showRowCheckboxes ? "Cancel Row Removal" : "Remove Row"}
        </button>

        <button onClick={toggleColumnRemoveMode} className={styles.button}>
          {showColumnCheckboxes ? "Cancel Column Removal" : "Remove Column"}
        </button>
      </div>

      {/* Input for direct cell editing */}
      {selectedCell && (
        <div className={styles.cellEditor}>
          <h3>Edit Selected Cell</h3>
          <input
            type="text"
            value={selectedValue}
            onChange={handleInputChange} // Sync the input with the cell editor
            className={styles.inputEditor}
          />
        </div>
      )}

      <div className={styles.tableContainer} style={{ width: tableWidth }}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={styles.tableHeaderCell}>
                    {showColumnCheckboxes && (
                      <input
                        type="checkbox"
                        checked={selectedColumns.has(header.id)}
                        onChange={() =>
                          handleColumnCheckboxChange(header.id)
                        }
                      />
                    )}
                    {!header.isPlaceholder &&
                      flexRender(header.column.columnDef.header, header.getContext())}
                    <div
                      {...header.getResizeHandler()}
                      style={{
                        cursor: "col-resize",
                        userSelect: "none",
                        backgroundColor: "lightgray",
                        width: "5px", // Adjust the resize handle width
                      }}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {showRowCheckboxes && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.index)}
                      onChange={() => handleRowCheckboxChange(row.index)}
                    />
                  </td>
                )}
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={styles.tableCell}
                    style={cellStyles[`${row.index}-${cell.column.id}`] || {}}
                    onClick={() => handleCellClick(row.index, cell.column.id)}
                  >
                    <input
                      type="text"
                      value={cell.getValue() || ""}
                      onChange={(e) =>
                        handleCellEdit(row.index, cell.column.id, e.target.value)
                      }
                      className={styles.cellInput}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Table resize handle in the bottom-right corner */}
        <div
          className={styles.tableResizeHandle}
          onMouseDown={startResize}
        ></div>
      </div>
    </div>
  );
};

export default TableComponent;
