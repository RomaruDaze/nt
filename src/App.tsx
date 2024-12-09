import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/main/main";
import Host from "./components/hostRoom/host";
import Wait from "./components/waitRoom/wait";
import HostGame from "./components/gameRoom/hostGame/hostgame";
import JoinGame from "./components/gameRoom/joinGame/joingame";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/host" element={<Host />} />
        <Route path="/hostgame" element={<HostGame />} />
        <Route path="/wait" element={<Wait />} />
        <Route path="/joingame" element={<JoinGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
