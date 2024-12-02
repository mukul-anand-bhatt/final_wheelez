import { View, Text, Image } from "react-native";
import { icons } from "@/constants";

const VehicleListed = () => {
  return (
    <View className="flex flex-col justify-center items-center ml-[32px] mt-[200px] w-[300px] h-[300px]">
      <Image className="w-[50px] h-[50px] mb-[10px]" source={icons.checkmark} />
      <Text className="font-JakartaBold text-md">
        Your vehicle has been has listed! {"\n"}
        Please wait for someone to rent it.
      </Text>
    </View>
  );
};
export default VehicleListed;
