import React, { Component } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { MuliText } from "components/StyledText";
import { Ionicons } from "@expo/vector-icons";
import images from "assets/images/images";
import colors from "assets/Color";
import moment from "moment";
import { recommend } from "api/sittingRequest.api";
import { createInvitation } from 'api/invitation.api';

export default class RecommendScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchedCount: 0,
      listMatched: [],
      recommendCount: 0,
      recommendList: []
    };

    this.sendInvitation = this.sendInvitation.bind(this);
  }

  getRecommendation = async () => {
    let data = await recommend(1);
    this.setState({
      matchedCount: data.matchedCount,
      listMatched: data.listMatched,
      recommendCount: data.recommendCount,
      recommendList: data.recommendList
    });

    return data;
  };

  calAge = function(dateOfBirth) {
    let born = this.getYear(dateOfBirth);
    let now = moment().year();
    return now - born;
  };

  getYear = function(dateOfBirth) {
    let arr = dateOfBirth.split("-");
    return arr[0];
  };

  sendInvitation = async function(receiverId) {
    let invitation = {
    "requestId": 1,
    "status": "PENDING",
    "receiver": receiverId,
    }

    console.log(invitation);

    try {
      let response = await createInvitation(invitation);
      console.log(response);
      
    } catch (error) {
      console.log(error.message);
    }

  }

  componentWillMount() {
    this.getRecommendation();
  }

  // netstat -ano | findstr 3000
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.sectionContainer}>
          <View style={styles.headerSection}>
            <Ionicons
              name="ios-arrow-down"
              size={24}
              style={{ marginBottom: -6, marginLeft: 20 }}
              color="#315f61"
            />
            <MuliText
              style={{ fontSize: 18, color: "#315f61", marginLeft: 10 }}
            >
              Recommend ({this.state.recommendCount})
            </MuliText>
          </View>
          {this.state.recommendList.map((item, index) => (
          <View key={item.userId} style={styles.bsitterContainer}>
            <View style={styles.bsitterItem}>
              <TouchableOpacity style={{ flexDirection: "row", flexGrow: 2 }}>
                <Image source={images.parent} style={styles.sitterImage} />
                <View>
                  <View style={styles.upperText}>
                    <MuliText style={styles.bsitterName}>
                      {item.user.nickname} -{" "}
                      {this.calAge(item.user.dateOfBirth)}
                    </MuliText>
                    {item.user.gender == "MALE" && (
                      <Ionicons
                        name="ios-male"
                        size={20}
                        style={{ marginBottom: -2, marginLeft: 20 }}
                        color={colors.blueAqua}
                      />
                    )}
                    {item.user.gender == "FEMALE" && (
                      <Ionicons
                        name="ios-female"
                        size={20}
                        style={{ marginBottom: -2, marginLeft: 20 }}
                        color={colors.pinkLight}
                      />
                    )}
                  </View>
                  <View style={styles.lowerText}>
                    <Ionicons
                      name="ios-pin"
                      size={24}
                      style={{ marginBottom: -4, marginLeft: 20 }}
                      color={colors.lightGreen}
                    />
                    <MuliText> 1.1 km </MuliText>
                    <Ionicons
                      name="ios-star"
                      size={24}
                      style={{ marginBottom: -4, marginLeft: 20 }}
                      color={colors.lightGreen}
                    />
                    <MuliText> {item.averageRating} </MuliText>
                  </View>
                </View>
              </TouchableOpacity>
              <View></View>
              <TouchableOpacity style={styles.inviteButton} onPress={() => this.sendInvitation(item.userId)}>
                <MuliText style={{ color: "#78ddb6", fontSize: 16 }}>
                  Invite
                </MuliText>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        </View>
        

        <View style={styles.sectionContainer}>
          <View style={styles.headerSection}>
            <Ionicons
              name="ios-arrow-down"
              size={24}
              style={{ marginBottom: -6, marginLeft: 20 }}
              color="#315f61"
            />
            <MuliText
              style={{ fontSize: 18, color: "#315f61", marginLeft: 10 }}
            >
              Matched Babysitter ({this.state.matchedCount})
            </MuliText>
          </View>
          {this.state.listMatched.map((item, index) => (
            <View key={item.userId} style={styles.bsitterContainer}>
              <View style={styles.bsitterItem}>
                <TouchableOpacity style={{ flexDirection: "row", flexGrow: 2 }}>
                  <Image source={images.parent} style={styles.sitterImage} />
                  <View>
                    <View style={styles.upperText}>
                      <MuliText style={styles.bsitterName}>
                        {item.user.nickname} -{" "}
                        {this.calAge(item.user.dateOfBirth)}
                      </MuliText>
                      {item.user.gender == "MALE" && (
                        <Ionicons
                          name="ios-male"
                          size={20}
                          style={{ marginBottom: -2, marginLeft: 20 }}
                          color={colors.blueAqua}
                        />
                      )}
                      {item.user.gender == "FEMALE" && (
                        <Ionicons
                          name="ios-female"
                          size={20}
                          style={{ marginBottom: -2, marginLeft: 20 }}
                          color={colors.pinkLight}
                        />
                      )}
                    </View>
                    <View style={styles.lowerText}>
                      <Ionicons
                        name="ios-pin"
                        size={24}
                        style={{ marginBottom: -4, marginLeft: 20 }}
                        color={colors.lightGreen}
                      />
                      <MuliText> 1.1 km </MuliText>
                      <Ionicons
                        name="ios-star"
                        size={24}
                        style={{ marginBottom: -4, marginLeft: 20 }}
                        color={colors.lightGreen}
                      />
                      <MuliText> 4.1 </MuliText>
                    </View>
                  </View>
                </TouchableOpacity>
                <View></View>
                <TouchableOpacity style={styles.inviteButton} onPress={() => this.sendInvitation(item.userId)}>
                  <MuliText style={{ color: "#78ddb6", fontSize: 16 }}>
                    Invite
                  </MuliText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

RecommendScreen.navigationOptions = {
  title: "Recommend babysitter"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dfe6e9"
  },
  textInput: {
    borderColor: "#EEEEEE",
    width: 300,
    height: 60,
    borderWidth: 2,
    borderRadius: 30,
    padding: 10,
    fontFamily: "muli"
  },
  sectionContainer: {
    backgroundColor: "white",
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10
  },
  headerSection: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#bdc3c7",
    height: 60,
    alignItems: "center",
    marginBottom: 15
  },
  bsitterContainer: {
    marginTop: 20,
    justifyContent: "center"
  },
  bsitterItem: {
    flexDirection: "row"
  },
  upperText: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginLeft: 15,
    flex: 1,
    alignItems: "center"
  },
  lowerText: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center"
  },
  submitButton: {
    width: 300,
    height: 60,
    padding: 10,
    backgroundColor: "#315F61",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },

  inviteButton: {
    marginRight: 20,
    flex: 1,
    justifyContent: "center"
  },
  bsitterName: {
    fontSize: 18,
    fontWeight: "400",
    color: "#315F61"
  },
  contentContainer: {
    paddingTop: 30
  },
  buttonContainer: {
    paddingTop: 30,
    alignItems: "center"
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  textContainer: {
    alignItems: "center",
    marginTop: 10
  },
  sitterImage: {
    width: 65,
    height: 65,
    borderRadius: 20,
    resizeMode: "contain"
  }
});