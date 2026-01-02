import { redirect } from 'next/navigation';

export default function Page() {
    // TODO: Add auth check logic here later
    // For now, redirect to login by default
    redirect('/login');
}
