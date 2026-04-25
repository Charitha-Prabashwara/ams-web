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
  ScheduleOutlined
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
  ScheduleOutlined
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
    }
  ]
};

export default academicRegistrations;
