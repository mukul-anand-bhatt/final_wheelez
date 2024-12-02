// import { useUser } from "@clerk/clerk-expo";
// import { useAuth } from "@clerk/clerk-expo";
// import * as Location from "expo-location";
// import { router } from "expo-router";
// import { useState, useEffect } from "react";
// import {
//   Text,
//   View,
//   TouchableOpacity,
//   Image,
//   FlatList,
//   ActivityIndicator,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// import GoogleTextInput from "@/components/GoogleTextInput";
// import Map from "@/components/Map";
// import RideCard from "@/components/RideCard";
// import { icons, images } from "@/constants";
// import { useFetch } from "@/lib/fetch";
// import { useLocationStore } from "@/store";
// import { Ride } from "@/types/type";

// const Home = () => {
//   const { user } = useUser();
//   const { signOut } = useAuth();

//   const { setUserLocation, setDestinationLocation } = useLocationStore();

//   const handleSignOut = () => {
//     signOut();
//     router.replace("/(auth)/sign-in");
//   };

//   const [hasPermission, setHasPermission] = useState<boolean>(false);

//   const {
//     data: recentRides,
//     loading,
//     error,
//   } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         setHasPermission(false);
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});

//       const address = await Location.reverseGeocodeAsync({
//         latitude: location.coords?.latitude!,
//         longitude: location.coords?.longitude!,
//       });

//       setUserLocation({
//         latitude: location.coords?.latitude,
//         longitude: location.coords?.longitude,
//         address: `${address[0].name}, ${address[0].region}`,
//       });
//     })();
//   }, []);

//   const handleDestinationPress = (location: {
//     latitude: number;
//     longitude: number;
//     address: string;
//   }) => {
//     setDestinationLocation(location);

//     router.push("/(root)/find-ride");
//   };

//   return (
//     <SafeAreaView className="bg-general-500">
//       <FlatList
//         data={recentRides?.slice(0, 5)}
//         renderItem={({ item }) => <RideCard ride={item} />}
//         keyExtractor={(item, index) => index.toString()}
//         className="px-5"
//         keyboardShouldPersistTaps="handled"
//         contentContainerStyle={{
//           paddingBottom: 100,
//         }}
//         ListEmptyComponent={() => (
//           <View className="flex flex-col items-center justify-center">
//             {!loading ? (
//               <>
//                 <Image
//                   source={images.noResult}
//                   className="w-40 h-40"
//                   alt="No recent rides found"
//                   resizeMode="contain"
//                 />
//                 <Text className="text-sm">No recent rides found</Text>
//               </>
//             ) : (
//               <ActivityIndicator size="small" color="#000" />
//             )}
//           </View>
//         )}
//         ListHeaderComponent={
//           <>
//             <View className="flex flex-row items-center justify-between my-5">
//               <Text className="text-2xl font-JakartaExtraBold">
//                 Welcome {user?.firstName}👋
//               </Text>
//               <TouchableOpacity
//                 onPress={handleSignOut}
//                 className="justify-center items-center w-10 h-10 rounded-full bg-white"
//               >
//                 <Image source={icons.out} className="w-4 h-4" />
//               </TouchableOpacity>
//             </View>

//             <GoogleTextInput
//               icon={icons.search}
//               containerStyle="bg-white shadow-md shadow-neutral-300"
//               handlePress={handleDestinationPress}
//             />

//             <>
//               <Text className="text-xl font-JakartaBold mt-5 mb-3">
//                 Your current location
//               </Text>
//               <View className="flex flex-row items-center bg-transparent h-[300px]">
//                 <Map />
//               </View>
//             </>

//             <Text className="text-xl font-JakartaBold mt-5 mb-3">
//               Recent Rides
//             </Text>
//           </>
//         }
//       />
//     </SafeAreaView>
//   );
// };

// export default Home;

import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { useLocationStore } from "@/store";
import { Ride } from "@/types/type";
import ScootyCard from "@/components/ScootyCards";
import ScootyModal from "@/components/ScootyModal";
import { ScrollView } from "react-native-gesture-handler";

const Home = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const [scootyData, setScootyData] = useState<ScootyData[]>([]);

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const {
    data: recentRides,
    loading,
    error,
  } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      setUserLocation({
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });
    })();
  }, []);

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);

    router.push("/(root)/find-ride");
  };
  type ScootyData = {
    id: number;
    scooty_number: string;
    price: string;
    phone_number: string;
    latitude: string;
    longitude: string;
    photos: string[];
  };

  const [selectedScooty, setSelectedScooty] = useState<
    ScootyData | undefined
  >();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCardPress = (item: ScootyData) => {
    setSelectedScooty(item);
    setIsModalVisible(true);
  };

  // const data: ScootyData[] = [
  //   {
  //     id: 1,
  //     scooty_number: "1234567890",
  //     price: "57",
  //     phone_number: "1234567890",
  //     latitude: "30.4102773",
  //     longitude: "77.9690186",
  //     photos: [
  //       "https://res.cloudinary.com/dov8y0g7e/image/upload/v1732987365/wheelez/upload_bilrbd.jpg",
  //       "https://res.cloudinary.com/dov8y0g7e/image/upload/v1732987366/wheelez/upload_lqdebi.jpg",
  //       "https://res.cloudinary.com/dov8y0g7e/image/upload/v1732987369/wheelez/upload_socesc.jpg",
  //       "https://res.cloudinary.com/dov8y0g7e/image/upload/v1732987403/wheelez/upload_y2mat0.jpg",
  //     ],
  //   },
  // ];

  const fetchScootyData = async () => {
    try {
      const response = await fetch("/(api)/listing", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch listings");
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchScootyData();
        setScootyData(data.data);
      } catch (err) {}
    };

    loadData();
  }, [scootyData]);

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item, index) => index.toString()}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        // ListEmptyComponent={() => (
        //   <View className="flex flex-col items-center justify-center">
        //     {!loading ? (
        //       <>
        //         <Image
        //           source={images.noResult}
        //           className="w-40 h-40"
        //           alt="No recent rides found"
        //           resizeMode="contain"
        //         />
        //         <Text className="text-sm">No recent rides found</Text>
        //       </>
        //     ) : (
        //       <ActivityIndicator size="small" color="#000" />
        //     )}
        //   </View>
        // )}

        ListHeaderComponent={
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl font-JakartaExtraBold">
                Welcome {user?.firstName}👋
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-10 h-10 rounded-full bg-white"
              >
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>
            <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleDestinationPress}
            />
            <>
              <Text className="text-xl font-JakartaBold mt-5 mb-3">
                Your current location
              </Text>
              <View className="flex flex-row items-center bg-transparent h-[300px]">
                <Map />
              </View>
            </>
            return (
            <SafeAreaView className="bg-general-500 flex-1">
              <FlatList
                data={scootyData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <ScootyCard
                    item={item}
                    onPress={() => handleCardPress(item)}
                  />
                )}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={() => (
                  <View className="flex-1 justify-center items-center">
                    <Text>No scooty available</Text>
                  </View>
                )}
              />
              <ScootyModal
                visible={isModalVisible}
                onClose={() => {
                  setSelectedScooty(undefined);
                  setIsModalVisible(false);
                }}
                item={selectedScooty}
              />
            </SafeAreaView>
            );
          </>
        }
      />
    </SafeAreaView>
  );
};

export default Home;
