import React, { useEffect, useLayoutEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements'
import CustomListItem from '../components/CustomListItem'
import { db, auth } from "../firebase"
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons"

export default function HomeScreen({ navigation }) {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection('chats').onSnapshot(snapshot => (
            setChats(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            }))) // Bracket Hell
        ))

        return unsubscribe;
    }, []);

    const signOut = () => {
        auth.signOut().then(() => {
            navigation.replace("Login");
        });
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Signal",
            headerStyle: { backgroundColor: "#fff" },
            headerTitleStyle: { color: "black" },
            headerTintColor: "black",
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity onPress={signOut} activeOpacity={0.5}>
                        <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 80,
                    marginRight: 20,
                }}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <AntDesign name="camerao" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate("AddChat")}>
                        <SimpleLineIcons
                            name="pencil"
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const enterChat = (id, chatName) => {
        navigation.navigate("Chat", {
            id: id,
            chatName: chatName,
        })
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {chats.map(({ id, data: { chatName } }) => (
                    <CustomListItem
                        key={id}
                        id={id}
                        chatName={chatName}
                        enterChat={enterChat}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
    }
})

