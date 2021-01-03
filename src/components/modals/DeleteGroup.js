import React, {useContext} from 'react'
import {View, Modal, Text, TouchableOpacity} from 'react-native'
import {styleContext} from '../../Style'

function DeleteGroup(props){
    const styles = useContext(styleContext)
    return(
        <Modal visible={props.visible} animationType="fade">
            <View style={styles.alertScreen}>
                <View style={styles.alert}>
                    <Text style={styles.text}>לא ניתן לשחזר קבוצות שנמחקו. בטוחים שאתם רוצים למחוק אותה?</Text>
                    <View style={styles.modalButtonContainer}>
                    <TouchableOpacity>
                    <Text style={styles.dontSave} onPress={props.delete}>
                    מחק
                    </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={props.dontDelete}>
                    <Text style={styles.save}>
                        אל תמחק
                    </Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default DeleteGroup