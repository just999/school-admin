'use client';

import Image from 'next/image';

import { createStudent, updateStudent } from '@/actions/student-actions';
import { useZodForm } from '@/hooks/use-zod-form';
import { StudentSchema, studentSchema } from '@/lib/form-validation-schemas';
import { CldUploadWidget } from 'next-cloudinary';
import { useRouter } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import InputField from '../input-field';

type StudentFormProps = {
  type: 'create' | 'update';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData: any;
};

interface StudentFormState {
  success: boolean;
  error: boolean;
  message?: string;
  fieldErrors?: {
    [key: string]: string[];
  };
}

const initialState: StudentFormState = {
  success: false,
  error: false,
  message: '',
  fieldErrors: {},
};

const StudentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: StudentFormProps) => {
  const [img, setImg] = useState<any>();
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useZodForm({
    schema: studentSchema,
    mode: 'onChange',
    defaultValues: data,
  });

  const router = useRouter();

  const studentAction = type === 'create' ? createStudent : updateStudent;

  const [state, formAction, isPending] = useActionState<
    StudentFormState,
    StudentSchema
  >(studentAction, initialState);
  useEffect(() => {
    if (state.success) {
      toast(`Student has been ${type === 'create' ? 'created' : 'updated'}`);
      setOpen(false);

      router.refresh();
    }

    if (state.error) {
      toast.error(state.message || 'Something went wrong');
      setMessage(state.message || 'Error');

      // If you have field-specific errors, you can handle them here
      if (state.fieldErrors) {
        Object.entries(state.fieldErrors).forEach(([field, errors]) => {
          errors.forEach((error) => {
            toast.error(`${field}: ${error}`);
          });
        });
      }
    }
  }, [router, setOpen, state, type]);
  const onSubmit = (data: StudentSchema) => {
    if (data) {
      startTransition(() => formAction({ ...data, img: img?.secure_url }));
    } else {
      console.error('Form data is null or undefined');
    }
  };

  const { grades, classes } = relatedData;
  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Student' : 'Update Student'}
      </h1>
      <span className='text-xs text-gray-400'>Authentication Information</span>
      {/* <div className='flex w-full flex-col gap-2 md:w-1/4'>
        <label htmlFor='username' className='text-xs'>
          Username
        </label>
        <input
          type='text'
          {...register('username')}
          className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
        />
        {errors.username?.message && (
          <p className='text-xs text-red-400'>
            {errors.username?.message.toString()}
          </p>
        )}
      </div> */}
      <div className='flex flex-wrap justify-between gap-4'>
        <InputField
          type='text'
          register={register}
          label='username'
          name='username'
          error={errors?.username}
          defaultValue={data?.username}
        />
        <InputField
          type='email'
          register={register}
          label='Email'
          name='email'
          error={errors?.email}
          defaultValue={data?.email}
        />
        <InputField
          type='password'
          register={register}
          label='Password'
          name='password'
          error={errors?.password}
          defaultValue={data?.password}
        />
      </div>
      <span className='text-xs font-medium text-gray-400'>
        Personal Information
      </span>
      <CldUploadWidget
        uploadPreset='agenliga'
        onSuccess={(result, { widget }) => {
          setImg(result.info);
          widget.close();
        }}
      >
        {({ open }) => {
          return (
            <div
              className='flex cursor-pointer items-center gap-2 text-xs text-gray-500'
              onClick={() => open()}
            >
              <Image
                src='/icons/upload.png'
                alt='upload'
                width={28}
                height={28}
              />
              <span>Upload a photo</span>
            </div>
          );
        }}
      </CldUploadWidget>
      <div className='flex flex-wrap justify-between gap-4'>
        <InputField
          type='text'
          register={register}
          label='Name'
          name='name'
          error={errors?.name}
          defaultValue={data?.name}
        />
        <InputField
          type='text'
          register={register}
          label='Surname'
          name='surname'
          error={errors?.surname}
          defaultValue={data?.surname}
        />
        <InputField
          type='text'
          register={register}
          label='Phone'
          name='phone'
          error={errors?.phone}
          defaultValue={data?.phone}
        />
        <InputField
          type='text'
          register={register}
          label='Address'
          name='address'
          error={errors?.address}
          defaultValue={data?.address}
        />
        <InputField
          type='text'
          register={register}
          label='BloodType'
          name='bloodType'
          error={errors?.bloodType}
          defaultValue={data?.bloodType}
        />
        <InputField
          type='date'
          register={register}
          label='Birthday'
          name='birthday'
          error={errors?.birthday}
          defaultValue={data?.birthday.toISOString().split('T')[0]}
        />
        <InputField
          type='text'
          register={register}
          label='Parent id'
          name='parentId'
          error={errors?.parentId}
          defaultValue={data?.parentId}
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
            Sex
          </label>
          <select
            className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
            {...register('sex')}
            defaultValue={data?.sex}
          >
            <option value='MALE'>Male</option>
            <option value='FEMALE'>Female</option>
          </select>
          {errors.sex?.message && (
            <p className='text-xs text-red-400'>
              {errors.sex?.message.toString()}
            </p>
          )}
        </div>
        <div className='flex w-full flex-col gap-2 md:w-1/4'>
          <label htmlFor='username' className='text-xs text-gray-500'>
            Grade
          </label>
          <select
            className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
            {...register('gradeId')}
            defaultValue={data?.subjects}
          >
            {grades.map((grade: { id: string; level: number }) => (
              <option key={grade.id} value={grade.id}>
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className='text-xs text-red-400'>
              {errors.gradeId?.message.toString()}
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

        {/* <div className='flex w-full flex-col justify-center gap-2 md:w-1/4'>
          <label
            htmlFor='img'
            className='flex cursor-pointer items-center gap-2 text-xs text-gray-500'
          >
            <Image
              src='/icons/upload.png'
              alt='upload'
              width={28}
              height={28}
            />
            <span>Upload a photo</span>
          </label>
          <input type='file' id='img' {...register('img')} className='hidden' />
          {errors.img?.message && (
            <p className='text-xs text-red-400'>
              {errors.img?.message.toString()}
            </p>
          )}
        </div> */}
      </div>
      {/* 
       {state.error && (
        <span className='text-red-500'>{errors.subjects?.message}</span>
      )} */}
      {message && <span className='text-green-500'>{message}</span>}

      <button
        type='submit'
        disabled={isPending}
        className='rounded-md bg-blue-400 p-2 text-white'
      >
        {isPending && type === 'create'
          ? 'creating...'
          : isPending && type === 'update'
            ? 'updating...'
            : type === 'create'
              ? 'create student'
              : 'update student'}
      </button>

      {state.error && state.message && (
        <div className='mt-2 text-sm text-red-500'>{state.message}</div>
      )}
    </form>
  );
};

export default StudentForm;
