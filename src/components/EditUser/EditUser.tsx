// src/components/EditUser/EditUser.tsx

import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Input } from "@rneui/themed";
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
        navigation.navigate("UserInfo", { user: { ...user, firstName: newFirstName, lastName: newLastName } });
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
  /* toast.show(`Användaren ${firstName} ${lastName} har uppdaterats!`, {
          type: "success",
          placement: "top",
          duration: 4000,
          animationType: "slide-in" */

  return (
    <View style={styles.container}>
      <Text>Edit User</Text>
      <Input
        value={newFirstName}
        disabled={isLoading}
        onChangeText={(text) => setNewFirstName(text)}
        placeholder="New First Name"
      ></Input>
      <Input
        value={newLastName}
        disabled={isLoading}
        onChangeText={(text) => setNewLastName(text)}
        placeholder="New Last Name"
      ></Input>
      <Button title="Update User" disabled={isLoading} loading={isLoading} onPress={handleUpdate}></Button>
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
