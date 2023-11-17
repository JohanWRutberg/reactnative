import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { useGetPostsQuery } from "../../store/api/postsApi";
import { useGetUsersQuery } from "../../store/api/usersApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { logIn } from "../../store/slices/authSlice";
import { SafeAreaView } from "react-native-safe-area-context";

interface Post {
  id: string;
  text: string;
  createdBy: string;
  createdDate: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

function PostList() {
  const { data: posts, isLoading, isError, refetch } = useGetPostsQuery({});
  console.log("Fetched Posts:", posts);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<Record<string, User>>({});

  const loggedInAs = useSelector((state: RootState) => state.auth.loggedInAs);
  const dispatch = useDispatch();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (posts) {
        const userIds = posts.map((post) => post.post.createdBy);
        const uniqueUserIds = [...new Set(userIds)];

        for (const userId of uniqueUserIds as string[]) {
          try {
            const { data } = await useGetUsersQuery(userId);
            setUsers((prevUsers) => ({ ...prevUsers, [userId]: data }));
          } catch (error) {
            console.error("Error fetching user:", error);
          }
        }
      }
    };

    fetchUsers();
  }, [posts]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error loading posts</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.infoContainer}>
            <Text style={{ fontSize: 16, color: "#fff" }}>Created by: {[item.post.createdBy]}</Text>
            <Text style={{ fontSize: 16, color: "#fff" }}>Created date: {item.post.createdDate}</Text>
            <Text style={{ fontSize: 16, color: "#fff" }}>Text: {item.post.text}</Text>
          </View>
        )}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </View>
  );
}

export default PostList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10
  },
  infoContainer: {
    backgroundColor: "#0078fe",
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
    width: "100%",
    alignSelf: "flex-start"
  },
  actionsContainer: {
    marginBottom: 0
  }
});
