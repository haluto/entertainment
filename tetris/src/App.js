import './App.css';
import GamePanel from "./js/components/GamePanel";
import StatusPanel from "./js/components/StatusPanel";
import SettingsPanel from "./js/components/SettingsPanel";
import ControlPanel from "./js/components/ControlPanel";

function App() {
  return (
    <div className="App">
      <div className="app-top-area">
        <div className="settings-panel-area">
          <SettingsPanel />
        </div>
        <div className="game-panel-area">
          <GamePanel />
        </div>
        <div className="status-panel-area">
          <StatusPanel />
        </div>
      </div>
      <div className="control-panel-area">
        <ControlPanel />
      </div>
    </div>
  );
}

export default App;
