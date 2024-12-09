import { useLocation } from "react-router-dom";
import "./hostgame.css";

function HostGame() {
  const location = useLocation();
  const roomName = location.state?.roomName || "未設定";

  return (
    <div className="hostgame-container">
      <div className="hostgame-header">
        <h1>ホストルーム</h1>
        <h2 id="hostgame-room-name">{roomName}</h2>
      </div>
      <div className="hostgame-content">
        <div className="hostgame-speaker">
          <h2>発言者</h2>
          <h3 id="hostgame-speaker-name"></h3>
        </div>
        <div className="hostgame-participant">
          <h2>参加者</h2>
          <h3 id="hostgame-participant-name"></h3>
        </div>
      </div>
    </div>
  );
}

export default HostGame;
