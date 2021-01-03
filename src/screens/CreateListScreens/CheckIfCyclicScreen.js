import React, { useContext } from 'react'
import { View, Image, Text } from 'react-native'
import { inject, observer } from 'mobx-react'
import Bottom from '../../components/Bottom'
import HomePageButton from '../../components/HomePageButton'
import Images from '../../assets'
import { styleContext } from '../../styles'

function CheckIfCyclicScreen({ navigation, store }) {
    const styles = useContext(styleContext)

    function setCycle() {
        store.setMethod('cycle')
        navigation.navigate('CreateListScreen/CycleHourScreen')
    }

    return (
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Image
                    style={styles.firstImage}
                    source={Images.recycle}
                    resizeMethod="resize"
                />
                <Text style={styles.title}>האם השמירות הן מחזוריות?</Text>
                <View style={styles.navigationContainer}>
                    <HomePageButton text='כן' onPress={setCycle} />
                    <HomePageButton text='לא' onPress={() => navigation.navigate('CreateListScreen/ChooseMethodScreen')} />
                </View>
            </View>
            <Bottom
                back={() => navigation.navigate('CreateListScreen/EndTimeScreen')}
                circles={!(store.group) ? 8 : 7}
                bigCircle={!(store.group) ? 6 : 5}
            />
        </View>
    )
}

export default inject("store")(observer(CheckIfCyclicScreen))