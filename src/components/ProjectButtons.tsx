import styles from './ProjectButtons.module.css';
import { createProject, getProjects, deleteProject } from '../lib/projects'
import type { Project } from '../lib/projects'
import { createLogEntry, endCurrentTask, getLogEntries } from '../lib/logEntries';
import type { LogEntry } from '../lib/logEntries';
import { useState } from 'react';

type ProjectButtonsProps = {
  projects: Project[],
  setLogEntries: (logEntries: LogEntry[]) => void,
}

export default function ProjectButtons(props: ProjectButtonsProps) {
  const [projects, setProjects] = useState(props.projects);

  function createProjectHandler() {
    const projectName = prompt('New project name:');
    if (!projectName) return;
    createProject(projectName);
    setProjects(getProjects());
  }

  function deleteProjectHandler(projectName: string) {
    if (window.confirm(`Are you sure you want to delete project ${projectName}?`)) {
      deleteProject(projectName);
      setProjects(getProjects());
    }
  }

  function createLogEntryHandler(projectName: string) {
    endCurrentTask();
    createLogEntry(projectName);
    props.setLogEntries(getLogEntries());
  }

  return (
    <ul className={styles['projectButtons-container']}>
      {projects.map((project, index) => (
        <li key={index}>
          <button className={styles.projectButton} onClick={() => createLogEntryHandler(project.name)}>{project.name}</button>
          <button className={styles.deleteProjectButton} onClick={() => deleteProjectHandler(project.name)}>&times;</button>
        </li>
      ))}
      <li>
        <button
          className={[styles.projectButton, styles['projectButton-createNew']].join(' ')}
          onClick={createProjectHandler}
        >
          + Create New Project
        </button>
      </li>
    </ul>
  )
}