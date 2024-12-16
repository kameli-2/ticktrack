import './App.css';
import { useState } from 'react'
import ProjectButtons from './components/ProjectButtons'
import { getProjects } from './lib/projects'
import LogEntries from './components/LogEntries'
import { getLogEntries } from './lib/logEntries';

function App() {
  const [logEntries, setLogEntries] = useState(getLogEntries());

  const projects = getProjects()
  return <>
    <section>
      <ProjectButtons projects={projects} setLogEntries={setLogEntries} />
    </section>
    <section>
      <LogEntries logEntries={logEntries} setLogEntries={setLogEntries} />
    </section>
  </>
}

export default App;
