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
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { RFValue } from "react-native-responsive-fontsize";

function Home() {
  
  const [booksList, setBooksList] = useState([])
  const [squery, setSquery] = useState('')
  const [showDrop, setShowDrop] = useState(true)
  const [numFetch, setNumFetch] = useState(0)


  const searchCache = useSearchCache((state)=>state.searchCache)
  // const setSelected = useStore((s) => s.setSelected) 
  const removeFromCache = useSearchCache((s)=>s.rmSearchCache)
  const addSearchCache = useSearchCache((s)=>s.addSearchCache)
  const resetCache = useSearchCache((s)=>s.resetCache)

  const [loadedImages, setLoadedImages] = useState(0);
  const [imagesReady, setImagesReady] = useState(true);

  useEffect(() => {
  if (loadedImages >= numFetch-1) {
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
          author: item.author_name ? item.author_name : 'N/A',
          publish_year: item.first_publish_year,
          cover: item.cover_edition_key,
        }))

        setNumFetch(top10.length)
        setShowDrop(false)
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
        <MaterialIcons name="account-circle" size={35} color="#0834d5" />
    </View>

    <Pressable onPress={()=>Keyboard.dismiss()} >

      <View>
      <View style={styles.TIWrapper}>

        <View style ={styles.tiContainer} >

            <TextInput 
            placeholder='Search using OpenLibrary...' 
            onChangeText={(e)=>{
              setSquery(e)
              debouncedFunction(e)
              setShowDrop(!(e.length == 0))
              }
            } 
            style={styles.textInput} 
            placeholderTextColor="#798192" 
            value={squery}
            /> 
            <TouchableOpacity style={styles.cancelBtn}
            onPress={()=>{
                      setSquery("")
                      setBooksList()
                      setShowDrop(true)
                    }}
            >
              <MaterialIcons name="cancel" size={23} color="black" />
            </TouchableOpacity>
          
            {/* {searchCache && 
              <TouchableOpacity
              onPress={ ()=> setShowDrop(!showDrop)}
              >
                <FontAwesome name="level-down" size={24} color="black" style={{paddingHorizontal: 10 }} />
              </TouchableOpacity> 
            } */}
        
        </View>
        {showDrop && (
          <View style = {styles.dropCont} >
            <View style = {styles.dropHeader}>
            <Text style={styles.dropHeaderText}>Recent Searches</Text>
            <TouchableOpacity onPress={()=>resetCache()} >
            <Text style={styles.blueHeaderText}>Clear all</Text>
            </TouchableOpacity>
            </View>
            <View style = {styles.dropItemCont}>
            <FlatList 
              data={searchCache}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => item.key}
              renderItem={({item, index})=>(
                
                <View style={styles.cacheCont}>   
                <View>
                  <MaterialIcons name="history" size={24} color="#b4b8c3" />
                </View>
                <TouchableOpacity
                  style={styles.dropItem}
                  onPress={() => handleDropBtn(item)}
                  activeOpacity={0.7}
                >
                    <Text style={styles.dropText}>{item.value}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => {removeFromCache(item.key)}}
                  >
                    <Feather name="x" size={22} color="#b4b8c3" />
                  </TouchableOpacity>
              </View>

          )}
            />
            </View>
          </View>
         )} 
        </View>


        <View style={{ backgroundColor: '#fff', paddingBottom: 100, marginTop: 10}} >
        {booksList && <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" 
          contentContainerStyle={{
            backgroundColor: '#fff',
            paddingBottom: 350,
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
    backgroundColor: '#fff',
  },  
  loaderOverlay: {
   ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(255,255,255,0.9)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100,
  },  
    
  header: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontSize: 35,
    fontWeight: "600",
    textAlign: 'center'
  },
  TIWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  textInput:{
    borderRadius: 30,
    height: 70,
    width: '90%',
    backgroundColor: '#f1f4f9',
    padding: 20,
    color: '#798192',
    fontSize: 15
  },
  cancelBtn: {
    position: 'absolute',
    right: RFValue(20),
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  dropCont: {
    display: 'flex',
    flex: 1,
    flexDirection: 'comlumn',
    borderRadius: 12,
    marginTop: 25,
    // width: "100%",
   alignSelf: 'stretch',
  },
  dropHeader:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between'
  },
  dropHeaderText: {
    fontSize: 20,
    fontWeight: 600
  },
  blueHeaderText:{
    fontSize: 16,
    color: '#4b61a4',
    fontWeight: 500
  },
  dropItemCont: {
    display: 'flex',
  },
  dropItem:{
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    paddingLeft: 15
  },
  dropText: {
    fontSize: 20,
    color: '#585e6b',
    fontWeight: 400
  },
  tiContainer:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cacheCont: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
    padding: 5,
  },



  closeBtn: {
    marginRight: 10,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default Home;
