import AsyncStorage from '@react-native-async-storage/async-storage';

const storeLikedBook = async (value) => {
  try {
    await AsyncStorage.setItem('my_key', value);
  } catch (e) {
    console.lo(e.value)
  }
};


const getLikedBook = async () => {
  try {
    const value = await AsyncStorage.getItem('my_key');
    if (value !== null) {

    }
  } catch (e) {

  }
};
