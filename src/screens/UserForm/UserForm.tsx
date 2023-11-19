import React from "react";
import { useRef, useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Input, Button } from "@rneui/themed";
import { useCreateUserMutation } from "../../store/api/usersApi";
import { useToast } from "react-native-toast-notifications";

export const UserForm = (props) => {
  const { navigation } = props;
  const lastNameRef = useRef(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [createUser, { isLoading }] = useCreateUserMutation();
  const toast = useToast();

  const [text, onChangeText] = React.useState("Useless Text");
  const [number, onChangeNumber] = React.useState("");

  const handleSubmit = () => {
    console.log("firstName: ", firstName);
    console.log("lastName: ", lastName);

    if (firstName === "" || lastName === "") {
      // show toast, must fill all inputs
      console.log("Invalid form!");
      toast.show("Please fill out all fields!", {
        type: "warning",
        placement: "top",
        duration: 4000,
        animationType: "slide-in"
      });
      return;
    }

    createUser({
      user: {
        firstName: firstName,
        lastName: lastName
      }
    })
      .then(() => {
        navigation.navigate("UserList");
        toast.show(`User ${firstName} ${lastName} has been created!`, {
          type: "success",
          placement: "top",
          duration: 4000,
          animationType: "slide-in"
        });
        setFirstName("");
        setLastName("");
      })
      .catch((error) => {
        toast.show(error, { type: "danger" });
      });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.actionsContainer}>
          <Text>Create a user</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFirstName(text)}
            value={firstName}
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current.focus()}
            blurOnSubmit={false}
            /* disabled={isLoading} */
            placeholder="First name"
          ></TextInput>
          <TextInput
            style={styles.input}
            /* ref={lastNameRef} */
            value={lastName}
            /*  disabled={isLoading} */
            returnKeyType="send"
            onSubmitEditing={() => handleSubmit()}
            onChangeText={(text) => setLastName(text)}
            placeholder="Last name"
          ></TextInput>
          <Button title="Create user" disabled={isLoading} loading={isLoading} onPress={() => handleSubmit()}></Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10
  }
});
