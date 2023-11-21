import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider, useSelector } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { store } from "./src/store/store";
import UserList from "./src/screens/UserList/UserList";
import { UserForm } from "./src/screens/UserForm/UserForm";
import { ToastProvider } from "react-native-toast-notifications";
import { UserInfo } from "./src/screens/UserInfo/UserInfo";
import EditUser from "./src/components/EditUser/EditUser";
import DeleteUser from "./src/components/DeleteUser/DeleteUser";
import PostForm from "./src/screens/PostForm/PostForm";
import PostList from "./src/screens/PostList/PostList";
import Colors from "./src/constants/Colors";
import { MaterialCommunityIcons, FontAwesome5, AntDesign, MaterialIcons, Octicons } from "@expo/vector-icons";
/* import Fonts from "./assets/fonts"; */

const UserListStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const UserListStackScreen = () => {
  return (
    <UserListStack.Navigator>
      <UserListStack.Screen name="UserList" component={UserList} />
      <UserListStack.Screen name="UserInfo" component={UserInfo} />
      <UserListStack.Screen name="EditUser" component={EditUser} />
      <UserListStack.Screen name="DeleteUser" component={DeleteUser} />
    </UserListStack.Navigator>
  );
};

const NavigationWrapper = () => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: "gray"
        }}
      >
        <Tab.Screen
          name="UserListStack"
          component={UserListStackScreen}
          options={{
            tabBarLabel: "User List",
            tabBarIcon: ({ color, size }) => <FontAwesome5 name="list-alt" color={color} size={size} />,
            headerShown: false
          }}
        />

        <Tab.Screen
          name="UserForm"
          component={UserForm}
          options={{
            tabBarLabel: "Create User",
            tabBarIcon: ({ color, size }) => <AntDesign name="form" color={color} size={size} />,
            headerShown: true
          }}
        />

        {loggedInAs && (
          <Tab.Screen
            name="UserInfo"
            component={UserInfo}
            options={{
              tabBarLabel: "Logged In",
              tabBarIcon: ({ color, size }) => <AntDesign name="user" color={color} size={size} />,
              title: `${loggedInAs.firstName} ${loggedInAs.lastName}`
            }}
          />
        )}

        <Tab.Screen
          name="PostForm"
          component={PostForm}
          options={{
            tabBarLabel: "Post",
            tabBarIcon: ({ color, size }) => <MaterialIcons name="post-add" color={color} size={size} />,
            headerShown: true
          }}
        />

        <Tab.Screen
          name="PostList"
          component={PostList}
          options={{
            tabBarLabel: "Posts",
            tabBarIcon: ({ color, size }) => <Octicons name="list-unordered" color={color} size={size} />
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <Provider store={store}>
        <NavigationWrapper />
      </Provider>
    </ToastProvider>
  );
}
