import React, {useState, useEffect, useMemo} from "react";
import PropTypes from 'prop-types';

import InputEvaluations from "../Input/evaluations";
import './styles.sass'
import { string } from "prop-types";

const CreateTable = ({id, rows, cols, parentCallback_val, parentCallback_crit, criterion_legends, alt_legends}) => {
  var val_table = Array.from({length: rows}, (i,j)=>Array.from({length: cols}, (v,k)=>alt_legends[0]));
  var w_table = Array.from({length: cols}, (i,j)=>criterion_legends[0]);
  const table = useMemo(() => {
    const t = [];
    const stateTab = [];

    for(let i = 0; i < rows; i++) {
      t[i] = [];
      for(let j = 0; j < cols; j++){
        t[i].push(`${i}${j}`)
      }
    }
    return t;
  }, [rows])

    const weights = useMemo(() => {
    const w = [];
    const stateTab = [];

    for(let i = 0; i < cols; i++) {
      w.push(`${i}`);
      stateTab.push('VL');
    }
    return w;
  }, [cols])

  const on_select_changed = (i, j, val) => {
    val_table[i][j] = val;
    parentCallback_val(id, val_table)
  };

  const on_w_selected = (i, j, val) => {
    w_table[j] = val;
    parentCallback_crit(id, w_table);
  }
    
  return (
    <>
    <div className="table">
      <div className="table__criteria-row">
        <div className="table__cell" />
        {table[0].map((criteria, index) => (
          <div className="table__cell" key={criteria}>
            <span>K{index + 1}</span>
          </div>))}
      </div>
      {table.map((row, rowindex) => (
        <div className="table__row" key={`${row[0]}${row[row.length - 1]}`}>
          <div className="table__cell"><span>{`A${rowindex + 1}`}</span></div>
          <div className="table__row">
            {
              row.map((cell, cellIndex) => (<div className="table__cell" key={cell}>
                <InputEvaluations 
                  row={rowindex}
                  col={cellIndex}
                  callback={on_select_changed}
                  options_={alt_legends}/>
              </div>))
            }
          </div>
        </div>
      ))} {
        <div className="table__row">
          <div className="table__cell"><span>{`w`}</span></div>
          {weights.map((criteria, index) => (
            <div className="table__cell" key={criteria}>
              <InputEvaluations
                row={0}
                col={index}
                options_={criterion_legends}
                callback={on_w_selected}
              />
            </div>
          ))}
      </div>
      }
    </div>
    </>
  );
};

CreateTable.propTypes = {
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
};

export default CreateTable;