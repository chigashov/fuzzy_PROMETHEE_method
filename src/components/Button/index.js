import React from 'react';

import './styles.sass';


const Button = ({children, isDisabled, on_click, data}) => (

  <button
    className='standart-button'
    disabled={isDisabled}
    onClick={on_click}
  >
    {children}
  </button>
);

export default Button; 