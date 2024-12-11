import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import { useSocket } from "../../SocketContext";
import "./gameroomroulette.css";

interface Prize {
  option: string;
  style: { backgroundColor: string };
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

  const wheelData: Prize[] = Object.entries(data).map(([name, role]) => ({
    option: `${name}`,
    style: { backgroundColor: role === "批判的" ? "#F22B35" : "#24CA69" },
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
        textColors={["#ffffff"]}
        onStopSpinning={() => {
          setMustSpin(false);
        }}
      />
      <div className="roulette-button-container">
        <button onClick={handleSpinClick}>SPIN</button>
      </div>
    </>
  );
};

export default Roulette;
