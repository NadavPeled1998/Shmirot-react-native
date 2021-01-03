import React, { useState, useEffect, useContext } from 'react'
import { View, Text, TextInput } from 'react-native'
import { inject, observer } from 'mobx-react'
import Bottom from '../../components/Bottom'
import NamesList from '../../components/NamesList'
import { styleContext } from '../../styles'


function MembersNameScreen({ navigation, store }) {
    const [enteredName, setEnteredName] = useState("")
    const [members, setMembers] = useState([])
    const [rule, setRule] = useState('')

    const styles = useContext(styleContext);

    function changeTextHandler(inputText) {
        setEnteredName(inputText)
        setRule('')
    }

    function submitEditingHandler() {
        let newMembers = members.slice()
        let makeMore = true
        for (let i = 0; i < newMembers.length; i++) {
            if (newMembers[i] === "") {
                newMembers[i] = enteredName
                makeMore = false
                break
            }
        }
        if (makeMore) newMembers.push(enteredName)
        setMembers(newMembers)
    }

    function changeTexInputHandler(inputText, index) {
        setRule('')
        let newMembers = members.slice()
        newMembers[index] = inputText
        setMembers(newMembers)
    }

    function getNumberOfMembers() {
        const { group, groups, num } = store
        const newMembers = group
            ? [...new Set(groups[group].members[groups[group].members.length - 1].filter(member => member))]
            : Array.from({ length: num }, () => '')
        setMembers(newMembers)
    }

    function movetoNumGuardPostsForward() {
        let newMembers = []
        members.map(member => {
            if (member != '') newMembers.push(member)
        })
        if (newMembers.length > 1) {
            setMembers(newMembers)
            store.setMembers(newMembers)
            navigation.navigate('CreateListScreen/NumGuardPostsScreen')
        }
        else setRule('צריך לפחות שני חיילים בשביל ליצור רשימת שמירה')
    }

    useEffect(() => {
        getNumberOfMembers()
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Text style={styles.title}>{!(store.group)
                    ? 'מה השמות שלכם?'
                    : 'זה הזמן למחוק/להוסיף חברים נוספים..'
                }
                </Text>
                <TextInput
                    style={rule ? styles.inputRequired : styles.input}
                    onChangeText={changeTextHandler}
                    onSubmitEditing={() => { setEnteredName(""), submitEditingHandler(enteredName) }}
                    value={enteredName} />
                <Text style={styles.rule}>{rule}</Text>
                <NamesList data={members} changeTexInputHandler={changeTexInputHandler}/>
            </View>
            <View style={{ flex: 0.2 }}/>
            <Bottom
                back={() => !(store.group)
                    ? navigation.navigate('NewGroupScreen')
                    : navigation.navigate('History')
                }
                forward={movetoNumGuardPostsForward}
                circles={!(store.group) ? 8 : 7}
                bigCircle={!(store.group) ? 1 : 0}
            />
        </View>
    )
}

export default inject("store")(observer(MembersNameScreen))