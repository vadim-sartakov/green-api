export { cn } from 'cn';

export function getInitials(phoneNumber: string) {
	return phoneNumber.replace(/\D/g, '').slice(-2) || '••';
}
