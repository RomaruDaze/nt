import "./wait.css";
import { useLocation } from "react-router-dom";

function Wait() {
  const location = useLocation();
  const roomNameFromState = location.state?.roomName;
  const roomNameFromStorage = localStorage.getItem("roomName");
  const roomName = roomNameFromState || roomNameFromStorage;

  return (
    <div className="wait-container">
      <div className="wait-header">
        <h1>ルーム選択</h1>
        <select>
          <option value={roomName}>{roomName}</option>
        </select>
      </div>
      <div className="wait-content">
        <h2>名前</h2>
        <input type="text" placeholder="名前入力" />
        <button>参加</button>
      </div>
    </div>
  );
}

export default Wait;
