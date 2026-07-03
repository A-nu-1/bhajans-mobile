import { View, Text, StyleSheet, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { getBhajans } from "@/services/bhajans";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import { Image } from "react-native";

export default function Home() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        async function loadCount() {
            try {
                const bhajans = await getBhajans();
                setCount(bhajans.length);
            } catch (err) {
                console.error(err);
            }
        }

        loadCount();
    }, []);

    return (
        <LinearGradient
            colors={["#fff2fe", "#ffd5f2"]}
            style={styles.container}
        >
            <Image
                source={require("@/assets/namaste.jpg")}
                style={styles.namasteImage}
                resizeMode="contain"
            />

            <Text style={styles.title}>
                Om Namo Yogeshwaraya
            </Text>

            <Text style={styles.subtitle}>
                Read • Sing • Devotion
            </Text>

            <View style={styles.card}>
                <Ionicons
                    name="musical-notes-outline"
                    size={36}
                    color={Colors.primary}
                />

                <Text style={styles.count}>
                    {count}
                </Text>

                <Text style={styles.cardText}>
                    Total Bhajans
                </Text>
            </View>
            <Pressable
                onPress={() => {
                    // Navigate to BhajansScreen
                    router.push("/(tabs)/BhajansScreen");
                }}
            >
                <View style={styles.quoteCard}>
                    <Text style={styles.quote}>
                        "Lets immerse in the divine melodies"
                    </Text>
                    <Ionicons
                        name="search-outline"
                        size={36}
                        color={Colors.primary}
                        style={{ marginTop: 5, textAlign: "center" }}
                    />
                </View>
            </Pressable>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },

    namasteImage: {
        width: 180,
        height: 180,
        borderRadius: 90,
        marginBottom: 10,
    },

    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginTop: 10,
        color: Colors.primary,
        textAlign: "center",
    },

    subtitle: {
        color: Colors.subtitle,
        marginBottom: 20,
        fontSize: 18,
    },

    card: {
        width: "100%",
        backgroundColor: "rgb(245, 195, 226)",
        borderRadius: 22,
        padding: 25,
        alignItems: "center",

        elevation: 10,
    },

    count: {
        fontSize: 39,
        fontWeight: "bold",
        color: Colors.primary,
        marginTop: 12,
    },

    cardText: {
        marginTop: 6,
        color: Colors.subtitle,

        fontSize: 18,
    },

    quoteCard: {
        marginTop: 30,
        width: "100%",
        backgroundColor: "rgb(245, 195, 226)",
        borderRadius: 18,
        padding: 20,
        elevation: 10,
    },

    quote: {
        textAlign: "center",
        fontStyle: "italic",
        color: Colors.subtitle,
        fontSize: 16,
    },
});