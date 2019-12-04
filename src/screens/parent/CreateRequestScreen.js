/* eslint-disable react/no-string-refs */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { retrieveToken } from 'utils/handleToken';
import moment from 'moment';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from 'react-native';
import { MuliText } from 'components/StyledText';
import DatePicker from 'react-native-datepicker';
import { Ionicons } from '@expo/vector-icons/';
import colors from 'assets/Color';
import {
  updateRequest,
  getOverlapSittingRequest,
} from 'api/sittingRequest.api';
import { CheckBox } from 'native-base';
import { formater } from 'utils/MoneyFormater';
import Toast, { DURATION } from 'react-native-easy-toast';
import AlertPro from 'react-native-alert-pro';
import { getPricings } from 'api/pricing.api';
import { getHolidays } from 'api/holiday.api';
import { getConfigs } from 'api/configuration.api';
import { getUser } from 'api/user.api';

class CreateRequestScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestId: 0,
      userId: null,
      loggedUser: null,
      sittingDate:
        this.props.navigation.getParam('selectedDate') ||
        new moment().format('YYYY-MM-DD'),
      startTime: null,
      endTime: null,
      sittingAddress: null,
      childrenNumber: 0,
      minAgeOfChildren: 0,
      children: [],
      totalPrice: 0,
      overlapRequests: [],
      noticeTitle: '',
      noticeMessage: '',
      cancelAlert: '',
      confirmAlert: '',
      showConfirm: false,
      pricings: [],
      holidays: [],
      officeHourStart: null,
      officeHourEnd: null,
      selectedChildren: [],
    };
    console.log(this.props.navigation.getParam('selectedDate'));
  }

  async componentWillMount() {
    this.getDataAccordingToRole();

    getUser().then((parent) => {
      this.setState({
        loggedUser: parent,
        sittingAddress: parent.address,
        children: parent.parent.children,
      });
    });

    getPricings().then((pricings) => {
      this.setState({ pricings });
    });

    getHolidays().then((holidays) => {
      this.setState({ holidays });
    });

    getConfigs().then((configs) => {
      this.setState({ officeHourStart: configs.officeHourStart, officeHourEnd: configs.officeHourEnd });
    });
  }

  beforeRecommend = () => {
    if (this.state.startTime == null || this.state.endTime == null) {
      this.refs.toast.show(
        'Vui lòng chọn thời gian trông trẻ',
        // DURATION.LENGTH_LONG,
      );
      return;
    }

    const start = moment(this.state.startTime, 'HH:mm');
    const end = moment(this.state.endTime, 'HH:mm').subtract(1, 'hour');
    if (end.isBefore(start)) {
      this.refs.toast.show(
        'Thời gian kết thúc phải cách thời gian bắt đầu ít nhất 1 tiếng',
        // DURATION.LENGTH_LONG,
      );
      return;
    }

    if (this.state.childrenNumber == 0) {
      this.refs.toast.show(
        'Vui lòng chọn ít nhất một trẻ',
        DURATION.LENGTH_LONG,
      );
      return;
    }

    const request = {
      requestId: this.state.requestId != 0 ? this.state.requestId : 0,
      createdUser: this.state.userId,
      sittingDate: this.state.sittingDate,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      sittingAddress: this.state.sittingAddress,
      childrenNumber: this.state.childrenNumber,
      minAgeOfChildren: this.state.minAgeOfChildren,
      status: 'PENDING',
      totalPrice: this.state.totalPrice,
    };

    getOverlapSittingRequest(request)
      .then((result) => {
        // is overlap with other request
        if (result.data.length > 0) {
          this.setState({
            noticeTitle: 'Yêu cầu trùng lặp',
            noticeMessage: `Bạn có ${result.data.length} yêu cầu đã tạo với khoảng thời trên. Tạo yêu cầu trông trẻ sẽ mất phí. Bạn có chắc muốn tạo thêm?`,
            showConfirm: true,
            cancelAlert: 'Hủy',
            confirmAlert: 'Tiếp tục',
            overlapRequests: result.data,
          });
          //
          this.AlertPro.open();
        } else {
          this.toRecommendScreen();
        }
      })
      .catch((error) => {
        if (error.response.status == 409) {
          this.refs.toast.show(
            'Không thể đặt yêu cầu cho ngày giờ ở quá khứ, vui lòng chọn lại.',
            DURATION.LENGTH_LONG,
          );
        } else {
          this.refs.toast.show(
            'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
            DURATION.LENGTH_LONG,
          );
        }
      });
  };

  toRecommendScreen = () => {
    const request = {
      requestId: this.state.requestId != 0 ? this.state.requestId : 0,
      createdUser: this.state.userId,
      sittingDate: this.state.sittingDate,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      sittingAddress: this.state.sittingAddress,
      childrenNumber: this.state.childrenNumber,
      minAgeOfChildren: this.state.minAgeOfChildren,
      status: 'PENDING',
      totalPrice: this.state.totalPrice,
    };

    this.props.navigation.navigate('Recommend', {
      requestId: this.state.requestId,
      request: request,
      onGoBack: (requestId) => this.setState({ requestId: requestId }),
    });

    this.AlertPro.close();
  };

  updateRequest = async () => {
    const request = {
      id: this.state.requestId,
      createdUser: this.state.userId,
      sittingDate: this.state.sittingDate,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      sittingAddress: this.state.sittingAddress,
      childrenNumber: this.state.childrenNumber,
      minAgeOfChildren: this.state.minAgeOfChildren,
      status: 'PENDING',
      totalPrice: this.state.totalPrice,
    };

    // console.log(request);
    await updateRequest(request).then(() => {
      this.props.navigation.navigate('Recommend', {
        requestId: this.state.requestId,
        request: request,
        onGoBack: (requestId) => this.setState({ requestId: requestId }),
      });
    });
  };

  getDataAccordingToRole = async () => {
    await retrieveToken().then((res) => {
      const { userId, roleId } = res;
      this.setState({ userId, roleId });
    });
  };

  toggleHidden = async (key) => {
    // eslint-disable-next-line no-unused-expressions
    key.checked == null ? (key.checked = true) : (key.checked = !key.checked);
    this.forceUpdate();
    await this.calculate();
    this.updatePrice();
  };

  calculate = async () => {
    let childCounter = 0;
    let minAge = 99;
    let selectedChildren = [];
    this.state.children.forEach((element) => {
      if (element.checked) {
        childCounter += 1;
        if (minAge > element.age) minAge = element.age;

        selectedChildren.push(element);
      }
    });

    this.setState({
      childrenNumber: childCounter,
      minAgeOfChildren: minAge,
      selectedChildren,
    });
  };

  updatePrice = async () => {
    if (
      this.state.sittingDate == null ||
      this.state.startTime == null ||
      this.state.endTime == null ||
      this.state.selectedChildren.length <= 0
    ) {
      this.setState({ totalPrice: 0 });
      return;
    }

    let totalPrice = 0;

    const sittingDate = moment(this.state.sittingDate, 'YYYY-MM-DD');
    const isHolyday = this.isHolyday(sittingDate);

    const officeHours = await this.getOfficeHours(); // khoảng thời gian trong giờ hành chính của request này (phút)
    const OTHours = await this.getOTHours(); // khoảng thời gian ngoài giờ hành chính của request này (phút)
    const totalDuration = officeHours + OTHours;
    console.log(
      'Duong: CreateRequestScreen -> updatePrice -> officeHours',
      officeHours,
    );
    console.log(
      'Duong: CreateRequestScreen -> updatePrice -> OTHours',
      OTHours,
    );
    const officeHoursPercentage = officeHours / 60;
    const OTHoursPercentage = OTHours / 60;
    const totalDurationPercentage = totalDuration / 60;

    this.state.selectedChildren.forEach((child) => {
      if (child.age < 0.6) {
        if (isHolyday) {
          totalPrice +=
            this.state.pricings[3].baseAmount *
            this.state.pricings[3].holiday *
            totalDurationPercentage;
        } else {
          totalPrice +=
            this.state.pricings[3].baseAmount *
            this.state.pricings[3].overtime *
            OTHoursPercentage;

          totalPrice +=
            this.state.pricings[3].baseAmount * officeHoursPercentage;
        }
      } else if (child.age < 1.8) {
        if (isHolyday) {
          totalPrice +=
            this.state.pricings[2].baseAmount *
            this.state.pricings[2].holiday *
            totalDurationPercentage;
        } else {
          totalPrice +=
            this.state.pricings[2].baseAmount *
            this.state.pricings[2].overtime *
            OTHoursPercentage;

          totalPrice +=
            this.state.pricings[2].baseAmount * officeHoursPercentage;
        }
      } else if (child.age < 6) {
        if (isHolyday) {
          totalPrice +=
            this.state.pricings[1].baseAmount *
            this.state.pricings[1].holiday *
            totalDurationPercentage;
        } else {
          totalPrice +=
            this.state.pricings[1].baseAmount *
            this.state.pricings[1].overtime *
            OTHoursPercentage;

          totalPrice +=
            this.state.pricings[1].baseAmount * officeHoursPercentage;
        }
      }

      this.setState({ totalPrice });
    });
  };

  getOfficeHours = async () => {
    let officeHours = 0;

    const startTime = moment(this.state.startTime, 'HH:mm');
    const endTime = moment(this.state.endTime, 'HH:mm');
    const officeHStart = moment(this.state.officeHourStart, 'HH:mm');
    const officeHEnd = moment(this.state.officeHourEnd, 'HH:mm');

    const sittingDate = moment(this.state.sittingDate, 'YYYY-MM-DD');
    // Thứ 7, CN
    if (sittingDate.day() == 0 || sittingDate.day() == 6) {
      return officeHours;
    }

    if (
      startTime.isSameOrAfter(officeHStart) &&
      endTime.isSameOrBefore(officeHEnd)
    ) {
      officeHours = endTime.diff(startTime, 'minutes');
      return officeHours;
    }

    if (startTime.isBefore(officeHStart) && endTime.isAfter(officeHEnd)) {
      officeHours = officeHEnd.diff(officeHStart, 'minutes');
      return officeHours;
    }

    if (startTime.isBefore(officeHStart) && endTime.isBefore(officeHStart)) {
      officeHours = 0;
      return officeHours;
    }

    if (startTime.isAfter(officeHEnd) && endTime.isAfter(officeHEnd)) {
      officeHours = 0;
      return officeHours;
    }

    if (startTime.isBefore(officeHStart) && endTime.isBefore(officeHEnd)) {
      officeHours = endTime.diff(officeHStart, 'minutes');
      return officeHours;
    }

    if (startTime.isAfter(officeHStart) && endTime.isAfter(officeHEnd)) {
      officeHours = officeHEnd.diff(startTime, 'minutes');
      return officeHours;
    }
  };

  getOTHours = async () => {
    let OTHours = 0;

    const startTime = moment(this.state.startTime, 'HH:mm');
    const endTime = moment(this.state.endTime, 'HH:mm');
    const officeHStart = moment(this.state.officeHourStart, 'HH:mm');
    const officeHEnd = moment(this.state.officeHourEnd, 'HH:mm');

    const sittingDate = moment(this.state.sittingDate, 'YYYY-MM-DD');
    // Thứ 7, CN
    if (sittingDate.day() == 0 || sittingDate.day() == 6) {
      OTHours = endTime.diff(startTime, 'minutes');
      return OTHours;
    }

    if (
      startTime.isSameOrAfter(officeHStart) &&
      endTime.isSameOrBefore(officeHEnd)
    ) {
      return OTHours;
    }

    if (startTime.isBefore(officeHStart) && endTime.isAfter(officeHEnd)) {
      OTHours += officeHStart.diff(startTime, 'minutes');

      OTHours += endTime.diff(officeHEnd, 'minutes');
      return OTHours;
    }

    if (
      (startTime.isBefore(officeHStart) && endTime.isBefore(officeHStart)) ||
      (startTime.isAfter(officeHEnd) && endTime.isAfter(officeHEnd))
    ) {
      OTHours += endTime.diff(startTime, 'minutes');
      return OTHours;
    }

    if (startTime.isBefore(officeHStart) && endTime.isBefore(officeHEnd)) {
      OTHours += officeHStart.diff(startTime, 'minutes');
      return OTHours;
    }

    if (startTime.isAfter(officeHStart) && endTime.isAfter(officeHEnd)) {
      OTHours += endTime.diff(officeHEnd, 'minutes');
      return OTHours;
    }
  };

  isHolyday = (date) => {
    let result = false;
    const sittingDate = date.format('DD/MM');
    this.state.holidays.forEach((element) => {
      if (sittingDate == element.date) {
        result = true;
        return;
      }
    });

    return result;
  };

  render() {
    const {
      noticeTitle,
      noticeMessage,
      cancelAlert,
      confirmAlert,
      sittingDate,
      startTime,
      endTime,
    } = this.state;

    return (
      <ScrollView>
        <Toast ref="toast" position="top" />
        <AlertPro
          ref={(ref) => {
            this.AlertPro = ref;
          }}
          onConfirm={() => this.toRecommendScreen()}
          onCancel={() => this.AlertPro.close()}
          title={noticeTitle}
          message={noticeMessage}
          textCancel={cancelAlert}
          textConfirm={confirmAlert}
          customStyles={{
            mask: {
              backgroundColor: 'transparent',
            },
            container: {
              shadowColor: '#000000',
              shadowOpacity: 0.1,
              shadowRadius: 10,
            },
            buttonCancel: {
              backgroundColor: colors.canceled,
            },
            buttonConfirm: {
              backgroundColor: colors.buttonConfirm,
            },
          }}
        />
        <View style={styles.containerInformationRequest}>
          <MuliText style={styles.headerTitle}>Trông trẻ</MuliText>
          <View>
            <View style={styles.inputDay}>
              <Ionicons
                name="ios-calendar"
                size={20}
                color={colors.lightGreen}
                style={{
                  marginTop: 10,
                }}
              />
              <DatePicker
                style={styles.pickedDate}
                date={sittingDate}
                mode="date"
                placeholder="Ngày"
                format="YYYY-MM-DD"
                minDate={moment().format('YYYY-MM-DD')}
                maxDate="2019-12-30"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateInput: {
                    borderWidth: 0,
                  },
                  placeholderText: {
                    fontSize: 15,
                    color: colors.lightGreen,
                    marginRight: 75,
                  },
                  dateText: {
                    fontSize: 15,
                    color: colors.lightGreen,
                  },
                }}
                onDateChange={async (date) => {
                  await this.setState({ sittingDate: date });
                  this.updatePrice();
                }}
                showIcon={false}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.input}>
              <Ionicons
                name="ios-timer"
                size={20}
                color={colors.gray}
                style={{
                  marginTop: 10,
                }}
              />

              <DatePicker
                style={styles.pickedTime}
                date={startTime}
                mode="time"
                placeholder="Giờ bắt đầu"
                format="HH:mm"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                androidMode="spinner"
                customStyles={{
                  dateInput: {
                    borderWidth: 0,
                  },
                  placeholderText: {
                    fontSize: 15,
                    color: colors.gray,
                    marginRight: 30,
                  },
                  dateText: {
                    fontSize: 15,
                    color: 'black',
                  },
                }}
                is24Hour
                onDateChange={async (time) => {
                  await this.setState({ startTime: time });
                  this.updatePrice();
                }}
                showIcon={false}
              />
            </View>

            <View style={styles.input}>
              <Ionicons
                name="ios-time"
                size={20}
                color={colors.gray}
                style={{
                  marginTop: 10,
                }}
              />
              <DatePicker
                style={styles.pickedTime}
                // minDate={this.state.startTime}
                date={endTime}
                mode="time"
                placeholder="Giờ kết thúc"
                format="HH:mm"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                androidMode="spinner"
                customStyles={{
                  dateInput: {
                    borderWidth: 0,
                  },
                  placeholderText: {
                    fontSize: 15,
                    color: colors.gray,
                    marginRight: 30,
                  },
                  dateText: {
                    fontSize: 15,
                    color: 'black',
                  },
                }}
                is24Hour
                onDateChange={async (time) => {
                  await this.setState({ endTime: time });
                  this.updatePrice();
                }}
                showIcon={false}
                // minuteInterval={15}
              />
            </View>
          </View>
          <View style={styles.inputAddress}>
            <Ionicons
              name="ios-home"
              size={20}
              color={colors.gray}
              style={{
                marginBottom: 5,
              }}
            />
            <MuliText style={styles.contentInformation}>
              Địa chỉ: {this.state.sittingAddress}
            </MuliText>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {this.state.children != null ? (
              <View style={styles.detailContainerChild}>
                <MuliText style={styles.headerTitleChild}>
                  Trẻ của bạn:
                </MuliText>
                <View style={styles.detailPictureContainer}>
                  {this.state.children.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={async () => {
                        await this.toggleHidden(item);
                      }}
                    >
                      <View
                        style={{
                          alignContent: 'space-between',
                          flexDirection: 'row',
                          marginLeft: 40,
                        }}
                      >
                        <View>
                          <Image
                            source={{ uri: item.image }}
                            style={{
                              opacity:
                                item.checked == null || item.checked == false
                                  ? 0.1
                                  : null,
                              width: 60,
                              height: 60,
                              borderRadius: 120 / 2,
                              overflow: 'hidden',
                            }}
                          />
                          <View>
                            <View style={{ alignItems: 'center' }}>
                              <MuliText
                                style={{
                                  color:
                                    item.checked == null ||
                                    item.checked == false
                                      ? colors.gray
                                      : 'black',
                                }}
                              >
                                {item.name}
                              </MuliText>
                              <View style={{ alignContent: 'center' }}>
                                <MuliText
                                  style={{
                                    color:
                                      item.checked == null ||
                                      item.checked == false
                                        ? colors.gray
                                        : 'black',
                                  }}
                                >
                                  {item.age} tuổi
                                </MuliText>
                                <CheckBox
                                  onPress={() => {
                                    this.toggleHidden(item);
                                  }}
                                  style={{
                                    marginTop: 5,
                                    width: 18,
                                    height: 18,
                                    borderRadius: 20 / 2,
                                    borderColor:
                                      item.checked == null ||
                                      item.checked == false
                                        ? colors.gray
                                        : 'black',
                                    backgroundColor:
                                      item.checked == null ||
                                      item.checked == false
                                        ? 'white'
                                        : 'black',
                                  }}
                                  checked={
                                    !(
                                      item.checked == null ||
                                      item.checked == false
                                    )
                                  }
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <View />
            )}
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.input}>
              <Ionicons
                name="ios-happy"
                size={20}
                color={colors.gray}
                style={{
                  marginBottom: 5,
                }}
              />
              <MuliText style={styles.contentInformation}>
                Số trẻ: {this.state.childrenNumber}{' '}
              </MuliText>
            </View>
            <View style={styles.input}>
              <Ionicons
                name="ios-heart-empty"
                size={20}
                color={colors.gray}
                style={{
                  marginBottom: 5,
                }}
              />
              <MuliText style={styles.contentInformation}>
                Nhỏ tuổi nhất:{' '}
                {this.state.minAgeOfChildren == 99
                  ? 'N/A'
                  : this.state.minAgeOfChildren}
              </MuliText>
            </View>
          </View>
          <View>
            <MuliText style={styles.headerTitle}>Thanh toán</MuliText>
            <View style={styles.priceContainer}>
              <MuliText style={styles.contentInformation}>
                Tổng tiền thanh toán:
              </MuliText>
              <MuliText style={styles.price}>
                {formater(this.state.totalPrice)} Đồng
              </MuliText>
            </View>
          </View>
          {this.state.requestId == 0 ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={this.beforeRecommend}
              >
                <MuliText style={{ color: 'white', fontSize: 11 }}>
                  Kế tiếp
                </MuliText>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                marginHorizontal: 15,
                marginTop: 30,
                alignItems: 'center',
              }}
            >
              <MuliText style={{ color: colors.gray, fontSize: 12 }}>
                Bạn không thể thay đổi yêu cầu giữ trẻ khi đã mời bảo mẫu
              </MuliText>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

