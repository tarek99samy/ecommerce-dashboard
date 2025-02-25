import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import Users from './pages/Users';
import Archive from './pages/Archive';
import Products from './pages/Products';
import Paidads from './pages/Paidads';
import Articles from './pages/Articles';
import Chats from './pages/Chats';
import General from './pages/General';
import Locations from './pages/Locations';
import Categories from './pages/Categories';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route
          path='/'
          element={
            <>
              <Navbar />
              <React.Suspense fallback={<ProgressSpinner />}>
                <Home />
              </React.Suspense>
            </>
          }
        />
        <Route
          path='/users'
          element={
            <>
              <Navbar />
              <React.Suspense fallback={<ProgressSpinner />}>
                <Users />
              </React.Suspense>
            </>
          }
        />
        <Route
          path='/products'
          element={
            <>
              <Navbar />
              <React.Suspense fallback={<ProgressSpinner />}>
                <Products />
              </React.Suspense>
            </>
          }
        />
        <Route
          path='/paidads'
          element={
            <>
              <Navbar />
              <React.Suspense fallback={<ProgressSpinner />}>
                <Paidads />
              </React.Suspense>
            </>
          }
        />
        <Route
          path='/articles'
          element={
            <>
              <Navbar />
              <React.Suspense fallback={<ProgressSpinner />}>
                <Articles />
              </React.Suspense>
            </>
          }
        />
        <Route
          path='/chats'
          element={
            <>
              <Navbar />
              <React.Suspense fallback={<ProgressSpinner />}>
                <Chats />
              </React.Suspense>
            </>
          }
        />
        <Route
          path='/categories'
          element={
            <>
              <Navbar />
              <React.Suspense fallback={<ProgressSpinner />}>
                <Categories />
              </React.Suspense>
            </>
          }
        />
        <Route
          path='/locations'
          element={
            <>
              <Navbar />
              <React.Suspense fallback={<ProgressSpinner />}>
                <Locations />
              </React.Suspense>
            </>
          }
        />
        <Route
          path='/archive'
          element={
            <>
              <Navbar />
              <React.Suspense fallback={<ProgressSpinner />}>
                <Archive />
              </React.Suspense>
            </>
          }
        />
        <Route
          path='/general'
          element={
            <>
              <Navbar />
              <React.Suspense fallback={<ProgressSpinner />}>
                <General />
              </React.Suspense>
            </>
          }
        />
        <Route
          path='*'
          element={
            <>
              <Navbar />
              <React.Suspense fallback={<ProgressSpinner />}>
                <Home />
              </React.Suspense>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
