'use client';

import { createTeacher, updateTeacher } from '@/actions/teacher-actions';
import { useZodForm } from '@/hooks/use-zod-form';
import { TeacherSchema, teacherSchema } from '@/lib/form-validation-schemas';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
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

type TeacherFormProps = {
  type: 'create' | 'update';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData: any;
};

interface TeacherFormState {
  success: boolean;
  error: boolean;
  message?: string;
  fieldErrors?: {
    [key: string]: string[];
  };
}

const initialState: TeacherFormState = {
  success: false,
  error: false,
  message: '',
  fieldErrors: {},
};

const TeacherForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: TeacherFormProps) => {
  const [img, setImg] = useState<any>();
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useZodForm({
    schema: teacherSchema,
    mode: 'onChange',
    defaultValues: data,
  });

  const router = useRouter();

  const teacherAction = type === 'create' ? createTeacher : updateTeacher;

  const [state, formAction, isPending] = useActionState<
    TeacherFormState,
    TeacherSchema
  >(teacherAction, initialState);
  useEffect(() => {
    if (state.success) {
      toast(`Teacher has been ${type === 'create' ? 'created' : 'updated'}`);
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
  const onSubmit = (data: TeacherSchema) => {
    if (data) {
      startTransition(() => formAction({ ...data, img: img?.secure_url }));
    } else {
      console.error('Form data is null or undefined');
    }
  };

  const { subjects } = relatedData;

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Teacher' : 'Update Teacher'}
      </h1>
      <span className='text-xs text-gray-400'>Authentication Information</span>

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
          defaultValue={data?.birthday}
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
            Subjects
          </label>
          <select
            multiple
            className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
            {...register('subjects')}
            defaultValue={data?.subjects}
          >
            {subjects.map((subject: { id: string; name: string }) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjects?.message && (
            <p className='text-xs text-red-400'>
              {errors.subjects?.message.toString()}
            </p>
          )}
        </div>

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
        {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
      </div>

      {state.error && (
        <span className='text-red-500'>{errors.subjects?.message}</span>
      )}
      {message && <span className='text-green-500'>{message}</span>}
      <button
        type='submit'
        disabled={isPending}
        className='rounded-md bg-blue-400 p-2 text-white'
      >
        {/* {isPending ? (
          <>
           
            Creating...
          </>
        ) : (
          'Create Teacher'
        )} */}

        {isPending && type === 'create'
          ? 'creating...'
          : isPending && type === 'update'
            ? 'updating...'
            : type === 'create'
              ? 'create teacher'
              : 'update teacher'}
        {/* {`${type}${isPending ? 'ing...' : ' teacher'}`} */}
        {/* {isPending ? `${type}ing...` : `${type} teacher`} */}
        {/* {buttonText} */}
        {/* {`${type === 'update' ? 'updat' : type}${isPending ? 'ing...' : ' teacher'}`} */}
      </button>

      {state.error && state.message && (
        <div className='mt-2 text-sm text-red-500'>{state.message}</div>
      )}
    </form>
  );
};

export default TeacherForm;

// function teacherAction(state: {
//   success: boolean;
//   error: boolean;
//   message: string;
// }):
//   | { success: boolean; error: boolean; message: string }
//   | Promise<{ success: boolean; error: boolean; message: string }> {
//   throw new Error('Function not implemented.');
// }