export default CreateRequestScreen;

CreateRequestScreen.navigationOptions = {
  title: 'Tạo yêu cầu giữ trẻ',
};

const styles = StyleSheet.create({
  price: {
    fontSize: 15,
    color: colors.lightGreen,
    fontWeight: '800',
  },
  priceContainer: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputDay: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 0,
    borderBottomWidth: 2,
    marginHorizontal: 15,
    marginTop: 15,
    borderColor: colors.lightGreen,
  },
  inputAddress: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 0,
    borderBottomWidth: 2,
    marginHorizontal: 15,
    marginTop: 15,
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 0,
    borderBottomWidth: 2,
    marginHorizontal: 15,
    marginTop: 15,
  },
  contentInformation: {
    marginHorizontal: 15,
    marginBottom: 5,
    fontSize: 12,
  },
  containerInformationRequest: {
    marginHorizontal: 15,
    marginTop: 30,
  },
  headerTitleChild: {
    fontSize: 20,
    color: colors.darkGreenTitle,
    marginBottom: 15,
    fontWeight: '800',
  },
  headerTitle: {
    marginHorizontal: 15,
    marginTop: 30,
    fontSize: 20,
    color: colors.darkGreenTitle,
    marginBottom: 10,
    fontWeight: '800',
  },
  submitButton: {
    width: 170,
    height: 40,
    padding: 10,
    marginBottom: 10,
    backgroundColor: colors.darkGreenTitle,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingTop: 15,
    alignItems: 'center',
  },
  detailPictureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailContainerChild: {
    marginHorizontal: 15,
    marginTop: 20,
  },
  detailContainer: {
    marginHorizontal: 25,
    marginTop: 20,
  },
});
