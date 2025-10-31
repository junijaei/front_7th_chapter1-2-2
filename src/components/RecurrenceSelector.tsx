import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

import type { RepeatInfo } from '../types';

interface RecurrenceSelectorProps {
  value: RepeatInfo;
  onChange: (value: RepeatInfo) => void;
  startDate?: string;
}

export function RecurrenceSelector({ value, onChange, startDate }: RecurrenceSelectorProps) {
  const [showEndDate, setShowEndDate] = useState(value.type !== 'none');

  useEffect(() => {
    setShowEndDate(value.type !== 'none');
  }, [value.type]);

  const handleRepeatTypeChange = (newType: string) => {
    const repeatInfo: RepeatInfo = {
      type: newType as RepeatInfo['type'],
      interval: 1,
    };

    onChange(repeatInfo);
  };

  const handleEndDateChange = (endDate: string) => {
    onChange({
      ...value,
      endDate,
    });
  };

  // 최소 날짜: 시작 날짜 + 1일
  const minEndDate = startDate
    ? new Date(new Date(startDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    : undefined;

  // 최대 날짜: 2025-12-31
  const maxEndDate = '2025-12-31';

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="repeat-type-label">반복</InputLabel>
        <Select
          labelId="repeat-type-label"
          id="repeat-type"
          value={value.type}
          label="반복"
          onChange={(e) => handleRepeatTypeChange(e.target.value)}
        >
          <MenuItem value="none">없음</MenuItem>
          <MenuItem value="daily">매일</MenuItem>
          <MenuItem value="weekly">매주</MenuItem>
          <MenuItem value="monthly">매월</MenuItem>
          <MenuItem value="yearly">매년</MenuItem>
        </Select>
      </FormControl>

      <AnimatePresence>
        {showEndDate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <TextField
              fullWidth
              type="date"
              label="종료 날짜"
              value={value.endDate || ''}
              onChange={(e) => handleEndDateChange(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: minEndDate,
                max: maxEndDate,
              }}
              helperText={
                value.endDate && startDate && new Date(value.endDate) <= new Date(startDate)
                  ? '종료 날짜는 시작 날짜 이후여야 합니다.'
                  : value.endDate && new Date(value.endDate) > new Date(maxEndDate)
                    ? '종료 날짜는 2025-12-31까지 선택 가능합니다.'
                    : ''
              }
              error={
                (value.endDate && startDate && new Date(value.endDate) <= new Date(startDate)) ||
                (value.endDate && new Date(value.endDate) > new Date(maxEndDate)) ||
                false
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
