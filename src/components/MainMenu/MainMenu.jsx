import { useNavigate } from 'react-router-dom';
import './MainMenu.css';

export default function MainMenu() {
  const navigate = useNavigate();

  return (
    <div className="main-menu">
      <h1>UNO Game</h1>
      <button onClick={() => navigate('/play')}>Start Game</button> {/* Navigate to /play */}
      <button>How to Play</button>
    </div>
  );
}