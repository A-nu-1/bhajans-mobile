import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  TextInput,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { getBhajans, getCategories, searchBhajans } from "@/services/bhajans";

import { Bhajan, Category } from "@/types/bhajan";
import { Colors } from "@/constants/theme";

export default function BhajansScreen() {
  const [bhajans, setBhajans] = useState<Bhajan[]>([]);
  const [allBhajans, setAllBhajans] = useState<Bhajan[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // LOAD INITIAL DATA
  useEffect(() => {
    loadInitial();
    getCategories().then(setCategories);
  }, []);

  async function loadInitial() {
    setLoading(true);
    const data = await getBhajans();
    setAllBhajans(data);
    setBhajans(data);
    setLoading(false);
  }

  // SEARCH
  async function handleSearch(text: string) {
    setQuery(text);

    if (!text.trim()) {
      loadInitial();
      return;
    }

    setLoading(true);
    const data = await searchBhajans(text);
    setBhajans(data);
    setLoading(false);
  }

  // CATEGORY FILTER (client-side fallback OR backend-ready)
  async function onSelectCategory(name: string | null) {
    setSelectedCategory(name);
    setLoading(true);

    const data = await getBhajans({
      search: query || undefined,
      category: name,
    });

    setBhajans(data);
    setLoading(false);
  }

  const openMediaUrl = async (url: string | null | undefined) => {
    if (!url) return;
    try {
      const Linking = require("react-native").Linking;
      Linking.openURL(url);
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 30,
        backgroundColor: "rgb(247, 215, 235)",
        paddingBottom: 120,
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          marginTop: 10,
          color: Colors.primary,
          textAlign: "center",
        }}
      >
        Om Namo Yogeshwaraya
      </Text>

      {/* SEARCH */}
      <View
        style={{
          margin: 12,
          position: "relative",
          justifyContent: "center",
        }}
      >
        <TextInput
          placeholder="Search bhajans..."
          value={query}
          onChangeText={handleSearch}
          style={{
            padding: 10,
            paddingRight: 45,
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: "rgb(249, 184, 224)",
            color: "#000000",
          }}
        />

        {query.length > 0 && (
          <Pressable
            onPress={() => handleSearch("")}
            hitSlop={10}
            style={{
              position: "absolute",
              right: 12,
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "600",
                color: "#555",
              }}
            >
              ×
            </Text>
          </Pressable>
        )}
      </View>

      {/* CATEGORY BAR */}
      <View style={{ height: 60, marginBottom: 8 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: 12,
            gap: 10,
          }}
        >
          <Pressable
            onPress={() => onSelectCategory(null)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: !selectedCategory ? Colors.primary : "#eee",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: !selectedCategory ? "#fff" : "#000",
                fontWeight: "500",
              }}
            >
              All ({allBhajans.length})
            </Text>
          </Pressable>

          {[...categories]
            .sort((a, b) => (b._count?.bhajans ?? 0) - (a._count?.bhajans ?? 0))
            .map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => onSelectCategory(cat.name)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor:
                    selectedCategory === cat.name ? Colors.primary : "#eee",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: selectedCategory === cat.name ? "#fff" : "#000",
                    fontWeight: "500",
                  }}
                >
                  {cat.name} ({cat._count?.bhajans || 0})
                </Text>
              </Pressable>
            ))}
        </ScrollView>
      </View>

      <ScrollView style={{ padding: 12 }}>
        {/* LOADING */}
        {loading && <Text>Loading...</Text>}

        {/* LIST */}
        {bhajans.map((b) => (
          // MODIFIED: Container is now a basic View to prevent gesture conflicts
          <View
            key={b.id}
            style={{
              backgroundColor: "rgb(249, 184, 224)",
              borderRadius: 16,
              marginVertical: 8,
              padding: 16,
              elevation: 3,
              flexDirection: "row", // Aligns content text and media button side-by-side
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* LEFT SIDE: Pressing this area goes to the details page */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/bhajans/[id]",
                  params: { id: b.id },
                })
              }
              style={{ flex: 1, marginRight: 8 }}
            >
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                {b.titleEnglish ?? b.title}
              </Text>
              <Text style={{ color: "#555", marginTop: 4 }}>{b.title}</Text>
            </Pressable>

            {/* RIGHT SIDE: Dedicated YouTube Media Trigger */}
            {b.mediaUrl && (
              <Pressable
                onPress={() => openMediaUrl(b.mediaUrl)}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? "#cc0000" : "#ff0000",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                })}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}
                >
                  ▶
                </Text>
              </Pressable>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
