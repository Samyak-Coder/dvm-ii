import {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text
} from 'react-native';
import ItemLiked from '../../components/ItemLiked';
import {useLike} from '../../storage/store';

export default function LikeScreen(){

    const likedBooks = useLike((state)=> state.likedStory)
    
 return (
    <View style={styles.container}>
    <View style={styles.header}>
        <Text style={styles.headerTitle}>Like</Text>
      </View>
    <View style={styles.TextIncontainer} >
      <FlatList
        data={likedBooks}
        style={{flex: 1}}
        contentContainerStyle={{
          margin: 0,
          paddingBottom: 100,
           backgroundColor: '#f2f2f7',
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({item})=><ItemLiked item={item} />
        }
        keyExtractor={(item) => item.key}
      />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
     backgroundColor: '#f2f2f7',
    
  },  
  TextIncontainer: {
     backgroundColor: '#f2f2f7',
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