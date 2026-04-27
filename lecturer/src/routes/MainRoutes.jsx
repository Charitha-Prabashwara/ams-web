import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - color
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - sample page
const Hod = Loadable(lazy(() => import('pages/extra-pages/hod')));
const Lecturer = Loadable(lazy(() => import('pages/extra-pages/lecturer')));
const Student = Loadable(lazy(() => import('pages/extra-pages/student')));
const Department = Loadable(lazy(() => import('pages/extra-pages/department')));
const Courses = Loadable(lazy(() => import('pages/extra-pages/courses.jsx')));
const Bathes = Loadable(lazy(() => import('pages/extra-pages/batches.jsx')));
const Semester = Loadable(lazy(() => import('pages/extra-pages/semester.jsx')));
const Subjects = Loadable(lazy(() => import('pages/extra-pages/subject.jsx')));
const LecturerSubjectRegistration = Loadable(lazy(() => import('pages/extra-pages/LecturerSubjectRegistrationPage.jsx')));
const SemesterSubjectRegistration = Loadable(lazy(() => import('pages/extra-pages/SemesterSubjectRegistration.jsx')));
const LecturerLectureScheduling = Loadable(lazy(() => import('pages/extra-pages/LecturerLectureScheduling.jsx')));
const AttendanceMarking = Loadable(lazy(() => import('pages/extra-pages/AttendanceMarking.jsx')));
const ProfileSettings = Loadable(lazy(() => import('pages/extra-pages/ProfileSettings.jsx')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'hod',
      element: <Hod />
    },
    {
      path: 'lecturer',
      element: <Lecturer />
    },
    {
      path: 'student',
      element: <Student />
    },
    {
      path: 'department',
      element: <Department />
    },
    {
      path: 'courses',
      element: <Courses />
    },
    {
      path: 'baches',
      element: <Bathes />
    },
    {
      path: 'semester',
      element: <Semester />
    },
    {
      path: 'subject',
      element: <Subjects/>
    },
    {
      path:'lecturerSubjectRegistration',
      element:<LecturerSubjectRegistration/>

    },
    {
      path:'SemesterSubjectRegistration',
      element:<SemesterSubjectRegistration/>
    },
    {
      path:'lecturerLectureScheduling',
      element:<LecturerLectureScheduling/>
    },
    {
      path:'attendanceMarking',
      element:<AttendanceMarking/>
    },
    {
      path:'profileSettings',
      element:<ProfileSettings/>
    },
    {
      path:'lecturer',
      element:<Lecturer/>
    }
  ]
};

export default MainRoutes;
