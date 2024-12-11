import { useLocation } from "react-router-dom";
import { useSocket } from "../../SocketContext";
import { useEffect, useState } from "react";
import Roulette from "./roulette";
import "./gameroomroulette.css";

function Gameroomroulette() {
  const socket = useSocket();
  const location = useLocation();
  const { myName } = location.state;
  const [andGroup, setAndGroup] = useState<string[]>([]);
  const [butGroup, setButGroup] = useState<string[]>([]);
  const [myRole, setMyRole] = useState<string | null>(null);
  const [rouletteData, setRouletteData] = useState<{ [key: string]: string }>(
    {}
  );

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
          console.log("Received data is not in the expected format:", groups);
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

    socket.on("rouletteCreated", (data: { [key: string]: string }) => {
      console.log("Received roulette data:", data);
      setRouletteData(data);
    });

    return () => {
      socket.off("updatePlayerList");
      socket.off("gameStarted");
      socket.off("rouletteCreated");
    };
  }, [socket, myName]);

  const handleMakeRoulette = () => {
    socket.emit("makeRoulette", { andGroup, butGroup });
  };

  return (
    <div className="gameroomroulette-container">
      <div className="gameroulette-header">
        <h1>ゲームルーレット</h1>
        <p>名前:{myName}</p>
        <p>役割:{myRole}</p>
      </div>
      <div className="horizontal-line"></div>
      <div className="gameroulette-body">
        <button onClick={handleMakeRoulette}>作成</button>
      </div>
      <div className="roulette-container">
        <Roulette data={rouletteData} myName={myName} />
      </div>
    </div>
  );
}

export default Gameroomroulette;
