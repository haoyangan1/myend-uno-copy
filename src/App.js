import './App.css';
import FriendList from './components/FriendList/FriendList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenu from './components/MainMenu/MainMenu';
import InGame from './components/InGame/InGame';
function App() {
  return (
    <Router>
      <Routes>
        {/* Main Menu with Friend List */}
        <Route 
          path="/" 
          element={
            <div className="main-menu-container">
              <MainMenu />
              <FriendList /> {/* Add FriendList here */}
            </div>
          } 
        />
        
        <Route path="/play" element={<InGame />} /> {/* Changed path to /play */}
      </Routes>
    </Router>
  );
}

export default App;



