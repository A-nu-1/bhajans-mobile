import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import YouTubePlayer from "./YouTubePlayer";

export default function ReaderClient({ bhajan }: any) {
  const [index, setIndex] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [showDesc, setShowDesc] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<
    string | null
  >(null);

  const { width } = Dimensions.get("window");
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    const firstCode =
      bhajan?.translations?.[0]?.language?.code ?? bhajan?.language ?? "kn";

    setSelectedLanguageCode(firstCode);
    setIndex(0);
  }, [bhajan?.id]);

  const availableTranslations = Array.isArray(bhajan?.translations)
    ? bhajan.translations
    : [];

  const selectedTranslation =
    availableTranslations.find(
      (translation: any) =>
        translation?.language?.code === selectedLanguageCode,
    ) ??
    availableTranslations[0] ??
    null;

  const currentTitle = selectedTranslation?.title ?? bhajan?.title ?? "";
  const currentDescription =
    selectedTranslation?.description ?? bhajan?.description ?? null;
  const currentMainText =
    selectedTranslation?.mainText ?? bhajan?.mainText ?? "";
  const currentParagraphs = Array.isArray(selectedTranslation?.paragraphs)
    ? selectedTranslation.paragraphs
    : Array.isArray(bhajan?.paragraphs)
      ? bhajan.paragraphs
      : [];

  const total = currentParagraphs.length || 0;
  const selectedLanguageLabel =
    selectedTranslation?.language?.name ||
    selectedTranslation?.language?.code?.toUpperCase() ||
    "Language";

  useEffect(() => {
    const englishTranslation = bhajan?.translations?.find(
      (translation: any) => translation?.language?.code === "en",
    );

    const firstCode =
      englishTranslation?.language?.code ??
      bhajan?.translations?.[0]?.language?.code ??
      bhajan?.language ??
      "kn";

    setSelectedLanguageCode(firstCode);
    setIndex(0);
  }, [bhajan?.id]);

  const goNext = () => {
    let newIndex = index + 1;

    if (newIndex >= total) newIndex = 0;

    setIndex(newIndex);

    scrollRef.current?.scrollTo({
      x: newIndex * width,
      animated: true,
    });
  };

  const goPrev = () => {
    let newIndex = index - 1;

    if (newIndex < 0) newIndex = total - 1;

    setIndex(newIndex);

    scrollRef.current?.scrollTo({
      x: newIndex * width,
      animated: true,
    });
  };

  const selectLanguage = (code: string) => {
    setSelectedLanguageCode(code);
    setShowLangMenu(false);
    setIndex(0);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(247, 215, 235)" }}>
      <ScrollView
        contentContainerStyle={{
          padding: 12,
          paddingTop: 40,
          paddingBottom: 120,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "600",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          {currentTitle}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
            alignItems: "center",
            zIndex: 30,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {currentDescription ? (
              <Pressable
                onPress={() => setShowDesc(true)}
                style={{ marginRight: 10 }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color={Colors.primary}
                />
              </Pressable>
            ) : null}
          </View>
          <View>
            <Pressable onPress={() => router.push("/(tabs)/BhajansScreen")}>
              <Ionicons name="arrow-back" size={22} color={Colors.primary} />
            </Pressable>
          </View>

          <View
            style={{ flexDirection: "row", alignItems: "center", zIndex: 40 }}
          >
            <View style={{ position: "relative", marginRight: 10, zIndex: 50 }}>
              <Pressable
                onPress={() => setShowLangMenu((value) => !value)}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.7)",
                }}
              >
                <Text style={{ color: Colors.primary, fontWeight: "600" }}>
                  {selectedLanguageLabel}
                </Text>
              </Pressable>

              {showLangMenu && availableTranslations.length > 0 ? (
                <View
                  style={{
                    position: "absolute",
                    top: 38,
                    right: 0,
                    minWidth: 140,
                    backgroundColor: "white",
                    borderRadius: 12,
                    paddingVertical: 6,
                    elevation: 12,
                    zIndex: 60,
                    shadowColor: "#000",
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                  }}
                >
                  {availableTranslations.map((translation: any) => {
                    const code = translation?.language?.code;
                    const label =
                      translation?.language?.name ||
                      code?.toUpperCase() ||
                      "Language";
                    const isSelected = code === selectedLanguageCode;

                    return (
                      <Pressable
                        key={code ?? label}
                        onPress={() => selectLanguage(code)}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          backgroundColor: isSelected
                            ? "rgba(250, 178, 233, 0.35)"
                            : "transparent",
                        }}
                      >
                        <Text
                          style={{
                            color: Colors.primary,
                            fontWeight: isSelected ? "700" : "500",
                          }}
                        >
                          {label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}
            </View>

            <Pressable
              onPress={() => setFontSize((s) => Math.max(14, s - 2))}
              style={{ marginRight: 10 }}
            >
              <Text style={{ color: Colors.primary }}>-A</Text>
            </Pressable>

            <Pressable onPress={() => setFontSize((s) => Math.min(32, s + 2))}>
              <Text style={{ color: Colors.primary }}>A+</Text>
            </Pressable>
          </View>
        </View>

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
            {currentMainText}
          </Text>
        </View>

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
              const i = Math.round(e.nativeEvent.contentOffset.x / width);
              setIndex(i);
            }}
          >
            {currentParagraphs?.map((p: any, i: number) => (
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

        {bhajan.mediaUrl ? <YouTubePlayer url={bhajan.mediaUrl} /> : null}
      </ScrollView>

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

      <Modal visible={showDesc} animationType="slide">
        <ScrollView
          style={{ flex: 1, backgroundColor: "#f9ccf2" }}
          contentContainerStyle={{ padding: 20 }}
        >
          <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 20 }}>
            Description
          </Text>

          <Text style={{ fontSize: 16, lineHeight: 26 }}>
            {currentDescription}
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
