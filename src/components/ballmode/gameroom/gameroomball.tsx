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
  const [andGroup, setAndGroup] = useState<string[]>([]);
  const [butGroup, setButGroup] = useState<string[]>([]);
  const [myRole, setMyRole] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [intercepter, setIntercepter] = useState<string | null>(null);
  const [intercepted, setIntercepted] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);

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

  return (
    <div className="game-room-ball-container">
      <div className="game-room-ball-header">
        <h1>ゲームルーム</h1>
        <p>名前：{myName}</p>
        <p>役割：{myRole}</p>
        <p
          className="game-room-ball-speaker"
          style={{ backgroundColor: isButtonDisabled ? "black" : "blue" }}
        >
          発言者：{selectedPlayer}
        </p>
      </div>
      <div className="horizontal-line"></div>
      <div className="game-room-ball-player-list">
        {andGroup.map((player, index) => (
          <button
            key={index}
            style={{ backgroundColor: isButtonDisabled ? "gray" : "green" }}
            onClick={() => handlePlayerClick(player)}
            disabled={isButtonDisabled}
          >
            {player}
          </button>
        ))}
        {butGroup.map((player, index) => (
          <button
            key={index}
            style={{ backgroundColor: isButtonDisabled ? "gray" : "red" }}
            onClick={() => handlePlayerClick(player)}
            disabled={isButtonDisabled}
          >
            {player}
          </button>
        ))}
      </div>
      <button
        className="intercept"
        onClick={handleIntercept}
        disabled={isInterceptButtonDisabled}
        style={{ backgroundColor: isInterceptButtonDisabled ? "gray" : "red" }}
      >
        発散
      </button>
      <button className="back-button" onClick={() => navigate("/")}>
        戻る
      </button>
      <div
        className="intercept-block"
        style={{ display: isIntercepted ? "block" : "none" }}
      >
        <p>発散者</p>
        <h1>{intercepter}</h1>
        <p>{timer}</p>
      </div>
    </div>
  );
}

export default GameRoomBall;
