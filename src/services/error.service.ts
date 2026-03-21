import axios from 'axios';

import { ERROR_MESSAGES } from '../const';

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: unknown; err?: unknown; error?: unknown } | undefined;
    const axiosMessage = data?.message ?? data?.err ?? data?.error ?? error.message;

    if (typeof axiosMessage === 'string') {
      return axiosMessage;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const e = error as { message?: unknown; err?: unknown; error?: unknown };
    const objectMessage = e.message ?? e.err ?? e.error;

    if (typeof objectMessage === 'string') {
      return objectMessage;
    }
  }

  if (typeof error === 'string' && error.trim() !== '') {
    return error;
  }

  return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
};
