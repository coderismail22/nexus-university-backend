import { Router } from "express";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { StudentRoutes } from "../modules/student/student.route";
import { UserRoutes } from "../modules/user/user.route";
import { AcademicCourseRoutes } from "../modules/Course/course.route";
import { AcademicSemesterRegistrationRoutes } from "../modules/semester-registration/semester-registration.route";
import { OfferedCourseRoutes } from "../modules/offered-course/offered-course.route";
import { FacultyRoutes } from "../modules/Faculty/faculty.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { AuthRoutes } from "../modules/auth/auth.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/students",
    route: StudentRoutes,
  },
  {
    path: "/academic-semesters",
    route: AcademicSemesterRoutes,
  },
  {
    path: "/academic-faculties",
    route: AcademicFacultyRoutes,
  },
  {
    path: "/faculties",
    route: FacultyRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/academic-departments",
    route: AcademicDepartmentRoutes,
  },
  {
    path: "/academic-courses",
    route: AcademicCourseRoutes,
  },
  {
    path: "/offered-courses",
    route: OfferedCourseRoutes,
  },
  {
    path: "/academic-semester-registrations",
    route: AcademicSemesterRegistrationRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
