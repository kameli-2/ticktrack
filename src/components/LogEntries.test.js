import { render, fireEvent, screen } from '@testing-library/react';
import LogEntries from './LogEntries';

const mockEntries = [
  {
    "project": "Internal",
    "created": "2024-12-10T13:11:25.558Z",
    "startTime": { "hours": "7", "minutes": "20" },
    "id": 1733836285558,
    "endTime": { "hours": "7", "minutes": "50" },
    "description": "Chatting, making coffee, unloading dishwasher",
  }, {
    "project": "Training",
    "created": "2024-12-10T13:11:47.543Z",
    "startTime": { "hours": "7", "minutes": "50" },
    "id": 1733836307543,
    "endTime": { "hours": "8", "minutes": "41" },
    "description": "Cyber security training",
  },
  {
    "project": "ClientProjectABC",
    "created": "2024-12-10T13:12:06.391Z",
    "startTime": { "hours": "8", "minutes": "41" },
    "id": 1733836326391,
    "endTime": { "hours": "11", "minutes": "8" },
    "description": "889 Adjusting text in hero image",
  },
  {
    "project": "ClientProjectABC",
    "created": "2024-12-10T13:12:51.212Z",
    "startTime": { "hours": "11", "minutes": "49" },
    "id": 1733836371212,
    "endTime": { "hours": "12", "minutes": "49" },
    "description": "889 Adjusting text in hero image",
  },
  {
    "project": "ClientProjectABC",
    "created": "2024-12-10T13:13:19.302Z",
    "startTime": { "hours": "12", "minutes": "49" },
    "id": 1733836399302,
    "endTime": { "hours": "16", "minutes": "41" },
    "description": "890 Show pick-up point selector in checkout",
  },
];

test('renders current date correctly', () => {
  render(<LogEntries
    logEntries={mockEntries}
    endCurrentTask={() => null}
    setLogEntries={() => null}
  />);

  screen.getAllByText(new Date().toDateString());
});

test('changes date correctly', async () => {
  render(<LogEntries
    logEntries={mockEntries}
    endCurrentTask={() => null}
    setLogEntries={() => null}
  />);

  const prevButton = screen.getByRole('button', { name: "Select previous date" });
  const nextButton = screen.getByRole('button', { name: "Select next date" });

  // Select previous date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  fireEvent(prevButton, new MouseEvent('click', { bubbles: true, cancelable: true }));
  await screen.findAllByText(yesterday.toDateString());

  // Select next date, going back to today
  fireEvent(nextButton, new MouseEvent('click', { bubbles: true, cancelable: true }));
  await screen.findAllByText(new Date().toDateString());
});
