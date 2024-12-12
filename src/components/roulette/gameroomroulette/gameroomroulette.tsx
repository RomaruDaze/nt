import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../../SocketContext";
import { useEffect, useState } from "react";
import Roulette from "./roulette";
import "./gameroomroulette.css";

function Gameroomroulette() {
  const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const { myName } = location.state;
  const [groups, setGroups] = useState<{ [key: string]: string[] }>({
    Logic: [],
    Process: [],
    Optimism: [],
    Facts: [],
    Danger: [],
    Emotion: [],
  });
  const [rouletteData, setRouletteData] = useState<{ [key: string]: string }>(
    {}
  );
  const [myRole, setMyRole] = useState<string | null>(null);

  useEffect(() => {
    socket.on("updateGroups", (groupData: { [key: string]: string[] }) => {
      setGroups(groupData);
      // Find which group the player belongs to
      for (const [role, players] of Object.entries(groupData)) {
        if (players.includes(myName)) {
          setMyRole(role);
          break;
        }
      }
    });

    socket.on("gameStarted", (groupData: { [key: string]: string[] }) => {
      setGroups(groupData);
      // Find which group the player belongs to
      for (const [role, players] of Object.entries(groupData)) {
        if (players.includes(myName)) {
          setMyRole(role);
          break;
        }
      }
    });

    socket.emit("requestPlayerList");
    socket.emit("requestRouletteState");

    socket.on("rouletteCreated", (data: { [key: string]: string }) => {
      setRouletteData(data);
      if (data[myName]) {
        setMyRole(data[myName]);
      }
    });

    return () => {
      socket.off("updateGroups");
      socket.off("gameStarted");
      socket.off("rouletteCreated");
    };
  }, [socket, myName]);

  const handleMakeRoulette = () => {
    socket.emit("makeRoulette", groups);
  };

  return (
    <div className="gameroomroulette-container">
      <div className="gameroulette-header">
        <p>名前:{myName}</p>
        <p>役割:{myRole}</p>
      </div>
      <button className="gameroulette-body" onClick={handleMakeRoulette}>
        作成
      </button>
      <div className="horizontal-line"></div>
      <div className="roulette-container">
        <Roulette data={rouletteData} myName={myName} />
      </div>
      <button className="back-button" onClick={() => navigate("/waitroulette")}>
        戻る
      </button>
    </div>
  );
}

export default Gameroomroulette;
