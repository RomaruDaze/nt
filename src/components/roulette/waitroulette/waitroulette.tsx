import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../SocketContext";
import "./waitroulette.css";

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
    if (name && !players.includes(name)) {
      socket.emit("newPlayer", name);
      setMyName(name);
      setName("");
    } else if (players.includes(name)) {
      alert("この名前はすでに使用されています。");
    }
  };

  const handleStart = () => {
    if (myName) {
      socket.emit("startGame", myName);
      navigate("/gameroomroulette", { state: { myName } });
    }
  };

  return (
    <div className="waitroulette-container">
      <div className="waitroulette-header">
        <h1>ルーレット</h1>
      </div>
      <div className="waitroulette-content">
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
      <div className="horizontal-line"></div>
      <div className="waitroulette-player-list">
        <h2>参加者</h2>
        <div className="waitroulette-player-list-item">
          <ul>
            {players.map((player, index) => (
              <li
                key={index}
                style={{ color: player === myName ? "green" : "black" }}
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
