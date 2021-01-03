import React, {useState, useEffect, useContext} from 'react'
import { View, FlatList, AsyncStorage, TouchableOpacity, Image, Text} from 'react-native'
import Bottom from '../../components/Bottom'
import { inject, observer } from "mobx-react";
import { styleContext } from '../../Style';


function GroupsNames({navigation, store}){
    const [loading, setLoading] = useState(true)
    const [existingGroups, setExistingGroups] = useState({})

    const styles = useContext(styleContext)

    async function chooseGroup(group){
        store.setGroup(group)
        navigation.navigate('History')
    }

    async function getGroups(){
        AsyncStorage.getItem('Groups', async (err,result) => {
            if(result){
                await setExistingGroups(JSON.parse(result))
                await store.setGroups(JSON.parse(result))
            }
            setLoading(false)
        })
    }

    useEffect(()=> {
        getGroups()
    },[])

    useEffect(() => {
        if(Object.keys(store.groups).length !== Object.keys(existingGroups).length){
            setExistingGroups(store.groups)
        }
    },[store.groups])

    if(!(loading)){
    if(Object.keys(existingGroups).length){
        return (
        <View style={styles.container}>
            <View style={styles.centerContainer}>
            <Image style={styles.firstImage} source={require('../../assets/existing-groups.png')}/>
                <Text style={styles.title}>קבוצות שמורות</Text>
                <View style={styles.existingGroupsContainer}>
                <FlatList
                numColumns={3}
                data = {Object.keys(existingGroups)}
                renderItem = {itemData => (
                    <TouchableOpacity style={styles.nameInput} onPress={() => chooseGroup(itemData.item)}>
                    <Text style={styles.textNameInput}>
                    {itemData.item}
                    </Text>
                    </TouchableOpacity>
                )}
                />
                </View>
            </View>
            <Bottom back={() => navigation.navigate('HomeScreen')}>
            </Bottom>
            </View>
        )
    }
    else{
        return(
            <View style={styles.centerContainer}>
                <View style={styles.centerContainer}>
                    <Text style={styles.title}>
                    לא שמרת קבוצות עדיין
                    </Text>
                    <TouchableOpacity onPress={()=> {navigation.navigate('NewGroupScreen')}}>
                        <Text  style={styles.save}>
                        ליצירת קבוצה חדשה
                        </Text>
                    </TouchableOpacity>
                </View>
                <Bottom back={() => navigation.navigate('HomeScreen')}/>
            </View>
        )
    }
    }
    else{
        return(
            <View style={styles.container}>
            </View>
        )
    }
}

export default inject("store")(observer(GroupsNames))  