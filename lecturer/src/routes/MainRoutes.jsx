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
    }
  ]
};

export default MainRoutes;
