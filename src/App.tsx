import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SocketProvider } from "./components/SocketContext";
import Home from "./components/home/home";
import WaitBall from "./components/ballmode/waitroom/waitball";
import GameRoomBall from "./components/ballmode/gameroom/gameroomball";
import WaitRoulette from "./components/roulette/waitroulette/waitroulette";
import GameRoomRoulette from "./components/roulette/gameroomroulette/gameroomroulette";
function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/waitball" element={<WaitBall />} />
          <Route path="/gameroomball" element={<GameRoomBall />} />
          <Route path="/waitroulette" element={<WaitRoulette />} />
          <Route path="/gameroomroulette" element={<GameRoomRoulette />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
