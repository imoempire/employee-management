import React, { useState, useMemo } from "react";
import {
  Paper,
  Text,
  Button,
  Select,
  Modal,
  TextInput,
  Textarea,
} from "@mantine/core";

interface CalendarEvent {
  id: string;
  date: string; // Format: YYYY-MM-DD
  time: string;
  title: string;
  description?: string;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
  hasCustomText?: boolean;
  customText?: string;
}

const ProjectBusinessCalendar: React.FC = () => {
  const currentDate = new Date();

  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      date: "2025-07-01",
      time: "9:30 AM",
      title: "Candidate interview",
    },
    { id: "2", date: "2025-07-02", time: "3:00 PM", title: "Staff Meeting" },
    {
      id: "3",
      date: "2025-07-03",
      time: "10:00 AM",
      title: "Conduct project training",
    },
    { id: "4", date: "2025-07-05", time: "2:00 PM", title: "Project meeting" },
    { id: "5", date: "2025-07-06", time: "12:00 PM", title: "Lunch meeting" },
    { id: "6", date: "2025-07-07", time: "2:00 PM", title: "Manager Meeting" },
    {
      id: "7",
      date: "2025-07-08",
      time: "10:30 AM",
      title: "Plan project schedule",
    },
    {
      id: "8",
      date: "2025-07-09",
      time: "5:00 PM",
      title: "Weekly Staff Meeting",
    },
    {
      id: "9",
      date: "2025-07-10",
      time: "11:00 AM",
      title: "Present business case",
    },
    { id: "10", date: "2025-07-12", time: "8:00 AM", title: "Team standup" },
    { id: "11", date: "2025-07-13", time: "12:30 PM", title: "Lunch meeting" },
    {
      id: "12",
      date: "2025-07-14",
      time: "5:00 PM",
      title: "Weekly Staff Meeting",
    },
    {
      id: "13",
      date: "2025-07-17",
      time: "10:00 AM",
      title: "Client presentation",
    },
    {
      id: "14",
      date: "2025-07-18",
      time: "9:00 AM",
      title: "Discuss project risks and issues",
    },
    {
      id: "15",
      date: "2025-07-19",
      time: "11:00 AM",
      title: "Discuss project budget",
    },
    {
      id: "16",
      date: "2025-07-21",
      time: "3:00 PM",
      title: "Project Presentations",
    },
    {
      id: "17",
      date: "2025-07-23",
      time: "5:00 PM",
      title: "Weekly Staff Meeting",
    },
    {
      id: "18",
      date: "2025-07-24",
      time: "10:00 AM",
      title: "Sprint planning",
    },
    { id: "19", date: "2025-07-25", time: "7:00 PM", title: "Team dinner" },
    // Add events for different months/years
    { id: "20", date: "2025-08-01", time: "9:00 AM", title: "Monthly review" },
    {
      id: "21",
      date: "2025-08-15",
      time: "2:00 PM",
      title: "Quarterly planning",
    },
    {
      id: "22",
      date: "2024-07-04",
      time: "10:00 AM",
      title: "Independence Day event",
    },
    {
      id: "23",
      date: "2025-01-01",
      time: "12:00 PM",
      title: "New Year planning",
    },
  ]);

  // Modal state
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    description: "",
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate year options (current year ± 10 years)
  const yearOptions = useMemo(() => {
    const years = [];
    const currentYear = currentDate.getFullYear();
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push({ value: i.toString(), label: i.toString() });
    }
    return years;
  }, [currentDate]);

  // Generate month options
  const monthOptions = monthNames.map((month, index) => ({
    value: index.toString(),
    label: month,
  }));

  // Sample events data with proper dates - you can replace this with your actual data
  const sampleEvents: CalendarEvent[] = events;

  // Filter events for the selected month and year
  const getEventsForDate = (
    year: number,
    month: number,
    day: number
  ): CalendarEvent[] => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return sampleEvents.filter((event) => event.date === dateString);
  };

  // Handle opening modal for adding event
  const handleAddEvent = (year: number, month: number, day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    setSelectedDate(dateString);
    setNewEvent({ title: "", time: "", description: "" });
    setModalOpened(true);
  };

  // Handle saving new event
  const handleSaveEvent = () => {
    if (newEvent.title.trim() && selectedDate) {
      const event: CalendarEvent = {
        id: Date.now().toString(), // Simple ID generation
        date: selectedDate,
        time: newEvent.time,
        title: newEvent.title.trim(),
        description: newEvent.description.trim() || undefined,
      };

      setEvents((prev) => [...prev, event]);
      setModalOpened(false);
      setNewEvent({ title: "", time: "", description: "" });
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalOpened(false);
    setNewEvent({ title: "", time: "", description: "" });
  };

  // Generate calendar data for the selected month/year
  const calendarData = useMemo(() => {
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const calendarDays: CalendarDay[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthDate = new Date(
        selectedYear,
        selectedMonth,
        0 - (firstDayOfWeek - 1 - i)
      );
      calendarDays.push({
        date: prevMonthDate.getDate(),
        isCurrentMonth: false,
        events: [],
      });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push({
        date: day,
        isCurrentMonth: true,
        events: getEventsForDate(selectedYear, selectedMonth, day),
      });
    }

    // Add empty cells for days after the last day of the month to complete the grid
    const remainingCells = 42 - calendarDays.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      calendarDays.push({
        date: i,
        isCurrentMonth: false,
        events: [],
      });
    }

    return calendarDays;
  }, [selectedYear, selectedMonth]);

  const renderCalendarCell = (day: CalendarDay, index: number) => {
    const hasEvents = day.events.length > 0;
    const isToday =
      day.isCurrentMonth &&
      day.date === currentDate.getDate() &&
      selectedMonth === currentDate.getMonth() &&
      selectedYear === currentDate.getFullYear();

    return (
      <div
        key={index}
        className={`h-24 text-xs relative cursor-pointer transition-colors hover:bg-gray-50  ${
          isToday ? "ring-2 ring-blue-500" : ""
        }`}
        onClick={() =>
          day.isCurrentMonth &&
          handleAddEvent(selectedYear, selectedMonth, day.date)
        }
      >
        <div
          className={`font-medium mb-1 p-2 ${
            day.isCurrentMonth && hasEvents
              ? "bg-cyan-100"
              : day.isCurrentMonth
              ? "bg-white"
              : "bg-gray-50"
          } ${day.isCurrentMonth ? "text-gray-700" : "text-gray-400"}`}
        >
          {day.date}
        </div>

        {day.isCurrentMonth && hasEvents ? (
          day.events.map((event, eventIndex) => (
            <div key={eventIndex} className="mb-1 p-2">
              {event.time && (
                <div className="font-medium text-gray-800">{event.time}</div>
              )}
              <div className="text-gray-600 text-xs leading-tight">
                {event.title}
              </div>
            </div>
          ))
        ) : day.isCurrentMonth ? (
          <div className="text-gray-400 p-2 text-xs italic hover:text-gray-600 transition-colors">
            Add event
          </div>
        ) : null}

        {day.hasCustomText && day.isCurrentMonth && (
          <div className="text-gray-600">{day.customText}</div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Monthly Project Business Calendar Schedule
        </h1>

        {/* Month and Year selectors */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-l-lg font-medium">
              Month
            </div>
            <Select
              value={selectedMonth.toString()}
              onChange={(value) => setSelectedMonth(parseInt(value || "0"))}
              data={monthOptions}
              className="w-40"
            />
          </div>

          <div className="flex items-center">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-l-lg font-medium">
              Year
            </div>
            <Select
              value={selectedYear.toString()}
              onChange={(value) =>
                setSelectedYear(
                  parseInt(value || currentDate.getFullYear().toString())
                )
              }
              data={yearOptions}
              className="w-32"
            />
          </div>
        </div>

        {/* Current selection display */}
        <div className="text-lg font-semibold text-gray-700 mb-4">
          {monthNames[selectedMonth]} {selectedYear}
        </div>
      </div>

      {/* Calendar */}
      <Paper shadow="sm" className="overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7">
          {daysOfWeek.map((day, index) => (
            <div
              key={day}
              className={`p-4 text-center font-bold text-white ${
                index === 0
                  ? "bg-blue-900"
                  : index + 1 === daysOfWeek.length
                  ? "bg-blue-900"
                  : "bg-blue-600"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 border-l border-t border-gray-200">
          {calendarData.map((day, index) => (
            <div
              key={index}
              className="border-r border-b border-gray-200 min-h-[6rem]"
            >
              {renderCalendarCell(day, index)}
            </div>
          ))}
        </div>
      </Paper>

      {/* Add Event Modal */}
      <Modal
        opened={modalOpened}
        onClose={handleModalClose}
        title="Add New Event"
        size="md"
        centered
      >
        <div className="space-y-4">
          <div>
            <Text size="sm" fw={500} mb={5}>
              Date:{" "}
              {selectedDate &&
                new Date(selectedDate + "T00:00:00").toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
            </Text>
          </div>

          <TextInput
            label="Event Title"
            placeholder="Enter event title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />

          <TextInput
            label="Time"
            placeholder="e.g., 9:30 AM or 14:30"
            value={newEvent.time}
            onChange={(e) =>
              setNewEvent((prev) => ({ ...prev, time: e.target.value }))
            }
          />

          <Textarea
            label="Description (Optional)"
            placeholder="Enter event description"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
          />

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveEvent} disabled={!newEvent.title.trim()}>
              Save Event
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectBusinessCalendar;
