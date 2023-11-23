import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Input, Text } from "@rneui/themed";
import { useDeleteUserMutation } from "../../store/api/usersApi";
import { useDeleteAllPostsMutation } from "../../store/api/postsApi";
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from "react-redux";
import { logOut } from "../../store/slices/authSlice";

const DeleteUser = ({ route, navigation }) => {
  const user = route?.params?.user;
  const dispatch = useDispatch();
  const toast = useToast();
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const [deleteAllPosts, { isLoading: isLoading2 }] = useDeleteAllPostsMutation();

  const handleDelete = async () => {
    try {
      await Promise.all([deleteUser({ userId: user.id }), deleteAllPosts({ userId: user.id })]);
      toast.show("User deleted successfully", {
        type: "success",
        placement: "top",
        duration: 4000,
        animationType: "slide-in"
      });
      dispatch(logOut());
      navigation.navigate("UserList");
    } catch (error) {
      toast.show(error, { type: "danger" });
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 200 }} />
      <Text h4>Delete User</Text>
      <Text>{`Are you sure you want to delete ${user.firstName} ${user.lastName}?`}</Text>
      <Button
        style={styles.deleteBtn}
        color="#FF385C"
        title="Delete User"
        disabled={isLoading}
        loading={isLoading}
        onPress={handleDelete}
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center"
  },
  deleteBtn: { padding: 2 }
});

export default DeleteUser;
