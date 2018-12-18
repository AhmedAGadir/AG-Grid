import React from 'react';

const flagRenderer = props => {
  if (props.node.group) {
    return (
      <span>
        <img src={"https://flags.fmcdn.net/data/flags/mini/ie.png"}/> {props.value}
      </span>
    )
  } else return <span>{props.value}</span>
}

export default flagRenderer;