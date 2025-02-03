/**
 * Prompts the user to download a file with the specified filename and content.
 * @param filename Name of the file when downloading
 * @param data Data contained by the file
 */
export function downloadFile(filename: string, data: any) {
  const a = document.createElement('a');
  const type = filename.split(".").pop();
  a.href = URL.createObjectURL( new Blob([data], { type:`text/${type === "txt" ? "plain" : type}` }) );
  a.download = filename;
  a.click();
};