import React, { useEffect, useContext } from 'react'
import { View, Image } from 'react-native'
import { inject, observer } from "mobx-react"
import HomePageButton from '../components/HomePageButton'
import Images from '../assets'
import { styleContext } from '../styles'

function HomeScreen({ navigation, store }) {
    const styles = useContext(styleContext);

    useEffect(() => {
        store.resetGroup()
    }, [])

    return (
        <View style={styles.centerContainer}>
            <Image style={styles.mainImage} source={Images.fullLogo} resizeMethod="resize" />
            <View style={styles.navigationContainer}>
                <HomePageButton text='צור קבוצה חדשה' onPress={() => navigation.navigate('NewGroupScreen')} />
                <HomePageButton text='קבוצות קיימות' onPress={() => navigation.navigate('ExistingGroupsScreen')} />
            </View>
        </View>
    )
}

export default inject("store")(observer(HomeScreen))
