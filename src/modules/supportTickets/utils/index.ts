import type { TicketStatus } from '../types';
import { TICKET_STATUS, TICKET_STATUS_LABELS } from '../constants';

/**
 * Lấy danh sách trạng thái hỗ trợ kèm cờ disabled dựa theo trạng thái hiện tại của Ticket
 */
export const getTicketStatusOptions = (
  currentStatus?: TicketStatus
): { value: TicketStatus; label: string; disabled?: boolean }[] => {
  return (Object.keys(TICKET_STATUS_LABELS) as TicketStatus[]).map((key) => {
    let isDisabled = false;

    if (currentStatus) {
      if (currentStatus === TICKET_STATUS.CLOSED) {
        // Trạng thái CLOSED không thể chuyển về bất kỳ trạng thái trước đó
        isDisabled = key !== TICKET_STATUS.CLOSED;
      } else if (currentStatus === TICKET_STATUS.RESOLVED) {
        // Trạng thái RESOLVED không thể chuyển về OPEN, IN_PROGRESS, PENDING_USER
        isDisabled =
          key === TICKET_STATUS.OPEN ||
          key === TICKET_STATUS.IN_PROGRESS ||
          key === TICKET_STATUS.PENDING_USER;
      } else if (currentStatus !== TICKET_STATUS.OPEN) {
        // Các trạng thái đã chuyển lên (IN_PROGRESS, PENDING_USER) không thể quay về OPEN
        isDisabled = key === TICKET_STATUS.OPEN;
      }
    }

    return {
      value: key,
      label: TICKET_STATUS_LABELS[key].label,
      disabled: isDisabled,
    };
  });
};
