import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import { useSocket } from "../../SocketContext";
import "./gameroomroulette.css";

interface Prize {
  option: string;
  style: {
    backgroundColor: string;
    textColor: string;
  };
}

interface RouletteProps {
  data: { [key: string]: string }; // Define the prop type
  myName: string;
}

const Roulette: React.FC<RouletteProps> = ({ data, myName }) => {
  const socket = useSocket();
  const [mustSpin, setMustSpin] = useState<boolean>(false);
  const [prizeNumber, setPrizeNumber] = useState<number>(0);
  const [spinResult, setSpinResult] = useState<string>("");

  const getColorForRole = (role: string): string => {
    const colors = {
      Logic: "#FFFFFF",
      Process: "#2e77ff",
      Optimism: "#efbf04",
      Creativity: "#2e6f40",
      Danger: "#000000",
      Emotion: "#ff3c2e",
    };
    return colors[role as keyof typeof colors] || "#CCCCCC";
  };

  const getTextColorForRole = (role: string): string => {
    // Return black for Logic role, white for others
    return role === "Logic" ? "#000000" : "#ffffff";
  };

  const wheelData: Prize[] = Object.entries(data).map(([name, role]) => ({
    option: `${name}`,
    style: {
      backgroundColor: getColorForRole(role),
      textColor: getTextColorForRole(role), // Add this property
    },
  }));

  const handleSpinClick = () => {
    if (wheelData.length > 0) {
      const newPrizeNumber = Math.floor(Math.random() * wheelData.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      socket.emit("spinRoulette", { prizeNumber: newPrizeNumber }); // Emit the spin event
    } else {
      console.warn("No data available to spin the wheel.");
    }
  };

  useEffect(() => {
    socket.on("spinRoulette", (data: { prizeNumber: number }) => {
      setPrizeNumber(data.prizeNumber);
      setMustSpin(true);
    });

    socket.on("broadcastSpinResult", (data: { result: string }) => {
      console.log("Broadcasted Spin Result:", data.result);
      setSpinResult(data.result);
    });

    return () => {
      socket.off("spinRoulette");
      socket.off("broadcastSpinResult");
    };
  }, [socket, wheelData, myName]);

  useEffect(() => {
    if (!mustSpin && wheelData[prizeNumber]) {
      const result = wheelData[prizeNumber].option;
      socket.emit("spinResult", { result }); // Emit the result to the server
    }
  }, [mustSpin, prizeNumber, wheelData, socket]);

  return (
    <>
      <div className="roulette-result">
        <h1>発言者：{spinResult}</h1>
      </div>
      <div className="roulette-wheel">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={
            wheelData.length > 0
              ? wheelData
              : [{ option: "No Data", style: { backgroundColor: "#dedede" } }]
          }
          outerBorderColor={"#000"}
          outerBorderWidth={10}
          innerBorderColor={"#000"}
          radiusLineColor={"#0f0f0f"}
          radiusLineWidth={1}
          fontSize={20}
          textColors={wheelData.map((item) => item.style.textColor)} // Use dynamic text colors
          onStopSpinning={() => {
            setMustSpin(false);
          }}
        />
        <div className="roulette-button-container">
          <button onClick={handleSpinClick}>スピン</button>
        </div>
      </div>
    </>
  );
};

export default Roulette;
