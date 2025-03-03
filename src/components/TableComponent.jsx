import React, { useState, useEffect, useRef } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import './TableComponent.css'; 

const TableComponent = ({ value, onChange }) => {
  // State to store table data, fetched from sessionStorage or default data
  const [tableData, setTableData] = useState(() => {
    const savedData = sessionStorage.getItem("tableData");
    return savedData
      ? JSON.parse(savedData)  // Use saved data from sessionStorage
      : value.data || [         // Or default data if not present
          { id: 1, name: "John Doe", age: 28 },
          { id: 2, name: "Jane Smith", age: 32 },
        ];
  });

  // State to store column data, fetched from sessionStorage or default columns
  const [tableColumns, setTableColumns] = useState(() => {
    const savedColumns = sessionStorage.getItem("tableColumns");
    return savedColumns
      ? JSON.parse(savedColumns)  // Use saved columns from sessionStorage
      : value.columns || [        // Or default columns if not present
          { accessorKey: "id", header: "ID", width: 150 },
          { accessorKey: "name", header: "Name", width: 150 },
          { accessorKey: "age", header: "Age", width: 100 },
        ];
  });

  // State to store custom cell styles (text color, background color)
  const [cellStyles, setCellStyles] = useState(() => {
    const savedStyles = sessionStorage.getItem("cellStyles");
    return savedStyles ? JSON.parse(savedStyles) : {}; // Fetched from sessionStorage if available
  });

  // States for toggle actions like row/column checkboxes for removal and selected cell for editing
  const [showRowCheckboxes, setShowRowCheckboxes] = useState(false);
  const [showColumnCheckboxes, setShowColumnCheckboxes] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedColumnsForRemoval, setSelectedColumnsForRemoval] = useState(new Set());
  const [selectedCell, setSelectedCell] = useState(null);
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  // State to manage table size, fetched from localStorage or default size
  const [size, setSize] = useState(() => {
    const savedSize = localStorage.getItem("tableSize");
    return savedSize ? JSON.parse(savedSize) : { width: 500, height: 300 }; // Saved size or default
  });

  const isResizingTable = useRef(false);  // Ref to manage resizing action

  // Function to start resizing the table
  const startResizeTable = (e) => {
    isResizingTable.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    };
    document.addEventListener("mousemove", resizeTable);
    document.addEventListener("mouseup", stopResizeTable);
  };

  // Function to resize the table dynamically as mouse moves
  const resizeTable = (e) => {
    if (!isResizingTable.current) return;
    const { x, y, width, height } = isResizingTable.current;
    const newWidth = Math.max(100, width + (e.clientX - x));  // Ensure width does not go below 100px
    const newHeight = Math.max(50, height + (e.clientY - y)); // Ensure height does not go below 50px
    setSize({ width: newWidth, height: newHeight });
  };

  // Function to stop resizing and remove event listeners
  const stopResizeTable = () => {
    isResizingTable.current = false;
    document.removeEventListener("mousemove", resizeTable);
    document.removeEventListener("mouseup", stopResizeTable);
  };

  // useEffect to save changes to sessionStorage and localStorage
  useEffect(() => {
    sessionStorage.setItem("tableData", JSON.stringify(tableData)); // Save table data to sessionStorage
    sessionStorage.setItem("tableColumns", JSON.stringify(tableColumns)); // Save table columns to sessionStorage
    sessionStorage.setItem("cellStyles", JSON.stringify(cellStyles)); // Save cell styles to sessionStorage

    localStorage.setItem("tableSize", JSON.stringify(size)); // Save table size to localStorage

    if (onChange) {
      onChange({ data: tableData, columns: tableColumns }); // Callback to parent component on table change
    }
  }, [tableData, tableColumns, cellStyles, size, onChange]);

  // React Table initialization
  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Function to handle cell edit
  const handleCellEdit = (rowIndex, columnId, value) => {
    const updatedData = [...tableData];
    updatedData[rowIndex] = { ...updatedData[rowIndex], [columnId]: value }; // Update the specific cell value
    setTableData(updatedData);
  };

  // Function to add a new row
  const addRow = () => {
    const newRow = tableColumns.reduce((acc, col) => {
      acc[col.accessorKey] = ""; // Set initial empty value for each column
      return acc;
    }, {});
    setTableData([...tableData, newRow]); // Add the new row to table data
  };

  // Function to add a new column
  const addColumn = () => {
    const newColumnKey = `column${tableColumns.length + 1}`;
    const newColumn = {
      accessorKey: newColumnKey,
      header: newColumnKey,
      width: 150,
    };
    setTableColumns([...tableColumns, newColumn]); // Add new column to columns
    setTableData(tableData.map((row) => ({ ...row, [newColumnKey]: "" }))); // Add new column to all rows with empty values
  };

  // Function to toggle row removal mode
  const toggleRowRemoveMode = () => {
    if (showRowCheckboxes) {
      setTableData(tableData.filter((_, index) => !selectedRows.has(index))); // Remove selected rows
      setSelectedRows(new Set()); // Clear selected rows
    }
    setShowRowCheckboxes(!showRowCheckboxes); // Toggle checkbox visibility for row selection
  };

  // Function to handle row checkbox change
  const handleRowCheckboxChange = (index) => {
    const updatedSelection = new Set(selectedRows);
    if (updatedSelection.has(index)) {
      updatedSelection.delete(index); // Deselect row
    } else {
      updatedSelection.add(index); // Select row
    }
    setSelectedRows(updatedSelection); // Update selected rows state
  };

  // Function to toggle column removal mode
  const toggleColumnRemoveMode = () => {
    setShowColumnCheckboxes(!showColumnCheckboxes); // Toggle checkbox visibility for column selection
    setSelectedColumnsForRemoval(new Set()); // Clear selected columns for removal
  };

  // Function to handle column checkbox change
  const handleColumnCheckboxChange = (columnId) => {
    const updatedSelection = new Set(selectedColumnsForRemoval);
    if (updatedSelection.has(columnId)) {
      updatedSelection.delete(columnId); // Deselect column
    } else {
      updatedSelection.add(columnId); // Select column
    }
    setSelectedColumnsForRemoval(updatedSelection); // Update selected columns state
  };

  // Function to remove selected columns from the table
  const removeSelectedColumns = () => {
    const columnsToRemove = Array.from(selectedColumnsForRemoval); // Get selected columns to remove
    const updatedColumns = tableColumns.filter(
      (col) => !columnsToRemove.includes(col.accessorKey) // Remove selected columns
    );

    const updatedData = tableData.map((row) => {
      const updatedRow = { ...row };
      columnsToRemove.forEach((colId) => {
        delete updatedRow[colId]; // Remove corresponding column data from each row
      });
      return updatedRow;
    });

    setTableColumns(updatedColumns); // Update columns
    setTableData(updatedData); // Update table data
    setSelectedColumnsForRemoval(new Set()); // Clear selected columns for removal
  };

  // Function to handle cell click and select it for editing
  const handleCellClick = (rowIndex, columnId) => {
    setSelectedCell({ rowIndex, columnId });
  };

  // Function to apply text color to selected cell
  const applyTextColor = () => {
    if (selectedCell) {
      const { rowIndex, columnId } = selectedCell;
      const newStyles = { ...cellStyles };
      newStyles[`${rowIndex}-${columnId}`] = {
        ...newStyles[`${rowIndex}-${columnId}`],
        color: textColor,
      };
      setCellStyles(newStyles); // Apply the new text color to the selected cell
    }
  };

  // Function to apply background color to selected cell
  const applyBgColor = () => {
    if (selectedCell) {
      const { rowIndex, columnId } = selectedCell;
      const newStyles = { ...cellStyles };
      newStyles[`${rowIndex}-${columnId}`] = {
        ...newStyles[`${rowIndex}-${columnId}`],
        backgroundColor: bgColor,
      };
      setCellStyles(newStyles); // Apply the new background color to the selected cell
    }
  };

  // Function to handle column header edit
  const handleColumnHeaderEdit = (index, value) => {
    const updatedColumns = [...tableColumns];
    updatedColumns[index] = { ...updatedColumns[index], header: value }; // Update column header text
    setTableColumns(updatedColumns);
  };

  // Function to handle input change in a selected cell
  const handleInputChange = (e) => {
    if (selectedCell) {
      const { rowIndex, columnId } = selectedCell;
      const newData = [...tableData];
      newData[rowIndex][columnId] = e.target.value; // Update cell data with new input
      setTableData(newData);
    }
  };

  return (
    <div className="table-container">
      {/* Input Box for Editing */}
      <div className="input-box">
        {/* Color Picker and Apply Buttons */}
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
        />
        <button onClick={applyTextColor} className="apply-text-color">
          Apply Text Color
        </button>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
        />
        <button onClick={applyBgColor} className="apply-bg-color">
          Apply Background Color
        </button>
        {/* Add Row and Column Buttons */}
        <button onClick={addRow} className="add-row">
          Add Row
        </button>
        <button onClick={addColumn} className="add-column">
          Add Column
        </button>
        {/* Row/Column Removal Buttons */}
        <button
          onClick={toggleRowRemoveMode}
          className={`toggle-row-remove-mode ${
            showRowCheckboxes ? "bg-red-500" : ""
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
          className={`toggle-column-remove-mode ${
            showColumnCheckboxes ? "bg-red-500" : ""
          }`}
        >
          {showColumnCheckboxes ? "Confirm Remove Column" : "Remove Column"}
        </button>
      </div>

      {/* Render cell input box when a cell is selected */}
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

      {/* Resizable Table */}
      <div className="table-wrapper" style={{ width: `${size.width}px`, height: `${size.height}px` }}>
        <table>
          <thead>
            <tr>
              {/* Render Column Headers */}
              {tableColumns.map((col, index) => (
                <th key={col.accessorKey}>
                  <input
                    type="text"
                    value={col.header}
                    onChange={(e) => handleColumnHeaderEdit(index, e.target.value)}
                  />
                  {/* Column Remove Checkbox */}
                  {showColumnCheckboxes && (
                    <input
                      type="checkbox"
                      onChange={() => handleColumnCheckboxChange(col.accessorKey)}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Render Rows */}
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {/* Row Checkbox for Removal */}
                {showRowCheckboxes && (
                  <td>
                    <input
                      type="checkbox"
                      onChange={() => handleRowCheckboxChange(rowIndex)}
                    />
                  </td>
                )}
                {/* Render Cells */}
                {tableColumns.map((col) => (
                  <td
                    key={col.accessorKey}
                    className={selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.columnId === col.accessorKey ? "selected-cell" : ""}
                    style={cellStyles[`${rowIndex}-${col.accessorKey}`] || {}}
                    onClick={() => handleCellClick(rowIndex, col.accessorKey)}
                  >
                    <input
                      type="text"
                      value={row[col.accessorKey] || ""}
                      onChange={(e) =>
                        handleCellEdit(rowIndex, col.accessorKey, e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Resizing Handle */}
        {tableColumns.length > 0 && (
          <div
            className="resizer"
            onMouseDown={startResizeTable}
          ></div>
        )}
      </div>
    </div>
  );
};

export default TableComponent;
