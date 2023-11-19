import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useCreatePostMutation } from "../../store/api/postsApi";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface Post {
  text: string;
  createdBy: string;
  createdDate: string;
}

function PostForm() {
  const [postText, setPostText] = useState("");
  const loggedInAs = useSelector((state: RootState) => state.auth.loggedInAs);
  const [createPost] = useCreatePostMutation();

  const handleCreatePost = () => {
    if (!loggedInAs) {
      // Handle the case where the user is not logged in
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

    // Clear the input field after creating a post
    setPostText("");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.actionsContainer}>
          <Text>Create a post</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your post"
            value={postText}
            onChangeText={(text) => setPostText(text)}
          />
          <Button title="Create post" onPress={handleCreatePost} />
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
