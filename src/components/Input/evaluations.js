import React, {useState} from "react";

const InputEvaluations = ({row, col, options_, callback}) => {
	const сhangeSelect = (event) => {
    	callback(row, col, event.target.value);
	};
	const createSelectItems = (item_val) => {
		let items = [];         
		for (let i = 0; i < item_val.length; i++) {             
			 items.push(<option key={item_val[i]+i.toString()} value={item_val[i]}>{item_val[i]}</option>);   
		}
		return items;
	};
  	return (
			<select onChange={сhangeSelect}>
				{createSelectItems(options_)}
			</select>
  	)
};

export default InputEvaluations;