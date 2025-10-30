import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/userEvent';
import userEvent from '@testing-library/user-event';
import { RecurrenceSelector } from '../../components/RecurrenceSelector';
import type { RepeatInfo } from '../../types';

describe('RecurrenceSelector', () => {
  const defaultProps = {
    value: { type: 'none' as const, interval: 1 },
    onChange: vi.fn(),
  };

  it('기본적으로 렌더링되며 "반복" 레이블이 표시된다', () => {
    render(<RecurrenceSelector {...defaultProps} />);

    expect(screen.getByText('반복')).toBeInTheDocument();
  });

  it('드롭다운이 렌더링되고 기본값이 "없음"이다', () => {
    render(<RecurrenceSelector {...defaultProps} />);

    const select = screen.getByRole('combobox', { name: /반복/ });
    expect(select).toHaveValue('none');
  });

  it('모든 반복 유형 옵션이 표시된다', () => {
    render(<RecurrenceSelector {...defaultProps} />);

    const select = screen.getByRole('combobox', { name: /반복/ });
    const options = within(select).getAllByRole('option');

    expect(options).toHaveLength(5);
    expect(options[0]).toHaveTextContent('없음');
    expect(options[1]).toHaveTextContent('매일');
    expect(options[2]).toHaveTextContent('매주');
    expect(options[3]).toHaveTextContent('매월');
    expect(options[4]).toHaveTextContent('매년');
  });

  it('반복 유형 "none" 선택 시 종료 날짜 필드가 숨겨져 있다', () => {
    render(<RecurrenceSelector {...defaultProps} />);

    expect(screen.queryByLabelText('종료 날짜')).not.toBeInTheDocument();
  });

  it('반복 유형 "매일" 선택 시 onChange 콜백이 호출되고 종료 날짜 필드가 표시된다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<RecurrenceSelector value={defaultProps.value} onChange={onChange} />);

    const select = screen.getByRole('combobox', { name: /반복/ });
    await user.selectOptions(select, 'daily');

    expect(onChange).toHaveBeenCalledWith({ type: 'daily', interval: 1 });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('반복 유형 선택 시 종료 날짜 필드가 Slide down 애니메이션으로 표시된다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender } = render(<RecurrenceSelector value={defaultProps.value} onChange={onChange} />);

    const select = screen.getByRole('combobox', { name: /반복/ });
    await user.selectOptions(select, 'weekly');

    // Props 업데이트를 시뮬레이션
    rerender(<RecurrenceSelector value={{ type: 'weekly', interval: 1 }} onChange={onChange} />);

    // 종료 날짜 필드가 표시되는지 확인
    expect(screen.getByLabelText('종료 날짜')).toBeInTheDocument();
  });

  it('반복 유형을 "없음"으로 변경하면 종료 날짜 필드가 숨겨진다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender } = render(
      <RecurrenceSelector value={{ type: 'weekly', interval: 1 }} onChange={onChange} />
    );

    // 처음에는 종료 날짜 필드가 표시됨
    expect(screen.getByLabelText('종료 날짜')).toBeInTheDocument();

    const select = screen.getByRole('combobox', { name: /반복/ });
    await user.selectOptions(select, 'none');

    // Props 업데이트를 시뮬레이션
    rerender(<RecurrenceSelector value={{ type: 'none', interval: 1 }} onChange={onChange} />);

    // 종료 날짜 필드가 숨겨지는지 확인
    expect(screen.queryByLabelText('종료 날짜')).not.toBeInTheDocument();
  });
});
