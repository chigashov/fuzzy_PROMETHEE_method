import React from "react";

const Input = ({count, setCount, min = 2, max}) => {
  
  const onChangeHandler = (event) => {
    if (Number(event.target.value) > max) return;
    setCount(Number(event.target.value));
  };

  return (
    <input
      type='number'
      value={count}
      onChange={onChangeHandler}
      min={min}
      max={max}  
    />
  )
};

export default Input;