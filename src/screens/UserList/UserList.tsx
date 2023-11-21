import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { ListItem, Button } from "@rneui/themed";
import { useSelector } from "react-redux";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useGetUsersQuery } from "@/src/store/api/usersApi";
import DeleteUser from "@/src/components/DeleteUser/DeleteUser";
import EditUser from "@/src/components/EditUser/EditUser";

const UserList = ({ navigation }) => {
  const { data, isLoading, refetch } = useGetUsersQuery({});
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const [selectedUserId, setSelectedUserId] = React.useState(null);

  useFocusEffect(
    React.useCallback(() => {
      // Only if logged in
      if (loggedInAs) {
        setSelectedUserId(loggedInAs.id);
      } else {
        setSelectedUserId(null);
      }
    }, [loggedInAs])
  );

  // Check if data is defined before sorting
  const sortedData = data && data.slice().sort((a, b) => a.firstName.localeCompare(b.firstName));

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Select a User to Login.</Text>
      <Text style={styles.headerText}>As logged in, you are able to Post a message.</Text>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={sortedData}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          renderItem={({ item }) => (
            <ListItem
              key={item.id}
              onPress={() => {
                navigation.navigate("UserInfo", { user: item });
              }}
            >
              <ListItem.Content>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <ListItem.Title style={{ color: loggedInAs && loggedInAs.id === item.id ? "red" : "black" }}>
                      {`${item.firstName} ${item.lastName}`}
                    </ListItem.Title>
                  </View>
                  <View style={{ flexDirection: "row", flex: 1, justifyContent: "flex-end" }}>
                    <Button
                      style={styles.editBtn}
                      color="#5E5D5E"
                      title="Edit"
                      onPress={() => {
                        navigation.navigate("EditUser", { user: item });
                      }}
                    />
                    <Button
                      style={styles.deleteBtn}
                      color="#FF385C"
                      title="Delete"
                      onPress={() => {
                        navigation.navigate("DeleteUser", { user: item });
                      }}
                    />
                  </View>
                </View>
              </ListItem.Content>
            </ListItem>
          )}
        ></FlatList>
      )}
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10
  },
  headerText: {
    fontSize: 14,
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
  editBtn: {
    padding: 2
  },
  deleteBtn: { padding: 2 },
  logoutBtn: { padding: 2 }
});
