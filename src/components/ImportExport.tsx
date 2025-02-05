import { getLogEntries, importLogEntries, LogEntry } from "../lib/logEntries"
import { getProjects, importProjects, Project } from "../lib/projects"
import { getSettings, saveSettings, Settings } from "../lib/settings"
import { getTodos, Todo, importTodos } from "../lib/todos"
import { downloadFile } from "../lib/utils"
import styles from "./AppSettings.module.css"

export default function ImportExport() {
  function exportData() {
    const data = {
      projects: getProjects(),
      logEntries: getLogEntries(),
      todos: getTodos(),
      settings: getSettings(),
    }
    downloadFile(`TickTrack-Export-${new Date().toISOString()}.json`, JSON.stringify(data));
  }

  async function importData(formData: FormData) {
    const data = formData.get('data') as File;
    const overwrite = formData.get('overwrite') === "true";

    if (overwrite && !window.confirm('This will overwrite your existing TickTrack data. Are you sure you want to continue?')) {
      return;
    }

    const { size, type } = data;
    if (type !== 'application/json') {
      window.alert('Wrong file type, must be application/json');
      return;
    }

    const MAX_FILESIZE = 9437184; // 9 MiB, localstorage max is 10 MiB
    if (size > MAX_FILESIZE) {
      window.alert('File exceeds max size 9 MiB');
      return;
    }

    let json = {} as {
      projects?: Project[],
      logEntries?: LogEntry[],
      todos?: Todo[],
      settings: Settings,
    };

    try {
      json = JSON.parse(await data.text());
    }
    catch (e) {
      window.alert('The content in the imported file is not valid JSON. Nothing was imported.');
      return;
    }

    if (json.projects && json.projects?.length > 0) importProjects(json.projects, overwrite);
    if (json.logEntries && json.logEntries?.length > 0) importLogEntries(json.logEntries, overwrite);
    if (json.todos && json.todos?.length > 0) importTodos(json.todos, overwrite);
    if (json.settings) saveSettings(json.settings);

    window.alert(`Import successful: ${json.projects?.length || 0} projects, ${json.logEntries?.length || 0} log entries, ${json.todos?.length || 0} todos, settings. Existing data ${overwrite ? 'was' : 'was not'} overwritten.`);
  }

  return <>
    <h2 className={styles.dividingHeader}>Export Data</h2>
    <p>
      Click the button to save all your TickTrack data (projects, log entries, todos, settings) as a .json file on your system. You can use this data to import it back to TickTrack on another device or browser.
    </p>
    <p>
      <button className="btn btn--full-width" onClick={exportData}>Export all TickTrack data</button>
    </p>

    <h2 className={styles.dividingHeader}>Import Data</h2>
    <p>
      Upload a TickTrack export file from your system to TickTrack.
    </p>
    <p>
      You can either overwrite your existing TickTrack data, or merge them. The merging is done in the following way:
    </p>
    <ul style={{ textAlign: "left" }}>
      <li>Projects: New projects are appended to the current projects list. Duplicate projects are combined.</li>
      <li>Log entries: New entries are appended to the current entries list. If an imported entry has the same creation time (=id) as an existing one, it is not imported.</li>
      <li>Todos: New todos are appended to the current entries list. If an imported todo has the same creation time (=id) as an existing one, it is not imported.</li>
      <li>Settings: Settings are not merged. New settings will always overwrite existing settings.</li>
    </ul>
    <p>Data is overwritten only if there is existing data of that type: for example, if the import data contains todos but no log entries, the existing log entries are not overwritten.</p>

    <form action={importData}>
      <p>
      <label>
        <input name="overwrite" type="checkbox" value="true" />
        Overwrite existing data
      </label>
      </p>

      <p>
        <input name="data" type="file" required className="btn" />
      </p>

      <p>
        <input className="btn btn--full-width" type="submit" value="Import data" />
      </p>
    </form>
  </>
}