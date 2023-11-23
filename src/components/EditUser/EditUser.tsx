import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Input, Text } from "@rneui/themed";
import { useUpdateUserMutation } from "../../store/api/usersApi";
import { useToast } from "react-native-toast-notifications";

const EditUser = ({ route, navigation }) => {
  const user = route?.params?.user;

  const [newFirstName, setNewFirstName] = useState(user.firstName);
  const [newLastName, setNewLastName] = useState(user.lastName);

  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const toast = useToast();

  const handleUpdate = () => {
    updateUser({
      user: {
        id: user.id,
        firstName: newFirstName,
        lastName: newLastName
      }
    })
      .then(() => {
        toast.show(`User ${newFirstName} ${newLastName} is now updated!`, {
          type: "success",
          placement: "top",
          duration: 4000,
          animationType: "slide-in"
        });

        // Navigate back to the UserList screen
        navigation.navigate("UserListStack", { screen: "UserList" });
      })
      .catch((error) => {
        toast.show(error, {
          type: "danger",
          placement: "top",
          duration: 4000,
          animationType: "slide-in"
        });
      });
  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 85 }} />
      <Text h4 style={{ textAlign: "center" }}>
        Edit User
      </Text>
      <Input
        value={newFirstName}
        disabled={isLoading}
        onChangeText={(text) => setNewFirstName(text)}
        placeholder="New First Name"
      />
      <Input
        value={newLastName}
        disabled={isLoading}
        onChangeText={(text) => setNewLastName(text)}
        placeholder="New Last Name"
      />
      <Button title="Edit User" color="#5E5D5E" disabled={isLoading} loading={isLoading} onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center"
  }
});

export default EditUser;
