import "./home.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://172.16.232.96:5000");

function Home() {
  const navigate = useNavigate();
  const HandleId = (id: string) => {
    if (id == "host") {
      navigate("/host");
    } else if (id == "join") {
      navigate("/join");
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
