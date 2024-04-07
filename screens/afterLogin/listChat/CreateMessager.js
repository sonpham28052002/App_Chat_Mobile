import { View, Text, SafeAreaView, Platform, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-paper'
import axios from 'axios'

const CreateMessager = () => {
    const [data, setData] = useState([])
    const [text, setText] = useState('')
    useEffect(() => {
        const timerId = setTimeout(() => {
            if (text.trim() != '')
                if (searchAndSort(text, items).resultFounds) {
                    setDataSearch(searchAndSort(text, items))
                }
        }, 1000);
        return () => clearTimeout(timerId);
    }, [text]);

const searchUser = async () => {
    axios.get(`https://deploybackend-production.up.railway.app/account/getAccountByPhone?phone=84387866829`)
    .then(res => {
        setData(res.data)
    })
    .catch(err => {
        console.log(err)
    })
}

  return (
    <SafeAreaView>
        { Platform.OS == "android" && <View style={{height: 30}}/>}
            <View style={{backgroundColor: '#1fadea'}}>
            <Text style={{
                textAlign: 'center',
                fontSize: 40,
                textAlign: 'center',
                margin: 10,
                color: '#fdf8f8'
            }}>Chat together!</Text>
            </View>
            <TextInput style={{
                backgroundColor: 'white',
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
            }}
            placeholder='Search...'
            onChangeText={text => setText(text)}
            value={text}
            />
            <View>
                <FlatList data={data}
                    renderItem={({ item }) => (
                        <TouchableOpacity>
                            <Text>{item.phone}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
    </SafeAreaView>
  )
}

export default CreateMessager