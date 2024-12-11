import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../../SocketContext";
import "./gameroomball.css";

function GameRoomBall() {
  const location = useLocation();
  const { myName } = location.state;
  const socket = useSocket();
  const [andGroup, setAndGroup] = useState<string[]>([]);
  const [butGroup, setButGroup] = useState<string[]>([]);
  const [myRole, setMyRole] = useState<string | null>(null);

  useEffect(() => {
    socket.on(
      "updatePlayerList",
      (groups: { andgroup: string[]; butgroup: string[] }) => {
        if (Array.isArray(groups.andgroup) && Array.isArray(groups.butgroup)) {
          setAndGroup(groups.andgroup);
          setButGroup(groups.butgroup);
          if (groups.andgroup.includes(myName)) {
            setMyRole("肯定的");
          } else if (groups.butgroup.includes(myName)) {
            setMyRole("批判的");
          } else {
            setMyRole(null);
          }
        } else {
          console.error("Received data is not in the expected format:", groups);
        }
      }
    );

    socket.on(
      "gameStarted",
      (data: { andgroup: string[]; butgroup: string[] }) => {
        setAndGroup(data.andgroup);
        setButGroup(data.butgroup);
        if (data.andgroup.includes(myName)) {
          setMyRole("肯定的");
        } else if (data.butgroup.includes(myName)) {
          setMyRole("批判的");
        } else {
          setMyRole(null);
        }
      }
    );

    socket.emit("requestPlayerList");

    return () => {
      socket.off("updatePlayerList");
      socket.off("gameStarted");
    };
  }, [socket, myName]);

  return (
    <div className="game-room-ball-container">
      <div className="game-room-ball-header">
        <h1>ゲームルーム</h1>
        <h2>名前：{myName}</h2>
        <h2>役割：{myRole}</h2>
      </div>
      <div className="horizontal-line"></div>
      <div className="game-room-ball-player-list">
        {andGroup.map((player, index) => (
          <button key={index} style={{ backgroundColor: "green" }}>
            {player}
          </button>
        ))}
        {butGroup.map((player, index) => (
          <button key={index} style={{ backgroundColor: "red" }}>
            {player}
          </button>
        ))}
      </div>
      <button className="back-button">戻る</button>
    </div>
  );
}

export default GameRoomBall;
