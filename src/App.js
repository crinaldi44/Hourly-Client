import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import ClockinScreen from './screens/clockin/ClockinScreen'
import LoginScreen from './screens/login/LoginScreen'
import Dashboard from './screens/dashboard/Dashboard copy';
import ProtectedRoute from './hooks/auth/components/ProtectedRoute';

/**
 * Represents the entry point for the application.
 * @returns {JSX.Element}
 * @constructor
 */
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
            <Route path='/' exact element={<ClockinScreen/>}/>
            <Route path='/login' exact element={<LoginScreen/>}/>
            <Route path='/dashboard/*' exact element={<ProtectedRoute element={<Dashboard/>}/>}/>
            <Route path='/*' element={<Navigate to='/'/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
