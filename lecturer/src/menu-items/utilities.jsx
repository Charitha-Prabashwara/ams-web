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
  UserOutlined
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
  UserOutlined
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
    },
    {
      id: 'profile-settings',
      title: 'Profile Settings',
      type: 'item',
      url: '/profileSettings',
      icon: icons.UserOutlined
    }
  ]
};

export default academic;
