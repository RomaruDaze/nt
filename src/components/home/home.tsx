import "./home.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSocket } from "../SocketContext";
import ball from "../../assets/ball_icon.png";
import roulette from "../../assets/wheel_icon.png";
import logo from "../../assets/logo.png";

function Home() {
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    return () => {
      console.log("Disconnected from Socket.IO server");
    };
  }, [socket]);

  const handleReset = () => {
    if (window.confirm("データをRESETしますか?")) {
      socket.emit("reset");
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <img src={logo} alt="ナゲTalk" />
        <h1>ナゲTalk</h1>
      </div>
      <div className="home-content">
        <button onClick={() => navigate("/waitball")}>ボール投げ</button>
        <img src={ball} alt="ボール投げ" />
      </div>
      <div className="home-content">
        <button onClick={() => navigate("/waitroulette")}>ルーレット</button>
        <img src={roulette} alt="ルーレット" />
      </div>
      <div className="home-footer">
        <button onClick={() => handleReset()}>RESET</button>
      </div>
    </div>
  );
}

export default Home;
