class TriangleFuzzyNumber {
  constructor(number) {
    this.lb = number[0];
    this.ub = number[2];
    this.quant = number[1];
  }
}

const triangular_devide_by_number = (a, numb) => {
  return new TriangleFuzzyNumber([a.lb/numb, a.quant/numb, a.ub/numb]);
}

const triangular_sum = (a, b) => {
  return new TriangleFuzzyNumber([a.lb + b.lb, a.quant + b.quant, a.ub + b.ub]);
}

const comparator = (a, b) => {
  if (a.ub > b.ub) {
    return true;
  }
  return false;
}

const aggregate_weights = (weights) => {
  let res_weights = [];
    for (let i = 0; i < weights[0].length; i++) {
      let weight = weights[0][i];
      for (let j = 1; j < weights.length; j++) {
        weight = triangular_sum(weight, weights[j][i]);
      }
      weight = triangular_devide_by_number(weight, weights.length);
      res_weights.push(weight);
    }
  return res_weights;
}

const normilize_table = (table) => {
  for (let col = 0; col < table[0].length; col++) {
    let max_v = table[0][col].ub;
    for (let row = 1; row < table.length; row++) {
      if (table[row][col].ub > max_v) {
        max_v = table[row][col].ub;
      }
    }
    for (let row = 0; row <  table.length; row++) {
      table[row][col] = triangular_devide_by_number(table[row][col], max_v);
    }
  }
  return table;
}

const transform_table = (table, legends) => {
  let new_table = [];
    (table).forEach(matrix => {
      let new_matrix = [];
        matrix.forEach(row => {
          let new_row = [];
          row.forEach(column => {
          new_row.push(new TriangleFuzzyNumber(legends[column]));
          });
          new_matrix.push(new_row);
        });
      new_table.push(new_matrix);
    });
  return new_table;
}

const transform_waights = (w_table, legends) => {
  let new_table = [];
    for (let i = 0; i < w_table.length; i++) {
      let new_w = [];
      for (let j = 0; j < w_table[i].length; j++) {
        new_w.push(new TriangleFuzzyNumber(legends[w_table[i][j]]));
      }
      new_table.push(new_w);
    }
  return new_table;
}

const aggregate_decidions = (tables) => {
  let aggr_table = [];
  let decidion_makers_count = tables.length;
  if (decidion_makers_count === 0) {
    return null
  }
  let alternatives_count = tables[0].length;
  if (alternatives_count === 0) {
    return null
  }
  let criterion_count = tables[0][0].length;
  if (criterion_count === 0) {
    return null
  }
  for (let row = 0; row < alternatives_count; row++) {
    let new_row = [];
    for (let col = 0; col < criterion_count; col++) {
      let aggr_val = tables[0][row][col];
        for (let evl = 1; evl < decidion_makers_count; evl++) {
          aggr_val = triangular_sum(aggr_val, tables[evl][row][col])
        }
        new_row.push(triangular_devide_by_number(aggr_val, decidion_makers_count));
      }
      aggr_table.push(new_row);
    }
  return aggr_table;
}

const pair_wise_compare = (table) => {
  let res_matrix = [];
    for (let i = 0; i < table.length; i++) {
      let alt_comp = [];
      for(let j = 0; j < table.length; j++) {
        if (i===j) {
          continue;
        }
        let comp_row = [];
        for (let k = 0; k < table[i].length; k++) {
          if (comparator(table[i][k], table[j][k])) {
            comp_row.push(1);
          } else {
            comp_row.push(0);
          }
        }
        alt_comp.push(comp_row);
      }
      res_matrix.push(alt_comp);
    }
  return res_matrix;
}

const weighted_aggregated_prefer = (pairwise_mtx, normalized_weights) => {
  let prefer = []
    for (let i = 0; i < pairwise_mtx.length; i++) {
      let row = [];
      for (let j = 0; j < pairwise_mtx[i].length; j++) {
        let weighted_pref = pairwise_mtx[i][j][0]*(normalized_weights[0].lb+normalized_weights[0].quant+normalized_weights[0].ub);
        for (let k = 1; k < pairwise_mtx[i][j].length; k++) {
          weighted_pref = weighted_pref + pairwise_mtx[i][j][k]*(normalized_weights[k].lb+normalized_weights[k].quant+normalized_weights[k].ub);
        }
        row.push(weighted_pref);
      }
      prefer.push(row);
    }
    for (let i = 0; i < prefer.length; i++) {
      prefer[i].splice(i, 0, null);
    }
  return prefer;
}

const calculate_flows = (prefer_mtx) => {
  let positive_flows = [];
  let negative_flows = [];
  let net_flows = [];
  let N = prefer_mtx.length;
  for (let i = 0; i < prefer_mtx.length; i++) {
    let p_flow = 0;
    let n_flow = 0;
    let net_flow = 0;
    for (let j = 0; j < prefer_mtx.length; j++) {
      if (i===j) {
        continue;
      }
      p_flow = p_flow + prefer_mtx[i][j];
      n_flow = n_flow + prefer_mtx[j][i];
    }
    p_flow = p_flow / (N-1);
    n_flow = n_flow / (N-1);
    net_flow = p_flow - n_flow;
    positive_flows.push(p_flow.toFixed(3));
    negative_flows.push(n_flow.toFixed(3));
    net_flows.push(net_flow.toFixed(3));
  }
  let rank = net_flows.slice(0).sort(function(a, b) {
    return b - a;
  }), ranking = [];
  for (var i = 0; i < net_flows.length; i++) {
    ranking.push(rank.indexOf(net_flows[i]) + 1);
  }
  return [positive_flows, negative_flows, net_flows, ranking];
}

export {
  transform_table,
  transform_waights,
  aggregate_decidions,
  aggregate_weights,
  normilize_table,
  pair_wise_compare,
  weighted_aggregated_prefer,
  calculate_flows
};
