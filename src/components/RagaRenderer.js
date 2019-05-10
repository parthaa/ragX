import React from "react";


const showSpan = (item, props) => {
  if (item.shruthi !== props.shruti) {
    return(
      <span>
        (Use <strong>{item.swara_code}</strong> as <strong>Sa</strong> to transition to {props.raga} in {props.shruti} Shruti)
      </span>
    );
  }

  return "";
}

const findTitle = (item, props) => {
  if (props.unknown) {
    return `${item.shruti} - ${item.swaras}`
  } else {
    return `${item.shruti} - ${item.raga}`    
  }
}

export default function(props) {
  const ragaRenderer = props.ragas.map((item, index) => {
    return (
      <li key={index}><strong>{findTitle(item, props)} </strong>
        { showSpan(item, props)}
      </li>
    )
  });

  return (
    <div className="notations">
            <span><h3> {props.title} </h3></span>
             <ol>
              {ragaRenderer.length > 0 ? ragaRenderer: "No results found"}
            </ol>
    </div>
  );
}