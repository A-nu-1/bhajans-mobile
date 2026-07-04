import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import YouTubePlayer from "./YouTubePlayer";

export default function ReaderClient({ bhajan, paragraphs }: any) {
  const [index, setIndex] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [showDesc, setShowDesc] = useState(false);

  const { width } = Dimensions.get("window");
  const scrollRef = useRef<any>(null);

  const total = paragraphs?.length || 0;

  // 👉 NEXT (infinite)
  const goNext = () => {
    let newIndex = index + 1;

    if (newIndex >= total) newIndex = 0; // loop

    setIndex(newIndex);

    scrollRef.current?.scrollTo({
      x: newIndex * width,
      animated: true,
    });
  };

  // 👉 PREV (infinite)
  const goPrev = () => {
    let newIndex = index - 1;

    if (newIndex < 0) newIndex = total - 1; // loop

    setIndex(newIndex);

    scrollRef.current?.scrollTo({
      x: newIndex * width,
      animated: true,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(247, 215, 235)" }}>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={{
          padding: 12,
          paddingTop: 40,
          paddingBottom: 120,
        }}
      >
        {/* TITLE */}
        <Text
          style={{
            fontSize: 28,
            fontWeight: "600",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          {bhajan.title}
        </Text>

        {/* TOP BAR */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
            alignItems: "center",
          }}
        >
          {bhajan.description && (
            <Pressable onPress={() => setShowDesc(true)}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={Colors.primary}
              />
            </Pressable>
          )}

          <Pressable onPress={() => router.push("/(tabs)/BhajansScreen")}>
            <Ionicons name="arrow-back" size={22} color={Colors.primary} />
          </Pressable>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable onPress={() => setFontSize((s) => Math.max(14, s - 2))}>
              <Text style={{ color: Colors.primary }}>-A</Text>
            </Pressable>

            <Pressable onPress={() => setFontSize((s) => Math.min(32, s + 2))}>
              <Text style={{ color: Colors.primary }}>A+</Text>
            </Pressable>
          </View>
        </View>

        {/* MAIN TEXT */}
        <View
          style={{
            backgroundColor: "rgb(249, 184, 224)",
            borderRadius: 18,
            padding: 20,
            marginBottom: 15,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize,
              lineHeight: fontSize * 1.8,
            }}
          >
            {bhajan.mainText}
          </Text>
        </View>

        {/* PARAGRAPHS SWIPE */}
        <View style={{ marginBottom: 20 }}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            decelerationRate="fast"
            snapToInterval={width}
            snapToAlignment="start"
            disableIntervalMomentum
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const i = Math.round(
                e.nativeEvent.contentOffset.x / width
              );
              setIndex(i);
            }}
          >
            {paragraphs?.map((p: any, i: number) => (
              <View
                key={i}
                style={{
                  width,
                  flex: 1,
                  padding: 20,
                  backgroundColor: "rgb(249, 184, 224)",
                  borderRadius: 18,
                  elevation: 5,
                }}
              >
                <Text
                  style={{
                    fontSize,
                    lineHeight: fontSize * 1.8,
                  }}
                >
                  {p.text}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {bhajan.mediaUrl ? (
          <YouTubePlayer url={bhajan.mediaUrl} />
        ) : null}

      </ScrollView>

      {/* FIXED BOTTOM NAV (NOW WORKS WITH SWIPE) */}
      <View
        style={{
          position: "absolute",
          bottom: 50,
          left: 20,
          right: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "rgb(243, 202, 227)",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 25,
          elevation: 10,
        }}
      >
        <Pressable onPress={goPrev}>
          <Text style={{ color: Colors.primary }}>◀ Prev</Text>
        </Pressable>

        <Text style={{ color: Colors.primary }}>
          {index + 1} / {total}
        </Text>

        <Pressable onPress={goNext}>
          <Text style={{ color: Colors.primary }}>Next ▶</Text>
        </Pressable>
      </View>

      {/* DESCRIPTION MODAL */}
      <Modal visible={showDesc} animationType="slide">
        <ScrollView
          style={{ flex: 1, backgroundColor: "#f9ccf2" }}
          contentContainerStyle={{ padding: 20 }}
        >
          <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 20 }}>
            Description
          </Text>

          <Text style={{ fontSize: 16, lineHeight: 26 }}>
            {bhajan.description}
          </Text>

          <Pressable
            onPress={() => setShowDesc(false)}
            style={{
              marginTop: 30,
              padding: 14,
              backgroundColor: "#fab2e9",
              borderRadius: 20,
              alignItems: "center",
            }}
          >
            <Text>Close</Text>
          </Pressable>
        </ScrollView>
      </Modal>
    </View>
  );
}