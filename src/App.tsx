import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import { CalendarView } from './components/CalendarView/CalendarView';
import { EventForm } from './components/EventForm/EventForm';
import { EventListItem } from './components/EventList/EventListItem';
import { RecurrenceDeleteModal } from './components/RecurrenceDeleteModal';
import { RecurrenceEditModal } from './components/RecurrenceEditModal';
import { notificationOptions } from './constants/eventConstants';
import { useCalendarView } from './hooks/useCalendarView.ts';
import { useEventForm } from './hooks/useEventForm.ts';
import { useEventOperations } from './hooks/useEventOperations.ts';
import { useNotifications } from './hooks/useNotifications.ts';
import { useSearch } from './hooks/useSearch.ts';
import { Event, EventForm as EventFormType } from './types';
import { findOverlappingEvents } from './utils/eventOverlap';
import { getTimeErrorMessage } from './utils/timeValidation';

function App() {
  const {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    endTime,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    isRepeating,
    setIsRepeating,
    repeatType,
    setRepeatType,
    repeatInterval,
    repeatEndDate,
    setRepeatEndDate,
    notificationTime,
    setNotificationTime,
    startTimeError,
    endTimeError,
    editingEvent,
    setEditingEvent,
    handleStartTimeChange,
    handleEndTimeChange,
    resetForm,
    editEvent,
  } = useEventForm();

  const { events, saveEvent, deleteEvent } = useEventOperations(Boolean(editingEvent), () =>
    setEditingEvent(null)
  );

  const { notifications, notifiedEvents, setNotifications } = useNotifications(events);
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();
  const { searchTerm, filteredEvents, setSearchTerm } = useSearch(events, currentDate, view);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  const [isRecurrenceEditModalOpen, setIsRecurrenceEditModalOpen] = useState(false);
  const [isRecurrenceDeleteModalOpen, setIsRecurrenceDeleteModalOpen] = useState(false);
  const [pendingEventData, setPendingEventData] = useState<Event | EventFormType | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const addOrUpdateEvent = async () => {
    if (!title || !date || !startTime || !endTime) {
      enqueueSnackbar('필수 정보를 모두 입력해주세요.', { variant: 'error' });
      return;
    }

    if (startTimeError || endTimeError) {
      enqueueSnackbar('시간 설정을 확인해주세요.', { variant: 'error' });
      return;
    }

    const eventData: Event | EventFormType = {
      id: editingEvent ? editingEvent.id : undefined,
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: {
        type: isRepeating ? repeatType : 'none',
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
        recurrenceId: editingEvent?.repeat.recurrenceId,
      },
      notificationTime,
    };

    // Check if we're editing a recurring event
    if (editingEvent && editingEvent.repeat.type !== 'none') {
      setPendingEventData(eventData);
      setIsRecurrenceEditModalOpen(true);
      return;
    }

    const overlapping = findOverlappingEvents(eventData, events);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
    } else {
      await saveEvent(eventData);
      resetForm();
    }
  };

  const handleRecurrenceEditConfirm = async (type: 'single' | 'all') => {
    setIsRecurrenceEditModalOpen(false);
    if (pendingEventData) {
      await saveEvent(pendingEventData, type);
      setPendingEventData(null);
      resetForm();
    }
  };

  const handleRecurrenceEditCancel = () => {
    setIsRecurrenceEditModalOpen(false);
    setPendingEventData(null);
  };

  const handleDeleteEvent = async (id: string) => {
    const event = events.find((e) => e.id === id);

    // Check if it's a recurring event
    if (event && event.repeat.type !== 'none') {
      setPendingDeleteId(id);
      setIsRecurrenceDeleteModalOpen(true);
      return;
    }

    // Delete single non-recurring event
    await deleteEvent(id);
  };

  const handleRecurrenceDeleteConfirm = async (type: 'single' | 'all') => {
    setIsRecurrenceDeleteModalOpen(false);
    if (pendingDeleteId) {
      await deleteEvent(pendingDeleteId, type);
      setPendingDeleteId(null);
    }
  };

  const handleRecurrenceDeleteCancel = () => {
    setIsRecurrenceDeleteModalOpen(false);
    setPendingDeleteId(null);
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', margin: 'auto', p: 5 }}>
      <Stack direction="row" spacing={6} sx={{ height: '100%' }}>
        <EventForm
          title={title}
          setTitle={setTitle}
          date={date}
          setDate={setDate}
          startTime={startTime}
          endTime={endTime}
          description={description}
          setDescription={setDescription}
          location={location}
          setLocation={setLocation}
          category={category}
          setCategory={setCategory}
          isRepeating={isRepeating}
          setIsRepeating={setIsRepeating}
          repeatType={repeatType}
          setRepeatType={setRepeatType}
          repeatEndDate={repeatEndDate}
          setRepeatEndDate={setRepeatEndDate}
          notificationTime={notificationTime}
          setNotificationTime={setNotificationTime}
          startTimeError={startTimeError}
          endTimeError={endTimeError}
          editingEvent={editingEvent}
          handleStartTimeChange={handleStartTimeChange}
          handleEndTimeChange={handleEndTimeChange}
          onSubmit={addOrUpdateEvent}
        />

        <CalendarView
          view={view}
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          holidays={holidays}
          onViewChange={setView}
          onNavigate={navigate}
        />

        <Stack
          data-testid="event-list"
          spacing={2}
          sx={{ width: '30%', height: '100%', overflowY: 'auto' }}
        >
          <FormControl fullWidth>
            <FormLabel htmlFor="search">일정 검색</FormLabel>
            <TextField
              id="search"
              size="small"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormControl>

          {filteredEvents.length === 0 ? (
            <Typography>검색 결과가 없습니다.</Typography>
          ) : (
            filteredEvents.map((event) => (
              <EventListItem
                key={event.id}
                event={event}
                isNotified={notifiedEvents.includes(event.id)}
                onEdit={editEvent}
                onDelete={handleDeleteEvent}
              />
            ))
          )}
        </Stack>
      </Stack>

      <Dialog open={isOverlapDialogOpen} onClose={() => setIsOverlapDialogOpen(false)}>
        <DialogTitle>일정 겹침 경고</DialogTitle>
        <DialogContent>
          <DialogContentText>다음 일정과 겹칩니다:</DialogContentText>
          {overlappingEvents.map((event) => (
            <Typography key={event.id}>
              {event.title} ({event.date} {event.startTime}-{event.endTime})
            </Typography>
          ))}
          <DialogContentText>계속 진행하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOverlapDialogOpen(false)}>취소</Button>
          <Button
            color="error"
            onClick={() => {
              setIsOverlapDialogOpen(false);
              saveEvent({
                id: editingEvent ? editingEvent.id : undefined,
                title,
                date,
                startTime,
                endTime,
                description,
                location,
                category,
                repeat: {
                  type: isRepeating ? repeatType : 'none',
                  interval: repeatInterval,
                  endDate: repeatEndDate || undefined,
                },
                notificationTime,
              });
            }}
          >
            계속 진행
          </Button>
        </DialogActions>
      </Dialog>

      {notifications.length > 0 && (
        <Stack position="fixed" top={16} right={16} spacing={2} alignItems="flex-end">
          {notifications.map((notification, index) => (
            <Alert
              key={index}
              severity="info"
              sx={{ width: 'auto' }}
              action={
                <IconButton
                  size="small"
                  onClick={() => setNotifications((prev) => prev.filter((_, i) => i !== index))}
                >
                  <CloseIcon />
                </IconButton>
              }
            >
              <AlertTitle>{notification.message}</AlertTitle>
            </Alert>
          ))}
        </Stack>
      )}

      <RecurrenceEditModal
        isOpen={isRecurrenceEditModalOpen}
        onConfirm={handleRecurrenceEditConfirm}
        onCancel={handleRecurrenceEditCancel}
      />

      <RecurrenceDeleteModal
        isOpen={isRecurrenceDeleteModalOpen}
        onConfirm={handleRecurrenceDeleteConfirm}
        onCancel={handleRecurrenceDeleteCancel}
      />
    </Box>
  );
}

export default App;
