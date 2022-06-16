import React from 'react'
import {transform_table, transform_waights, aggregate_decidions,
    aggregate_weights, normilize_table, pair_wise_compare,
    weighted_aggregated_prefer, calculate_flows} from '../../logic/promethei'

import './styles.sass'

const Report = ({val_tables, weights_tables, terms1, terms2}) => {

  const _transformed_val_table = transform_table(val_tables, terms1);
  const _transformed_w_table = transform_waights(weights_tables, terms2);
  const _aggr_val_table = aggregate_decidions(_transformed_val_table);
  const _aggr_w_table = aggregate_weights(_transformed_w_table);
  const _norm_val_table = normilize_table(_aggr_val_table);
  const _pair_compared_table = pair_wise_compare(_norm_val_table);
  const _aggr_pref_table = weighted_aggregated_prefer(_pair_compared_table, _aggr_w_table);
  const _flows_table = calculate_flows(_aggr_pref_table);

  const transpose_matrix = (mtx) => {
    let new_mtx = Array.from({length: mtx[0].length}, (i,j) =>
      Array.from({length: mtx.length}, (v,k) => 0));
    for (let row = 0; row < mtx.length; row++) {
      for (let col = 0; col < mtx[0].length; col++) {
        new_mtx[col][row] = mtx[row][col];
      }
    }
    return new_mtx;
  };

  const flows_table = transpose_matrix(_flows_table);
  const headers = ['Исходящий поток', 'Входящий поток', 'Чистый поток', 'Ранжирование'];
  return (
    <>
      <div className='table'>
        <div className="table-left-decoration"></div>
        <div className='table__criteria-row'>
          <div className="table__cell" />
            {headers.map((flow, index) => (
            <div className="table__cell" key={index}>
              <span>{flow}</span>
            </div>
          ))}
        </div>
        {flows_table.map((row, rowindex) => (
          <div className="table__row" key={`${row[0]}${row[row.length - 1]}`}>
            <div className="table__cell">
              <span>{`A${rowindex + 1}`}</span>
            </div>
            <div className="table__row"> {
              row.map((cell, cellIndex) =>
                (<div className="table__cell" key={cellIndex}>
                  <span>{cell}</span>
                </div>
              ))}
            </div>
          </div>
        ))} 
      </div>
    </>
  );
};

export default Report;