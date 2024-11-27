// import { db } from '@/lib/db';
// import { Day, PrismaClient, UserSex } from '@prisma/client';
// const prisma = new PrismaClient();

// async function main() {
//   // ADMIN
//   await prisma.admin.create({
//     data: {
//       // id: 'admin1',
//       username: 'admin1',
//     },
//   });
//   await prisma.admin.create({
//     data: {
//       // id: 'admin2',
//       username: 'admin2',
//     },
//   });

//   // GRADE
//   for (let i = 1; i <= 6; i++) {
//     await prisma.grade.create({
//       data: {
//         level: i,
//       },
//     });
//   }

//   // CLASS
//   for (let i = 1; i <= 6; i++) {
//     const res = async () => {
//       const grId = await db.grade.findMany();
//       return grId;
//     };

//     await prisma.class.create({
//       data: {
//         name: `${i}A`,
//         gradeId: i,
//         capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
//       },
//     });
//   }

//   // SUBJECT
//   const subjectData = [
//     { name: 'Mathematics' },
//     { name: 'Science' },
//     { name: 'English' },
//     { name: 'History' },
//     { name: 'Geography' },
//     { name: 'Physics' },
//     { name: 'Chemistry' },
//     { name: 'Biology' },
//     { name: 'Computer Science' },
//     { name: 'Art' },
//   ];

//   for (const subject of subjectData) {
//     await prisma.subject.create({ data: subject });
//   }

//   // TEACHER
//   for (let i = 1; i <= 15; i++) {
//     await prisma.teacher.create({
//       data: {
//         id: `teacher${i}`, // Unique ID for the teacher
//         username: `teacher${i}`,
//         name: `TName${i}`,
//         surname: `TSurname${i}`,
//         email: `teacher${i}@example.com`,
//         phone: `123-456-789${i}`,
//         address: `Address${i}`,
//         bloodType: 'A+',
//         sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
//         subjects: { connect: [{ id: (i % 10) + 1 }] },
//         classes: { connect: [{ id: (i % 6) + 1 }] },
//         birthday: new Date(
//           new Date().setFullYear(new Date().getFullYear() - 30)
//         ),
//       },
//     });
//   }

//   // LESSON
//   for (let i = 1; i <= 30; i++) {
//     await prisma.lesson.create({
//       data: {
//         name: `Lesson${i}`,
//         day: Day[
//           Object.keys(Day)[
//             Math.floor(Math.random() * Object.keys(Day).length)
//           ] as keyof typeof Day
//         ],
//         startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
//         endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
//         subjectId: (i % 10) + 1,
//         classId: (i % 6) + 1,
//         teacherId: `teacher${(i % 15) + 1}`,
//       },
//     });
//   }

//   // PARENT
//   for (let i = 1; i <= 25; i++) {
//     await prisma.parent.create({
//       data: {
//         id: `parentId${i}`,
//         username: `parentId${i}`,
//         name: `PName ${i}`,
//         surname: `PSurname ${i}`,
//         email: `parent${i}@example.com`,
//         phone: `123-456-789${i}`,
//         address: `Address${i}`,
//       },
//     });
//   }

//   // STUDENT
//   for (let i = 1; i <= 50; i++) {
//     await prisma.student.create({
//       data: {
//         id: `student${i}`,
//         username: `student${i}`,
//         name: `SName${i}`,
//         surname: `SSurname ${i}`,
//         email: `student${i}@example.com`,
//         phone: `987-654-321${i}`,
//         address: `Address${i}`,
//         bloodType: 'O-',
//         sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
//         parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`,
//         gradeId: (i % 6) + 1,
//         classId: (i % 6) + 1,
//         birthday: new Date(
//           new Date().setFullYear(new Date().getFullYear() - 10)
//         ),
//       },
//     });
//   }

//   // EXAM
//   for (let i = 1; i <= 10; i++) {
//     await prisma.exam.create({
//       data: {
//         title: `Exam ${i}`,
//         startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
//         endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
//         lessonId: (i % 30) + 1,
//       },
//     });
//   }

//   // ASSIGNMENT
//   for (let i = 1; i <= 10; i++) {
//     await prisma.assignment.create({
//       data: {
//         title: `Assignment ${i}`,
//         startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
//         dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
//         lessonId: (i % 30) + 1,
//       },
//     });
//   }

//   // RESULT
//   for (let i = 1; i <= 10; i++) {
//     await prisma.result.create({
//       data: {
//         score: 90,
//         studentId: `student${i}`,
//         ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }),
//       },
//     });
//   }

