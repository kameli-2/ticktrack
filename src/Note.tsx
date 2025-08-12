import { useParams } from 'react-router-dom';
import './App.css';
import Note from './components/Note';

function App() {
  let { id } = useParams();
  
  if (!id) return <section><p>Note not found</p></section>

  return <section>
    <Note id={Number(id)} />
  </section>
}

export default App;
