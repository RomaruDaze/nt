import "./main.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();
  return (
    <div className="main-container">
      <div className="main-header">
        <img src={logo} alt="logo" />
        <h1>ナゲTalk</h1>
      </div>
      <div className="main-content">
        <button onClick={() => navigate("/host")}>ホスト</button>
        <button onClick={() => navigate("/wait")}>参加</button>
      </div>
    </div>
  );
}

export default Main;
