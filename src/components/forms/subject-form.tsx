'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { createSubject, updateSubject } from '@/actions/subject-actions';
import { subjectSchema, SubjectSchema } from '@/lib/form-validation-schemas';
import { useRouter } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
} from 'react';
import { toast } from 'react-toastify';
import InputField from '../input-field';

type SubjectFormProps = {
  type: 'create' | 'update';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
};

const SubjectForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: SubjectFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: data,
  });

  const router = useRouter();

  const subjectAction = type === 'create' ? createSubject : updateSubject;

  const [state, formAction, isPending] = useActionState(subjectAction, {
    success: false,
    error: false,
  });

  const onSubmit = (data: SubjectSchema) => {
    if (data) {
      startTransition(() => formAction(data));
    } else {
      console.error('Form data is null or undefined');
    }
  };

  useEffect(() => {
    if (state.success) {
      toast(`Subject has been ${type === 'create' ? 'created' : 'updated'}`);
      setOpen(false);

      router.refresh();
    }
  }, [router, setOpen, state, type]);
  const { teachers } = relatedData;

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Subject' : 'Update Subject'}
      </h1>

      <div className='flex flex-wrap justify-between gap-4'>
        <InputField
          type='text'
          register={register}
          label='subject name'
          name='name'
          error={errors?.name}
          defaultValue={data?.name}
        />

        {data && (
          <InputField
            type='text'
            register={register}
            label='Id'
            name='id'
            error={errors?.id}
            defaultValue={data?.id}
            hidden
          />
        )}

        <div className='flex w-full flex-col gap-2 md:w-1/4'>
          <label htmlFor='username' className='text-xs text-gray-500'>
            Teachers
          </label>
          <select
            multiple
            className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
            {...register('teachers')}
            defaultValue={data?.teachers}
          >
            {teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name + '' + teacher.surname}
                </option>
              )
            )}
          </select>
          {errors.teachers?.message && (
            <p className='text-xs text-red-400'>
              {errors.teachers?.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state.error && (
        <span className='text-red-500'>Something went wrong!</span>
      )}
      <button className='rounded-md bg-blue-400 p-2 text-white'>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default SubjectForm;
