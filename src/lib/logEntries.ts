const LOCALSTORAGE_ITEM_KEY = 'logEntries';

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

export function createLogEntry(projectName: string | LogEntry) {
  const logEntries = getLogEntries();
  const entry = typeof projectName === 'string' ? {
    project: projectName,
    created: new Date(),
    startTime: getHoursAndMinutes()
  } as LogEntry : projectName; // If projectName is not string, it's a full LogEntry object
  entry.id = getEntryId(entry);
  logEntries.push(entry);
  window.localStorage.setItem(LOCALSTORAGE_ITEM_KEY, JSON.stringify(logEntries));
  return entry.id;
}

export function getLogEntries(): LogEntry[] {
  return JSON.parse(window.localStorage.getItem(LOCALSTORAGE_ITEM_KEY) || '[]')
}

export function deleteLogEntry(id: number) {
  const logEntries = getLogEntries().filter(entry => entry.id !== id);
  window.localStorage.setItem(LOCALSTORAGE_ITEM_KEY, JSON.stringify(logEntries));
}

export function updateLogEntry(id: number, newData: Partial<LogEntry>) {
  const logEntries = getLogEntries();
  const entry = logEntries.find(entry => entry.id === id);
  if (!entry) return;
  Object.assign(entry, newData);
  window.localStorage.setItem(LOCALSTORAGE_ITEM_KEY, JSON.stringify(logEntries));
}

export function getLogEntry(id: number): LogEntry | undefined {
  const logEntries = getLogEntries();
  return logEntries.find(entry => entry.id === id);
}

export function endCurrentTask(logEntries = getLogEntries(), force = false) {
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
  window.localStorage.setItem(LOCALSTORAGE_ITEM_KEY, JSON.stringify(logEntries));
}

export function getEntryId(entry: LogEntry) {
  return +new Date(entry.created)
}

export function getTimeInMinutes(time: Time | undefined) {
  return parseInt(String(time?.hours || 0)) * 60 + parseInt(String(time?.minutes || 0));
}

export function updateTimeInputs(id: number, time: Time, type: 'start' | 'end') {
  const hoursElement = document.getElementById(`log-entry-${type}-time-hours-${id}`) as HTMLInputElement;
  const minutesElement = document.getElementById(`log-entry-${type}-time-minutes-${id}`) as HTMLInputElement;
  if (hoursElement && minutesElement) {
    hoursElement.value = String(time.hours);
    minutesElement.value = String(time.minutes);
  }
}

function extractJiraId(logEntry: { project?: string, description?: string }) {
  if (!logEntry.project || !logEntry.description) return null;
  const ticketId = logEntry.description?.match(/^\s?[0-9]+/);
  if (ticketId) return ticketId;
  return null;
}

export function formatEntryKey(logEntry: { project?: string, description?: string }) {
  if (extractJiraId(logEntry)) return `${logEntry.project}-${logEntry.description}`;
  return [logEntry.project, logEntry.description].filter(Boolean).join(' / ') || '(no description)';
}

export function importLogEntries(logEntries: LogEntry[], overwrite = false) {
  if (overwrite) window.localStorage.removeItem(LOCALSTORAGE_ITEM_KEY);

  const existingEntries = getLogEntries();
  logEntries.forEach(logEntry => {
    if (existingEntries.every(existingEntry => existingEntry.id !== logEntry.id)) {
      createLogEntry(logEntry);
    }
  });
}