//   // ATTENDANCE
//   for (let i = 1; i <= 10; i++) {
//     await prisma.attendance.create({
//       data: {
//         date: new Date(),
//         present: true,
//         studentId: `student${i}`,
//         lessonId: (i % 30) + 1,
//       },
//     });
//   }

//   // EVENT
//   for (let i = 1; i <= 5; i++) {
//     await prisma.event.create({
//       data: {
//         title: `Event ${i}`,
//         description: `Description for Event ${i}`,
//         startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
//         endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
//         classId: (i % 5) + 1,
//       },
//     });
//   }

//   // ANNOUNCEMENT
//   for (let i = 1; i <= 5; i++) {
//     await prisma.announcement.create({
//       data: {
//         title: `Announcement ${i}`,
//         description: `Description for Announcement ${i}`,
//         date: new Date(),
//         classId: (i % 5) + 1,
//       },
//     });
//   }

//   console.log('Seeding completed successfully.');
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

import { Day, PrismaClient, UserSex } from '@prisma/client';

const prisma = new PrismaClient();

function generateClerkId(prefix: string) {
  // const prefix = 'user_';
  const length = 27;
  let randomString = '';

  while (randomString.length < length) {
    randomString += Math.random().toString(36).substring(2);
  }

  randomString = randomString.substring(0, length);

  return `${prefix}${randomString}`;
}

