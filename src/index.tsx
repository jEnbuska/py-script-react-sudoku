import classnames from "classnames";
import produce from "immer";
import { range } from "lodash";
import React, { ChangeEvent, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

declare function cell_correct(
  sudoku: number[][],
  row_no: number,
  column_no: number
): boolean;

declare function block_correct(
  sudoku: number[][],
  row_no: number,
  column_no: number
): boolean;

declare function column_correct(sudoku: number[][], column_no: number): boolean;

declare function row_correct(sudoku: number[][], row_no: number): boolean;

const isValid = (grid: number[][], rowIndex: number, columnIndex: number) => {
  const cellCorrect = cell_correct(grid, rowIndex, columnIndex);
  const blockCorrect = block_correct(
    grid,
    Math.floor(rowIndex / 3) * 3,
    Math.floor(columnIndex / 3) * 3
  );
  const rowCorrect = row_correct(grid, rowIndex);
  const columnCorrect = column_correct(grid, columnIndex);
  return cellCorrect && rowCorrect && columnCorrect && blockCorrect;
};

const initialState = range(9).map(() => range(9).map(() => 0));

const Sudoku = () => {
  console.log("RENDER SUDOKU");
  const [sudoku, setSudoku] = useState(initialState);
  const handleChange =
    (rowIndex: number, columnIndex: number) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10) || 0;
      const nextState = produce(sudoku, (draft) => {
        draft[rowIndex][columnIndex] = value;
      });
      setSudoku(nextState);
    };
  return (
    <div>
      {sudoku.map((row, rowIndex) => {
        return (
          <div key={`row-${rowIndex}`} className="sudokuRow">
            {row.map((value, columnIndex) => {
              return (
                <input
                  key={`${rowIndex}-${columnIndex}`}
                  value={value ? value : ""}
                  type="number"
                  min={0}
                  max={9}
                  onChange={handleChange(rowIndex, columnIndex)}
                  className={classnames("sudokuCell", {
                    sudokuCellInvalid: !isValid(sudoku, rowIndex, columnIndex),
                  })}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
const waitUntilSudokuPyReady = async (): Promise<void> => {
  if ("cell_correct" in window) {
    console.log("done");
    return;
  }
  console.log("wait");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(waitUntilSudokuPyReady());
    }, 500);
  });
};
const root = createRoot(document.getElementById("root")!);
waitUntilSudokuPyReady().then(() => {
  root.render(<Sudoku />);
});