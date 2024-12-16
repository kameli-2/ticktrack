import styles from './LogEntries.module.css'
import { ReactElement, useState } from 'react';
import {
  getLogEntries,
  deleteLogEntry,
  updateLogEntry,
  duplicateLogEntry,
  getTimeInMinutes,
  updateTimeInputs,
  endCurrentTask,
} from '../lib/logEntries';
import type { LogEntry, Time } from '../lib/logEntries';
import Report from './Report'

type LogEntriesProps = {
  logEntries: LogEntry[],
  setLogEntries: (logEntries: LogEntry[]) => void,
}

export default function LogEntries(props: LogEntriesProps) {
  const [showDate, setShowDate] = useState(new Date());
  const { logEntries, setLogEntries } = props;

  function prevDate() {
    setShowDate(new Date(+showDate - 1000 * 60 * 60 * 24));
  }

  function nextDate() {
    setShowDate(new Date(+showDate + 1000 * 60 * 60 * 24));
  }

  const visibleLogEntries = logEntries
    .filter(({ created }) => new Date(created).toDateString() === showDate.toDateString())
    .sort((a, b) => getTimeInMinutes(a.startTime) - getTimeInMinutes(b.startTime));

  function deleteLogEntryHandler(id: number) {
    if (window.confirm('Are you sure you want to delete this log entry?')) {
      deleteLogEntry(id);
      setLogEntries(getLogEntries());
    }
  }

  function updateLogEntryHandler(id: number) {
    const updateData = {
      startTime: {
        hours: (document.getElementById(`log-entry-start-time-hours-${id}`) as HTMLInputElement)?.value,
        minutes: (document.getElementById(`log-entry-start-time-minutes-${id}`) as HTMLInputElement)?.value,
      },
      endTime: {
        hours: (document.getElementById(`log-entry-end-time-hours-${id}`) as HTMLInputElement)?.value,
        minutes: (document.getElementById(`log-entry-end-time-minutes-${id}`) as HTMLInputElement)?.value,
      },
      description: (document.getElementById(`log-entry-description-${id}`) as HTMLInputElement)?.value,
    };

    if (parseInt(updateData.startTime.minutes) > 59) {
      updateData.startTime.minutes = '0';
      updateData.startTime.hours = String(parseInt(updateData.startTime.hours) + 1);
      updateTimeInputs(id, updateData.startTime, 'start');
    }

    if (parseInt(updateData.startTime.minutes) < 0) {
      updateData.startTime.minutes = '59';
      updateData.startTime.hours = String(parseInt(updateData.startTime.hours) - 1);
      updateTimeInputs(id, updateData.startTime, 'start');
    }

    if (parseInt(updateData.endTime.minutes) > 59) {
      updateData.endTime.minutes = '0';
      updateData.endTime.hours = String(parseInt(updateData.endTime.hours) + 1);
      updateTimeInputs(id, updateData.endTime, 'end');
    }

    if (parseInt(updateData.endTime.minutes) < 0) {
      updateData.endTime.minutes = '59';
      updateData.endTime.hours = String(parseInt(updateData.endTime.hours) - 1);
      updateTimeInputs(id, updateData.endTime, 'end');
    }

    updateLogEntry(id, updateData)
    setLogEntries(getLogEntries());
  }

  function duplicateLogEntryHandler(id: number) {
    setShowDate(new Date());
    endCurrentTask();
    duplicateLogEntry(id);
    setLogEntries(getLogEntries());
  }

  function entryExtendUpHandler(id: number, newStartTime: Time | undefined) {
    if (!newStartTime) return;
    updateLogEntry(id, { startTime: newStartTime });
    setLogEntries(getLogEntries());
    updateTimeInputs(id, newStartTime, 'start');
  }

  function entryExtendDownHandler(id: number, newEndTime: Time | undefined) {
    if (!newEndTime) return;
    updateLogEntry(id, { endTime: newEndTime });
    setLogEntries(getLogEntries());
    updateTimeInputs(id, newEndTime, 'end');
  }

  return <>
    <h2 className={styles.logEntryHeader}>
      <button className="btn" onClick={prevDate} aria-label="Select previous date">&lt;</button>
      &nbsp;
      {showDate.toDateString()}
      &nbsp;
      <button className="btn" onClick={nextDate} aria-label="Select next date">&gt;</button>
    </h2>

    <ul id="logEntries" className={styles.logEntries}>
      {visibleLogEntries.reduce((liElements, logEntry, index) => {
        let breakDuration = 0;

        if (index > 0) {
          const prevEntry = visibleLogEntries[index - 1];
          const prevEntryEndTime = getTimeInMinutes(prevEntry.endTime);
          const currentEntryStartTime = getTimeInMinutes(logEntry.startTime);
          breakDuration = currentEntryStartTime - prevEntryEndTime;
        }

        if (breakDuration > 0) {
          liElements.push(<li key={`${logEntry.id}-2`} className={styles.logEntryBreak}>
            <button className={styles.logEntryExtendUp} onClick={() => entryExtendUpHandler(logEntry.id, visibleLogEntries[index - 1].endTime)}>↥</button>
            <button className={styles.logEntryExtendDown} onClick={() => entryExtendDownHandler(visibleLogEntries[index - 1].id, logEntry.startTime)}>↧</button>
            <span>~ {breakDuration} minutes ~</span>
          </li>);
        }

        liElements.push(<li key={logEntry.id} className={styles.logEntry}>
          <input aria-label="Entry start time hours" className={styles.logEntryHours} id={`log-entry-start-time-hours-${logEntry.id}`} type="number" min="0" max="23" onChange={() => updateLogEntryHandler(logEntry.id)} defaultValue={logEntry.startTime?.hours || 0} />
          <input aria-label="Entry start time minutes" className={styles.logEntryMinutes} id={`log-entry-start-time-minutes-${logEntry.id}`} type="number" min="-1" max="60" onChange={() => updateLogEntryHandler(logEntry.id)} defaultValue={logEntry.startTime?.minutes || 0} />
          &nbsp;-&nbsp;
          <input aria-label="Entry end time hours" className={styles.logEntryHours} id={`log-entry-end-time-hours-${logEntry.id}`} type="number" min="0" max="23" onChange={() => updateLogEntryHandler(logEntry.id)} defaultValue={logEntry.endTime?.hours || 0} />
          <input aria-label="Entry end time minutes" className={styles.logEntryMinutes} id={`log-entry-end-time-minutes-${logEntry.id}`} type="number" min="-1" max="60" onChange={() => updateLogEntryHandler(logEntry.id)} defaultValue={logEntry.endTime?.minutes || 0} />
          &nbsp;
          <span className={styles.logEntryProject}>{typeof logEntry.project === 'string' ? logEntry.project : ''}</span>
          <input aria-label="Entry description" className={styles.logEntryDescription} id={`log-entry-description-${logEntry.id}`} type="text" placeholder="Description" onChange={() => updateLogEntryHandler(logEntry.id)} defaultValue={logEntry.description} />
          <button aria-label="Delete entry" className={styles.logEntryDelete} onClick={() => deleteLogEntryHandler(logEntry.id)}>&times;</button>
          <button aria-label="Duplicate entry" className={styles.logEntryDuplicate} onClick={() => duplicateLogEntryHandler(logEntry.id)}>+</button>
        </li>);

        return liElements;
      }, [] as ReactElement[])}
    </ul>

    {visibleLogEntries.length ? <button className="btn" onClick={() => endCurrentTask(getLogEntries(), true)}>End current task</button> : null}

    {visibleLogEntries.length ? <Report logEntries={visibleLogEntries} /> : <p className="notification">No entries</p>}
  </>
}