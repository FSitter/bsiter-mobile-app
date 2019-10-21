import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import TabBarIcon from 'components/TabBarIcon';
import HomeScreen from 'screens/HomeScreen';
import SettingsScreen from 'screens/SettingsScreen';
import CreateRequestScreen from 'screens/parent/CreateRequestScreen';
import RequestDetail from 'screens/RequestDetail';
import RecommendBabysitter from 'screens/Recommend/RecommendScreen';

const config = Platform.select({
  default: {},
});

const CreateRequestStack = createStackNavigator(
  {
    CreateRequest: CreateRequestScreen,
  },
  config,
);

CreateRequestStack.navigationOptions = {
  tabBarLabel: 'Tạo mới yêu cầu',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS == 'ios' ? 'ios-add' : 'md-add'}
    />
  ),
};

CreateRequestStack.path = '';

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      // eslint-disable-next-line no-unused-vars
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    },
    RequestDetail: RequestDetail,
    Recommend: RecommendBabysitter,
    CreateRequest: CreateRequestScreen,
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

// const CircleStack = createStackNavigator(
//   {
//     Circles: SettingsScreen,
//   },
//   config,
// );

// CircleStack.navigationOptions = {
//   tabBarLabel: 'Vòng tròn tin tưởng',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS == 'ios' ? 'ios-man' : 'md-man'}
//     />
//   ),
// };

// CircleStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
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
  // CircleStack,
  CreateRequestStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
