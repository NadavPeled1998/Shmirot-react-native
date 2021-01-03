import React, {useContext} from 'react'
import {View, Modal, Text, TouchableOpacity} from 'react-native'
import {styleContext} from '../../Style'

function LeaveBeforeSaving(props){
    const styles = useContext(styleContext)
    return(
        <Modal visible={props.visible} animationType="fade">
            <View style={styles.alertScreen}>
                <View style={styles.alert}>
                    <Text style={styles.text}>רשימת השמירה לא נשמרה. לאן תרצה להגיע?</Text>
                    <View style={styles.modalButtonContainer}>
                    <TouchableOpacity>
                    <Text style={styles.dontSave} onPress={props.homePage}>
                    דף הבית 
                    </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={props.result}>
                    <Text style={styles.save}>
                        רשימת השמירה
                        </Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default LeaveBeforeSaving