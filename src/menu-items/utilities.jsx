// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  BookOutlined,
  PartitionOutlined  
} from '@ant-design/icons';
import { PiBuilding } from "react-icons/pi";

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
  PartitionOutlined  
};


// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'academic-uni',
  title: 'Academic Unit',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Typography',
      type: 'item',
      url: '/typography',
      icon: icons.FontSizeOutlined
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
      id: 'department',
      title: 'Department',
      type: 'item',
      url: '/department',
      icon: icons.PiBuilding

    }
  ]
};

export default utilities;