async function main() {
  const prefix = 'admin_';
  const mockClerkAdmin1Id = generateClerkId(prefix);
  const mockClerkAdmin2Id = generateClerkId(prefix);
  // ADMIN
  await prisma.admin.create({
    data: {
      username: 'admin1',
      adminClerkId: mockClerkAdmin1Id,
    },
  });
  await prisma.admin.create({
    data: {
      username: 'admin2',
      adminClerkId: mockClerkAdmin2Id,
    },
  });

  // GRADE
  const grades = [];
  for (let i = 1; i <= 6; i++) {
    // const prefix = 'grade_';
    // const mockClerkGradeId = generateClerkId(prefix);
    const grade = await prisma.grade.create({
      data: {
        level: i,
        // gradeClerkId: mockClerkGradeId,
      },
    });
    grades.push(grade);
  }

  // CLASS
  const classes = [];
  for (let i = 1; i <= 6; i++) {
    // const prefix = 'class_';
    // const mockClerkClassId = generateClerkId(prefix);
    const classItem = await prisma.class.create({
      data: {
        // classClerkId: mockClerkClassId,
        name: `${i}A`,
        gradeId: grades[i - 1].id,
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
    classes.push(classItem);
  }

  // SUBJECT
  const subjectData = [
    { name: 'Mathematics' },
    { name: 'Science' },
    { name: 'English' },
    { name: 'History' },
    { name: 'Geography' },
    { name: 'Physics' },
    { name: 'Chemistry' },
    { name: 'Biology' },
    { name: 'Computer Science' },
    { name: 'Art' },
  ];

  const subjects = [];
  for (const subject of subjectData) {
    const subjectItem = await prisma.subject.create({ data: subject });
    subjects.push(subjectItem);
  }

  // TEACHER
  const teachers = [];
  for (let i = 1; i <= 15; i++) {
    const prefix = 'teacher_';
    const mockClerkTeacherId = generateClerkId(prefix);
    try {
      const subjectIndex = i % subjects.length;
      const classIndex = i % classes.length;
      const teacher = await prisma.teacher.create({
        data: {
          username: `teacher${i}`,
          teacherClerkId: mockClerkTeacherId,
          name: `TName${i}`,
          surname: `TSurname${i}`,
          email: `teacher${i}@example.com`,
          phone: `123-456-789${i}`,
          address: `Address${i}`,
          bloodType: 'A+',
          sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
          // subjects: { connect: [{ id: subjects[i % subjects.length].id }] },
          subjectIds: [subjects[subjectIndex].id],
          birthday: new Date(
            new Date().setFullYear(new Date().getFullYear() - 30)
          ),
        },
      });

      await prisma.subject.update({
        where: { id: subjects[subjectIndex].id },
        data: {
          teacherIds: {
            push: teacher.id,
          },
        },
      });

      await prisma.class.update({
        where: { id: classes[classIndex].id },
        data: {
          supervisorId: teacher.id,
        },
      });

      teachers.push(teacher);
    } catch (error) {
      console.error(`Failed to create teacher ${i}:`, error);
    }
  }

  // LESSON
  const lessons = [];
  for (let i = 1; i <= 30; i++) {
    // const prefix = 'lesson_';
    // const mockClerkLessonId = generateClerkId(prefix);
    const lesson = await prisma.lesson.create({
      data: {
        name: `Lesson${i}`,
        // lessonClerkId: mockClerkLessonId,
        day: Day[
          Object.keys(Day)[
            Math.floor(Math.random() * Object.keys(Day).length)
          ] as keyof typeof Day
        ],
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
        subjectId: subjects[i % subjects.length].id,
        classId: classes[i % classes.length].id,
        teacherId: teachers[i % teachers.length].id,
      },
    });
    lessons.push(lesson);
  }

  // PARENT
  const parents = [];
  for (let i = 1; i <= 25; i++) {
    const prefix = 'parent_';
    const mockClerkParentId = generateClerkId(prefix);
    const parent = await prisma.parent.create({
      data: {
        username: `parentId${i}`,
        parentClerkId: mockClerkParentId,
        name: `PName ${i}`,
        surname: `PSurname ${i}`,
        email: `parent${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
      },
    });
    parents.push(parent);
  }

  // STUDENT
  const students = [];
  for (let i = 1; i <= 50; i++) {
    const prefix = 'student_';
    const mockClerkStudentId = generateClerkId(prefix);
    const student = await prisma.student.create({
      data: {
        username: `student${i}`,
        studentClerkId: mockClerkStudentId,
        name: `SName${i}`,
        surname: `SSurname ${i}`,
        email: `student${i}@example.com`,
        phone: `987-654-321${i}`,
        address: `Address${i}`,
        bloodType: 'O-',
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentId: parents[Math.floor(i / 2) % parents.length].id,
        gradeId: grades[i % grades.length].id,
        classId: classes[i % classes.length].id,
        birthday: new Date(
          new Date().setFullYear(new Date().getFullYear() - 10)
        ),
      },
    });
    students.push(student);
  }

  // EXAM
  const exams = [];
  for (let i = 1; i <= 10; i++) {
    // const prefix = 'exam_';
    // const mockClerkExamId = generateClerkId(prefix);
    const exam = await prisma.exam.create({
      data: {
        // examClerkId: mockClerkExamId,
        title: `Exam ${i}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        lessonId: lessons[i % lessons.length].id,
      },
    });

    exams.push(exam);
  }

  // ASSIGNMENT
  const assignments = [];
  for (let i = 1; i <= 10; i++) {
    // const prefix = 'assignment_';
    // const mockClerkAssignmentId = generateClerkId(prefix);
    const assignment = await prisma.assignment.create({
      data: {
        // assignmentClerkId: mockClerkAssignmentId,
        title: `Assignment ${i}`,
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        lessonId: lessons[i % lessons.length].id,
      },
    });
    assignments.push(assignment);
  }

  const resultData = [];
  for (let i = 1; i <= 10; i++) {
    const resultEntry = {
      score: 90,
      studentId: students[i % students.length].id,
      ...(i <= 5
        ? {
            examId: exams[i - 1].id, // Use actual exam ID from previous creation
            assignmentId: null,
          }
        : {
            examId: null,
            assignmentId: assignments[i - 6].id, // Use actual assignment ID
          }),
    };

    resultData.push(resultEntry);
  }

  // Option 1: Create results one by one
  for (const result of resultData) {
    await prisma.result.create({ data: result });
  }

  // ATTENDANCE
  for (let i = 1; i <= 10; i++) {
    // const prefix = 'attendance_';
    // const mockClerkAttendanceId = generateClerkId(prefix);
    await prisma.attendance.create({
      data: {
        // attendanceClerkId: mockClerkAttendanceId,
        date: new Date(),
        present: true,
        studentId: students[i % students.length].id,
        lessonId: lessons[i % lessons.length].id,
      },
    });
  }

  // EVENT
  for (let i = 1; i <= 5; i++) {
    // const prefix = 'event_';
    // const mockClerkEventId = generateClerkId(prefix);
    await prisma.event.create({
      data: {
        // eventClerkId: mockClerkEventId,
        title: `Event ${i}`,
        description: `Description for Event ${i}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        classId: classes[i % classes.length].id,
      },
    });
  }

  // ANNOUNCEMENT
  for (let i = 1; i <= 5; i++) {
    // const prefix = 'announcement_';
    // const mockClerkAnnouncementId = generateClerkId(prefix);
    await prisma.announcement.create({
      data: {
        // announcementClerkId: mockClerkAnnouncementId,
        title: `Announcement ${i}`,
        description: `Description for Announcement ${i}`,
        date: new Date(),
        classId: classes[i % classes.length].id,
      },
    });
  }

  console.log('Seeding completed successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
