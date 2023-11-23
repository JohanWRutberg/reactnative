import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider, useSelector } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { persistor, store } from "./src/store/store";
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
import { PersistGate } from "redux-persist/integration/react";
import { Platform, StyleSheet, Text, View, SafeAreaView, StatusBar } from "react-native";
/* import Fonts from "./assets/fonts"; */

const UserListStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const UserListStackScreen = () => {
  return (
    <UserListStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "rgba(0, 0, 0, 0.5)" // Set a semi-transparent dark background
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold"
        },
        headerTransparent: true
      }}
    >
      <UserListStack.Screen
        name="UserList"
        component={UserList}
        options={{
          title: "Users"
        }}
      />
      <UserListStack.Screen
        name="UserInfo"
        component={UserInfo}
        options={{
          title: "User Info"
        }}
      />
      <UserListStack.Screen
        name="EditUser"
        component={EditUser}
        options={{
          title: "Edit User"
        }}
      />
      <UserListStack.Screen
        name="DeleteUser"
        component={DeleteUser}
        options={{
          title: "Delete User"
        }}
      />
    </UserListStack.Navigator>
  );
};

const NavigationWrapper = () => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: "white",
            tabBarStyle: {
              backgroundColor: "rgba(0, 0, 0, 0.7)", // Set a semi-transparent dark background
              position: "absolute", // Position the tab bar at the bottom of the screen
              elevation: 0 // Remove shadow on Android
            }
          }}
        >
          <Tab.Screen
            name="UserListStack"
            component={UserListStackScreen}
            options={{
              headerStyle: {
                backgroundColor: "rgba(0, 0, 0, 0.7)"
              },
              headerTintColor: "white",
              tabBarLabel: "User List",
              tabBarIcon: ({ color, size }) => <FontAwesome5 name="list-alt" color={color} size={size} />,
              headerShown: false
            }}
          />

          <Tab.Screen
            name="UserForm"
            component={UserForm}
            options={{
              headerStyle: {
                backgroundColor: "rgba(0, 0, 0, 0.7)"
              },
              headerTintColor: "white",
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
                headerStyle: {
                  backgroundColor: "rgba(0, 0, 0, 0.7)"
                },
                headerTintColor: "white",
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
              headerStyle: {
                backgroundColor: "rgba(0, 0, 0, 0.7)"
              },
              headerTintColor: "white",
              tabBarLabel: "Post",
              tabBarIcon: ({ color, size }) => <MaterialIcons name="post-add" color={color} size={size} />,
              headerShown: true
            }}
          />

          <Tab.Screen
            name="PostList"
            component={PostList}
            options={{
              headerStyle: {
                backgroundColor: "rgba(0, 0, 0, 0.5)" // Set a semi-transparent dark background
              },
              headerTintColor: "black",
              headerTransparent: true, // Set header to be transparent
              tabBarLabel: "Posts",
              tabBarIcon: ({ color, size }) => <Octicons name="list-unordered" color={color} size={size} />
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
            <StatusBar barStyle="light-content" backgroundColor="rgba(0, 0, 0, 0.7)" />
            <NavigationWrapper />
          </View>
        </PersistGate>
      </Provider>
    </ToastProvider>
  );
}
