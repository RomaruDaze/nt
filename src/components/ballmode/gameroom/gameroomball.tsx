import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../../SocketContext";
import { useNavigate } from "react-router-dom";

import "./gameroomball.css";

function GameRoomBall() {
  const location = useLocation();
  const { myName } = location.state;
  const socket = useSocket();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<{ [key: string]: string[] }>({
    logic: [],
    process: [],
    optimism: [],
    facts: [],
    danger: [],
    emotion: [],
  });
  const [myRole, setMyRole] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [intercepter, setIntercepter] = useState<string | null>(null);
  const [intercepted, setIntercepted] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    socket.on("updateGroups", (updatedGroups: { [key: string]: string[] }) => {
      setGroups(updatedGroups);
      // Find player's role
      for (const [role, players] of Object.entries(updatedGroups)) {
        if (players.includes(myName)) {
          setMyRole(role);
          break;
        }
      }
    });

    socket.on("gameStarted", (data: { [key: string]: string[] }) => {
      setGroups(data);
      // Find player's role
      for (const [role, players] of Object.entries(data)) {
        if (players.includes(myName)) {
          setMyRole(role);
          break;
        }
      }
    });

    socket.emit("requestPlayerList");

    return () => {
      socket.off("updateGroups");
      socket.off("gameStarted");
    };
  }, [socket, myName]);

  const handlePlayerClick = (player: string) => {
    socket.emit("playerClicked", { player });
  };

  //Gamelogic
  useEffect(() => {
    socket.on("playerClickedNotification", (data: { player: string }) => {
      setSelectedPlayer(data.player);
    });

    if (selectedPlayer !== null && selectedPlayer === myName) {
      console.log("You are selected!");
    } else if (selectedPlayer !== null && selectedPlayer !== myName) {
      console.log("You are not selected!");
    } else if (selectedPlayer === null) {
      console.log("game started");
    }
  }, [selectedPlayer, myName]);

  const isButtonDisabled = selectedPlayer !== myName && selectedPlayer !== null;

  //intercept
  const handleIntercept = () => {
    if (selectedPlayer && selectedPlayer !== myName) {
      socket.emit("intercept", { myName, selectedPlayer });
      socket.emit("broadcastIntercept", {
        intercepter: myName,
        intercepted: selectedPlayer,
      });
      setIntercepter(myName);
      setIntercepted(selectedPlayer);
      setTimer(60);
      socket.emit("startTimer", { time: 60 });
    }
  };

  const isInterceptButtonDisabled =
    selectedPlayer === myName && selectedPlayer !== null;

  const isIntercepted = intercepted !== null;

  useEffect(() => {
    socket.on(
      "interceptNotification",
      (data: { intercepter: string; intercepted: string }) => {
        if (data.intercepted === myName && data.intercepter !== myName) {
          console.log("You got intercepted");
        } else if (data.intercepted !== myName && data.intercepter !== myName) {
          console.log(`${data.intercepted} got intercepted`);
        } else if (data.intercepted !== myName && data.intercepter === myName) {
          console.log(`You intercepted ${data.intercepted}`);
        }
        setIntercepter(data.intercepter);
        setIntercepted(data.intercepted);
      }
    );

    return () => {
      socket.off("interceptNotification");
    };
  }, [socket, myName]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (intercepted !== null) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            setIntercepted(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [intercepted]);

  useEffect(() => {
    socket.on("timerUpdate", (data: { time: number }) => {
      setTimer(data.time);
    });

    return () => {
      socket.off("timerUpdate");
    };
  }, []);

  // Add this helper function for text colors
  function getRoleTextColor(role: string): string {
    return role === "Logic" ? "#000000" : "#FFFFFF";
  }

  return (
    <div className="game-room-ball-container">
      <div className="game-room-ball-header">
        <p>名前：{myName}</p>
        <p>役割：{myRole}</p>
        <h2
          className="game-room-ball-speaker"
          style={{ backgroundColor: isButtonDisabled ? "black" : "blue" }}
        >
          発言者：{selectedPlayer}
        </h2>
      </div>
      <div className="horizontal-line"></div>
      <div className="game-room-ball-player-list">
        {Object.entries(groups).map(([role, players]) =>
          players.map((player, index) => (
            <button
              key={`${role}-${index}`}
              style={{
                backgroundColor: isButtonDisabled ? "gray" : getRoleColor(role),
                color: getRoleTextColor(role),
              }}
              onClick={() => handlePlayerClick(player)}
              disabled={isButtonDisabled}
            >
              {player}
            </button>
          ))
        )}
      </div>
      <button
        className="intercept"
        onClick={handleIntercept}
        disabled={isInterceptButtonDisabled}
        style={{ backgroundColor: isInterceptButtonDisabled ? "gray" : "red" }}
      >
        ちょい待って!?
      </button>
      <button className="back-button" onClick={() => navigate("/waitball")}>
        戻る
      </button>
      <div
        className="intercept-block"
        style={{ display: isIntercepted ? "block" : "none" }}
      >
        <h1>ちょい待って！</h1>
        <h2>🗣️ {intercepter}</h2>
        <p>⏰ {timer}</p>
      </div>
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

export default GameRoomBall;
