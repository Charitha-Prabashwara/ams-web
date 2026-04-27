// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  BookOutlined,
  PartitionOutlined,
  ScheduleOutlined,
  CalendarOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { PiBuilding } from 'react-icons/pi';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  PiBuilding,
  BookOutlined,
  PartitionOutlined,
  ScheduleOutlined,
  CalendarOutlined,
  TeamOutlined
};

// ==============================|| MENU ITEMS - ACADEMIC REGISTRATIONS ||============================== //

const academicRegistrations = {
  id: 'academic-reg',
  title: 'Academic Registrations',
  type: 'group',
  children: [
    {
      id: 'lecturer-subject-assignment',
      title: 'Subject Instructor Assignment',
      type: 'item',
      url: '/lecturerSubjectRegistration',
      icon: icons.AppstoreAddOutlined
    },
    {
      id: 'semester-subject-registration',
      title: 'Semester Subject Registration',
      type: 'item',
      url: '/SemesterSubjectRegistration',
      icon: icons.BookOutlined
    },
    {
      id: 'lecturer-lecture-scheduling',
      title: 'Lecture Scheduling',
      type: 'item',
      url: '/lecturerLectureScheduling',
      icon: icons.CalendarOutlined
    },
    {
      id: 'attendance-marking',
      title: 'Attendance Marking',
      type: 'item',
      url: '/attendanceMarking',
      icon: icons.TeamOutlined
    }
  ]
};

export default academicRegistrations;