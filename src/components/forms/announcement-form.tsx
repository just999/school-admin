'use client';

import { useZodForm } from '@/hooks/use-zod-form';

import {
  createAnnouncement,
  updateAnnouncement,
} from '@/actions/announcement-actions';
import {
  AnnouncementSchema,
  announcementSchema,
} from '@/schema/announcement-schema';
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

type AnnouncementFormProps = {
  type: 'create' | 'update';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
};

const AnnouncementForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: AnnouncementFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: announcementSchema,
    mode: 'onChange',
    defaultValues: data,
  });

  const router = useRouter();

  const announcementAction =
    type === 'create' ? createAnnouncement : updateAnnouncement;

  const [state, formAction, isPending] = useActionState(announcementAction, {
    success: false,
    error: false,
  });

  const onSubmit = (data: AnnouncementSchema) => {
    if (data) {
      startTransition(() => formAction(data));
    } else {
      console.error('Form data is null or undefined');
    }
  };

  useEffect(() => {
    if (state.success) {
      toast(
        `Announcement has been ${type === 'create' ? 'created' : 'updated'}`
      );
      setOpen(false);

      router.refresh();
    }
  }, [router, setOpen, state, type]);
  const { classes } = relatedData;

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create'
          ? 'Create a new Announcement'
          : 'Update Announcement'}
      </h1>

      <div className='flex flex-wrap justify-between gap-4'>
        <InputField
          type='text'
          register={register}
          label='announcement title'
          name='title'
          error={errors?.title}
          defaultValue={data?.title}
        />
        <InputField
          type='text'
          register={register}
          label='description'
          name='description'
          error={errors?.description}
          defaultValue={data?.description}
        />
        <InputField
          type='date'
          register={register}
          label='Date'
          name='date'
          error={errors?.date}
          defaultValue={data?.date}
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
            Class
          </label>
          <select
            className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
            {...register('classId')}
            defaultValue={data?.classId}
          >
            {classes.map(
              (cl: { id: string; name: string; description: string }) => (
                <option key={cl.id} value={cl.id}>
                  {cl.name}
                </option>
              )
            )}
          </select>
          {errors.classId?.message && (
            <p className='text-xs text-red-400'>
              {errors.classId?.message.toString()}
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

export default AnnouncementForm;
