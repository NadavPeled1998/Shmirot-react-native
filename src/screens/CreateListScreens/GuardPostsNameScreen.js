import React, { useState, useEffect, useContext } from 'react'
import { View, Text } from 'react-native'
import { inject, observer } from 'mobx-react'
import Bottom from '../../components/Bottom'
import Nameslist from '../../components/NamesList'
import { styleContext } from '../../styles'

function GuardPostsNameScreen({ navigation, store }) {
    const [guardPosts, setGuardPosts] = useState([])

    const styles = useContext(styleContext);

    function changeTexInputHandler(inputText, index) {
        const newGuardPosts = guardPosts.slice()
        newGuardPosts[index] = inputText
        setGuardPosts(newGuardPosts)
    }

    function getNumOfPostGuards() {
        let guardPostsArray = []
        for (let i = 0; i < store.numGuardPosts; i++) {
            guardPostsArray.push(`עמדה מס' ${i + 1}`)
        }
        setGuardPosts(guardPostsArray)
    }

    async function movetoStartTimeForward() {
        let newGuardPosts = []
        guardPosts.map(guardPost => {
            if (guardPost !== '') newGuardPosts.push(guardPost)
        })
        if (newGuardPosts.length > 1) {
            setGuardPosts(newGuardPosts)
            store.setGuardPosts(newGuardPosts)
        }
        else {
            store.setNumGuardPosts(1)
            store.setGuardPosts([])
        }
        navigation.navigate('CreateListScreen/StartTimeScreen')
    }

    useEffect(() => {
        getNumOfPostGuards()
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Text style={styles.guardPostNameTitle}>כאן אתם יכולים לתת שמות לעמדות</Text>
                <Nameslist data={guardPosts} changeTexInputHandler={changeTexInputHandler} />
            </View>
            <View style={{ flex: 0.2 }} />
            <Bottom
                back={() => navigation.navigate('CreateListScreen/NumGuardPostsScreen')}
                forward={movetoStartTimeForward}
                circles={!(store.group) ? 8 : 7}
                bigCircle={!(store.group) ? 3 : 2}
            />
        </View>
    )
}

export default inject("store")(observer(GuardPostsNameScreen))