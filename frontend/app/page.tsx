import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to feed page (or login if not authenticated)
  redirect('/feed');
}
