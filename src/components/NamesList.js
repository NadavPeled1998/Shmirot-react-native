import React, { useContext } from 'react'
import { View, FlatList, TextInput } from 'react-native'
import { styleContext } from '../styles'

function NamesList({ data, changeTexInputHandler }) {
    const styles = useContext(styleContext)
    return (
        <View style={styles.inputsContainer}>
            <FlatList
                numColumns={3}
                data={data}
                renderItem={({ item, index }) => (
                    <TextInput
                        key={index}
                        style={styles.nameInput}
                        onChangeText={(inputText) => changeTexInputHandler(inputText, index)}
                        value={item}
                    />
                )}>
            </FlatList>
        </View>
    )
}

export default NamesList