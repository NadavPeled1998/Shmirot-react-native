import React, { useState, useEffect, useContext } from 'react'
import { View, FlatList, AsyncStorage, TouchableOpacity, Image, Text } from 'react-native'
import { inject, observer } from "mobx-react"
import Bottom from '../../components/Bottom'
import Images from '../../assets'
import { styleContext } from '../../styles'


function GroupsNamesScreen({ navigation, store }) {
    const [loading, setLoading] = useState(true)
    const [existingGroups, setExistingGroups] = useState({})

    const styles = useContext(styleContext)

    useEffect(() => {
        getGroups()
    }, [])

    useEffect(() => {
        if (Object.keys(store.groups).length !== Object.keys(existingGroups).length) {
            setExistingGroups(store.groups)
        }
    }, [store.groups])

    async function getGroups() {
        AsyncStorage.getItem('Groups', async (err, result) => {
            if (result) {
                await setExistingGroups(JSON.parse(result))
                await store.setGroups(JSON.parse(result))
            }
            setLoading(false)
        })
    }

    function chooseGroup(group) {
        store.setGroup(group)
        navigation.navigate('History')
    }

    return (
        <View style={styles.container}>
            { !loading
                ? (
                    <View style={styles.centerContainer}>
                        {Object.keys(existingGroups).length
                            ? (
                                <>
                                    <Image 
                                        style={styles.firstImage} 
                                        source={Images.existingGroups} 
                                        resizeMethod="resize" 
                                    />
                                    <Text style={styles.title}>קבוצות שמורות</Text>
                                    <View style={styles.existingGroupsContainer}>
                                        <FlatList
                                            numColumns={3}
                                            data={Object.keys(existingGroups)}
                                            renderItem={itemData => (
                                                <TouchableOpacity
                                                    style={styles.nameInput}
                                                    onPress={() => chooseGroup(itemData.item)}
                                                    key={itemData.index}
                                                >
                                                    <Text style={styles.textNameInput}>
                                                        {itemData.item}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.title}>
                                        לא שמרת קבוצות עדיין
                                    </Text>
                                    <TouchableOpacity onPress={() => { navigation.navigate('NewGroupScreen') }}>
                                        <Text style={styles.save}>
                                            ליצירת קבוצה חדשה
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        <Bottom back={() => navigation.navigate('HomeScreen')} />
                    </View>
                )
                : null
            }
        </View>
    )
}

export default inject("store")(observer(GroupsNamesScreen))  