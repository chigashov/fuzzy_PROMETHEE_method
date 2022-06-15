import React, {useState, useMemo} from 'react';

import Input from './components/Input/index';
import Button from './components/Button/index';
import CreateTable from './components/Table/index';
import Report from './components/Table/report';
import './styles.sass';

const App = () => {
  const terms_criterion = {
    'VL': [0, 0.1, 0.3],
    'L': [0.1, 0.3, 0.5],
    'M': [0.3, 0.5, 0.7],
    'H': [0.5, 0.7, 0.9],
    'VH': [0.7, 0.9, 1],
  };

  const crit_legs = ['VL', 'L', 'M', 'H', 'VH'];

  const terms_alternative = {
    'N': [0, 0.1, 0.3],
    'BK': [0.1, 0.3, 0.5],
    'S': [0.3, 0.5, 0.7],
    'P': [0.5, 0.7, 0.9],
    'O': [0.7, 0.9, 1],
  };

  const alt_legs = ['N', 'BK', 'S', 'P', 'O',];

  const [countOfDecisionMakers, setCountOfDecisionMakers] = useState(1);
  const [countOfCriteria, setCountOfCriteria] = useState(2);
  const [countOfAlternatives, setCountOfAlternatives] = useState(2);
  const [isSavedCount, setIsSavedCount] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [val_matrix, setValMatrix] = useState(null);
  const [criterion_matrix, setCriterionMatrix] = useState(null);

  const isDisabledButton = useMemo(() => {
    if (
      countOfDecisionMakers >= 1 &&
      countOfDecisionMakers <= 5 &&
      countOfCriteria >= 2 &&
      countOfCriteria <= 6 &&
      countOfAlternatives >= 2 &&
      countOfAlternatives <= 10
    ) {
      return false;
    }
    return true;
  }, [countOfDecisionMakers, countOfCriteria, countOfAlternatives]);

  const saveCounts = (event) => {
    event.preventDefault();
    setIsSavedCount(true);
  };

  const on_table_updated = (id, table) => {
    let result_mtx = val_matrix;
    for(let j = 0; j < countOfAlternatives; j++) {
      for(let k = 0; k < countOfCriteria; k++) {
        result_mtx[id][j][k] = table[j][k];
      }
    }
    setValMatrix(result_mtx);
  };

  const on_w_updated = (id, w_table) => {
    let crit_mtx = criterion_matrix;
    for (let i = 0; i < countOfCriteria; i++) {
      crit_mtx[id][i] = w_table[i];
    }
    setCriterionMatrix(crit_mtx);
  }

  const on_save_dim_clicked = () => {
    setCriterionMatrix(Array.from({length: countOfDecisionMakers}, (i,j)=>
      Array.from({length: countOfCriteria}, (v,k)=>'VL')));
    setValMatrix(Array.from({length: countOfDecisionMakers}, (z,p)=>
      Array.from({length: countOfAlternatives}, (i,j)=>
      Array.from({length: countOfCriteria}, (v,k)=>'N'))));
  }

  const on_calculate_clicked = () => {
    setIsCalculated(true);
  };

  const createInputTables = (length) => {
    return Array.from({ length }, (v, k) => k)
  };

  // return (
  //   <div className='App'>
  //     <Report val_tables={val_table} weights_tables={w} terms1={terms_v2} terms2={terms} />
  //   </div>
  // )

  if (isCalculated) {
    return (
      <div className='App'>
        <Report 
          val_tables={val_matrix} 
          weights_tables={criterion_matrix} 
          terms1={terms_alternative} 
          terms2={terms_criterion} />
      </div>
    )
  } else {
    return (
      <div className="App">
        {!isSavedCount ? (
          <>
            <form className='input-container' onSubmit={saveCounts}>
              <div className="form-left-decoration"></div>
              <div className="form-right-decoration"></div>
              <div className="circle"></div>
              <h2 className='input-container__h2form'>Метод fuzzy PROMETHEE</h2>
              <div className='input-container__divform'>
                Введите количество ЛПР:
                <Input
                  count={countOfDecisionMakers} 
                  setCount={setCountOfDecisionMakers}
                  min={1}
                  max={5}
                />
              </div>
              <div className='input-container__divform'>
                Введите количество критериев:
                <Input
                  count={countOfCriteria}
                  setCount={setCountOfCriteria}
                  min={2}
                  max={6}
                />
              </div>
              <div className='input-container__divform'>
                Введите количесвто альтернатив:
                <Input
                  count={countOfAlternatives}
                  setCount={setCountOfAlternatives}
                  min={2}
                  max={10}
                />
              </div>
              <Button isDisabled={isDisabledButton} on_click={on_save_dim_clicked}>Сохранить</Button>
            </form>
            <div className='counters'>
              <span>Count Of Decision Makers: {countOfDecisionMakers}</span>
              <span>Count Of Criteria: {countOfCriteria}</span>
              <span>Count Of Alternatives: {countOfAlternatives}</span>
            </div>
          </>
        ) : (
          <div>
            {createInputTables(countOfDecisionMakers).map((decisionmaker) => (
              <CreateTable key={decisionmaker}
                parentCallback_val={on_table_updated}
                parentCallback_crit={on_w_updated}
                id={decisionmaker} 
                rows={countOfAlternatives} 
                cols={countOfCriteria}
                criterion_legends={crit_legs}
                alt_legends={alt_legs}/>
            ))}
            <Button isDisabled={isDisabledButton} on_click={on_calculate_clicked}>Рассчитать</Button>
          </div>
        )} 
      </div>
    );
  }
};

export default App;