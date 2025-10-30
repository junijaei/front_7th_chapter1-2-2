import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../../App';

describe('반복 일정 통합 테스트', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('반복 일정 생성 플로우', () => {
    it('사용자가 매주 반복 일정을 생성할 수 있다', async () => {
      const user = userEvent.setup();
      render(<App />);

      // 1. 일정 생성 폼 열기
      const addButton = screen.getByRole('button', { name: /일정 추가/ });
      await user.click(addButton);

      // 2. 제목 입력
      const titleInput = screen.getByLabelText(/제목/);
      await user.type(titleInput, '주간 회의');

      // 3. 시작 날짜 선택
      const dateInput = screen.getByLabelText(/날짜/);
      await user.type(dateInput, '2025-01-06');

      // 4. 반복 유형 "매주" 선택
      const repeatSelect = screen.getByLabelText(/반복/);
      await user.selectOptions(repeatSelect, 'weekly');

      // 5. 종료 날짜 선택
      const endDateInput = screen.getByLabelText(/종료 날짜/);
      await user.type(endDateInput, '2025-01-27');

      // 6. 저장 버튼 클릭
      const saveButton = screen.getByRole('button', { name: /저장/ });
      await user.click(saveButton);

      // 7. 캘린더에 4개의 반복 일정이 표시되는지 확인
      const eventItems = screen.getAllByRole('listitem', { name: /주간 회의/ });
      expect(eventItems).toHaveLength(4);

      // 8. 각 일정에 반복 아이콘이 표시되는지 확인
      eventItems.forEach((item) => {
        const recurrenceIcon = within(item).getByLabelText(/반복 일정/);
        expect(recurrenceIcon).toBeInTheDocument();
      });
    });
  });

  describe('반복 일정 수정 플로우', () => {
    it('사용자가 반복 일정 중 하나를 단일 수정할 수 있다', async () => {
      const user = userEvent.setup();
      render(<App />);

      // 1. 매주 반복 일정 생성 (생략 - 위 테스트와 동일)
      // ...

      // 2. 두 번째 일정 (1/13) 클릭
      const eventItems = screen.getAllByRole('listitem', { name: /주간 회의/ });
      await user.click(eventItems[1]);

      // 3. 제목 변경
      const titleInput = screen.getByLabelText(/제목/);
      await user.clear(titleInput);
      await user.type(titleInput, '긴급 회의');

      // 4. 저장 버튼 클릭
      const saveButton = screen.getByRole('button', { name: /저장/ });
      await user.click(saveButton);

      // 5. 모달에서 "예" 클릭 (단일 수정)
      const modal = screen.getByRole('dialog');
      const yesButton = within(modal).getByRole('button', { name: '예' });
      await user.click(yesButton);

      // 6. 해당 일정만 제목이 변경되고, 반복 아이콘이 제거되었는지 확인
      expect(screen.getByText('긴급 회의')).toBeInTheDocument();
      expect(screen.queryByLabelText(/반복 일정/, { selector: '[data-event-id="event-2"]' })).not.toBeInTheDocument();

      // 7. 다른 일정은 변경되지 않았는지 확인
      const remainingEvents = screen.getAllByText('주간 회의');
      expect(remainingEvents).toHaveLength(3);
    });

    it('사용자가 반복 일정 전체를 수정할 수 있다', async () => {
      const user = userEvent.setup();
      render(<App />);

      // 1. 매주 반복 일정 생성 (생략)
      // ...

      // 2. 임의의 일정 클릭
      const eventItems = screen.getAllByRole('listitem', { name: /주간 회의/ });
      await user.click(eventItems[1]);

      // 3. 제목 변경
      const titleInput = screen.getByLabelText(/제목/);
      await user.clear(titleInput);
      await user.type(titleInput, '전체 회의');

      // 4. 저장 버튼 클릭
      const saveButton = screen.getByRole('button', { name: /저장/ });
      await user.click(saveButton);

      // 5. 모달에서 "아니오" 클릭 (전체 수정)
      const modal = screen.getByRole('dialog');
      const noButton = within(modal).getByRole('button', { name: '아니오' });
      await user.click(noButton);

      // 6. 모든 일정의 제목이 변경되었는지 확인
      const allEvents = screen.getAllByText('전체 회의');
      expect(allEvents).toHaveLength(4);

      // 7. 모든 일정의 반복 아이콘이 유지되는지 확인
      const recurrenceIcons = screen.getAllByLabelText(/반복 일정/);
      expect(recurrenceIcons).toHaveLength(4);
    });
  });

  describe('반복 일정 삭제 플로우', () => {
    it('사용자가 반복 일정 중 하나를 단일 삭제할 수 있다', async () => {
      const user = userEvent.setup();
      render(<App />);

      // 1. 매주 반복 일정 생성 (생략)
      // ...

      // 2. 두 번째 일정 (1/13) 삭제 버튼 클릭
      const eventItems = screen.getAllByRole('listitem', { name: /주간 회의/ });
      const deleteButton = within(eventItems[1]).getByRole('button', { name: /삭제/ });
      await user.click(deleteButton);

      // 3. 모달에서 "예" 클릭 (단일 삭제)
      const modal = screen.getByRole('dialog');
      const yesButton = within(modal).getByRole('button', { name: '예' });
      await user.click(yesButton);

      // 4. 해당 일정만 삭제되고, 다른 일정은 유지되는지 확인
      const remainingEvents = screen.getAllByRole('listitem', { name: /주간 회의/ });
      expect(remainingEvents).toHaveLength(3);
    });

    it('사용자가 반복 일정 전체를 삭제할 수 있다', async () => {
      const user = userEvent.setup();
      render(<App />);

      // 1. 매주 반복 일정 생성 (생략)
      // ...

      // 2. 임의의 일정 삭제 버튼 클릭
      const eventItems = screen.getAllByRole('listitem', { name: /주간 회의/ });
      const deleteButton = within(eventItems[0]).getByRole('button', { name: /삭제/ });
      await user.click(deleteButton);

      // 3. 모달에서 "아니오" 클릭 (전체 삭제)
      const modal = screen.getByRole('dialog');
      const noButton = within(modal).getByRole('button', { name: '아니오' });
      await user.click(noButton);

      // 4. 모든 일정이 삭제되었는지 확인
      expect(screen.queryByText('주간 회의')).not.toBeInTheDocument();
    });
  });
});
