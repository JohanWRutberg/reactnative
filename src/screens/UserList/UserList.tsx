import React from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { ListItem, Button } from "@rneui/themed";
import { useSelector } from "react-redux";
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

  const sortedData = data && data.slice().sort((a, b) => a.firstName.localeCompare(b.firstName));

  // Create a custom key for the header text item
  const headerKey = "header-text";

  // Combine the header text with the user data
  const combinedData = [{ id: headerKey, isHeader: true }, ...(sortedData || [])];

  return (
    <View style={styles.container}>
      <FlatList
        data={combinedData}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListHeaderComponent={<Text style={{ marginTop: 85 }}></Text>}
        renderItem={({ item, index }) => {
          if (item.isHeader) {
            return (
              <React.Fragment key={item.id}>
                <Text style={styles.headerText}>
                  Logged in User:
                  {loggedInAs ? (
                    <Text
                      style={{ color: "black", fontSize: 20, fontWeight: "bold" }}
                    >{` ${loggedInAs.firstName} ${loggedInAs.lastName}`}</Text>
                  ) : (
                    <Text style={{ color: "red", fontSize: 20, fontWeight: "bold" }}> None!</Text>
                  )}
                </Text>
                <Text style={styles.headerText}>Tap on Users name to Login!</Text>
              </React.Fragment>
            );
          }

          return (
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
          );
        }}
        ListFooterComponent={<View style={styles.bottomMargin}></View>}
      />
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
    padding: 0,
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
  editBtn: {
    padding: 2
  },
  deleteBtn: { padding: 2 },
  logoutBtn: { padding: 2 },
  bottomMargin: {
    height: 80 // Adjust this value based on the height you want
  }
});
