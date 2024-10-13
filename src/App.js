import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import SinglePost from './components/SinglePost';

function App() {
  const token = localStorage.getItem('token');
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/edit/:id" element={<EditPost />} />
                <Route path="/post/:id" element={<SinglePost />} />
            </Routes>
        </Router>
    );
}

export default App;
