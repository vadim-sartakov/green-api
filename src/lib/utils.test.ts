import { describe, expect, it } from 'vitest';

import { getInitials, normalizePhoneNumber } from './utils';

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