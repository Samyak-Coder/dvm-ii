import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  Text,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import Item from './Item'
import debounce from "lodash/debounce";
import { useNavigation } from '@react-navigation/native'
import { useSearchCache, useStore } from './store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

function Home() {
  
  const [booksList, setBooksList] = useState([])
  // const [expectedImages, setExpectedImages] = useState(0);
  // const [loadedImages, setLoadedImages] = useState(0);
  // const [imagesReady, setImagesReady] = useState(true);
  const [squery, setSquery] = useState('')
  const [showDrop, setShowDrop] = useState(false)

  const searchCache = useSearchCache((state)=>state.searchCache)
  const setSelected = useStore((s) => s.setSelected) 
  const removeFromCache = useSearchCache((s)=>s.rmSearchCache)

  const navigation = useNavigation()

//   useEffect(() => {
//   if (expectedImages > 0 && loadedImages >= expectedImages) {
//     setImagesReady(true);
//   }
// }, [loadedImages, expectedImages]);
   
  const fetchBooks = async(name)=>{
    try{
        const response = await axios.get(`https://openlibrary.org/search.json?q=${name}`)

        const data1 = response.data.docs
        
        const top10 = data1.slice(0,10).map(item=>({
          key: item.key,
          title: item.title,
          author: item.author_name ? item.author_name.join(',') : 'N/A',
          publish_year: item.first_publish_year,
          cover: item.cover_edition_key,
        }))

        const imageCount = top10.filter(item => item.cover).length;

        setBooksList(top10)
        // setExpectedImages(imageCount);
        // setLoadedImages(0);
        // setImagesReady(imageCount === 0)
      } catch(err){
        console.log(`Error: ${err}`)
      }
  }

  const debouncedFunction = useCallback(debounce(fetchBooks, 600), [])

  const handleDropBtn = (item) =>{
    setSquery(item.title)
    setSelected(item)
    navigation.navigate('Details')
  }

  return (
    <View style={styles.container}>
    <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
    </View>
    <View style={styles.TextIncontainer} >
    <View style={styles.TIWrapper}>
      <View style ={styles.tiContainer} >
      <TextInput 
      placeholder='Search using OpenLibrary...' 
      onChangeText={(e)=>{
        setSquery(e)
        debouncedFunction(e)
        setShowDrop(e.length == 0)
        }
      } 
      onFocus={ () =>setShowDrop(true)}
      onBlur={()=>setShowDrop(false)}
      style={styles.textInput} 
      placeholderTextColor="black" 
      value={squery}
      onEndEditing={()=>console.log(squery)}
      />
      {searchCache && 
      <TouchableOpacity
      onPress={ ()=> setShowDrop(!showDrop)}
      >
        <FontAwesome name="level-down" size={24} color="black" style={{paddingHorizontal: 10 }} />
    </TouchableOpacity> 
    }
      </View>
      {showDrop && (
        <View style = {styles.dropCont} >
          <FlatList 
            data={searchCache}
            keyExtractor={(item) => item.key}
            renderItem={({item, index})=>(
              <View style={[styles.cacheCont, index !== searchCache.length - 1 && styles.separator ]}>
                <TouchableOpacity
                  style={styles.dropItem}
                  onPress={() => handleDropBtn(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropText}>
                    {item.title}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => removeFromCache(item.key)}
                >
                  <MaterialIcons name="cancel" size={18} color="#444" />
                </TouchableOpacity>
            </View>

        )}
          />
        </View>
      )}
      </View>
      <FlatList
        data={booksList}
        renderItem={({item})=><Item item={item} />
        }
        keyExtractor={(item) => item.key}
        removeClippedSubviews = {true}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        onImageLoadEnd={() =>
        setLoadedImages(prev => prev + 1)
      }
      />
    </View>
    {/* {!imagesReady && (
  <View style={styles.loaderOverlay}>
    <ActivityIndicator size="large" color="#2F49D1" />
  </View>
)} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#f9fafb',
    
  },  
  // loaderOverlay: {
  // ...StyleSheet.absoluteFillObject,
  // backgroundColor: "rgba(255,255,255,0.9)",
  // justifyContent: "center",
  // alignItems: "center",
  // zIndex: 100,
  // },  
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
    backgroundColor: "#2F49D1",
    paddingTop: 60,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    textAlign: 'center'
  },
  TIWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  textInput:{
    borderWidth: 2,
    borderRadius: 15,
    height: 50,
    width: '75%',
    borderBlockColor: '#545151',
    padding: 10,
    color: 'black'
  },
  dropCont: {
    position: 'absolute',
    top: 55,
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: 220,
    zIndex: 1000,
    elevation: 10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  dropItem:{
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropText: {
    flex: 1,
    fontSize: 15,
    color: '#111',
    marginRight: 10,
  },
  tiContainer:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cacheCont: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  separator:{
     borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

dropItem: {
  flex: 1,
  paddingVertical: 12,
  paddingHorizontal: 14,
},

dropText: {
  fontSize: 15,
  color: '#111',
  lineHeight: 20,
},

closeBtn: {
  marginRight: 10,
  marginTop: 12,
  justifyContent: 'center',
  alignItems: 'center',
},

});

export default Home;
