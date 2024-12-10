export type Time = {
  hours: string | number,
  minutes: string | number,
}

export type LogEntry = {
  project: string,
  startTime?: Time,
  endTime?: Time,
  description?: string,
  created: Date,
  id: number,
}

export function createLogEntry(projectName: string) {
  const logEntries = getLogEntries();
  const entry = {
    project: projectName,
    created: new Date(),
    startTime: getHoursAndMinutes()
  } as LogEntry;
  entry.id = getEntryId(entry);
  logEntries.push(entry);
  window.localStorage.setItem('logEntries', JSON.stringify(logEntries));
}

export function getLogEntries(): LogEntry[] {
  return JSON.parse(window.localStorage.getItem('logEntries') || '[]')
}

export function deleteLogEntry(id: number) {
  const logEntries = getLogEntries().filter(entry => entry.id !== id);
  window.localStorage.setItem('logEntries', JSON.stringify(logEntries));
}

export function updateLogEntry(id: number, newData: Partial<LogEntry>) {
  const logEntries = getLogEntries();
  const entry = logEntries.find(entry => entry.id === id);
  if (!entry) return;
  Object.assign(entry, newData);
  window.localStorage.setItem('logEntries', JSON.stringify(logEntries));
}

export function getLogEntry(id: number): LogEntry | undefined {
  const logEntries = getLogEntries();
  return logEntries.find(entry => entry.id === id);
}

export function getHoursAndMinutes(date = new Date()): Time {
  return {
    hours: date.getHours(),
    minutes: date.getMinutes()
  }
}

export function duplicateLogEntry(id: number) {
  const originalEntry = getLogEntry(id);
  if (!originalEntry) return;

  const newEntry = {
    ...originalEntry,
    startTime: getHoursAndMinutes(),
    endTime: undefined,
    created: new Date(),
  }

  newEntry.id = getEntryId(newEntry);

  const logEntries = getLogEntries();
  logEntries.push(newEntry);
  window.localStorage.setItem('logEntries', JSON.stringify(logEntries));
}

export function getEntryId(entry: LogEntry) {
  return +new Date(entry.created)
}

export function getTimeInMinutes(time: Time | undefined) {
  return parseInt(String(time?.hours || 0)) * 60 + parseInt(String(time?.minutes || 0));
}

export function updateTimeInputs(id: number, time: Time, type: 'start' | 'end') {
  (document.getElementById(`log-entry-${type}-time-hours-${id}`) as HTMLInputElement).value = String(time.hours);
  (document.getElementById(`log-entry-${type}-time-minutes-${id}`) as HTMLInputElement).value = String(time.minutes);
}