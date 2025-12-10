// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';
import { FaUserShield, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined,
  FaUserShield,
  FaChalkboardTeacher,
  FaUserGraduate
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'support',
  title: 'Academic User',
  type: 'group',
  children: [
    {
      id: 'lecturer',
      title: 'Lecturer',
      type: 'item',
      url: '/lecturer',
      icon: icons.FaChalkboardTeacher
    },
    {
      id: 'hod',
      title: 'Department Executive',
      type: 'item',
      url: '/hod',
      icon: icons.FaUserShield
    },
    {
      id: 'student',
      title: 'Student',
      type: 'item',
      url: '/student',
      icon: icons.FaUserGraduate
    },
    {
      id: 'documentation',
      title: 'Documentation',
      type: 'item',
      url: 'https://codedthemes.gitbook.io/mantis/',
      icon: icons.QuestionOutlined,
      external: true,
      target: true
    }
  ]
};

export default support;
