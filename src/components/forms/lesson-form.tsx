'use client';

import { useZodForm } from '@/hooks/use-zod-form';

import { createLesson, updateLesson } from '@/actions/lesson-actions';
import { weekDay } from '@/lib/helper';
import { lessonSchema, LessonSchema } from '@/schema/lesson-schema';
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

type LessonFormProps = {
  type: 'create' | 'update';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
};

type LessonInitialState = {
  success: boolean;
  error: boolean;
  message: '' | undefined;
  fieldErrors?: {
    [key: string]: string[];
  };
};

const initialState: LessonInitialState = {
  success: false,
  error: false,
  message: undefined,
  fieldErrors: {},
};

const LessonForm = ({ type, data, setOpen, relatedData }: LessonFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: lessonSchema,
    mode: 'onChange',
    defaultValues: data,
  });

  const router = useRouter();

  const lessonAction = type === 'create' ? createLesson : updateLesson;

  const [state, formAction, isPending] = useActionState(
    lessonAction,
    initialState
  );

  const onSubmit = (data: LessonSchema) => {
    if (data) {
      startTransition(() => formAction(data));
    } else {
      console.error('Form data is null or undefined');
    }
  };

  useEffect(() => {
    if (state.success) {
      toast(`Lesson has been ${type === 'create' ? 'created' : 'updated'}`);
      setOpen(false);

      router.refresh();
    }
  }, [router, setOpen, state, type]);
  const { subjects, classes, teachers } = relatedData;

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Lesson' : 'Update Lesson'}
      </h1>

      <div className='flex flex-wrap justify-between gap-4'>
        <InputField
          type='text'
          register={register}
          label='lesson name'
          name='name'
          error={errors?.name}
          defaultValue={data?.name}
        />
        <div className='flex w-full flex-col gap-2 md:w-1/4'>
          <label htmlFor='day' className='text-xs text-gray-500'>
            Day
          </label>
          <select
            className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
            {...register('day')}
            defaultValue={data?.day}
          >
            {weekDay.map((day: { name: string; value: string }) => (
              <option key={day.name} value={day.value}>
                {day.name}
              </option>
            ))}
          </select>
          {errors.day?.message && (
            <p className='text-xs text-red-400'>
              {errors.day?.message.toString()}
            </p>
          )}
        </div>
        <InputField
          type='datetime-local'
          register={register}
          label='Start Time'
          name='startTime'
          error={errors?.startTime}
          defaultValue={data?.startTime}
        />
        <InputField
          type='datetime-local'
          register={register}
          label='end time'
          name='endTime'
          error={errors?.endTime}
          defaultValue={data?.endTime}
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
            Subjects
          </label>
          <select
            className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
            {...register('subjectId')}
            defaultValue={data?.subjects}
          >
            {subjects.map((subject: { id: string; name: string }) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjectId?.message && (
            <p className='text-xs text-red-400'>
              {errors.subjectId?.message.toString()}
            </p>
          )}
        </div>
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
              (classItem: {
                id: string;
                name: string;
                capacity: number;
                _count: { students: number };
              }) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name} -{' '}
                  {classItem._count.students + '/' + classItem.capacity}{' '}
                  capacity
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

        <div className='flex w-full flex-col gap-2 md:w-1/4'>
          <label htmlFor='username' className='text-xs text-gray-500'>
            Teacher
          </label>
          <select
            className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
            {...register('teacherId')}
            defaultValue={data?.teachers}
          >
            {teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option
                  key={teacher.id}
                  value={teacher.id}
                  // selected={data && teacher.id === data.teacherId}
                >
                  {teacher.name + '' + teacher.surname}
                </option>
              )
            )}
          </select>
          {errors.teacherId?.message && (
            <p className='text-xs text-red-400'>
              {errors.teacherId?.message.toString()}
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

export default LessonForm;
