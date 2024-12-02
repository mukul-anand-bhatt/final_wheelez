import React from "react";
import { View, Text, Image, Pressable } from "react-native";

type ScootyCardProps = {
  item: {
    scooty_number: string;
    price: string;
    phone_number: string;
    latitude: string;
    longitude: string;
    photos: string[];
  };
  onPress: () => void;
};

const ScootyCard: React.FC<ScootyCardProps> = ({ item, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row bg-white rounded-xl overflow-hidden shadow-md mb-4"
    >
      <Image source={{ uri: item.photos[0] }} className="w-1/2 h-32" />
      <View className="flex-1 p-3 justify-center">
        <Text className="text-base font-medium text-gray-800">
          Scooty Number: {item.scooty_number}
        </Text>
        <Text className="text-base font-medium text-gray-800">
          Price: ₹{item.price}
        </Text>
        <Text className="text-base font-medium text-gray-800">
          Contact: {item.phone_number}
        </Text>
        <Text className="text-sm font-medium text-gray-600">
          Location: Lat {item.latitude}, Long {item.longitude}
        </Text>
      </View>
    </Pressable>
  );
};

export default ScootyCard;
