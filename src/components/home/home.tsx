import "./home.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSocket } from "../SocketContext";

function Home() {
  const navigate = useNavigate();
  const socket = useSocket();

  const HandleId = (id: string) => {
    if (id === "host") {
      navigate("/host");
    } else if (id === "join") {
      socket.emit("requestRoomNames");
      navigate("/join");
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    return () => {
      console.log("Disconnected from Socket.IO server");
    };
  }, [socket]);

  return (
    <div className="main-container">
      <div className="main-header">
        <h1>ナゲTalk</h1>
      </div>
      <div className="main-content">
        <button onClick={() => HandleId("host")}>ホスト</button>
        <button onClick={() => HandleId("join")}>参加</button>
      </div>
    </div>
  );
}

export default Home;
