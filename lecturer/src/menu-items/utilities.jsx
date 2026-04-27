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
      id: 'profile-settings',
      title: 'Profile Settings',
      type: 'item',
      url: '/profileSettings',
      icon: icons.UserOutlined
    }
  ]
};

export default academic;
