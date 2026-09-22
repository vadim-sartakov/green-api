export { cn } from 'cn';

export const getInitials = (phoneNumber: string) => {
	return phoneNumber.replace(/\D/g, '').slice(-2) || '••';
}
