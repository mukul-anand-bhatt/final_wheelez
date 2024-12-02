import React from "react";
import { View, Text, FlatList, Image, Modal, Pressable } from "react-native";

type ScootyModalProps = {
  visible: boolean;
  onClose: () => void;
  item?: {
    scooty_number: string;
    price: string;
    phone_number: string;
    latitude: string;
    longitude: string;
    photos: string[];
  };
};

const ScootyModal: React.FC<ScootyModalProps> = ({
  visible,
  onClose,
  item,
}) => {
  if (!item) return null;

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-11/12 bg-white rounded-lg p-5 items-center">
          <FlatList
            data={item.photos}
            keyExtractor={(photo, index) => index.toString()}
            horizontal
            renderItem={({ item: photo }) => (
              <Image
                source={{ uri: photo }}
                className="w-80 h-48 mr-2 rounded-lg"
              />
            )}
          />
          <Text className="text-lg font-semibold text-gray-800 mt-4">
            Scooty Number: {item.scooty_number}
          </Text>
          <Text className="text-lg font-semibold text-gray-800 mt-2">
            Price: ₹{item.price}
          </Text>
          <Text className="text-base text-gray-600 mt-2">
            Contact: {item.phone_number}
          </Text>
          <Text className="text-base text-gray-600 mt-2">
            Location: {item.latitude}, {item.longitude}
          </Text>
          <Pressable
            className="mt-5 bg-gray-800 rounded-lg py-2 px-6"
            onPress={onClose}
          >
            <Text className="text-white text-base font-medium">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ScootyModal;
