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

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const academicRegistrations = {
  id: 'academic-reg',
  title: 'Academic Registrations',
  type: 'group',
  children: [
   
    {
      id: 'util-color',
      title: 'Subject Instructor Assignment',
      type: 'item',
      url: '/lecturerSubjectRegistration',
      icon: icons.PartitionOutlined
    },
     {
      id: 'semester-subject-registrations',
      title: 'Semester Subject Registration',
      type: 'item',
      url: '/SemesterSubjectRegistration',
      icon: icons.PartitionOutlined
    },
  
  ]
};

export default academicRegistrations;
