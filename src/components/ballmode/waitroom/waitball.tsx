import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../SocketContext";
import "./waitball.css";

function WaitBall() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [name, setName] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [myName, setMyName] = useState<string | null>(null);

  useEffect(() => {
    socket.on("updatePlayerList", (newPlayers: string[]) => {
      setPlayers(newPlayers);
    });

    socket.on("nameTaken", (data) => {
      alert(data.message);
    });

    return () => {
      socket.off("updatePlayerList");
      socket.off("nameTaken");
      socket.off("gameStarted");
    };
  }, [socket, navigate]);

  const handleJoin = () => {
    if (name) {
      socket.emit("newPlayer", name);
      setMyName(name);
      setName("");
    }
  };

  const handleStart = () => {
    if (myName) {
      socket.emit("startGame", myName);
      navigate("/gameroomball", { state: { myName } });
    }
  };

  return (
    <div className="waitball-container">
      <div className="waitball-header">
        <h1>ボール投げ</h1>
        <div className="waitball-content">
          <input
            type="text"
            placeholder="名前入力"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="join-button" onClick={handleJoin}>
            参加
          </button>
        </div>
        <button className="back-button" onClick={() => navigate("/")}>
          戻る
        </button>
      </div>
      <div className="horizontal-line"></div>
      <div className="waitball-player-list">
        <h2>参加者</h2>
        <div className="waitball-player-list-item">
          <ul>
            {players.map((player, index) => (
              <li
                key={index}
                style={{ color: player === myName ? "gold" : "white" }}
              >
                {player}
                {player === myName && (
                  <p style={{ display: "inline", marginLeft: "5px" }}>
                    (あなた)
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button className="start-button" onClick={handleStart}>
        スタート
      </button>
    </div>
  );
}

export default WaitBall;
