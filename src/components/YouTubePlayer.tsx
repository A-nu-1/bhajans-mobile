import { View, Text, Pressable } from "react-native";
import { Colors } from "@/constants/theme";

type Props = {
  url: string;
};

export default function YouTubePlayer({ url }: Props) {
  if (!url) return null;

  return (
    <View
      style={{
        marginHorizontal: 15,
        marginBottom: 15,
      }}
    >
      <Pressable
        onPress={() => {
          const Linking = require("react-native").Linking;
          Linking.openURL(url);
        }}
        style={({ pressed }) => ({
          backgroundColor: Colors.primary,
          paddingVertical: 12,
          paddingHorizontal: 18,
          borderRadius: 25,
          alignItems: "center",
          opacity: pressed ? 0.7 : 1,
          flexDirection: "row",
          justifyContent: "center",
          gap: 8,
        })}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          ▶ Listen on YouTube
        </Text>
      </Pressable>
    </View>
  );
}