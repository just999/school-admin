'use client';

import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
} from 'react';

import { deleteAnnouncement } from '@/actions/announcement-actions';
import { deleteAssignment } from '@/actions/assignment-actions';
import { deleteAttendance } from '@/actions/attendance-actions';
import { deleteClass } from '@/actions/class-actions';
import { deleteEvent } from '@/actions/event-actions';
import { deleteExam } from '@/actions/exam-actions';
import { deleteLesson } from '@/actions/lesson-actions';
import { deleteParent } from '@/actions/parent-actions';
import { deleteResult } from '@/actions/result-actions';
import { deleteStudent } from '@/actions/student-actions';
import { deleteSubject } from '@/actions/subject-actions';
import { deleteTeacher } from '@/actions/teacher-actions';
import { FormModalProps } from '@/types';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  parent: deleteParent,
  lesson: deleteLesson,
  exam: deleteExam,
  assignment: deleteAssignment,
  result: deleteResult,
  announcement: deleteAnnouncement,
  attendance: deleteAttendance,
  event: deleteEvent,
};

const TeacherForm = dynamic(() => import('./forms/teacher-form'), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import('./forms/student-form'), {
  loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import('./forms/parent-form'), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import('./forms/subject-form'), {
  loading: () => <h1>Loading...</h1>,
});
const LessonForm = dynamic(() => import('./forms/lesson-form'), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import('./forms/class-form'), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import('./forms/exam-form'), {
  loading: () => <h1>Loading...</h1>,
});
const AssignmentForm = dynamic(() => import('./forms/assignment-form'), {
  loading: () => <h1>Loading...</h1>,
});
const ResultForm = dynamic(() => import('./forms/result-form'), {
  loading: () => <h1>Loading...</h1>,
});
const AnnouncementForm = dynamic(() => import('./forms/announcement-form'), {
  loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import('./forms/event-form'), {
  loading: () => <h1>Loading...</h1>,
});
const AttendanceForm = dynamic(() => import('./forms/attendance-form'), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: 'create' | 'update',
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  subject: (setOpen, type, data, relatedData) => (
    <SubjectForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  lesson: (setOpen, type, data, relatedData) => (
    <LessonForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  class: (setOpen, type, data, relatedData) => (
    <ClassForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  teacher: (setOpen, type, data, relatedData) => (
    <TeacherForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  student: (setOpen, type, data, relatedData) => (
    <StudentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  parent: (setOpen, type, data, relatedData) => (
    <ParentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  exam: (setOpen, type, data, relatedData) => (
    <ExamForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  assignment: (setOpen, type, data, relatedData) => (
    <AssignmentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  result: (setOpen, type, data, relatedData) => (
    <ResultForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  announcement: (setOpen, type, data, relatedData) => (
    <AnnouncementForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  event: (setOpen, type, data, relatedData) => (
    <EventForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  attendance: (setOpen, type, data, relatedData) => (
    <AttendanceForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  // clerkId,
  relatedData,
}: FormModalProps & { relatedData?: any }) => {
  const [open, setOpen] = useState<boolean>(false);

  const Form = () => {
    const [state, formAction] = useActionState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted`);
        setOpen(false);

        router.refresh();
      }
    }, [router, state]);

    return type === 'delete' && id ? (
      <form action={formAction} className='flex flex-col gap-4 p-4'>
        <input type='text' name='id' defaultValue={id} hidden />
        <span className='text-center font-medium'>
          All data will be lost, are u sure?
        </span>
        <button className='w-max self-center rounded-md border-none bg-red-700 px-4 py-2 text-white'>
          delete
        </button>
      </form>
    ) : type === 'create' || type === 'update' ? (
      forms[table](setOpen, type, data, relatedData)
    ) : (
      'Form not found'
    );
  };

  const handleToggleModal = (data: any) => {
    setOpen(true);
  };

  const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7';
  const bgColor =
    type === 'create'
      ? 'bg-babyYellow'
      : type === 'update'
        ? 'bg-babyBlue'
        : 'bg-babyPurple';

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => handleToggleModal(data)}
      >
        <Image
          src={`/icons/${type}.png`}
          alt={`${type}.png`}
          width={16}
          height={16}
        />
      </button>
      {open && (
        <div className='absolute left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60'>
          <div className='relative w-[90%] rounded-md bg-white p-4 md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]'>
            <Form />
            <div
              className='absolute right-4 top-4 cursor-pointer'
              onClick={() => setOpen(false)}
            >
              <Image
                src='/icons/close.png'
                alt='close'
                width={14}
                height={14}
              />{' '}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
