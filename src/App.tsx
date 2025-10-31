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
import { EventListItem } from './components/EventList/EventListItem';
import { RecurrenceDeleteModal } from './components/RecurrenceDeleteModal';
import { RecurrenceEditModal } from './components/RecurrenceEditModal';
import { categories, notificationOptions } from './constants/eventConstants';
import { useCalendarView } from './hooks/useCalendarView.ts';
import { useEventForm } from './hooks/useEventForm.ts';
import { useEventOperations } from './hooks/useEventOperations.ts';
import { useNotifications } from './hooks/useNotifications.ts';
import { useSearch } from './hooks/useSearch.ts';
import { Event, EventForm, RepeatType } from './types';
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
  const [pendingEventData, setPendingEventData] = useState<Event | EventForm | null>(null);
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

    const eventData: Event | EventForm = {
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
        <Stack spacing={2} sx={{ width: '20%' }}>
          <Typography variant="h4">{editingEvent ? '일정 수정' : '일정 추가'}</Typography>

          <FormControl fullWidth>
            <FormLabel htmlFor="title">제목</FormLabel>
            <TextField
              id="title"
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="date">날짜</FormLabel>
            <TextField
              id="date"
              size="small"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormControl>

          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <FormLabel htmlFor="start-time">시작 시간</FormLabel>
              <Tooltip title={startTimeError || ''} open={!!startTimeError} placement="top">
                <TextField
                  id="start-time"
                  size="small"
                  type="time"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  onBlur={() => getTimeErrorMessage(startTime, endTime)}
                  error={!!startTimeError}
                />
              </Tooltip>
            </FormControl>
            <FormControl fullWidth>
              <FormLabel htmlFor="end-time">종료 시간</FormLabel>
              <Tooltip title={endTimeError || ''} open={!!endTimeError} placement="top">
                <TextField
                  id="end-time"
                  size="small"
                  type="time"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  onBlur={() => getTimeErrorMessage(startTime, endTime)}
                  error={!!endTimeError}
                />
              </Tooltip>
            </FormControl>
          </Stack>

          <FormControl fullWidth>
            <FormLabel htmlFor="description">설명</FormLabel>
            <TextField
              id="description"
              size="small"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="location">위치</FormLabel>
            <TextField
              id="location"
              size="small"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel id="category-label">카테고리</FormLabel>
            <Select
              id="category"
              size="small"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-labelledby="category-label"
              aria-label="카테고리"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat} aria-label={`${cat}-option`}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isRepeating}
                  onChange={(e) => setIsRepeating(e.target.checked)}
                />
              }
              label="반복 일정"
            />
          </FormControl>

          {isRepeating && (
            <>
              <FormControl fullWidth>
                <FormLabel htmlFor="repeat-type">반복</FormLabel>
                <Select
                  id="repeat-type"
                  size="small"
                  value={repeatType === 'none' ? '' : repeatType}
                  onChange={(e) => setRepeatType(e.target.value as RepeatType)}
                  aria-label="반복"
                >
                  <MenuItem value="daily" aria-label="매일">
                    매일
                  </MenuItem>
                  <MenuItem value="weekly" aria-label="매주">
                    매주
                  </MenuItem>
                  <MenuItem value="monthly" aria-label="매월">
                    매월
                  </MenuItem>
                  <MenuItem value="yearly" aria-label="매년">
                    매년
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <FormLabel htmlFor="repeat-end-date">종료 날짜</FormLabel>
                <TextField
                  id="repeat-end-date"
                  size="small"
                  type="date"
                  value={repeatEndDate}
                  onChange={(e) => setRepeatEndDate(e.target.value)}
                  aria-label="종료 날짜"
                />
              </FormControl>
            </>
          )}

          <FormControl fullWidth>
            <FormLabel htmlFor="notification">알림 설정</FormLabel>
            <Select
              id="notification"
              size="small"
              value={notificationTime}
              onChange={(e) => setNotificationTime(Number(e.target.value))}
            >
              {notificationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ! 반복은 8주차 과제에 포함됩니다. 구현하고 싶어도 참아주세요~ */}
          <Button
            data-testid="event-submit-button"
            onClick={addOrUpdateEvent}
            variant="contained"
            color="primary"
          >
            {editingEvent ? '일정 수정' : '일정 추가'}
          </Button>
        </Stack>

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
