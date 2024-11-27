'use client';

import { useZodForm } from '@/hooks/use-zod-form';

import {
  createAttendance,
  updateAttendance,
} from '@/actions/attendance-actions';
import { AttendanceSchema, attendanceSchema } from '@/schema/attendance-schema';
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

type AttendanceFormProps = {
  type: 'create' | 'update';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
};

const AttendanceForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: AttendanceFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useZodForm({
    schema: attendanceSchema,
    mode: 'onChange',
    defaultValues: data,
  });

  const present = watch('present');

  const router = useRouter();

  const attendanceAction =
    type === 'create' ? createAttendance : updateAttendance;

  const [state, formAction, isPending] = useActionState(attendanceAction, {
    success: false,
    error: false,
  });

  const onSubmit = (data: AttendanceSchema) => {
    if (data) {
      startTransition(() => formAction(data));
    } else {
      console.error('Form data is null or undefined');
    }
  };

  useEffect(() => {
    if (state.success) {
      toast(`Attendance has been ${type === 'create' ? 'created' : 'updated'}`);
      setOpen(false);

      router.refresh();
    }
  }, [router, setOpen, state, type]);
  const { students, lessons } = relatedData;

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Attendance' : 'Update Attendance'}
      </h1>

      <div className='flex flex-wrap justify-between gap-4'>
        <InputField
          type='date'
          register={register}
          label='attendance date'
          name='date'
          error={errors?.date}
          defaultValue={data?.date}
        />
        <div className='flex flex-col items-center justify-center'>
          <InputField
            type='checkbox'
            register={register}
            label='present'
            name='present'
            error={errors?.present}
            // defaultValue={data?.present}
          />
          <p>{present ? 'present' : 'absent'} </p>
        </div>
        {/* <InputField
          type='date'
          register={register}
          label='Date'
          name='date'
          error={errors?.date}
          defaultValue={data?.date}
        /> */}

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
            students
          </label>
          <select
            className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
            {...register('studentId')}
            defaultValue={data?.studentId}
          >
            {students.map(
              (cl: { id: string; name: string; description: string }) => (
                <option key={cl.id} value={cl.id}>
                  {cl.name}
                </option>
              )
            )}
          </select>
          {errors.studentId?.message && (
            <p className='text-xs text-red-400'>
              {errors.studentId?.message.toString()}
            </p>
          )}
        </div>

        <div className='flex w-full flex-col gap-2 md:w-1/4'>
          <label htmlFor='username' className='text-xs text-gray-500'>
            lessons
          </label>
          <select
            className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
            {...register('lessonId')}
            defaultValue={data?.lessonId}
          >
            {lessons.map(
              (cl: { id: string; name: string; description: string }) => (
                <option key={cl.id} value={cl.id}>
                  {cl.name}
                </option>
              )
            )}
          </select>
          {errors.lessonId?.message && (
            <p className='text-xs text-red-400'>
              {errors.lessonId?.message.toString()}
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
      <pre>{JSON.stringify(watch(), null, 2)}</pre>
    </form>
  );
};

export default AttendanceForm;
