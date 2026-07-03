import { useEffect, useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput } from "react-native";
import { router } from "expo-router";
import { getBhajans,
    getCategories,
    searchBhajans,
} from "@/services/bhajans";

import { Bhajan, Category } from "@/types/bhajan";
import { Colors } from "@/constants/theme";


export default function BhajansScreen() {
    const [bhajans, setBhajans] = useState<Bhajan[]>([]);
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
    return (
        <View style={{ flex: 1 ,paddingTop: 30, backgroundColor: "rgb(247, 215, 235)", paddingBottom: 110}}>


            <ScrollView style={{ padding: 12 }}>

                {/* SEARCH */}
                <TextInput
                    placeholder="Search bhajans..."
                    value={query}
                    onChangeText={handleSearch}
                    style={{
                        margin: 12,
                        padding: 10,
                        borderWidth: 1,
                        borderRadius: 10,
                        backgroundColor: "rgb(249, 184, 224)",
                        color: "#000000",
                    }}
                />

                {/* CATEGORY BAR */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
                        <Pressable
                            onPress={() => onSelectCategory(null)}
                            style={{
                                padding: 10,
                                borderRadius: 20,
                                backgroundColor: !selectedCategory ? Colors.primary : "#eee",
                            }}
                        >
                            <Text style={{ color: !selectedCategory ? "#fff" : "#000" }}>
                                All ({bhajans.length})
                            </Text>
                        </Pressable>

                        {categories.map((cat) => (
                            <Pressable
                                key={cat.id}
                                onPress={() => onSelectCategory(cat.name)}
                                style={{
                                    padding: 10,
                                    borderRadius: 20,
                                    backgroundColor:
                                        selectedCategory === cat.name ? Colors.primary : "#eee",
                                }}
                            >
                                <Text
                                    style={{
                                        color:
                                            selectedCategory === cat.name ? "#fff" : "#000",
                                    }}
                                >
                                    {cat.name} ({cat._count?.bhajans || 0})
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>

                {/* LOADING */}
                {loading && <Text>Loading...</Text>}

                {/* LIST */}
                {bhajans.map((b) => (
                    <Pressable
                        key={b.id}
                        onPress={() =>
                            router.push({
                                pathname: "/bhajans/[id]",
                                params: { id: b.id },
                            })
                        }
                        style={{
                            backgroundColor: "rgb(249, 184, 224)",
                            borderRadius: 16,
                            marginVertical: 8,
                            padding: 16,
                            elevation: 3,
                        }}
                    >
                        <Text style={{ fontSize: 16, fontWeight: "600" }}>
                            {}{b.title}
                        </Text>
                        <Text>{b.titleEnglish}</Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}

