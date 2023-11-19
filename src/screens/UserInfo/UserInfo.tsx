import { StyleSheet, View } from "react-native";
import { Button, Text } from "@rneui/themed";
import { logIn, logOut } from "../../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

export const UserInfo = ({ route, navigation }) => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const user = route?.params?.user || loggedInAs;
  const dispatch = useDispatch();

  const updateUser = () => {
    navigation.navigate("EditUser", { user });
  };

  const deleteUser = () => {
    navigation.navigate("DeleteUser", { user });
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text h4>User: {`${user.firstName} ${user.lastName}`}</Text>
      </View>
      <View style={styles.actionsContainer}>
        {loggedInAs?.id === user.id ? (
          <View style={styles.buttonContainer}>
            <Button style={styles.editBtn} onPress={updateUser} color="#5E5D5E" title="Edit"></Button>
            <Button style={styles.deleteBtn} onPress={deleteUser} title="Delete" color="#FF385C"></Button>
            <Button
              style={styles.logoutBtn}
              onPress={() => dispatch(logOut())}
              title="Log out"
              color="#1A1A1A"
            ></Button>
          </View>
        ) : (
          <>
            <Button onPress={() => dispatch(logIn(user))} color="#5E5D5E" title="Log in"></Button>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 24,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 36
  },
  infoContainer: {
    marginBottom: 24
  },
  actionsContainer: {
    marginBottom: 24
  },
  buttonContainer: {
    padding: 5
  },
  editBtn: {
    padding: 12
  },
  deleteBtn: { padding: 12 },
  logoutBtn: { padding: 12 }
});
