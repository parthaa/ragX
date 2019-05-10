import React from "react";

export default function(props) {
  const items = props.items.map((item, index) => {
    return (<option key={index} value={index}>{item.name}</option>)
  });

  const onChange = (evt) => {
    if (evt.target.value === -1) {
      props.onSelection({})
    } else {
      props.onSelection(props.items[evt.target.value])
    }
  }
  return (
    <div>
      <h2> {props.title} </h2>
      <select onChange={(evt) => onChange(evt)} >
        <option key={-1} value={-1}></option>
        {items}
      </select>
    </div>
  );
}