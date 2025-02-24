import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://127.0.0.1:3300/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser({
          username: response.data.username,
          isAdmin: response.data.isAdmin // تأكد من الحصول على خاصية isAdmin
        });
      })
      .catch(err => {
        console.error('Failed to fetch user:', err);
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
