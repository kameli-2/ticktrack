import styles from './Report.module.css'
import { formatEntryKey, getTimeInMinutes } from '../lib/logEntries'
import type { LogEntry } from '../lib/logEntries';

type ReportProps = {
  logEntries: LogEntry[],
}

const ROUND_TO = 30; // round up to 30min

function formatTime(minutes: number) {
  if (minutes <= 0) return 'Invalid duration'
  return `${Math.ceil(minutes / ROUND_TO) / 2} hours`; // Round to next 30min
}

function formatExactTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes - hours * 60}min`
}

export default function Report(props: ReportProps) {
  const { logEntries } = props;

  function getDuration(logEntry: LogEntry) {
    const duration = getTimeInMinutes(logEntry.endTime) - getTimeInMinutes(logEntry.startTime);
    if (isNaN(duration) || duration < 0) return 0;
    return duration;
  }

  const report = logEntries.reduce((report, logEntry) => {
    const entryKey = formatEntryKey({ project: logEntry.project, description: logEntry.description });
    const duration = getDuration(logEntry);

    if (report.get(entryKey)) {
      report.set(entryKey, report.get(entryKey) + duration);
    }
    else {
      report.set(entryKey, duration);
    }

    return report;
  }, new Map());

  return <>
    <h2>Report</h2>
    <table className={styles.reportTable}>
      <tbody>
        {Array.from(report.entries()).map(([entryName, duration]) => (
          <ReportRow key={entryName} entryName={entryName} duration={duration} />
        ))}
        <tr className={styles.reportTableTotalsRow}>
          <td>Total</td>
          <td>{formatTime(Array.from(report.values()).reduce((sum, current) => sum + 60*(Math.ceil(current / ROUND_TO) / 2), 0))}</td>
          <td>(exact: {formatExactTime(Array.from(report.values()).reduce((sum, current) => sum + current, 0))})</td>
        </tr>
      </tbody>
    </table>
  </>
}

function ReportRow(props: { entryName: string, duration: number }) {
  const { entryName, duration } = props;

  function copyToClipboard(text: string, clickEvent: React.MouseEvent) {
    navigator.clipboard.writeText(text);
    const target = clickEvent.currentTarget as HTMLElement;
    target.innerText = 'copied!'
    setTimeout(() => target.innerText = 'copy', 1000)
  }

  return <tr>
    <td><span>{entryName}</span> <button className="btn btn-small" onClick={(e) => copyToClipboard(entryName, e)}>copy</button></td>
    <td>{formatTime(duration)}</td>
    <td>(exact: {formatExactTime(duration)})</td>
  </tr>
}