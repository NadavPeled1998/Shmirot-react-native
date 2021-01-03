import React, { useContext } from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { styleContext } from '../styles'

function HomePageButton({ text, onPress }) {
    const styles = useContext(styleContext)
    return (
        <TouchableOpacity style={styles.homeButton} onPress={onPress}>
            <Text style={styles.homeTitle}>{text}</Text>
        </TouchableOpacity>
    )
}

export default HomePageButton