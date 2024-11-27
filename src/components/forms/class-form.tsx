// 'use client';

// import { createClass, updateClass } from '@/actions/class-actions';
// import { useZodForm } from '@/hooks/use-zod-form';
// import { classSchema, ClassSchema } from '@/lib/form-validation-schemas';
// import { useRouter } from 'next/navigation';
// import {
//   Dispatch,
//   SetStateAction,
//   startTransition,
//   useActionState,
//   useEffect,
// } from 'react';
// import { toast } from 'react-toastify';
// import InputField from '../input-field';

// type ClassFormProps = {
//   type: 'create' | 'update';
//   data?: any;
//   setOpen: Dispatch<SetStateAction<boolean>>;
//   relatedData?: any;
// };

// const ClassForm = ({ type, data, setOpen, relatedData }: ClassFormProps) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useZodForm({
//     schema: classSchema,
//     mode: 'onChange',
//     defaultValues: data,
//   });

//   const router = useRouter();

//   const classAction = type === 'create' ? createClass : updateClass;

//   const [state, formAction, isPending] = useActionState(classAction, {
//     success: false,
//     error: false,
//   });

//   const onSubmit = (data: ClassSchema) => {
//     if (data) {
//       startTransition(() => formAction(data));
//     } else {
//       console.error('Form data is null or undefined');
//     }
//   };

//   useEffect(() => {
//     if (state.success) {
//       toast(`Class has been ${type === 'create' ? 'created' : 'updated'}`);
//       setOpen(false);

//       router.refresh();
//     }
//   }, [router, setOpen, state, type]);
//   const { teachers, grades } = relatedData;

//   return (
//     <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
//       <h1 className='text-xl font-semibold'>
//         {type === 'create' ? 'Create a new Class' : 'Update Class'}
//       </h1>

//       <div className='flex flex-wrap justify-between gap-4'>
//         <InputField
//           type='text'
//           register={register}
//           label='class name'
//           name='name'
//           error={errors?.name}
//           defaultValue={data?.name}
//         />
//         <InputField
//           type='number'
//           register={register}
//           label='capacity'
//           name='capacity'
//           error={errors?.capacity}
//           defaultValue={data?.capacity}
//         />

//         {data && (
//           <InputField
//             type='text'
//             register={register}
//             label='Id'
//             name='id'
//             error={errors?.id}
//             defaultValue={data?.id}
//             hidden
//           />
//         )}

//         <div className='flex w-full flex-col gap-2 md:w-1/4'>
//           <label htmlFor='username' className='text-xs text-gray-500'>
//             Supervisor
//           </label>
//           <select
//             className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
//             {...register('supervisorId')}
//             defaultValue={data?.teachers}
//           >
//             {teachers.map(
//               (teacher: { id: string; name: string; surname: string }) => (
//                 <option
//                   key={teacher.id}
//                   value={teacher.id}
//                   selected={data && teacher.id === data.supervisorId}
//                 >
//                   {teacher.name + '' + teacher.surname}
//                 </option>
//               )
//             )}
//           </select>
//           {errors.supervisorId?.message && (
//             <p className='text-xs text-red-400'>
//               {errors.supervisorId?.message.toString()}
//             </p>
//           )}
//         </div>
//         <div className='flex w-full flex-col gap-2 md:w-1/4'>
//           <label htmlFor='username' className='text-xs text-gray-500'>
//             Grade
//           </label>
//           <select
//             className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
//             {...register('gradeId')}
//             defaultValue={data?.gradeId}
//           >
//             {grades.map((grade: { id: string; level: string }) => (
//               <option
//                 key={grade.id}
//                 value={grade.id}
//                 selected={data && grade.id === data.gradeId}
//               >
//                 {grade.level}
//               </option>
//             ))}
//           </select>
//           {errors.gradeId?.message && (
//             <p className='text-xs text-red-400'>
//               {errors.gradeId?.message.toString()}
//             </p>
//           )}
//         </div>
//       </div>
//       {state.error && (
//         <span className='text-red-500'>Something went wrong!</span>
//       )}
//       <button className='rounded-md bg-blue-400 p-2 text-white'>
//         {type === 'create' ? 'Create' : 'Update'}
//       </button>
//     </form>
//   );
// };

// export default ClassForm;

'use client';

import { createClass, updateClass } from '@/actions/class-actions';
import { useZodForm } from '@/hooks/use-zod-form';
import { classSchema, ClassSchema } from '@/lib/form-validation-schemas';
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

type ClassFormProps = {
  type: 'create' | 'update';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
};

const ClassForm = ({ type, data, setOpen, relatedData }: ClassFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: classSchema,
    mode: 'onChange',
    defaultValues: data,
  });

  const router = useRouter();

  const classAction = type === 'create' ? createClass : updateClass;

  const [state, formAction, isPending] = useActionState(classAction, {
    success: false,
    error: false,
  });

  const onSubmit = (formData: ClassSchema) => {
    if (formData) {
      startTransition(() => formAction(formData));
    } else {
      console.error('Form data is null or undefined');
    }
  };

  useEffect(() => {
    if (state.success) {
      toast(`Class has been ${type === 'create' ? 'created' : 'updated'}`);
      setOpen(false);

      router.refresh();
    }
  }, [router, setOpen, state, type]);
  const { teachers, grades } = relatedData;

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Class' : 'Update Class'}
      </h1>

      <div className='flex flex-wrap justify-between gap-4'>
        <InputField
          type='text'
          register={register}
          label='class name'
          name='name'
          error={errors?.name}
          defaultValue={data?.name}
        />
        <InputField
          type='number'
          register={register}
          label='capacity'
          name='capacity'
          error={errors?.capacity}
          defaultValue={data?.capacity}
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
            Supervisor
          </label>
          <select
            className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
            {...register('supervisorId')}
            defaultValue={data?.teachers}
          >
            {teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option
                  key={teacher.id}
                  value={teacher.id}
                  // selected={data && teacher.id === data.supervisorId}
                >
                  {teacher.name + '' + teacher.surname}
                </option>
              )
            )}
          </select>
          {errors.supervisorId?.message && (
            <p className='text-xs text-red-400'>
              {errors.supervisorId?.message.toString()}
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
            defaultValue={data?.gradeId}
          >
            {grades.map((grade: { id: string; level: string }) => (
              <option
                key={grade.id}
                value={grade.id}
                // selected={data && grade.id === data.gradeId}
              >
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

export default ClassForm;
