import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./startroom.css";
import { useSocket } from "../SocketContext";

function Join() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [roomNames, setRoomNames] = useState<string[]>([]);

  useEffect(() => {
    // Listen for the 'sentRoomName' event to receive room names
    socket.on("sentRoomName", (data) => {
      setRoomNames(data);
    });

    // Emit a request for room names when the component mounts
    socket.emit("requestRoomNames");

    return () => {
      socket.off("sentRoomName");
    };
  }, [socket]);

  return (
    <div className="startjoin-container">
      <div className="startjoin-roomname">
        <h1>ルーム</h1>
        <select>
          <option>ルーム選択</option>
          {roomNames.map((roomName, index) => (
            <option key={index}>{roomName}</option>
          ))}
        </select>
      </div>
      <div className="horizontal-line"></div>
      <div className="startjoin-name">
        <h1>名前</h1>
        <input type="text" placeholder="名前入力してください" />
        <button onClick={() => navigate("/waithost")}>作成</button>
      </div>
      <button className="startjoin-back" onClick={() => navigate("/")}>
        Back
      </button>
    </div>
  );
}

export default Join;
