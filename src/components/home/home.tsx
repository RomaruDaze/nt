import "./home.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSocket } from "../SocketContext";

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

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>ナゲTalk</h1>
      </div>
      <div className="home-content">
        <button onClick={() => navigate("/waitball")}>ホール投げ</button>
        <button onClick={() => navigate("/waitroulette")}>ルーレット</button>
      </div>
    </div>
  );
}

export default Home;
