import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SectionList,
} from "react-native";
import { Video } from "expo-av";
import axios from "axios";
import { useSelector } from "react-redux";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import host from "../../../configHost";

const Tab = createMaterialTopTabNavigator();
function Anh({ route }) {
  const account = useSelector((state) => state.account);
  const [dataAnhVideoSortByDate, setDataAnhSortByDate] = useState([]);
  async function getImageFileLink() {
    try {
      const res = await axios.get(
        `${host}users/getMessageByIdSenderAndIsReceiver?idSender=${account.id}&idReceiver=${route.params.account.id}`

      );
      if (res.data) {
        const sortedData = res.data.sort(
          (a, b) => new Date(a.senderDate) - new Date(b.senderDate)
        );
        const image = sortedData.filter((item) => {
          return (
            item.messageType === "PNG" ||
            item.messageType === "JPEG" ||
            item.messageType === "JPG" ||
            item.messageType === "VIDEO"
          );
        });
        // const a = image.slice(0, 20);
        const groupedData = groupDataByDate(image);
        setDataAnhSortByDate(groupedData);
      }
    } catch (error) {
      console.log("get image file link error", error);
    }
  }

  useEffect(() => {
    getImageFileLink();
  }, []);

  const groupDataByDate = (data) => {
    const groupedData = [];
    data.forEach((item) => {
      const date = new Date(item.senderDate).toDateString();
      const existingGroup = groupedData.find((group) => group.date === date);
      if (existingGroup) {
        existingGroup.data.push(item);
      } else {
        groupedData.push({ date, data: [item] });
      }
    });
    return groupedData;
  };
                                   
  const getDayDifference = (date) => {
    const today = new Date();
    const dateObj = new Date(date);
    const diffTime = Math.abs(today - dateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderSectionHeader = ({ section: { date } }) => {
    const diffDays = getDayDifference(date);
    let sectionTitle = "";
    if (diffDays === 0) {
      sectionTitle = "Hôm nay";
    } else if (diffDays === 1) {
      sectionTitle = "Hôm qua";
    } else {
      sectionTitle = date;
    }
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{sectionTitle}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.imageContainer}>
        {item.messageType === "VIDEO" ? (
          <Video
            source={{ uri: item.url }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
          />
        ) : (
          <Image source={{ uri: item.url }} style={styles.image} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={dataAnhVideoSortByDate}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />
    </View>
  );
}

function File({route}) {
  const [dataFileSortByDate, setFileSortByDate] = useState([]);
  const account = useSelector((state) => state.account);
  async function getFileFileLink() {
    try {
      const res = await axios.get(
        `${host}users/getMessageByIdSenderAndIsReceiver?idSender=${account.id}&idReceiver=${route.params.account.id}`
      );
      if (res.data) {
        const sortedData = res.data.sort(
          (a, b) => new Date(a.senderDate) - new Date(b.senderDate)
        );
        const file = sortedData.filter((item) => {
          return (
            item.messageType === "PDF" ||
            item.messageType === "DOC" ||
            item.messageType === "DOCX" ||
            item.messageType === "PPT" ||
            item.messageType === "PPTX" ||
            item.messageType === "RAR" ||
            item.messageType === "JSON" ||
            item.messageType === "XML" ||
            item.messageType === "CSV" ||
            item.messageType === "HTML" ||
            item.messageType === "XLSX" ||
            item.messageType === "XLS" ||
            item.messageType === "ZIP" ||
            item.messageType === "TXT"
          );
        });
        // const a = file.slice(0, 20);
        const groupedData = groupDataByDate(file);
        setFileSortByDate(groupedData);
      }
    } catch (error) {
      console.log("get image file link error", error);
    }
  }

  useEffect(() => {
    getFileFileLink();
  }, []);

  const groupDataByDate = (data) => {
    const groupedData = [];
    data.forEach((item) => {
      const date = new Date(item.senderDate).toDateString();
      const existingGroup = groupedData.find((group) => group.date === date);
      if (existingGroup) {
        existingGroup.data.push(item);
      } else {
        groupedData.push({ date, data: [item] });
      }
    });
    return groupedData;
  };

  const getDayDifference = (date) => {
    const today = new Date();
    const dateObj = new Date(date);
    const diffTime = Math.abs(today - dateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderSectionHeader = ({ section: { date } }) => {
    const diffDays = getDayDifference(date);
    let sectionTitle = "";
    if (diffDays === 0) {
      sectionTitle = "Hôm nay";
    } else if (diffDays === 1) {
      sectionTitle = "Hôm qua";
    } else {
      sectionTitle = date;
    }
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{sectionTitle}</Text>
      </View>
    );
  };
  const truncateFileName = (fileName) => {
    if (fileName.length > 29) {
      return (
        fileName.substring(0, 24)  +"..."
        //  +
        // fileName.substring(fileName.length - 7)
      );
    }
    return fileName;
  };
  // get user by id
   function getNameUserById(id) {
    try {
      if(id===route.params.account.id){
        return route.params.account.name.toString();
      }
      else{
       return account.userName
      }

    } catch (error) {
      console.log("get user by id error", error);
    }
  }
  // getNameUserById("RGpCgF0lR1aGVcttckhAbBHWcSp2")
  const renderFileItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.fileItem}>
        <Text style={styles.fileName}>{truncateFileName(item.titleFile)}{item.messageType}</Text>
        <Text style={styles.fileDetails}>Size: {item.size} KB</Text>
        <Text style={styles.fileDetails}>{getNameUserById(item.sender.id)}</Text> 
        <TouchableOpacity style={styles.fileOptionsButton}>
          <Text style={styles.fileOptionsButtonText}>...</Text>

        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={dataFileSortByDate}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderFileItem}
        renderSectionHeader={renderSectionHeader}
      />
    </View>
  );
}

const OptionChat3 = ({ navigation, route }) => {
  return (
    <Tab.Navigator>
      {/* <Tab.Screen name="Anh" component={() => <Anh route={route} />} /> */}
      <Tab.Screen name="Ảnh"
      initialParams={{ account: route.params.account }}
      component={Anh} />

      <Tab.Screen name="File" component={File} 
         initialParams={{ account: route.params.account}}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9EBED",
    alignItems: "center",
    paddingTop: 10,
  },
  sectionHeader: {
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  image: {
    width: 350,
    height: 200,
    resizeMode: "cover",
  },
  video: {
    width: 350,
    height: 200,
  },
  fileItem: {
    width: 350,
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 30,
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  fileName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  fileDetails: {
    fontSize: 14,
    color: "#888",
  },
  fileOptionsButton: {
    position: "absolute",
    top: 20,
    right: 10,
  },
  fileOptionsButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#888",
  },
});
export default OptionChat3;
