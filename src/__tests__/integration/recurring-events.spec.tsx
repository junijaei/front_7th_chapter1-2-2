import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { SnackbarProvider } from 'notistack';
import { ReactElement } from 'react';

import App from '../../App';
import { server } from '../../setupTests';
import { Event } from '../../types';

const theme = createTheme();

const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return {
    ...render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>{element}</SnackbarProvider>
      </ThemeProvider>
    ),
    user,
  };
};

describe('반복 일정 수정 및 삭제', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it('반복 일정 중 하나를 단일 수정하면 해당 일정만 변경되고 반복 아이콘이 제거된다', async () => {
    // Given: 4개의 반복 일정 설정
    const mockEvents: Event[] = [
      {
        id: '1',
        title: '주간 회의',
        date: '2025-10-06',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-10-27',
          recurrenceId: 'rec-1',
        },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '주간 회의',
        date: '2025-10-13',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-10-27',
          recurrenceId: 'rec-1',
        },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '주간 회의',
        date: '2025-10-20',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-10-27',
          recurrenceId: 'rec-1',
        },
        notificationTime: 10,
      },
      {
        id: '4',
        title: '주간 회의',
        date: '2025-10-27',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-10-27',
          recurrenceId: 'rec-1',
        },
        notificationTime: 10,
      },
    ];

    server.use(
      http.get('/api/events', () => {
        return HttpResponse.json({ events: mockEvents });
      }),
      http.put('/api/events/:id', async ({ params, request }) => {
        const { id } = params;
        const updatedEvent = (await request.json()) as Event;
        const index = mockEvents.findIndex((e) => e.id === id);

        if (index !== -1) {
          // 단일 수정: repeat.type을 'none'으로 변경
          mockEvents[index] = {
            ...mockEvents[index],
            ...updatedEvent,
            repeat: { type: 'none', interval: 0 },
          };
        }

        return HttpResponse.json(mockEvents[index]);
      })
    );

    const { user } = setup(<App />);

    // When: 두 번째 일정 편집
    const editButtons = await screen.findAllByLabelText('Edit event');
    await user.click(editButtons[1]);

    // 제목 변경
    const titleInput = screen.getByLabelText('제목');
    await user.clear(titleInput);
    await user.type(titleInput, '긴급 회의');

    await user.click(screen.getByTestId('event-submit-button'));

    // 모달에서 "예" (단일 수정) 클릭
    const modal = await screen.findByRole('dialog');
    expect(within(modal).getByText('반복 일정 수정')).toBeInTheDocument();
    expect(within(modal).getByText('해당 일정만 수정하시겠어요?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '예' }));

    // Then: 검증
    const eventList = within(screen.getByTestId('event-list'));
    expect(eventList.getByText('긴급 회의')).toBeInTheDocument();

    const weeklyMeetings = eventList.getAllByText('주간 회의');
    expect(weeklyMeetings).toHaveLength(3);

    // 수정된 일정에는 반복 아이콘이 없어야 함
    const urgentMeetingItem = eventList.getByText('긴급 회의').closest('[role="listitem"]');
    expect(within(urgentMeetingItem!).queryByLabelText('반복 일정')).not.toBeInTheDocument();

    // 다른 3개 일정은 반복 아이콘 유지
    const repeatIcons = eventList.getAllByLabelText('반복 일정');
    expect(repeatIcons).toHaveLength(3);
  });

  it('반복 일정 전체를 수정하면 모든 일정이 변경되고 반복 아이콘이 유지된다', async () => {
    // Given: 4개의 반복 일정 설정
    const mockEvents: Event[] = [
      {
        id: '1',
        title: '주간 회의',
        date: '2025-10-06',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-10-27',
          recurrenceId: 'rec-1',
        },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '주간 회의',
        date: '2025-10-13',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-10-27',
          recurrenceId: 'rec-1',
        },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '주간 회의',
        date: '2025-10-20',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-10-27',
          recurrenceId: 'rec-1',
        },
        notificationTime: 10,
      },
      {
        id: '4',
        title: '주간 회의',
        date: '2025-10-27',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-10-27',
          recurrenceId: 'rec-1',
        },
        notificationTime: 10,
      },
    ];

    server.use(
      http.get('/api/events', () => {
        return HttpResponse.json({ events: mockEvents });
      }),
      http.put('/api/events/:id', async ({ params, request }) => {
        const { id } = params;
        const updatedEvent = (await request.json()) as Event;
        const targetEvent = mockEvents.find((e) => e.id === id);

        if (targetEvent?.repeat.recurrenceId) {
          // 전체 수정: 동일한 recurrenceId를 가진 모든 일정 수정
          const recurrenceId = targetEvent.repeat.recurrenceId;
          mockEvents.forEach((event) => {
            if (event.repeat.recurrenceId === recurrenceId) {
              Object.assign(event, updatedEvent);
            }
          });
        }

        return HttpResponse.json(targetEvent);
      })
    );

    const { user } = setup(<App />);

    // When: 두 번째 일정 편집
    const editButtons = await screen.findAllByLabelText('Edit event');
    await user.click(editButtons[1]);

    // 제목 변경
    const titleInput = screen.getByLabelText('제목');
    await user.clear(titleInput);
    await user.type(titleInput, '전체 회의 변경');

    await user.click(screen.getByTestId('event-submit-button'));

    // 모달에서 "아니오" (전체 수정) 클릭
    const modal = await screen.findByRole('dialog');
    expect(within(modal).getByText('반복 일정 수정')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '아니오' }));

    // Then: 검증
    const eventList = within(screen.getByTestId('event-list'));
    const allEvents = eventList.getAllByText('전체 회의 변경');
    expect(allEvents).toHaveLength(4);

    expect(eventList.queryByText('주간 회의')).not.toBeInTheDocument();

    // 모든 일정이 반복 아이콘 유지
    const repeatIcons = eventList.getAllByLabelText('반복 일정');
    expect(repeatIcons).toHaveLength(4);
  });

  it('반복 일정 중 하나를 단일 삭제하면 해당 일정만 삭제된다', async () => {
    // Given: 4개의 반복 일정 설정
    const mockEvents: Event[] = [
      {
        id: '1',
        title: '주간 회의',
        date: '2025-10-06',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-10-27',
          recurrenceId: 'rec-1',
        },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '주간 회의',
        date: '2025-10-13',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-10-27',
          recurrenceId: 'rec-1',
        },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '주간 회의',
        date: '2025-10-20',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-10-27',
          recurrenceId: 'rec-1',
        },
        notificationTime: 10,
      },
      {
        id: '4',
        title: '주간 회의',
        date: '2025-10-27',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-10-27',
          recurrenceId: 'rec-1',
        },
        notificationTime: 10,
      },
    ];

    server.use(
      http.get('/api/events', () => {
        return HttpResponse.json({ events: mockEvents });
      }),
      http.delete('/api/events/:id', ({ params }) => {
        const { id } = params;
        const index = mockEvents.findIndex((e) => e.id === id);

        if (index !== -1) {
          mockEvents.splice(index, 1);
        }

        return new HttpResponse(null, { status: 204 });
      })
    );

    const { user } = setup(<App />);

    // When: 두 번째 일정 삭제
    const deleteButtons = await screen.findAllByLabelText('Delete event');
    await user.click(deleteButtons[1]);

    // 모달에서 "예" (단일 삭제) 클릭
    const modal = await screen.findByRole('dialog');
    expect(within(modal).getByText('반복 일정 삭제')).toBeInTheDocument();
    expect(within(modal).getByText('해당 일정만 삭제하시겠어요?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '예' }));

    // Then: 검증
    const eventList = within(screen.getByTestId('event-list'));
    const weeklyMeetings = eventList.getAllByText('주간 회의');
    expect(weeklyMeetings).toHaveLength(3);

    const repeatIcons = eventList.getAllByLabelText('반복 일정');
    expect(repeatIcons).toHaveLength(3);
  });

  it('반복 일정 전체를 삭제하면 모든 일정이 삭제된다', async () => {
    // Given: 4개의 반복 일정 설정
    const mockEvents: Event[] = [
      {
        id: '1',
        title: '주간 회의',
        date: '2025-10-06',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-10-27',
          recurrenceId: 'rec-1',
        },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '주간 회의',
        date: '2025-10-13',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-10-27',
          recurrenceId: 'rec-1',
        },
        notificationTime: 10,
      },
      {
        id: '3',
        title: '주간 회의',
        date: '2025-10-20',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-10-27',
          recurrenceId: 'rec-1',
        },
        notificationTime: 10,
      },
      {
        id: '4',
        title: '주간 회의',
        date: '2025-10-27',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-10-27',
          recurrenceId: 'rec-1',
        },
        notificationTime: 10,
      },
    ];

    server.use(
      http.get('/api/events', () => {
        return HttpResponse.json({ events: mockEvents });
      }),
      http.delete('/api/events/:id', ({ params }) => {
        const { id } = params;
        const targetEvent = mockEvents.find((e) => e.id === id);

        if (targetEvent?.repeat.recurrenceId) {
          // 전체 삭제: 동일한 recurrenceId를 가진 모든 일정 삭제
          const recurrenceId = targetEvent.repeat.recurrenceId;
          const indicesToRemove = mockEvents
            .map((e, index) => (e.repeat.recurrenceId === recurrenceId ? index : -1))
            .filter((index) => index !== -1)
            .reverse();

          indicesToRemove.forEach((index) => mockEvents.splice(index, 1));
        }

        return new HttpResponse(null, { status: 204 });
      })
    );

    const { user } = setup(<App />);

    // When: 첫 번째 일정 삭제
    const deleteButtons = await screen.findAllByLabelText('Delete event');
    await user.click(deleteButtons[0]);

    // 모달에서 "아니오" (전체 삭제) 클릭
    const modal = await screen.findByRole('dialog');
    expect(within(modal).getByText('반복 일정 삭제')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '아니오' }));

    // Then: 검증
    const eventList = within(screen.getByTestId('event-list'));
    expect(eventList.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
    expect(eventList.queryByText('주간 회의')).not.toBeInTheDocument();
  });
});
