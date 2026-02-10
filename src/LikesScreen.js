import {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text
} from 'react-native';
import ItemLiked from './ItemLiked';
import {useLike} from './store';

export default function LikeScreen(){

    const likedBooks = useLike((state)=> state.likedStory)
    console.log("likedbooskafasd:", likedBooks)
    
 return (
    <View style={styles.container}>
    <View style={styles.header}>
        <Text style={styles.headerTitle}>Like</Text>
      </View>
    <View style={styles.TextIncontainer} >
      <FlatList
        data={likedBooks}
        renderItem={({item})=><ItemLiked item={item} />
        }
        keyExtractor={(item) => item.key}
        removeClippedSubviews = {true}
      />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#f9fafb',
    
  },  
  TextIncontainer: {
    backgroundColor: "#fff",
    marginTop: -50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    zIndex: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    height: '100%'
  },  
   header: {
    height: 160,
    backgroundColor: "#c83333",
    paddingTop: 60,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    textAlign: 'center'
  },
});