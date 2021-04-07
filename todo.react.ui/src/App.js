import React from 'react';

import Header from './Header';

const App = ({ children }) => {
  return (
    <div>
      <Header />
      { children }
    </div>
  );
}

export default App;
