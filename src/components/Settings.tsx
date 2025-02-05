import AppSettings from "./AppSettings";
import ImportExport from "./ImportExport";

export default function Settings() {
  return <div className="narrow">
    <AppSettings />
    <ImportExport />
  </div>
}