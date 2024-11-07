// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/DashboardApp';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Main route to the Dashboard */}
                    <Route path="/" element={<Dashboard />} />
                    
                </Routes>
            </div>
        </Router>
    );
}

export default App;
