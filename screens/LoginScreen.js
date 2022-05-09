import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView } from 'react-native';
import { auth } from '../firebase';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect (() => {
       const unsubscribe = auth.onAuthStateChanged( authUser => {
            if (authUser) {
                navigation.replace("Home");
            }
        });

        return unsubscribe;
    },[]);

    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password).catch(error => alert(error));
    };

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light" />
            <Image source={{
                uri: 'https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png',
            }}
                style={{
                    width: 200,
                    height: 200,
                }}
            />
            <View style={styles.inputContainer}>
                <Input
                    placeholder="Email"
                    autoFocus
                    type="email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <Input
                    placeholder="Password"
                    secureTextEntry
                    type="password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    onSubmitEditing={signIn}
                />
            </View>

            <Button containerStyle={styles.button} onPress={signIn} title='Login' />
            <Button
                containerStyle={styles.button}
                type="outline"
                onPress={() => navigation.navigate('Register')}
                title='Register'
            />

            {/* Fixing a known bug lets the keybord don't touch the content */}
            <View style={{ height: 200 }} />
        </KeyboardAvoidingView>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#fff',
        padding: 10,
    },
    inputContainer: {
        width: 300,
    },
    button: {
        width: 200,
        marginTop: 10,
    },
});
