import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const RouteGuard = ({component: ProtectedComponent, ...rest }) => {
  const authenticated = useSelector(state => !!state.auth.token);
  
  return (
    <Route
      { ...rest }
      render={ (props) => (authenticated ? <ProtectedComponent { ...props } /> : <Redirect to='/' />) }
    />
  )
}

export default RouteGuard;