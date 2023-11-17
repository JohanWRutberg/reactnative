import { View, Text, FlatList, ScrollView, RefreshControl, StyleSheet } from "react-native";
import { useGetUsersQuery } from "../../store/api/usersApi";
import { ListItem } from "@rneui/themed";

const UserList = ({ navigation }) => {
  const { data, isLoading, refetch } = useGetUsersQuery({});

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={data}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          renderItem={({ item }) => (
            <ListItem
              key={item.id}
              onPress={() => {
                navigation.navigate("UserInfo", { user: item });
              }}
            >
              <ListItem.Content>
                <ListItem.Title>{`${item.firstName} ${item.lastName}`}</ListItem.Title>
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
