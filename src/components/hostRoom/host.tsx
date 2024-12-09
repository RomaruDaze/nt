import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./host.css";

function Host() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");

  const handleStartGame = (mode: string) => {
    if (!roomName) {
      alert("ルーム名を入力してください。");
      return;
    }
    localStorage.setItem("roomName", roomName);
    navigate("/hostgame", { state: { roomName, mode } });
  };

  return (
    <div className="host-container">
      <div className="host-header">
        <h1>ホスト</h1>
        <input
          type="text"
          placeholder="ルーム名"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
      </div>
      <div className="host-content">
        <h2>モード選択</h2>
        <button onClick={() => handleStartGame("ボール投げ")}>
          ボール投げ
        </button>
        <button onClick={() => handleStartGame("ルーレット")}>
          ルーレット
        </button>
      </div>
      <button
        className="host-back-button"
        onClick={() => setTimeout(() => navigate("/"), 100)}
      >
        戻る
      </button>
    </div>
  );
}

export default Host;
