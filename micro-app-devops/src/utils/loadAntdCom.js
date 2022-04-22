/*
 * @Author: 任继民
 * @Date: 2021-01-08 14:25:16
 * @LastEditors: 任继民
 * @LastEditTime: 2021-02-07 12:29:55
 * @Description:
 */
import {
  Button,
  Card,
  Form,
  Input,
  Tabs,
  Table,
  Tree,
  Select,
  Checkbox,
  Radio,
  Layout,
  ConfigProvider,
  Breadcrumb,
  Menu,
  Pagination,
  DatePicker,
  InputNumber,
  TimePicker,
  TreeSelect,
  Transfer,
  Avatar,
  Popover,
  Dropdown,
  Modal,
  message,
  Upload,
  Switch,
} from 'ant-design-vue';

// import {
//   UserOutlined,
//   VideoCameraOutlined,
//   UploadOutlined,
//   MenuUnfoldOutlined,
//   MenuFoldOutlined,
//   LogoutOutlined,
//   MailOutlined,
// } from '@ant-design/icons-vue';
// import { Icon } from '../components/index';

export default function lazyLoadAntComponent(app) {
  // 注册antd组件
  [
    Button,
    Card,
    Tabs,
    Table,
    Tree,
    Form,
    Input,
    Select,
    Checkbox,
    Radio,
    Layout,
    ConfigProvider,
    Breadcrumb,
    Menu,
    Pagination,
    DatePicker,
    TimePicker,
    Transfer,
    TreeSelect,
    InputNumber,
    Avatar,
    Popover,
    Dropdown,
    Modal,
    message,
    Upload,
    Switch,
  ].forEach(com => app.use(com));

  // // 加载自定义组件和图标
  // [
  //   // Icon,
  //   UserOutlined,
  //   VideoCameraOutlined,
  //   UploadOutlined,
  //   MenuUnfoldOutlined,
  //   MenuFoldOutlined,
  //   LogoutOutlined,
  //   MailOutlined,
  // ].forEach(com => app.component(com.name, com));
}
