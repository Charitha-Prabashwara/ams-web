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
  FileTextOutlined,
  CalendarOutlined
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
  FileTextOutlined,
  CalendarOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const academic = {
  id: 'academic-uni',
  title: 'Academic',
  type: 'group',
  children: [
    {
      id: 'util-color',
      title: 'Subject',
      type: 'item',
      url: '/subject',
      icon: icons.FileTextOutlined 
    },
    {
      id: 'lecture-scheduling',
      title: 'Lecture Scheduling',
      type: 'item',
      url: '/lecture-scheduling',
      icon: icons.CalendarOutlined
    },
    {
      id: 'util-color',
      title: 'Batch',
      type: 'item',
      url: '/baches',
      icon: icons.PartitionOutlined
    },
    {
      id: 'course',
      title: 'Courses',
      type: 'item',
      url: '/courses',
      icon: icons.BookOutlined
    },
    {
      id: 'semester',
      title: 'Semester',
      type: 'item',
      url: '/semester',
      icon: icons.ScheduleOutlined
    },
    {
      id: 'department',
      title: 'Department',
      type: 'item',
      url: '/department',
      icon: icons.PiBuilding
    }
  ]
};

export default academic;
