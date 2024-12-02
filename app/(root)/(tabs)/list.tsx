import { useUser } from "@clerk/clerk-expo";
import { BackHandler, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import { useFetch } from "@/lib/fetch";
import { Ride } from "@/types/type";
import InputField from "@/components/InputField";
import { Cloudinary } from "cloudinary-core";

import CustomButton from "@/components/CustomButton";
import { useEffect, useState } from "react";
import { icons } from "@/constants";
import { ScrollView, ActivityIndicator } from "react-native";
import { Alert } from "react-native";
import VehicleListed from "@/components/VehicleListed";
import * as Location from "expo-location";

const Rides = () => {
  const { user } = useUser();
  const [isChooseModalVisible, setisChooseModalVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isMultipleDeleteModalVisible, setIsMultipleDeleteModalVisible] =
    useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [noOfImages, setNoOfImages] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const [isDeleteIconVisible, setIsDeleteIconVisible] = useState(false);
  const [scootyNumber, setScootyNumber] = useState("");
  const [price, setPrice] = useState("");
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    data: recentRides,
    loading,
    error,
  } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

  const cld = new Cloudinary({
    cloud: {
      cloudName: "dov8y0g7e", // Replace with your Cloudinary cloud name
    },
    url: {
      secure: true, // Use secure URLs
    },
  });

  const options = {
    upload_preset: "ml_default", // Replace with your upload preset
    unsigned: true,
  };

  const handleImageUpload = async (uri: string) => {
    try {
      const formData = new FormData();

      // Append the file data
      formData.append("file", {
        uri: uri, // Local file path
        type: "image/jpeg", // Adjust the MIME type as needed
        name: "upload.jpg", // A name for the file
      });

      // Append the upload preset and folder name
      formData.append("upload_preset", options.upload_preset);
      formData.append("folder", "wheelez"); // Specify the folder name

      if (options.unsigned) {
        formData.append("unsigned", "true");
      }

      // Make the POST request to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cld.config().cloud.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      // Log the result for debugging
      console.log("Upload success:", result);

      return result; // Return the result for further use
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // const uploadedImage = await handleImageUpload(result.assets[0].uri); // Upload the image to Cloudinary
      setImages((prevImages) => [...prevImages, result.assets[0].uri]); // Add uploaded image URL
      setNoOfImages(noOfImages + 1);
    }
    setisChooseModalVisible(false);
  };

  const takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // const uploadedImage = await handleImageUpload(result.assets[0].uri); // Upload the image to Cloudinary
      setImages((prevImages) => [...prevImages, result.assets[0].uri]); // Add uploaded image URL
      setNoOfImages(noOfImages + 1);
    }
    setisChooseModalVisible(false);
  };

  const handleImagePress = (image: string) => {
    if (isLongPressed) {
      if (selectedImages.includes(image)) {
        setSelectedImages(selectedImages.filter((image1) => image1 != image));
      } else setSelectedImages([...selectedImages, image]);
    } else {
      setSelectedImage(image);
      setIsImageModalVisible(true);
    }
  };

  function handleDelete() {
    if (selectedImage) {
      const newImages = images.filter((image) => image !== selectedImage);
      setImages(newImages);
      setSelectedImage(null);
      setIsImageModalVisible(false);
      setNoOfImages(noOfImages - 1);
    }
  }
  function handleMoreThan4() {
    setShowWarning(true);
    const timer = setTimeout(() => setShowWarning(false), 2000);
    return () => clearTimeout(timer);
  }

  function handleLongPress(image: string) {
    setIsLongPressed(true);
    setSelectedImages([...selectedImages, image]);
    setIsDeleteIconVisible(true);
  }

  function handleMultipleDelete() {
    const newImages = images.filter((image) => !selectedImages.includes(image));
    setImages(newImages);
    setNoOfImages(newImages.length);
    setSelectedImages([]);
    setIsLongPressed(false);
    setIsDeleteIconVisible(false);
  }

  // async function handleSubmit() {
  //   if (
  //     scootyNumber.length == 10 &&
  //     price.length > 0 &&
  //     phoneNumber.length == 10
  //   ) {
  //     setIsLoaderVisible(true);
  //     for (let i = 0; i < images.length; i++) {
  //       const response = await handleImageUpload(images[i]);
  //       images[i] = response.secure_url;
  //     }
  //     let latAndLong;
  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status === "granted") {
  //       const location = await Location.getCurrentPositionAsync({});
  //       const { latitude, longitude } = location.coords;
  //       latAndLong = `${latitude},${longitude}`;
  //     } else {
  //       console.log("Permission denied");
  //     }
  //     const data = {
  //       scootyNumber,
  //       price,
  //       phoneNumber,
  //       images,
  //       latAndLong,
  //     };
  //     console.log(data);

  //     setIsLoaderVisible(false);
  //     setIsSubmitted(true);
  //   } else if (scootyNumber.length < 10) {
  //     Alert.alert(
  //       "Empty scooty number", // Title of the alert
  //       "Enter valid scooty number", // Alert message
  //       [{ text: "OK", onPress: () => console.log("OK Pressed") }],
  //       { cancelable: true } // Whether the alert can be dismissed by tapping outside
  //     );
  //   } else if (price.length == 0) {
  //     Alert.alert(
  //       "Empty price", // Title of the alert
  //       "Enter a price", // Alert message
  //       [{ text: "OK", onPress: () => console.log("OK Pressed") }],
  //       { cancelable: true } // Whether the alert can be dismissed by tapping outside
  //     );
  //   } else if (phoneNumber.length < 10) {
  //     Alert.alert(
  //       "Empty phone number", // Title of the alert
  //       "Enter valid phone number", // Alert message
  //       [{ text: "OK", onPress: () => console.log("OK Pressed") }],
  //       { cancelable: true } // Whether the alert can be dismissed by tapping outside
  //     );
  //   }
  // }

  async function handleSubmit() {
    if (
      scootyNumber.length == 10 &&
      price.length > 0 &&
      phoneNumber.length == 10
    ) {
      setIsLoaderVisible(true);
      for (let i = 0; i < images.length; i++) {
        const response = await handleImageUpload(images[i]);
        images[i] = response.secure_url;
      }
      let latitude;
      let longitude;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        latitude = location.coords.latitude;
        longitude = location.coords.longitude;
      } else {
        console.log("Permission denied");
      }
      const data = {
        scootyNumber,
        price,
        phoneNumber,
        location: { latitude, longitude },
        photos: images,
      };
      setIsLoaderVisible(false);
      setIsSubmitted(true);
      try {
        const response = await fetch("/(api)/ride/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
          console.log("Data successfully saved:", result.data);
        } else {
          console.error("Error:", result.error);
        }
      } catch (error) {
        console.error("Error submitting data:", error);
      } finally {
        setIsLoaderVisible(false);
      }
    } else {
      console.log("Validation failed. Check your inputs.");
    }
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isLongPressed) {
          setIsLongPressed(false);
          setSelectedImages([]);
          setIsDeleteIconVisible(false);
          return true;
        }
        return false;
      }
    );

    const removeBackHandler = () => {
      backHandler.remove();
    };

    if (!isLongPressed) {
      removeBackHandler();
    }

    return () => backHandler.remove();
  }, [isLongPressed]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        {isSubmitted ? (
          <VehicleListed />
        ) : (
          <View>
            <View className="flex-1 ml-[25px] pb-[110px]">
              <Text className="text-2xl font-JakartaBold my-5">
                List your two wheeler
              </Text>
              <View className="w-[315px]">
                <InputField
                  label="Scooty number"
                  placeholder="Enter Scooty number"
                  autoCapitalize="characters"
                  value={scootyNumber}
                  onChangeText={setScootyNumber}
                />
                <InputField
                  label="Price"
                  placeholder="Enter the price you want to set"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
                <InputField
                  label="Phone number"
                  placeholder="Enter your phone number"
                  keyboardType="numeric"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
                <Text className="text-lg font-JakartaSemiBold mt-[10px] mb-[10px]">
                  Upload 4 images of your scooty
                </Text>
                {noOfImages != 4 ? (
                  <CustomButton
                    title="Upload Images"
                    className="mt-[10px]"
                    onPress={() => {
                      setisChooseModalVisible(true);
                    }}
                  />
                ) : (
                  <View>
                    <CustomButton
                      title="Upload Images"
                      className="mt-[10px]"
                      onPress={handleMoreThan4}
                    />
                    {showWarning && (
                      <Text className="mt-[10px] ml-[10px] text-red-700 font-semibold">
                        Do not upload more than 4 images
                      </Text>
                    )}
                  </View>
                )}
                <Modal
                  isVisible={isChooseModalVisible}
                  onBackButtonPress={() => {
                    setisChooseModalVisible(false);
                  }}
                  onBackdropPress={() => {
                    setisChooseModalVisible(false);
                  }}
                >
                  <View className="bg-white flex-1 max-h-[200px] justify-center rounded-2xl items-center flex-row">
                    <Pressable onPress={takeImage}>
                      <Image
                        source={{
                          uri: "https://cdn-icons-png.flaticon.com/512/5904/5904483.png",
                        }}
                        className="h-[70px] w-[70px] ml-[30px] mr-[20px]"
                      />
                    </Pressable>
                    <Pressable onPress={pickImage}>
                      <Image
                        source={{
                          uri: "https://t4.ftcdn.net/jpg/04/81/13/43/360_F_481134373_0W4kg2yKeBRHNEklk4F9UXtGHdub3tYk.jpg",
                        }}
                        className="h-[120px] w-[120px]"
                      />
                    </Pressable>
                  </View>
                </Modal>

                <View className="flex flex-wrap justify-start flex-row mt-[10px]">
                  {images.map((image, index) => (
                    <View key={index} className="w-1/2 p-1">
                      <Pressable
                        onPress={() => handleImagePress(image)}
                        onLongPress={() => {
                          handleLongPress(image);
                        }}
                      >
                        <Image
                          source={{ uri: image }}
                          className="w-full h-[150px]"
                        />
                      </Pressable>
                      {selectedImages.includes(image) && (
                        <View className="absolute mt-[105px] ml-[105px]">
                          <Image
                            source={icons.checkmark}
                            className="w-[40px] h-[40px]"
                          />
                        </View>
                      )}
                      {isLongPressed && !selectedImages.includes(image) && (
                        <View className="absolute mt-[106px] ml-[106px]">
                          <Image
                            source={icons.circle}
                            className="w-[38px] h-[38px]"
                          />
                        </View>
                      )}
                    </View>
                  ))}
                </View>

                <Modal
                  isVisible={isImageModalVisible}
                  onBackButtonPress={() => {
                    setIsImageModalVisible(false);
                  }}
                  onBackdropPress={() => {
                    setIsImageModalVisible(false);
                  }}
                >
                  <View className="bg-white flex-1 max-h-[250px] justify-center rounded-3xl items-center flex-row mt-[30px]">
                    {selectedImage && (
                      <Image
                        source={{ uri: selectedImage }}
                        className="w-full h-[250px] rounded-3xl"
                      />
                    )}
                  </View>
                  <Pressable onPress={handleDelete}>
                    <Image
                      source={icons.deleteIcon}
                      className="w-[60px] h-[60px] mt-[30px] ml-[130px]"
                    />
                  </Pressable>
                </Modal>
                {isDeleteIconVisible && selectedImages.length > 0 && (
                  <Pressable
                    onPress={() => {
                      setIsMultipleDeleteModalVisible(true);
                    }}
                  >
                    <Image
                      source={icons.deleteIcon}
                      className="w-[60px] h-[60px] mt-[12px] ml-[128px]"
                    />
                  </Pressable>
                )}
                <Modal
                  isVisible={isMultipleDeleteModalVisible}
                  onBackButtonPress={() => {
                    setIsMultipleDeleteModalVisible(false);
                  }}
                  onBackdropPress={() => {
                    setIsMultipleDeleteModalVisible(false);
                  }}
                >
                  <View className="bg-white flex-1 max-h-[180px] justify-center rounded-3xl items-center mt-[30px]">
                    <Text className="mt-[10px] ml-[10px] font-semibold">
                      Delete {selectedImages.length}{" "}
                      {selectedImages.length == 1 ? "item" : "items"} ?
                    </Text>
                    <View className="flex flex-row justify-center ml-[10px] mt-[50px]">
                      <Pressable
                        onPress={() => {
                          handleMultipleDelete();
                          setIsMultipleDeleteModalVisible(false);
                        }}
                      >
                        <Text className="text-lg font-bold text-red-500 mr-[10px]">
                          Delete
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          setIsMultipleDeleteModalVisible(false);
                        }}
                      >
                        <Text className="text-lg font-bold text-blue-500 ml-[80px]">
                          Cancel
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
                {noOfImages == 4 && !isLongPressed && (
                  <CustomButton
                    title="List my vehicle"
                    className="mt-[10px]"
                    onPress={handleSubmit}
                  />
                )}
              </View>
            </View>
            <Modal isVisible={isLoaderVisible}>
              <ActivityIndicator
                size="large"
                color="#ff0000"
                animating={isLoaderVisible}
              />
            </Modal>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Rides;
