import React, { useState, useContext } from 'react'
import { View, Modal, Text, TextInput, TouchableOpacity } from 'react-native'
import { styleContext } from '../../styles'

function SaveGroup(props) {
    const [groupName, setGroupName] = useState("")

    const styles = useContext(styleContext)

    function setGroupNameHandler(inputText) {
        setGroupName(inputText)
    }
    return (
        <Modal visible={props.visible} animationType="fade">
            <View style={styles.alertScreen}>
                <View style={styles.alert}>
                    <Text style={styles.text}>איך לקרוא לקבוצה החדשה?</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setGroupNameHandler}
                        value={groupName}
                    />
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity>
                            <Text style={styles.dontSave} onPress={() => props.onComeBack()}>
                                אל תשמור
                        </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => props.onSaveGroup(groupName)}>
                            <Text style={styles.save}>
                                שמור קבוצה
                        </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default SaveGroup