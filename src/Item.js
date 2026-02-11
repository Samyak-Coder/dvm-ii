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
import { useNavigation } from '@react-navigation/native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {useLike, useStore, useSearchCache} from './store';


const Item = ({ item, onImageLoadEnd  }) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false)
  const anim = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  const addLikedStory = useLike((state)=> state.addLikedStory)
  const deslikeStory = useLike((state)=> state.dislikeStory)
  const likedBooks = useLike((state)=> state.likedStory)

  const navigation = useNavigation()

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
    navigation.navigate('Details')
    addSearchCache(item)
    
  }

  return (
      <TouchableOpacity style={styles.item} onPress={toggleList} activeOpacity={0.9}>
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
            <Text style={styles.title}>{item.title}</Text>
          </View>

          <Animated.View
            style={{
              height: heightInterpolate,
              overflow: 'hidden',
            }}
            pointerEvents={expanded ? 'auto' : 'none'} //mouse pointer ke liye
          >
            <View
              style={styles.hiddenTxt}
              onLayout={(e) => {
                const h = e.nativeEvent.layout.height; 
                if (contentHeight === 0 && h > 0) setContentHeight(h);
              }}
            >
            <View style={styles.metaRow}>
              <View style={styles.metaText}>
                <Text style={styles.meta}><Text style ={{fontWeight: 'bold'}}>Author:</Text> {item.author}</Text>
                <Text style={styles.meta}><Text style ={{fontWeight: 'bold'}}>Publish Year:</Text> {item.publish_year}</Text>
              </View>

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
              <FontAwesome name={liked ? "heart" : "heart-o"} size={24} color="black" style={{padding: 10}}/>
            </TouchableOpacity>
            </View>
            <View style={{display: 'flex', alignItems: 'center', margin: 10,}}>
              <TouchableOpacity 
      style={styles.blueButton}
      onPress={() => toDetails(item)}
    >
      <Text style={styles.buttonText}>See Details</Text>
      <Text style={styles.arrow}>{'>'}</Text>
    </TouchableOpacity>
              {/* <Button title="See Details"  color ="#58c4dc" style={{ width: '60%', color: 'black'}} titleStyle={{color: 'black'}}/> */}
            </View>
            </View>
          </Animated.View>
          
          {contentHeight === 0 && (
        <View
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h && h > 0) setContentHeight(h);
          }}
        >
          <View
              style={styles.hiddenTxt}
              onLayout={(e) => {
                const h = e.nativeEvent.layout.height; 
                if (contentHeight === 0 && h > 0) setContentHeight(h);
              }}
            >
            <View style={styles.metaRow}>
              <View style={styles.metaText}>
                <Text style={styles.meta}>Author: {item.author}</Text>
                <Text style={styles.meta}>Publish Year: {item.publish_year}</Text>
              </View>

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
              <FontAwesome name={liked ? "heart" : "heart-o"} size={24} color="black" style={{padding: 10}}/>
            </TouchableOpacity>
            </View>
            <View style={{display: 'flex', alignItems: 'center', margin: 10,}}>
              <TouchableOpacity 
      style={styles.blueButton}
      onPress={() => console.log('Button Pressed')}
    >
      <Text style={styles.buttonText}>See Details</Text>
      <Text style={styles.arrow}>{'>'}</Text>
    </TouchableOpacity>
              {/* <Button title="See Details"  color ="#58c4dc" style={{ width: '60%', color: 'black'}} titleStyle={{color: 'black'}}/> */}
            </View>
            </View>
        </View>
      )}
        </View>
      </TouchableOpacity>
  );
};

export default Item;

const styles = StyleSheet.create({
  item: {
    margin: 10,
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
  },
  innerBtnCtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, 
     
  },
  hiddenTxt: {
    display: 'flex',
    marginLeft: 10,
    // fontSize: 20,
    paddingVertical: 8,
  },
  hiddenFont: {
    fontSize: 20
  },
  metaRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  paddingBottom: 5,
   borderBottomWidth: 1,
  borderBottomColor: '#eee',
},

metaText: {
  flex: 1,              
  paddingRight: 8, 
  paddingTop: 10,     
},

meta: {
  fontSize: 17,
  flexWrap: "wrap",    
},

heartBtn: {
  padding: 10,
  flexShrink: 0,        
},
boldTxt:{
 fontStyle: 'bold' 
},
blueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 30, 
    
    backgroundColor: '#3F62D7', 

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    elevation: 5,
    
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  arrow: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 6, 
  }

});
