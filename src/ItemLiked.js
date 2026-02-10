import { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useStore, useLike } from "./store";

const ItemLiked = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(true);

  const anim = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  const addLikedStory = useLike((s) => s.addLikedStory);
  const dislikeStory = useLike((s) => s.dislikeStory);
  const setSelected = useStore((s) => s.setSelected);
  const navigation = useNavigation();

  const toggle = () => {
    Animated.timing(anim, {
      toValue: expanded ? 0 : 1,
      duration: 280,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const heightInterpolate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const onLike = () => {
    setLiked((prev) => {
      const next = !prev;
      next ? addLikedStory(item) : dislikeStory(item.key);
      return next;
    });
  };

  const toDetails = () => {
    setSelected(item);
    navigation.navigate("Details");
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={toggle}
      style={styles.wrapper}
    >
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <Image
            source={{
              uri: item.cover
                ? `https://covers.openlibrary.org/b/olid/${item.cover}-M.jpg`
                : "https://placehold.co/60x90.png",
            }}
            style={styles.cover}
          />

          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        </View>

        {/* EXPANDABLE */}
        <Animated.View
  style={{ height: heightInterpolate, overflow: "hidden" }}
  pointerEvents={expanded ? "auto" : "none"}
>
  <View
    style={styles.expand}
    onLayout={(e) => {
      if (!contentHeight) {
        setContentHeight(e.nativeEvent.layout.height);
      }
    }}
  >
    <TouchableOpacity
      style={styles.heartBtn}
      onPress={onLike}
      activeOpacity={0.7}
    >
      <FontAwesome
        name={liked ? "heart" : "heart-o"}
        size={22}
        color={liked ? "#E53935" : "#444"}
      />
    </TouchableOpacity>

    <Text style={styles.meta}>Author: {item.author}</Text>
    <Text style={styles.meta}>Publish Year: {item.publish_year}</Text>

    <TouchableOpacity
      style={styles.moreBtn}
      activeOpacity={0.8}
      onPress={toDetails}
    >
      <Text style={styles.moreText}>`MORE`</Text>
    </TouchableOpacity>
  </View>
</Animated.View>

      </View>
    </TouchableOpacity>
  );
};

export default ItemLiked;

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginVertical: 10,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    elevation: 4,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  cover: {
    width: 60,
    height: 90,
    borderRadius: 6,
  },

  title: {
    flex: 1, // ✅ ONLY flexible column
    fontSize: 20,
    fontWeight: "600",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  meta: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },

  likeBtn: {
    width: 44, // 🔒 fixed width
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },

  expand: {
  marginTop: 12,
  paddingRight: 40,
},

heartBtn: {
  position: "absolute",
  top: 0,
  right: 0,
  width: 36,
  height: 36,
  justifyContent: "center",
  alignItems: "center",
},

meta: {
  fontSize: 14,
  color: "#444",
  marginBottom: 6,
},

moreBtn: {
  marginTop: 14,
  alignSelf: "center",
  backgroundColor: "#58c4dc",
  paddingHorizontal: 26,
  paddingVertical: 10,
  borderRadius: 10,
},

moreText: {
  color: "#fff",
  fontWeight: "700",
  letterSpacing: 0.5,
},

});
