import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';
import { createLogEntry, updateLogEntry } from './lib/logEntries';
import { wait } from '@testing-library/user-event/dist/utils';

test('renders correct title', () => {
  render(<App />);
  const h1 = screen.getByRole('heading', { level: 1 });
  expect(h1.innerHTML).toContain('Time Tracker');
});

test('duplicating a task from yesterday when there is one ongoing task today', async () => {
  // Create mock data
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = yesterday.toISOString().substring(0, 10);
  const todayDate = new Date().toISOString().substring(0, 10);

  const mockEntries = [
    {
      "project": `Internal`,
      "created": `${yesterdayDate}T13:11:25.558Z`,
      "startTime": { "hours": "7", "minutes": "20" },
      "id": 1733836285558,
      "endTime": { "hours": "7", "minutes": "50" },
      "description": "Chatting, making coffee, unloading dishwasher",
    },
    {
      "project": "ClientProjectABC",
      "created": `${todayDate}T13:12:06.391Z`,
      "startTime": { "hours": "8", "minutes": "41" },
      "id": 1733836326391,
      "description": "889 Adjusting text in hero image",
    },
  ];

  localStorage.setItem('logEntries', JSON.stringify(mockEntries));

  render(<App />);

  const prevButton = screen.getByRole('button', { name: "Select previous date" });

  // Select previous date
  fireEvent(prevButton, new MouseEvent('click', { bubbles: true, cancelable: true }));

  // Duplicate an entry
  const duplicateButtons = await screen.findAllByRole('button', { name: 'Duplicate entry' });
  fireEvent(duplicateButtons[0], new MouseEvent('click', { bubbles: true, cancelable: true }));

  // We should now be back at today's date, and have two entries visible
  screen.getAllByText(new Date().toDateString());
  const entryDescriptions = screen.getAllByRole('textbox', { name: 'Entry description' });
  expect(entryDescriptions).toHaveLength(2);
})