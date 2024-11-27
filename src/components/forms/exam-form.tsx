'use client';

import { createExam, updateExam } from '@/actions/exam-actions';

import { useZodForm } from '@/hooks/use-zod-form';
import { ExamSchema, examSchema } from '@/schema/exam-schema';
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

type ExamFormProps = {
  type: 'create' | 'update';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
};

const ExamForm = ({ type, data, setOpen, relatedData }: ExamFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: examSchema,
    mode: 'onChange',
    defaultValues: data,
  });

  const router = useRouter();

  const examAction = type === 'create' ? createExam : updateExam;

  const [state, formAction, isPending] = useActionState(examAction, {
    success: false,
    error: false,
  });

  const onSubmit = (data: ExamSchema) => {
    if (data) {
      startTransition(() => formAction(data));
    } else {
      console.error('Form data is null or undefined');
    }
  };

  useEffect(() => {
    if (state.success) {
      toast(`Exam has been ${type === 'create' ? 'created' : 'updated'}`);
      setOpen(false);

      router.refresh();
    }
  }, [router, setOpen, state, type]);
  const { lessons } = relatedData;

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Exam' : 'Update Exam'}
      </h1>

      <div className='flex flex-wrap justify-between gap-4'>
        <InputField
          type='text'
          register={register}
          label='exam title'
          name='title'
          error={errors?.title}
          defaultValue={data?.title}
        />
        <InputField
          type='datetime-local'
          register={register}
          label='Start Date'
          name='startTime'
          error={errors?.startTime}
          defaultValue={data?.startTime}
        />
        <InputField
          type='datetime-local'
          register={register}
          label='End Date'
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
            Lesson
          </label>
          <select
            className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
            {...register('lessonId')}
            defaultValue={data?.teachers}
          >
            {lessons.map((lesson: { id: string; name: string }) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.name}
              </option>
            ))}
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
    </form>
  );
};

export default ExamForm;
