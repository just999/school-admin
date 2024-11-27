import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';
import { FormModalProps } from '@/types';
import FormModal from './form-modal';

const FormContainer = async ({
  table,
  type,
  data,
  id,
  // clerkId,
}: FormModalProps) => {
  let relatedData = {};

  const { userId, role } = await getUserRoleAndId();
  let newTeacherId: any = undefined;
  if (role === 'teacher') {
    const teachers = await db.teacher.findMany({
      select: { id: true, name: true, surname: true, teacherClerkId: true },
    });
    newTeacherId = teachers.filter((t) => t.teacherClerkId === userId)[0].id;
  }

  if (type !== 'delete') {
    switch (table) {
      case 'subject':
        const subjectTeachers = await db.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;

      case 'class':
        const classGrades = await db.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await db.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: classTeachers, grades: classGrades };
        break;

      case 'teacher':
        const teacherSubjects = await db.subject.findMany({
          select: { id: true, name: true },
        });

        relatedData = { subjects: teacherSubjects };
        break;

      case 'student':
        const studentGrades = await db.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClass = await db.class.findMany({
          include: { _count: { select: { students: true } } },
        });

        relatedData = { grades: studentGrades, classes: studentClass };
        break;

      case 'parent':
        const parentStudents = await db.student.findMany({
          select: { id: true, name: true, surname: true },
        });

        relatedData = { students: parentStudents };
        break;

      case 'exam':
        const examLessons = await db.lesson.findMany({
          where: {
            ...(role === 'teacher' ? { teacherId: newTeacherId } : {}),
          },
          select: { id: true, name: true },
        });

        relatedData = { lessons: examLessons };
        break;

      case 'assignment':
        const assignmentLessons = await db.lesson.findMany({
          where: {
            ...(role === 'teacher' ? { teacherId: newTeacherId } : {}),
          },
          select: { id: true, name: true },
        });

        relatedData = { lessons: assignmentLessons };
        break;

      case 'lesson':
        const lessonSubject = await db.subject.findMany({
          select: { id: true, name: true },
        });
        const lessonClasses = await db.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        const lessonTeachers = await db.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = {
          subjects: lessonSubject,
          classes: lessonClasses,
          teachers: lessonTeachers,
        };
        break;

      case 'result':
        const results = await db.result.findMany({
          include: {
            student: { select: { name: true, surname: true } },
            exam: {
              include: {
                lesson: {
                  select: {
                    class: { select: { name: true } },
                    teacher: { select: { name: true, surname: true } },
                  },
                },
              },
            },
            assignment: {
              include: {
                lesson: {
                  select: {
                    class: { select: { name: true } },
                    teacher: { select: { name: true, surname: true } },
                  },
                },
              },
            },
          },
        });

        const resultExams = await db.exam.findMany({
          select: { id: true, title: true, lessonId: true },
        });
        const resultAssignments = await db.assignment.findMany({
          select: { id: true, title: true, lessonId: true },
        });

        const resultExamsAssignment = [...resultAssignments, ...resultExams];

        const resultStudents = await db.student.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = {
          exams: resultExams,
          assignments: resultAssignments,
          examsAssignment: resultExamsAssignment,
          students: resultStudents,
          results: results,
        };
        break;

      case 'announcement':
        const announcementClasses = await db.class.findMany({
          where: {
            ...(role === 'teacher' ? { supervisorId: newTeacherId } : {}),
          },
          select: { id: true, name: true, supervisorId: true },
        });
        relatedData = { classes: announcementClasses };
        break;

      case 'attendance':
        const attendanceStudents = await db.student.findMany({
          select: { id: true, name: true, surname: true },
        });
        const attendanceLessons = await db.lesson.findMany({
          where: {
            ...(role === 'teacher' ? { teacherId: newTeacherId } : {}),
          },
          select: { id: true, name: true },
        });

        relatedData = {
          students: attendanceStudents,
          lessons: attendanceLessons,
        };
        break;

      case 'event':
        const eventClasses = await db.class.findMany({
          where: {
            ...(role === 'teacher' ? { supervisorId: newTeacherId } : {}),
          },
          select: { id: true, name: true, supervisorId: true },
        });
        relatedData = { classes: eventClasses };
        break;

      default:
        break;
    }
  }

  return (
    <div>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        // clerkId={clerkId}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
