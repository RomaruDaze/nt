import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSocket } from "../SocketContext";
import "./startroom.css";

function Host() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [roomName, setRoomName] = useState("");

  const sendRoomName = () => {
    socket.emit("sendRoomName", roomName);
  };

  useEffect(() => {
    socket.on("message from join", (data) => {
      console.log("Message from Join:", data);
    });
  }, []);

  return (
    <div className="starthost-container">
      <div className="starthost-roomname">
        <h1>ルーム名</h1>
        <input
          type="text"
          placeholder="ルーム名入力してください"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
      </div>
      <div className="horizontal-line"></div>
      <div className="starthost-name">
        <h1>名前</h1>
        <input type="text" placeholder="名前入力してください" />
        <button onClick={() => sendRoomName()}>作成</button>
      </div>
      <button className="starthost-back" onClick={() => navigate("/")}>
        Back
      </button>
    </div>
  );
}

export default Host;
