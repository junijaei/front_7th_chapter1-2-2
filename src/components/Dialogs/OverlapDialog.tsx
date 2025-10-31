import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';

import { Event } from '../../types';

interface OverlapDialogProps {
  isOpen: boolean;
  overlappingEvents: Event[];
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * 일정 겹침 경고 다이얼로그
 */
export function OverlapDialog({
  isOpen,
  overlappingEvents,
  onClose,
  onConfirm,
}: OverlapDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
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
        <Button onClick={onClose}>취소</Button>
        <Button color="error" onClick={onConfirm}>
          계속 진행
        </Button>
      </DialogActions>
    </Dialog>
  );
}
