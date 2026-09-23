import { describe, expect, it, vi } from 'vitest';

import { getInitials, normalizePhoneNumber, retry } from './utils';

describe('retry', () => {
  it('returns the result after a failed attempt', async () => {
    const fn = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('temporary failure'))
      .mockResolvedValue('success');

    await expect(retry(fn, { maxRetries: 1, retryDelay: 0 })).resolves.toBe(
      'success',
    );
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws the last error after retries are exhausted', async () => {
    const error = new Error('failure');
    const fn = vi.fn<() => Promise<never>>().mockRejectedValue(error);

    await expect(retry(fn, { maxRetries: 2, retryDelay: 0 })).rejects.toBe(
      error,
    );
    expect(fn).toHaveBeenCalledTimes(3);
  });
});

describe('normalizePhoneNumber', () => {
  it('removes formatting characters from a phone number', () => {
    expect(normalizePhoneNumber('+1 (555) 123-4567')).toBe('15551234567');
  });

  it('accepts numeric phone numbers', () => {
    expect(normalizePhoneNumber(15551234567)).toBe('15551234567');
  });
});

describe('getInitials', () => {
  it('returns the last two digits of a phone number', () => {
    expect(getInitials('+1 (555) 123-4567')).toBe('67');
  });

  it('returns the fallback when no digits are present', () => {
    expect(getInitials('unknown')).toBe('••');
  });
});
