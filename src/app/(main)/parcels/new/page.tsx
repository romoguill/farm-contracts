import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CreateParcelForm from '../../_components/forms/create-parcel-form';

async function NewParcelsPage() {
  const { session } = await validateRequest();

  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <div>
      <CreateParcelForm />
    </div>
  );
}
export default NewParcelsPage;
