import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import TabBarIcon from 'components/TabBarIcon';
import ParentHomeScreen from 'screens/parent/ParentHomeScreen';
import ParentSetting from 'screens/ParentSetting';
import CreateRequestScreen from 'screens/parent/CreateRequestScreen';
import RequestDetail from 'screens/RequestDetail';
import Feedback from 'screens/parent/Feedback';
import RecommendBabysitter from 'screens/Recommend/RecommendScreen';
import BsitterProfile from 'screens/Recommend/BsitterProfile';
import ProfileDetail from 'screens/ProfileDetail';
import PaymentStripe from 'utils/PaymentStripe';
import SittingList from 'screens/parent/SittingList';

// import MyNetwork from '../screens/circle/MyNetwork';
import QRcodeScannerScreen from 'utils/qrScanner';
import CircleScreens from 'screens/parent/CircleScreens';
import ReportScreen from 'screens/ReportScreen';

const config = Platform.select({
  default: {},
});

// const CreateRequestStack = createStackNavigator(
//   {
//     CreateRequest: CreateRequestScreen,
//   },
//   config,
// );

// CreateRequestStack.navigationOptions = {
//   tabBarLabel: 'Tạo mới yêu cầu',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS == 'ios' ? 'ios-add' : 'md-add'}
//     />
//   ),
// };

// CreateRequestStack.path = '';

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: ParentHomeScreen,
      // eslint-disable-next-line no-unused-vars
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    },
    RequestDetail: {
      screen: RequestDetail,
      navigationOptions: () => ({
        title: 'Yêu cầu chi tiết',
      }),
    },
    CreateRequest: {
      screen: CreateRequestScreen,
      navigationOptions: () => ({
        title: 'Tạo yêu cầu giữ trẻ',
        headerBackTitle: 'RecommendBabysitter',
      }),
    },
    Recommend: {
      screen: RecommendBabysitter,
      navigationOptions: () => ({
        title: 'Người giữ trẻ phù hợp',
      }),
    },
    SitterProfile: {
      screen: BsitterProfile,
      navigationOptions: () => ({
        title: 'Thông tin người giữ trẻ',
      }),
    },
    QrScanner: QRcodeScannerScreen,
  },
  config,
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Trang chủ',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS == 'ios' ? 'ios-home' : 'md-home'}
    />
  ),
};

HomeStack.path = '';

const CircleStack = createStackNavigator(
  {
    Circles: CircleScreens,
    // QrScanner: QRcodeScannerScreen,
  },
  config,
);

CircleStack.navigationOptions = {
  tabBarLabel: 'Vòng tròn tin tưởng',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS == 'ios' ? 'ios-man' : 'md-man'}
    />
  ),
};

CircleStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: ParentSetting,
    Profile: ProfileDetail,
    ReportScreen: ReportScreen,
    Payment: PaymentStripe,
    Feedback: Feedback,
  },
  config,
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Tùy chỉnh',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS == 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  CircleStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
