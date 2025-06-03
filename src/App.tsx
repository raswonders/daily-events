import "./App.css";
import { Table } from "./components/Table";

function App() {
  return (
    <div className="App">
      <h1 className="App_Title">Daily Events</h1>
      <div className="App_Table">
        <Table />
      </div>
    </div>
  );
}

export default App;
