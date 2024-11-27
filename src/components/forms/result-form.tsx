// 'use client';

// import { createResult, updateResult } from '@/actions/result-actions';
// import { useZodForm } from '@/hooks/use-zod-form';
// import { resultSchema, ResultSchema } from '@/schema/result-schema';
// import { useRouter } from 'next/navigation';
// import {
//   Dispatch,
//   SetStateAction,
//   startTransition,
//   useActionState,
//   useEffect,
//   useState,
// } from 'react';
// import { toast } from 'react-toastify';
// import InputField from '../input-field';

// type ResultFormProps = {
//   type: 'create' | 'update';
//   data?: any;
//   setOpen: Dispatch<SetStateAction<boolean>>;
//   relatedData?: any;
// };

// const ResultForm = ({ type, data, setOpen, relatedData }: ResultFormProps) => {
//   const [selectedType, setSelectedType] = useState<'exam' | 'assignment'>(
//     'exam'
//   );
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useZodForm({
//     schema: resultSchema,
//     mode: 'onChange',
//     defaultValues: data,
//   });
//   const router = useRouter();

//   const resultAction = type === 'create' ? createResult : updateResult;

//   const [state, formAction, isPending] = useActionState(resultAction, {
//     success: false,
//     error: false,
//   });

//   const onSubmit = (data: ResultSchema) => {
//     if (data) {
//       startTransition(() => formAction(data));
//     } else {
//       console.error('Form data is null or undefined');
//     }
//   };

//   useEffect(() => {
//     if (state.success) {
//       toast(`Result has been ${type === 'create' ? 'created' : 'updated'}`);
//       setOpen(false);

//       router.refresh();
//     }
//   }, [router, setOpen, state, type]);
//   const { exams, assignments, examsAssignment, students } = relatedData;
//   // Filter exams or assignments based on selected type
//   const filteredAssignments = selectedType === 'exam' ? exams : assignments;

//   return (
//     <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
//       <h1 className='text-xl font-semibold'>
//         {type === 'create' ? 'Create a new Result' : 'Update Result'}
//       </h1>

//       <div className='flex flex-wrap justify-between gap-4'>
//         <InputField
//           type='number'
//           register={register}
//           label='result score'
//           name='score'
//           error={errors?.score}
//           defaultValue={data?.score}
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
//           <label className='text-xs text-gray-500'>
//             {selectedType === 'exam' ? 'Exams' : 'Assignments'}
//           </label>
//           <select
//             className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
//             {...register('assignmentId')}
//             defaultValue={data?.title}
//           >
//             <option value=''>Select {selectedType}</option>
//             {filteredAssignments.map((item: { id: string; title: string }) => (
//               <option key={item.id} value={item.id}>
//                 {item.title}
//               </option>
//             ))}
//           </select>
//           {errors.assignmentId?.message && (
//             <p className='text-xs text-red-400'>
//               {errors.assignmentId?.message.toString()}
//             </p>
//           )}
//         </div>

//         <div className='flex w-full flex-col gap-2 md:w-1/4'>
//           <label htmlFor='username' className='text-xs text-gray-500'>
//             student
//           </label>
//           <select
//             className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
//             {...register('studentId')}
//             defaultValue={data?.studentId}
//           >
//             {students.map(
//               (student: { id: string; name: string; surname: string }) => (
//                 <option key={student.id} value={student.id}>
//                   {student.name + '  ' + student.surname}
//                 </option>
//               )
//             )}
//           </select>
//           {errors.studentId?.message && (
//             <p className='text-xs text-red-400'>
//               {errors.studentId?.message.toString()}
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

// export default ResultForm;

'use client';

import { createResult, updateResult } from '@/actions/result-actions';
import { useZodForm } from '@/hooks/use-zod-form';
import { resultSchema, ResultSchema } from '@/schema/result-schema';
import { Result } from '@prisma/client';
import { useRouter } from 'next/navigation';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import InputField from '../input-field';

type ResultFormProps = {
  type: 'create' | 'update';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
};

const ResultForm = ({ type, data, setOpen, relatedData }: ResultFormProps) => {
  const [selectedType, setSelectedType] = useState<'exam' | 'assignment'>(
    data?.type || 'exam'
  );
  const [res, setRes] = useState(data);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useZodForm({
    schema: resultSchema,
    mode: 'onChange',
    defaultValues: {
      ...res,
      resType: selectedType,
    },
  });
  const { exams, assignments, students, results } = relatedData;
  const router = useRouter();

  const resultAction = type === 'create' ? createResult : updateResult;

  const [state, formAction, isPending] = useActionState(resultAction, {
    success: false,
    error: false,
  });

  const filteredRes = results.filter((res: Result) => res.id === data.id)[0];
  useEffect(() => {
    if (res.examId === '') {
      setSelectedType('assignment');
      setValue('resType', 'assignment');
      setValue('assignmentId', res.assignmentId);
      setValue('examId', '');
    } else if (res.assignmentId === '') {
      setSelectedType('exam');
      setValue('resType', 'exam');
      setValue('examId', res.examId);
      setValue('assignmentId', '');
    }
  }, [res.assignmentId, res.examId, setValue]);

  const onSubmit = (data: ResultSchema) => {
    if (data) {
      startTransition(() =>
        formAction({
          ...data,
          resType: selectedType,
        })
      );
    } else {
      console.error('Form data is null or undefined');
    }
  };

  useEffect(() => {
    if (state.success) {
      toast(`Result has been ${type === 'create' ? 'created' : 'updated'}`);
      setOpen(false);

      router.refresh();
    }
  }, [router, setOpen, state, type]);

  // Filter exams or assignments based on selected type
  const filteredAssignments = selectedType === 'exam' ? exams : assignments;

  // const typeDefaultValue = selectedType === 'exam' ? examId : assignmentId;

  const handleSelectType = (e: ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as 'exam' | 'assignment';
    setSelectedType(newType);
    // Reset the assignment/exam selection when type changes
    if (newType === 'assignment') {
      setValue('assignmentId', filteredRes.assignmentId);
      setValue('examId', '');
      // setValue('type', 'assignment');
    } else if (newType === 'exam') {
      setValue('examId', filteredRes.examId);
      setValue('assignmentId', '');
      // setValue('type', 'exam');
    }
    setRes(filteredRes);
    setValue('resType', newType);
  };

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Result' : 'Update Result'}
      </h1>

      <div className='flex flex-wrap justify-between gap-4'>
        {/* Type Selection */}
        <div className='flex w-full flex-col gap-2 md:w-1/4'>
          <label className='text-xs text-gray-500'>Select Type</label>
          <select
            className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
            // {...register('type')}
            defaultValue={selectedType === 'exam' ? 'exam' : 'assignment'}
            onChange={(e) => handleSelectType(e)}
          >
            <option value='exam'>Exam</option>
            <option value='assignment'>Assignment</option>
          </select>
        </div>

        <InputField
          type='number'
          register={register}
          label='result score'
          name='score'
          error={errors?.score}
          defaultValue={data?.score}
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

        <input
          type='hidden'
          {...register('resType')}
          defaultValue={selectedType}
        />

        {/* Dynamic Exam/Assignment Selection */}
        <div className='flex w-full flex-col gap-2 md:w-1/4'>
          <label className='text-xs text-gray-500'>
            {selectedType === 'exam' ? 'Exams' : 'Assignments'}
          </label>
          <select
            {...register(selectedType === 'exam' ? 'examId' : 'assignmentId')}
            className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
            defaultValue={
              data?.[selectedType === 'exam' ? 'examId' : 'assignmentId']
            }
          >
            <option value=''>Select {selectedType}</option>
            {filteredAssignments.map((item: { id: string; title: string }) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          {errors.assignmentId?.message && (
            <p className='text-xs text-red-400'>
              {errors.assignmentId?.message.toString()}
            </p>
          )}
        </div>

        <div className='flex w-full flex-col gap-2 md:w-1/4'>
          <label className='text-xs text-gray-500'>student</label>
          <select
            className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
            {...register('studentId')}
            defaultValue={data?.studentId}
          >
            {students.map(
              (student: { id: string; name: string; surname: string }) => (
                <option key={student.id} value={student.id}>
                  {student.name + '  ' + student.surname}
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

export default ResultForm;
