export type Project = {
  name: string,
}

export function createProject(name: string) {
  if (!name) return;
  const projects = getProjects();
  projects.push({ name });
  window.localStorage.setItem('projects', JSON.stringify(projects));
}

export function getProjects(): Project[] {
  return JSON.parse(window.localStorage.getItem('projects') || '[]')
}

export function deleteProject(projectName: string) {
  const projects = getProjects().filter(({ name }) => name !== projectName);
  window.localStorage.setItem('projects', JSON.stringify(projects));
}
