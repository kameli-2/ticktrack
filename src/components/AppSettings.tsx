import { useState } from 'react';
import { getSettings, saveSettings } from '../lib/settings';
import style from './AppSettings.module.css'

export default function AppSettings() {
  const [currentSettings, setCurrentSettings] = useState(getSettings());

  const settingsInputs = [
    {
      group: "rounding",
      id: "rounding__round_to",
      label: "Round to",
      type: "number",
      unit: "minutes",
      info: "The log entry sum is rounded up or down to this value.",
    },
    {
      group: "rounding",
      id: "rounding__always_round_up",
      label: "Always round up",
      type: "checkbox",
      info: "If not checked, the log entry sum will be rounded to up or down, whichever is closer.",
    },
    {
      group: "rounding",
      id: "rounding__min_duration",
      label: "Minimum duration",
      type: "number",
      unit: "minutes",
      info: "If the rounded log entry sum is less than this value, this value is used instead.",
    },
    {
      group: "rounding",
      id: "rounding__max_decimals",
      label: "Max decimals",
      type: "number",
      info: "Maximum number of decimals used when displaying log entries in hours.",
    },
  ];

  function saveSettingsHandler(data: FormData) {
    const newSettings = Object.fromEntries(settingsInputs.map(({ id, type }) => {
      const newValue = type === 'checkbox' ? !!data.get(id) : data.get(id);
      return [id, newValue];
    }));
    saveSettings(newSettings);
    setCurrentSettings(getSettings());
    window.alert("Settings saved successfully.");
  }

  return <>
    <form action={saveSettingsHandler}>
      <h3>App Settings</h3>
      <h4>Rounding Log Entries for the Report</h4>
      <p>The log entries with the same project & title are summed, and the sum is rounded up or down using the following rules.</p>
      {settingsInputs.filter(({ group }) => group === 'rounding').map(input =>
        <label key={input.id} className={style.formInput}>
          <span className={style.inputLabel}>{input.label}</span>
          <input
            className={style.inputField}
            type={input.type}
            name={input.id}
            defaultChecked={input.type === 'checkbox' && currentSettings[input.id] === true}
            defaultValue={input.type === 'checkbox' ? true : currentSettings[input.id]}
          />
          <span className={style.inputUnit}>{input.unit}</span>
          <br />
          <span className={style.inputInfo}>{input.info}</span>
        </label>
      )}
      <div>
        <input type="submit" className="btn" value="Save" />
      </div>
    </form>
  </>
}