import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const AdminRoute = ({ element }) => {
  const { user } = useContext(UserContext);

  if (user && user.isAdmin) {
    return element;
  }
  return <Navigate to="/unauthorized" />;
};

export default AdminRoute;
