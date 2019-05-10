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

export default function(props) {
  const raga_render = props.ragas.map((item, index) => {
    return (
      <li key={index}><strong>{item.shruti} - {item.raga} </strong>
        { showSpan(item, props)}
      </li>
    )
  });

  return (
    <div className="notations">
            <span><h3> {props.title} </h3></span>
             <ol>
              {raga_render.length > 0 ? raga_render: "No results found"}
            </ol>
    </div>
  );
}