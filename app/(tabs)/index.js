import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  Keyboard,
  ScrollView
} from 'react-native';
import Item from '../../components/item'
import debounce from "lodash/debounce";
import { useSearchCache, useStore } from '../../storage/store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { RFValue } from "react-native-responsive-fontsize";

function Home() {
  
  const [booksList, setBooksList] = useState([])
  const [squery, setSquery] = useState('')
  const [showDrop, setShowDrop] = useState(false)
  const [numFetch, setNumFetch] = useState(0)


  const searchCache = useSearchCache((state)=>state.searchCache)
  // const setSelected = useStore((s) => s.setSelected) 
  const removeFromCache = useSearchCache((s)=>s.rmSearchCache)
  const addSearchCache = useSearchCache((s)=>s.addSearchCache)

  const [loadedImages, setLoadedImages] = useState(0);
  const [imagesReady, setImagesReady] = useState(true);

  useEffect(() => {
  if (loadedImages >= numFetch) {
    setImagesReady(true);
  }else{
    console.log("heha", loadedImages)
  }
}, [loadedImages, numFetch]);

   
  const fetchBooks = async(name)=>{
    try{
        setImagesReady(false);
        setLoadedImages(0);

        const response = await axios.get(`https://openlibrary.org/search.json?q=${name}`)
        const data1 = response.data.docs
        
        const top10 = data1.slice(0,10).map(item=>({
          key: item.key,
          title: item.title,
          author: item.author_name ? item.author_name.join(',') : 'N/A',
          publish_year: item.first_publish_year,
          cover: item.cover_edition_key,
        }))

        setNumFetch(top10.length)

        setBooksList(top10)
        console.log(searchCache)
        addSearchCache({
          key: name,
          value: name
        })

      } catch(err){
        console.log(`Error: ${err}`)
      }
  }

  const debouncedFunction = useCallback(debounce(fetchBooks, 600), []);

  const handleDropBtn = (item) =>{
    setSquery(item.value)
    fetchBooks(item.value)
    console.log("ts")
  }

  return (
    <View style={styles.container}>
      
    <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
    </View>

    <Pressable onPress={(e)=>{setShowDrop(false), Keyboard.dismiss(), console.log("tf"), e.stopPropagation()}} >

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
            onBlur={()=>{setShowDrop(false), console.log("blurred")}}
            style={styles.textInput} 
            placeholderTextColor="black" 
            value={squery}
            />
            <TouchableOpacity style={styles.cancelBtn}
            onPress={()=>{
                      setSquery("")
                      setBooksList()
                    }}
            >
              
              <MaterialIcons name="cancel" size={23} color="black" />
            </TouchableOpacity>
          
            {searchCache && 
              <TouchableOpacity
              onPress={ ()=> setShowDrop(!showDrop)}
              >
                <FontAwesome name="level-down" size={24} color="black" style={{paddingHorizontal: 10 }} />
              </TouchableOpacity> 
            }
        
        </View>
        {showDrop && (
          <View style = {styles.dropCont} 
          onLayout={console.log(imagesReady, "hello")}
          >
            <FlatList 
              data={searchCache}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => item.key}
              renderItem={({item, index})=>(
                
                <View style={[styles.cacheCont, index !== searchCache.length - 1 && styles.separator ]}>   
                <TouchableOpacity
                    style={styles.dropItem}
                    onPress={() => handleDropBtn(item)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.dropText}>
                      {item.value}
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


        <View style={{ backgroundColor: '#f2f2f7', paddingBottom: 100}} >
        {booksList && <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" 
          contentContainerStyle={{
            backgroundColor: '#f2f2f7',
            paddingBottom: 100,
          }}
        >
           {booksList.map((item) => (
            <View key={item.key} >
          <Item item={item} onImageLoadEnd={() =>
              setLoadedImages(prev => prev + 1)
          }/>
          </View>
          ))}
          
        </ScrollView>}
        </View>
        
        </View>
    </Pressable>
    {!imagesReady && (
  <View style={styles.loaderOverlay}>
    <ActivityIndicator size="large" color="#2F49D1" />
  </View>
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#f2f2f7',
  },  
  loaderOverlay: {
   ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(255,255,255,0.9)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100,
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
    alignSelf: 'center',
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
  cancelBtn: {
    position: 'absolute',
    right: RFValue(35),
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  dropCont: {
    position: 'absolute',
    top: 55,
    width: '90%',
    backgroundColor: '#f2f2f7',
    borderRadius: 12,
    maxHeight: 220,
    zIndex: 200,
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
    zIndex: 10
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
