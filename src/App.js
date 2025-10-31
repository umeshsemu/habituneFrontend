import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './index.css';
import Layout from './components/Layout';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MapView from './components/MapView';
import Form from './components/Form';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { setUserPosts } from './store/appSlice';

// A small bootstrapper that runs inside Provider to fetch user posts when authenticated
const AuthBootstrapper = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { onSubmit } = useSelector((state) => state.app);

  useEffect(() => {
    if (isAuthenticated !== true) return;
      fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/property/myposts`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        const properties = (data && data.properties) ? data.properties : [];
        dispatch(setUserPosts(properties));
      })
      .catch((err) => {
        // Silently handle error
      });
  }, [isAuthenticated, onSubmit, dispatch]);

  return null;
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthBootstrapper />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/:username/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/:username/postad" 
            element={
              <ProtectedRoute>
                <Form />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Layout />}>
            <Route index element={<MapView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;