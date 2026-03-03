import {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import ItemLiked from '../../components/ItemLiked';
import ItemLikedList from '../../components/ItemLikedList';
import {useLike} from '../../storage/store';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LikeScreen(){

    const likedBooks = useLike((state)=> state.likedStory)
    const[grid, setGrid] = useState(true)
    const[list, setList] = useState(false)
    
 return (
  <View style={styles.container}>
    <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favourites</Text>
      </View>
      
    <View style={styles.TextIncontainer} >
      <View style={styles.headeings}>
        <Text style={{fontSize:28, fontWeight: 600}}>Saved Collection</Text>
        <Text style={{fontSize:18, fontWeight: 350, color: '#888d98'}}>{likedBooks.length} books in collection</Text>
      </View>

      <View style={styles.viewOptions} >
        <TouchableOpacity onPress={()=>{setGrid(true), setList(false)}} >
          <Ionicons name="grid" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{setList(true), setGrid(false)}} >
          <Ionicons name="list-outline" size={24} color="black" />
         </TouchableOpacity>
      </View>

    {grid && (
      <FlatList
        data={likedBooks}
        style={{flex: 1}}
        contentContainerStyle={{
          margin: 0,
          paddingBottom: 100,
           backgroundColor: '#f2f2f7',
        }}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({item})=><ItemLiked item={item} />
        }
        keyExtractor={(item) => item.key}
      />
      )}
    {list && (
      <FlatList
        data={likedBooks}
        style={{flex: 1}}
        contentContainerStyle={{
          margin: 0,
          paddingBottom: 100,
           backgroundColor: '#f2f2f7',
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({item})=><ItemLikedList item={item} />
        }
        keyExtractor={(item) => item.key}
      />
      )}
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
  viewOptions:{
    display: 'flex',
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10, 
    marginBottom: 25,
    gap: 10,
    backgroundColor: '#eaecf4',
    padding: 10,
    width: '25%',
    borderRadius: 15,
  },
  headeings:{
    margin: 10
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