import { useState } from 'react';
import { getSettings, saveSettings, Settings } from '../lib/settings';
import style from './AppSettings.module.css'
import { setAppearance } from '../lib/utils';

type SettingsInputBase = {
  group: 'rounding' | 'style'
  id: keyof Settings
  label: string
  type: 'number' | 'checkbox' | 'text'
  unit?: string
  info?: string
}

interface SettingsInputSelect extends Omit<SettingsInputBase, 'type'> {
  type: 'select'
  options: { label: string, value: string }[]
}

type SettingsInput = SettingsInputBase | SettingsInputSelect;

export default function AppSettings() {
  const [currentSettings, setCurrentSettings] = useState(getSettings());

  const settingsInputs: SettingsInput[] = [
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
    {
      group: "style",
      id: "style__appearance",
      label: "Appearance",
      type: "select",
      options: [
        {
          label: "Auto",
          value: "auto",
        },
        {
          label: "Light",
          value: "light",
        },
        {
          label: "Dark",
          value: "dark",
        },
      ],
    },
  ];

  function saveSettingsHandler(data: FormData) {
    const newSettings = Object.fromEntries(settingsInputs.map(({ id, type }) => {
      const newValue = type === 'checkbox' ? !!data.get(id) : data.get(id);
      return [id, newValue];
    }));
    saveSettings(newSettings);
    setCurrentSettings(getSettings());
    setAppearance(); // Make sure light/dark theme is updated
    window.alert("Settings saved successfully.");
  }

  return <>
    <form action={saveSettingsHandler}>
      <h3>App Settings</h3>

      <h4>Rounding Log Entries for the Report</h4>
      <p>The log entries with the same project & title are summed, and the sum is rounded up or down using the following rules.</p>
      {settingsInputs.filter(({ group }) => group === 'rounding').map(input => <SettingsInputComponent key={input.id} input={input} currentSettings={currentSettings} />)}
      
      <h4>Style</h4>
      {settingsInputs.filter(({ group }) => group === 'style').map(input => <SettingsInputComponent key={input.id} input={input} currentSettings={currentSettings} />)}
      
      <div>
        <input type="submit" className="btn" value="Save" />
      </div>
    </form>
  </>
}

function SettingsInputComponent(props: { input: SettingsInput, currentSettings: Settings }) {
  const { input, currentSettings } = props;

  return <label className={style.formInput}>
    <span className={style.inputLabel}>{input.label}</span>

    {
      input.type === 'checkbox' ? <SettingsCheckbox id={input.id} checked={currentSettings[input.id] === true} /> :

      input.type === 'select' ? <SettingsSelect id={input.id} options={input.options} value={String(currentSettings[input.id])} /> :

      <input
        className={style.inputField}
        type={input.type}
        name={input.id}
        defaultValue={String(currentSettings[input.id])}
      />
    }

    <span className={style.inputUnit}>{input.unit}</span>
    <br />
    <span className={style.inputInfo}>{input.info}</span>
  </label>
}

function SettingsCheckbox(props: { id: string, checked: boolean }) {
  const { id, checked } = props;
  return <input
    className={style.inputField}
    type="checkbox"
    name={id}
    defaultChecked={checked}
    defaultValue="true"
  />
}

function SettingsSelect(props: { id: string, options: { label: string, value: string }[], value: string | number }) {
  const { id, options, value } = props;
  return <select
      className={style.inputField}
      name={id}
      defaultValue={value}
      key={value} // Workaround for a React 19 bug: <https://github.com/facebook/react/issues/30580>
    >
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
}
