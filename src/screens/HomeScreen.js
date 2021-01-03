import React, { useEffect, useContext } from 'react'
import {View, TouchableOpacity, Text, Image} from 'react-native'
import { inject, observer } from "mobx-react";
import { styleContext } from '../Style';

function HomeScreen({navigation, store }){
    const styles = useContext(styleContext);
    
    useEffect(()=> {
        store.resetGroup()
    },[])

    return (
        <View style={styles.centerContainer}>
        <Image style={styles.mainImage} source={require('../assets/fullLogo.png')}/>
            <View style={styles.navigationContainer}>
            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('NewGroupScreen')}>
                <Text style={styles.homeTitle}>
                צור קבוצה חדשה
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('ExistingGroupsScreen')}> 
                <Text style={styles.homeTitle}>
                קבוצות קיימות
                </Text>                                                          
            </TouchableOpacity>
            </View>
        </View>
    )
}

export default inject("store")(observer(HomeScreen))
    