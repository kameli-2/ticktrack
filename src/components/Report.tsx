import styles from './Report.module.css'
import { formatEntryKey, getTimeInMinutes } from '../lib/logEntries'
import type { LogEntry } from '../lib/logEntries';
import { getSettings } from '../lib/settings';

type ReportProps = {
  logEntries: LogEntry[],
}

function roundMinutesToHours(minutes: number) {
  const settings = getSettings();

  // First round the value to the unit specified in settings (e.g. 30min).
  // So roundedValue will tell us how many units the value has.
  // For example 3h 15min with always rounding up and 30min rounding unit would be 7 units.
  const roundingUnits = settings.rounding__always_round_up
    ? Math.ceil(minutes / settings.rounding__round_to)
    : Math.round(minutes / settings.rounding__round_to);
    
  // Now turn those units into hours, rounded to max number of decimals specified in the settings.
  const MAX_DECIMALS = settings.rounding__max_decimals;
  const roundedToHours = Math.round(Math.pow(10, MAX_DECIMALS) * settings.rounding__round_to * roundingUnits / 60) / Math.pow(10, MAX_DECIMALS);

  // Take minimum value into account.
  const minimumValueInHours = settings.rounding__min_duration / 60;
  const finalValue = minutes === 0 ? 0 : Math.max(roundedToHours, minimumValueInHours);

  return finalValue;
}

function formatTime(minutes: number) {
  if (minutes <= 0) return 'Invalid duration';
  return `${roundMinutesToHours(minutes)} hours`;
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
          <td>{formatTime(Array.from(report.values()).reduce((sum, current) => sum + 60 * roundMinutesToHours(current), 0))}</td>
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