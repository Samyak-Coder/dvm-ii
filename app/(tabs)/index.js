import { useState, useEffect, useRef} from 'react';
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
import HorizItem from '../../components/horizItem';
import ItemGrid from '../../components/itemGrid'
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { RFValue } from "react-native-responsive-fontsize";
import Ionicons from '@expo/vector-icons/Ionicons';

function Home() {

  return (
    <View style={styles.container}>
      
    <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <MaterialIcons name="account-circle" size={35} color="#0834d5" />
    </View>
    <ScrollView>
    <View style={{marginTop: 20}}>

      <HorizItem
       link={"https://openlibrary.org/subjects/classic.json?limit=10"}
        name={'Classic Books'} 
      />
      <HorizItem 
      link={"https://openlibrary.org/subjects/fiction.json?limit=10"} 
      name={'Fiction'} 
      />
      <HorizItem 
      link={"https://openlibrary.org/subjects/textbook.json?limit=10"} 
      name={'Textbooks'} 
      />
      <HorizItem 
      link={"https://openlibrary.org/subjects/selfhelp.json?limit=10"} 
      name={'Self Help'} 
      />

    </View>

    </ScrollView>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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

export default Home;