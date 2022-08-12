import React, { Component } from 'react';


class Square extends Component {
  render(){
    var squareStyle = {
      height: 200,
      width: 150,
      padding: 0,
      backgroundColor: "#FFF",
      boxShadow:"0px 0px 5px #666"
    };

    return(
      <button>
    <div style={squareStyle}>
    </div>
    </button>
   );
  }
}

export default Square;
