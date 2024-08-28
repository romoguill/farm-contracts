import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

export default async function SignUpForm() {
  const form = useForm();
  return (
    <Form {...form}>
      <form></form>
    </Form>
  );
}
