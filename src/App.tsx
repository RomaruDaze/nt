import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home/home";
import Host from "./components/startRoom/host";
import Join from "./components/startRoom/join";
import WaitJoin from "./components/waitRoom/waitJoin";
import WaitHost from "./components/waitRoom/waitHost";
import HostGame from "./components/gameRoom/hostGame/hostgame";
import JoinGame from "./components/gameRoom/joinGame/joingame";
import { SocketProvider } from "./components/SocketContext";

function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/host" element={<Host />} />
          <Route path="/join" element={<Join />} />
          <Route path="/waitjoin" element={<WaitJoin />} />
          <Route path="/waithost" element={<WaitHost />} />
          <Route path="/hostgame" element={<HostGame />} />
          <Route path="/joingame" element={<JoinGame />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
