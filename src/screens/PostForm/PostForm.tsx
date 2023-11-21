import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useCreatePostMutation } from "../../store/api/postsApi";
import { Input, Button } from "@rneui/themed";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useToast } from "react-native-toast-notifications";

interface Post {
  text: string;
  createdBy: string;
  createdDate: string;
}

function PostForm() {
  const [postText, setPostText] = useState("");
  const loggedInAs = useSelector((state: RootState) => state.auth.loggedInAs);
  const [createPost] = useCreatePostMutation();
  const toast = useToast();

  const handleCreatePost = () => {
    if (!loggedInAs) {
      // If user is not logged in
      return;
    }

    // Posts need to be 5 or more char
    if (postText.length < 5) {
      // Show a toast message minimum 5 char
      toast.show("Post must be at least 5 characters long", {
        type: "danger",
        placement: "top",
        duration: 4000,
        animationType: "slide-in"
      });

      return;
    }

    createPost({
      post: {
        text: postText,
        createdBy: {
          id: loggedInAs.id,
          firstName: loggedInAs.firstName,
          lastName: loggedInAs.lastName
        },
        createdDate: Math.floor(new Date().getTime() / 1000)
      }
    });

    // Toast message after creating a post
    toast.show("Your post has been saved!", {
      type: "success",
      placement: "top",
      duration: 4000,
      animationType: "slide-in"
    });

    // Clear input field after creating a post
    setPostText("");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.actionsContainer}>
          {!loggedInAs && <Text style={styles.notLoggedInText}>You need to be logged in to post a message!</Text>}
          {loggedInAs && <Text>Create a post</Text>}
          <TextInput
            style={styles.input}
            placeholder="Enter your post"
            value={postText}
            onChangeText={(text) => setPostText(text)}
            editable={!!loggedInAs}
          />
          <Button
            style={styles.createBtn}
            color="#5E5D5E"
            title="Create post"
            onPress={handleCreatePost}
            disabled={!loggedInAs}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default PostForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 24,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 36
  },
  notLoggedInText: {
    color: "red",
    marginBottom: 10
  },
  actionsContainer: {
    marginBottom: 24
  },
  input: {
    backgroundColor: "lightgray",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10
  },
  createBtn: {
    padding: 2
  }
});
