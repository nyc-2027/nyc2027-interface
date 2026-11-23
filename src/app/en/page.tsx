import type { Metadata } from 'next';
import EventLanding from '@/components/event-landing';

export const metadata: Metadata = { title: 'NYC 2027 · Ninh Binh — Leading for Impact', description: 'Discover New Year Convention 2027, 15–17 January in Ninh Binh, Vietnam. Explore the program and international delegate packages.' };
export default function EnglishHome() { return <EventLanding />; }
