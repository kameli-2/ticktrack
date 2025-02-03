const LOCALSTORAGE_ITEM_KEY = 'projects';

export type Project = {
  name: string,
}

export function createProject(name: string) {
  if (!name) return;
  const projects = getProjects();
  if (projects.find(p => p.name === name)) return; // Project already exists

  projects.push({ name });
  window.localStorage.setItem(LOCALSTORAGE_ITEM_KEY, JSON.stringify(projects));
}

export function getProjects(): Project[] {
  return JSON.parse(window.localStorage.getItem(LOCALSTORAGE_ITEM_KEY) || '[]')
}

export function deleteProject(projectName: string) {
  const projects = getProjects().filter(({ name }) => name !== projectName);
  window.localStorage.setItem(LOCALSTORAGE_ITEM_KEY, JSON.stringify(projects));
}

export function importProjects(projects: Project[], overwrite = false) {
  if (overwrite) window.localStorage.removeItem(LOCALSTORAGE_ITEM_KEY);
  projects.forEach(project => createProject(project.name));
}