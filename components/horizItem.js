import {useEffect, useState} from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet
} from 'react-native';
import ItemGrid from './itemGrid'
import axios from 'axios';

export default function HorizItem({name, link}){

  const [bookList, setBookList] = useState([])
  const [loader, setLoader] = useState(false)

  useEffect(()=>{
    const fetchBook = async() => {
    try{
      setLoader(true)
      console.log("Classic Fetch")
    let response = await axios.get(link)
    let data = response.data.works.map(item=>({
          key: item.key,
          title: item.title,
          author: item.authors.name ? item.authors.name : 'N/A',
          cover: item.cover_edition_key|| item.cover_id,
        }))
        setBookList(data)
    } catch(error){
      console.log(error)
    } finally{
      setLoader(false)
    }
    }
    fetchBook()
  }, [])

    return(
    <View style={styles.listCont}>
    <Text style={styles.headerTxt}>{name}</Text>
    {loader && <ActivityIndicator />}
    {bookList &&
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 10,
          gap: 15
        }}
        >
        {bookList.map((item) => (
          <View key={item.key} style={{width: 160}}>
            <ItemGrid item={item} />
          </View>
        ))}
      </ScrollView>
    }
    </View>
    )
}


const styles = StyleSheet.create({


  headerTxt:{
    fontSize: 25,
    fontWeight: 600,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  listCont:{
    marginTop: 30,
    padding: 5
  }
  
});