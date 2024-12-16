import './App.css';
import Todos from './components/Todos';
import Navigation from './components/Navigation';

function App() {
  return <div className="App">
      <header className="App-header">
        <h1>Todos</h1>
        <Navigation selected="/todo" />
      </header>
      <section>
        <Todos />
      </section>
    </div>
}

export default App;
