import './App.css';
import GameScreen from "./js/components/GameScreen";
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
          <GameScreen />
        </div>
      </div>
      <div className="control-panel-area">
        <ControlPanel />
      </div>
    </div>
  );
}

export default App;
