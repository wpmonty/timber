import { redirect } from 'next/navigation';

export default async function PropertyIndexPage() {
  redirect(`/properties`);
}
