import React from "react";

import RagaRenderer from './RagaRenderer';
import piano from './static/images/piano.jpeg';
export default function(props) {
  return (
    <div className="notations">
       <h2> Derived Transpose Patterns </h2>
        <span>
          <h3> Legend </h3>
          <img src={piano} width="300px" height="100px"/>
        </span>
        <RagaRenderer title={"Known Ragas"} shruti={props.shruti} raga={props.raga} ragas={props.transposes.knownRagas}/>
        <hr/>
        <RagaRenderer title={"Unnown Ragas"} shruti={props.shruti} raga={props.raga} ragas={props.transposes.unknownRagas}/>
    </div>
  );
}