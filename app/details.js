import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useStore } from '../storage/store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

export default function Details() {
  const [description, setDescription] = useState('Description not available');
  const [title, setTitle] = useState('');
  const selected = useStore((s) => s.selected);

  useEffect(() => {
    if (!selected) return;

    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `https://openlibrary.org${selected.key}.json`
        );
        const data = response.data;

        if (typeof data.description === 'string') {
          setDescription(data.description);
        } else if (data.description?.value) {
          setDescription(data.description.value);
        }
        console.log(selected)
        setTitle(data.title);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBook();
  }, [selected]);

  if (!selected) {
    return (
      <View style={styles.center}>
        <Text>No item selected.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
       <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {router.push('/(tabs)') }}
        >
          <FontAwesome name="chevron-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Details</Text>
      </View>

     
      <View style={styles.floatingImage}>
        <Image
          source={{
            uri: selected.cover
              ? `https://covers.openlibrary.org/b/olid/${selected.cover}-M.jpg`
              : 'https://placehold.co/180x270.png',
          }}
          style={styles.image}
        />
      </View>
      
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.author}>{selected.author}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f3fa',
  },
  header: {
    height: 150,
    backgroundColor: '#2F49D1',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 60,
    alignItems: 'center',

  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },

  backBtn: {
    position: 'absolute',
    left: 20,
    top: 60,
    padding: 8,
  },
  floatingImage: {
    marginTop: -30,
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
  },

  image: {
    width: 160,
    height: 240,
    borderRadius: 14,
    backgroundColor: '#eee',
  },

  scroll: {
    // paddingTop: 50,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    // elevation: 8,
    marginTop: -30,
    paddingTop: 30
  },

  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 15,
  },

  author: {
    textAlign: 'center',
    fontSize: 14,
    color: '#777',
    marginBottom: 16,
    marginTop: 5,
  },

  description: {
    fontSize: 17,
    lineHeight: 22,
    color: '#333',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
