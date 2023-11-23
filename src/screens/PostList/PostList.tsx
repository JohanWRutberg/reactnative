import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl, SafeAreaView } from "react-native";
import { useGetPostsQuery } from "../../store/api/postsApi";
import { useGetUsersQuery } from "../../store/api/usersApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";

import { formatISO } from "../../utils";

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
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<Record<string, User>>({});

  const loggedInAs = useSelector((state: RootState) => state.auth.loggedInAs);
  const dispatch = useDispatch();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);

  const fetchUsers = async () => {
    if (posts) {
      const userIds = posts.map((post) => post.post.createdBy.id);
      const uniqueUserIds = [...new Set(userIds)];

      for (const userId of uniqueUserIds as string[]) {
        if (!userId) continue;
        try {
          const { data } = useGetUsersQuery(userId);
          setUsers((prevUsers) => ({ ...prevUsers, [userId]: data }));
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [posts]);

  if (isLoading) {
    return <Text style={{ fontSize: 16, color: "000" }}>Loading...</Text>;
  }

  if (isError) {
    return <Text style={{ fontSize: 16, color: "red", textAlign: "center" }}>Error loading posts</Text>;
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
            <Text style={{ fontSize: 16, color: "#fff" }}>
              Created by: {`${item.post.createdBy.firstName} ${item.post.createdBy.lastName}`}
            </Text>
            <Text style={{ fontSize: 16, color: "#fff" }}>Created date: {formatISO(item.post.createdDate)}</Text>
            <Text style={{ fontSize: 16, color: "#fff" }}>Text: {item.post.text}</Text>
          </View>
        )}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListHeaderComponent={
          <Text style={{ fontSize: 16, color: "black", textAlign: "center", marginTop: 90 }}>
            Posts in chronological order
          </Text>
        }
        ListFooterComponent={<View style={styles.bottomMargin}></View>}
      />
    </View>
  );
}

PostList.navigationOptions = {
  headerStyle: {
    backgroundColor: "rgba(0, 0, 0, 0.5)" // Set a semi-transparent dark background
  },
  headerTintColor: "black",
  headerTransparent: true // Set header to be transparent
};

export default PostList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    paddingTop: 0,
    paddingBottom: 0 // Adjust this value based on the height you want
  },
  headerText: {
    fontSize: 18,
    color: "black"
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
  },
  bottomMargin: {
    height: 80 // Adjust this value based on the height you want
  }
});
