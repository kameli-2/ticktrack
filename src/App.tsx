import './App.css';
import { useState } from 'react'
import ProjectButtons from './components/ProjectButtons'
import { getProjects } from './lib/projects'
import LogEntries from './components/LogEntries'
import {
  getLogEntries,
  updateLogEntry,
  getHoursAndMinutes,
  getTimeInMinutes,
  updateTimeInputs
} from './lib/logEntries';

function App() {
  const [logEntries, setLogEntries] = useState(getLogEntries());

  function endCurrentTask(force = false) {
    const currentEntry = logEntries
      .filter(({ created }) => new Date(created).toDateString() === new Date().toDateString())
      .sort((b, a) => getTimeInMinutes(a.startTime) - getTimeInMinutes(b.startTime))
      [0];

    if (!currentEntry) return;
    if (!force && getTimeInMinutes(currentEntry.endTime) > 0) return;

    const endTime = getHoursAndMinutes();
    updateLogEntry(currentEntry.id, { endTime });

    const { id } = currentEntry;
    updateTimeInputs(id, endTime, 'end');
    setLogEntries(getLogEntries());
  }

  const projects = getProjects()
  return <>
    <div className="App">
      <header className="App-header">
        <h1>Time Tracker</h1>
      </header>
      <section>
        <ProjectButtons projects={projects} endCurrentTask={endCurrentTask} setLogEntries={setLogEntries} />
      </section>
      <section>
        <LogEntries endCurrentTask={endCurrentTask} logEntries={logEntries} setLogEntries={setLogEntries} />
      </section>
    </div>
  </>
}

export default App;
