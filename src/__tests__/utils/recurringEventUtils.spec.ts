import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateRecurringEvents, isRecurringEvent } from '../../utils/recurringEventUtils';
import type { Event, RepeatType } from '../../types';

describe('recurringEventUtils', () => {
  beforeEach(() => {
    vi.useRealTimers(); // Ensure clean state first
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('generateRecurringEvents', () => {
    const baseEventData = {
      title: '테스트 이벤트',
      startTime: '09:00',
      endTime: '10:00',
      description: '테스트 설명',
      location: '테스트 장소',
      category: 'meeting',
      notificationTime: 10,
    };

    it('매일 반복 일정을 올바르게 생성한다', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-07');
      const repeatType: RepeatType = 'daily';

      const events = generateRecurringEvents(startDate, endDate, repeatType, baseEventData);

      expect(events).toHaveLength(7);
      expect(events[0].date).toBe('2025-01-01');
      expect(events[6].date).toBe('2025-01-07');

      // 모든 이벤트가 동일한 recurrenceId를 가지는지 확인
      const recurrenceIds = events.map((e) => e.repeat.interval);
      expect(new Set(recurrenceIds).size).toBe(1);

      // 각 이벤트의 repeat.type이 'daily'인지 확인
      events.forEach((event) => {
        expect(event.repeat.type).toBe('daily');
      });
    });

    it('매주 반복 일정을 올바르게 생성한다', () => {
      const startDate = new Date('2025-01-01'); // 수요일
      const endDate = new Date('2025-01-29');
      const repeatType: RepeatType = 'weekly';

      const events = generateRecurringEvents(startDate, endDate, repeatType, baseEventData);

      expect(events).toHaveLength(5); // 1/1, 1/8, 1/15, 1/22, 1/29
      expect(events[0].date).toBe('2025-01-01');
      expect(events[1].date).toBe('2025-01-08');
      expect(events[4].date).toBe('2025-01-29');

      // 모든 이벤트가 수요일인지 확인
      events.forEach((event) => {
        const eventDate = new Date(event.date);
        expect(eventDate.getDay()).toBe(3); // 수요일 = 3
      });
    });

    it('매월 반복 일정을 올바르게 생성한다', () => {
      const startDate = new Date('2025-01-15');
      const endDate = new Date('2025-06-30');
      const repeatType: RepeatType = 'monthly';

      const events = generateRecurringEvents(startDate, endDate, repeatType, baseEventData);

      expect(events).toHaveLength(6); // 1/15, 2/15, 3/15, 4/15, 5/15, 6/15
      expect(events[0].date).toBe('2025-01-15');
      expect(events[1].date).toBe('2025-02-15');
      expect(events[5].date).toBe('2025-06-15');

      // 각 이벤트가 15일인지 확인
      events.forEach((event) => {
        const eventDate = new Date(event.date);
        expect(eventDate.getDate()).toBe(15);
      });
    });

    it('31일 매월 반복 시 31일이 없는 달은 건너뛴다 (엣지 케이스)', () => {
      const startDate = new Date('2025-01-31');
      const endDate = new Date('2025-12-31');
      const repeatType: RepeatType = 'monthly';

      const events = generateRecurringEvents(startDate, endDate, repeatType, baseEventData);

      // 31일이 있는 달: 1월, 3월, 5월, 7월, 8월, 10월, 12월 = 7개
      expect(events).toHaveLength(7);

      expect(events[0].date).toBe('2025-01-31');
      expect(events[1].date).toBe('2025-03-31');
      expect(events[2].date).toBe('2025-05-31');
      expect(events[3].date).toBe('2025-07-31');
      expect(events[4].date).toBe('2025-08-31');
      expect(events[5].date).toBe('2025-10-31');
      expect(events[6].date).toBe('2025-12-31');
    });

    it('윤년 2월 29일 매년 반복 시 윤년이 아닌 해는 건너뛴다 (엣지 케이스)', () => {
      const startDate = new Date('2024-02-29'); // 2024년은 윤년
      const endDate = new Date('2030-12-31');
      const repeatType: RepeatType = 'yearly';

      const events = generateRecurringEvents(startDate, endDate, repeatType, baseEventData);

      // 2024, 2028만 윤년 = 2개
      expect(events).toHaveLength(2);
      expect(events[0].date).toBe('2024-02-29');
      expect(events[1].date).toBe('2028-02-29');
    });

    it('매년 반복 일정을 올바르게 생성한다', () => {
      const startDate = new Date('2025-03-15');
      const endDate = new Date('2028-12-31');
      const repeatType: RepeatType = 'yearly';

      const events = generateRecurringEvents(startDate, endDate, repeatType, baseEventData);

      expect(events).toHaveLength(4); // 2025, 2026, 2027, 2028
      expect(events[0].date).toBe('2025-03-15');
      expect(events[1].date).toBe('2026-03-15');
      expect(events[2].date).toBe('2027-03-15');
      expect(events[3].date).toBe('2028-03-15');
    });

    it('종료 날짜가 없으면 빈 배열을 반환한다', () => {
      const startDate = new Date('2025-01-01');
      const endDate = null as any;
      const repeatType: RepeatType = 'daily';

      const events = generateRecurringEvents(startDate, endDate, repeatType, baseEventData);

      expect(events).toEqual([]);
    });

    it('종료 날짜가 시작 날짜보다 이전이면 빈 배열을 반환한다', () => {
      const startDate = new Date('2025-01-10');
      const endDate = new Date('2025-01-05');
      const repeatType: RepeatType = 'daily';

      const events = generateRecurringEvents(startDate, endDate, repeatType, baseEventData);

      expect(events).toEqual([]);
    });

    it('생성된 모든 이벤트는 고유한 ID를 가진다', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-05');
      const repeatType: RepeatType = 'daily';

      const events = generateRecurringEvents(startDate, endDate, repeatType, baseEventData);

      const ids = events.map((e) => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(events.length);
    });
  });

  describe('isRecurringEvent', () => {
    it('repeat.type이 "daily"이면 true를 반환한다', () => {
      const event: Event = {
        id: '1',
        title: '테스트',
        date: '2025-01-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: 'meeting',
        repeat: {
          type: 'daily',
          interval: 1,
          endDate: '2025-01-07',
        },
        notificationTime: 10,
      };

      expect(isRecurringEvent(event)).toBe(true);
    });

    it('repeat.type이 "weekly"이면 true를 반환한다', () => {
      const event: Event = {
        id: '1',
        title: '테스트',
        date: '2025-01-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: 'meeting',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2025-01-29',
        },
        notificationTime: 10,
      };

      expect(isRecurringEvent(event)).toBe(true);
    });

    it('repeat.type이 "none"이면 false를 반환한다', () => {
      const event: Event = {
        id: '1',
        title: '테스트',
        date: '2025-01-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: 'meeting',
        repeat: {
          type: 'none',
          interval: 1,
        },
        notificationTime: 10,
      };

      expect(isRecurringEvent(event)).toBe(false);
    });
  });
});
