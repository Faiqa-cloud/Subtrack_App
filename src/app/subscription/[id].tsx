import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams,Link } from 'expo-router'

const SubscriptionDetails = () => {
  const {id} = useLocalSearchParams<{id :string}>()

  return (
    <View>
      <Text>Subscription Details :{id}</Text>
      <Link href="/">Go to Home</Link>
    </View>
  )
}

export default SubscriptionDetails