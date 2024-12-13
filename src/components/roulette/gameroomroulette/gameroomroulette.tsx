import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../../SocketContext";
import { useEffect, useState } from "react";
import Roulette from "./roulette";
import "./gameroomroulette.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedhat } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
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

  // Define a function to get the role description
  function getRoleDescription(role: string | null): string {
    const descriptions: { [key: string]: string } = {
      Logic: "事実を話す役割",
      Process: "議論のまとめる役割",
      Optimism: "利点を特定する役割",
      Creativity: "新しいアイデアを考え出す役割",
      Danger: "リスクと課題を特定する役割",
      Emotion: "感情を話す役割",
    };
    return role
      ? descriptions[role] || "Role description not available."
      : "No role assigned.";
  }

  return (
    <div className="gameroomroulette-container">
      <div className="gameroulette-header">
        <h2>
          <FontAwesomeIcon icon={faUser} /> {myName}
        </h2>
        <p
          style={{
            backgroundColor: myRole === "Danger" ? "#FFFFFF" : "#000000",
            color: myRole === "Danger" ? "#000000" : "#FFFFFF",
            border: myRole === "Danger" ? "2px solid #000000" : "none",
          }}
        >
          <span
            className="role-icon"
            style={{
              color:
                myRole === "Danger"
                  ? "#000000"
                  : myRole === "Creativity"
                  ? "#00ff47"
                  : myRole === "Optimism"
                  ? "#ffdd00"
                  : myRole === "Process"
                  ? "#00aaff"
                  : myRole === "Emotion"
                  ? "#ff4000"
                  : myRole === "Logic"
                  ? "#FFFFFF"
                  : getRoleColor(myRole || ""),
            }}
          >
            <FontAwesomeIcon icon={faRedhat} />
          </span>{" "}
          {myRole}
        </p>
        <div className="role-desc">
          <h3>役割 : {getRoleDescription(myRole)}</h3>
        </div>
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

function getRoleColor(role: string): string {
  const colors = {
    Logic: "#FFFFFF",
    Process: "#2e77ff",
    Optimism: "#efbf04",
    Creativity: "#2e6f40",
    Danger: "#000000",
    Emotion: "#ff3c2e",
  };
  return colors[role as keyof typeof colors] || "gray";
}

export default Gameroomroulette;
