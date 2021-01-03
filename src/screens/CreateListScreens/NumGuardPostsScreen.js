import React, { useState, useContext } from 'react'
import { View, Image, Text, TextInput } from 'react-native'
import { inject, observer } from "mobx-react"
import Bottom from '../../components/Bottom'
import Images from '../../assets'
import { styleContext } from '../../styles'

function NumGuardPostsScreen({ navigation, store }) {
    const [enteredValue, setEnteredValue] = useState("")
    const [rule, setRule] = useState("")

    const styles = useContext(styleContext);

    function changeNumberHandler(inputText) {
        setEnteredValue(inputText.replace(/[^0-9]/g, ""))
        setRule('')
    }

    async function moveToNextPage() {
        const numberOfGuardPosts = parseInt(enteredValue)
        const { members, setNumGuardPosts, setGuardPosts } = store
        if (members.length < numberOfGuardPosts) setRule('אי אפשר שיהיה יותר עמדות מחיילים')
        else if (isNaN(numberOfGuardPosts) || numberOfGuardPosts < 2) {
            setNumGuardPosts(1)
            setGuardPosts([])
            navigation.navigate('CreateListScreen/StartTimeScreen')
        }
        else {
            store.setNumGuardPosts(numberOfGuardPosts)
            navigation.navigate('CreateListScreen/GuardPostsNameScreen')
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Image
                    style={styles.firstImage}
                    source={Images.postGuard}
                    resizeMethod="resize"
                />
                <Text style={styles.title}>כמה עמדות?</Text>
                <TextInput
                    keyboardType="number-pad"
                    maxLength={2}
                    style={rule ? styles.inputRequired : styles.input}
                    value={enteredValue}
                    onChangeText={changeNumberHandler}
                    onSubmitEditing={moveToNextPage}
                />
                <Text style={styles.rule}>{rule}</Text>
            </View>
            <View style={{ flex: 0.45 }} />
            <Bottom
                back={() => navigation.navigate('CreateListScreen/MembersNameScreen')}
                forward={moveToNextPage}
                circles={!(store.group) ? 8 : 7}
                bigCircle={!(store.group) ? 2 : 1}
            />
        </View>
    )
}

export default inject("store")(observer(NumGuardPostsScreen))