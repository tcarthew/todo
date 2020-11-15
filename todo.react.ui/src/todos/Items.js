import React, { Component } from 'react';
import RequiresAuth from '../auth/RequiresAuth';

class Items extends Component {
  render() {
    return (
      <div>Items</div>
    );
  }
}

export default RequiresAuth(Items);