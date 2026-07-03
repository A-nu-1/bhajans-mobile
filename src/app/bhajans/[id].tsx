import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { api } from "@/services/bhajans";

// import your reader component (adjust path if needed)
import ReaderClient from "@/components/ReaderClient";

export default function BhajanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [bhajan, setBhajan] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/bhajans/${id}`);
        setBhajan(res.data);
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

  return <ReaderClient bhajan={bhajan} paragraphs={bhajan.paragraphs} />;
}