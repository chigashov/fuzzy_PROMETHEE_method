import React from "react";

import './styles.sass'

const Input = ({count, setCount, min, max}) => {
  
  const onChangeHandler = (event) => {
    if (Number(event.target.value) > max) return;
    setCount(Number(event.target.value));
  };

  return (
    <input
      className='input'
      type='number'
      value={count}
      onChange={onChangeHandler}
      min={min}
      max={max}
    />
  )
};

export default Input;