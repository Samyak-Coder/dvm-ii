import { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Button
} from 'react-native';  
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {useLike, useStore, useSearchCache} from '../storage/store';
import { router } from 'expo-router';
import { RFValue } from "react-native-responsive-fontsize";

const ItemLiked = ({ item, onImageLoadEnd  }) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(true)
  const anim = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  const addLikedStory = useLike((state)=> state.addLikedStory)
  const deslikeStory = useLike((state)=> state.dislikeStory)
  const likedBooks = useLike((state)=> state.likedStory)

  const setSelected = useStore((s) => s.setSelected) 
  const addSearchCache = useSearchCache((s)=>s.addSearchCache)


  const handleLike = async (item, bool) => { 
    if (bool) addLikedStory(item)
      else deslikeStory(item.key)
    console.log(bool)
  }

  const toggleList = () => {
    const toValue = expanded ? 0 : 1;
    Animated.timing(anim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const heightInterpolate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const toDetails = (item) =>{
    console.log(item)
    setSelected(item)    
    router.push('/details')
    addSearchCache(item)
    
  }

  return (
    <View style={styles.cardWrapper} >
      <TouchableOpacity style={styles.item} onPress={()=>toDetails(item)} activeOpacity={0.9}>
        <View style={styles.btnContainer}>
          <View style={[styles.innerBtnCtn, expanded ?{borderBottomWidth: 1,
  borderBottomColor: '#eee', paddingBottom: 5}: {}]}>
            <Image
              source={{
                uri: item.cover
                  ? `https://covers.openlibrary.org/b/olid/${item.cover}-M.jpg`
                  : 'https://placehold.co/60x90.png',
              }}
              onLoadEnd={onImageLoadEnd}
              onError={onImageLoadEnd}
              style={{ width: 60, height: 90, borderRadius: 5 }}
            />
            <View style={styles.likeContainer} >
              <TouchableOpacity
                style={styles.heartBtn}
                onPress={() => {
                  setLiked(prev => {
                    const newVal = !prev;
                    handleLike(item, newVal);
                    return newVal;
                  });
                }}
              >
              <FontAwesome name={liked ? "heart" : "heart-o"} size={20} color="#1030d0" />
            </TouchableOpacity>
            </View>
            <Text style={styles.title}>{item.title}</Text>
          </View>

              <View style={styles.metaText}>
                <Text style={styles.meta}>{item.author[0]}</Text>
              </View>


          
        </View>
      </TouchableOpacity>
      </View>
  );
};

export default ItemLiked;

const styles = StyleSheet.create({
  cardWrapper: {
    width: '48%',      
    marginBottom: 20,
  },
  item: {
    // margin: 10,
  },
  title: {
    display: 'flex',
    flex: 1,
    fontSize: 23,
    alignItems: 'center',
    margin: 10,
  },
  btnContainer: {
    overflow: 'hidden',
    borderRadius: 10,
    boxShadow: '5px 5px 5px rgba(0,0,0,0.3)',
    padding: 20,
    backgroundColor: '#fafafa',
  },
  innerBtnCtn: {
    // flexDirection: 'row',
    alignItems: 'center',
    gap: 10, 
     
  },
  likeContainer:{
    position: 'absolute',
    padding: 0,
    top: RFValue(-15),
    right: RFValue(-15),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '50%'
  },
  metaText: {
  alignItems: "flex-start",
  flex: 1,              
  paddingRight: 8, 
    
},

meta: {
  fontSize: 17,
  flexWrap: "wrap",    
},

heartBtn: {
  padding: 10,  
  alignSelf: 'center' 
},
boldTxt:{
 fontStyle: 'bold' 
},

});
