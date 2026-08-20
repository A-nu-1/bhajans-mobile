import { getBhajanById } from "@/services/bhajans";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

// import your reader component (adjust path if needed)
import ReaderClient from "@/components/ReaderClient";

export default function BhajanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [bhajan, setBhajan] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBhajanById(id as string);
        setBhajan(data);
      } catch (err) {
        console.log("error loading bhajan", err);
      }
    }

    if (id) load();
  }, [id]);

  if (!bhajan) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <ReaderClient bhajan={bhajan} />;
}