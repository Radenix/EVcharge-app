import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import tw from "twrnc";
import React, { useState, useEffect } from "react";
import { SvgXml } from "react-native-svg";
import axios from "axios";
// import * as Keychain from "react-native-keychain";
import * as SecureStore from "expo-secure-store";

const Login = ({ setStatus }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  
  const svgImage = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
    <path d="M93.0002 30.55C92.2045 30.55 91.4415 30.2339 90.8789 29.6713C90.3163 29.1087 90.0002 28.3456 90.0002 27.55V19.36C89.9949 15.8183 88.5856 12.4232 86.0813 9.9189C83.577 7.41456 80.1819 6.00529 76.6402 6H68.4502C67.6545 6 66.8915 5.68393 66.3289 5.12132C65.7663 4.55871 65.4502 3.79565 65.4502 3C65.4502 2.20435 65.7663 1.44129 66.3289 0.87868C66.8915 0.31607 67.6545 0 68.4502 0L76.6402 0C81.7724 0.00793429 86.692 2.05019 90.321 5.67918C93.95 9.30816 95.9923 14.2278 96.0002 19.36V27.55C96.0002 27.944 95.9226 28.3341 95.7718 28.698C95.6211 29.062 95.4001 29.3927 95.1215 29.6713C94.8429 29.9499 94.5122 30.1709 94.1482 30.3216C93.7843 30.4724 93.3942 30.55 93.0002 30.55Z" fill="#313e47"/>
    <path d="M76.6402 96H68.4502C67.6545 96 66.8915 95.6839 66.3289 95.1213C65.7663 94.5587 65.4502 93.7957 65.4502 93C65.4502 92.2044 65.7663 91.4413 66.3289 90.8787C66.8915 90.3161 67.6545 90 68.4502 90H76.6402C80.1819 89.9947 83.577 88.5855 86.0813 86.0811C88.5856 83.5768 89.9949 80.1817 90.0002 76.64V68.45C90.0002 67.6544 90.3163 66.8913 90.8789 66.3287C91.4415 65.7661 92.2045 65.45 93.0002 65.45C93.7958 65.45 94.5589 65.7661 95.1215 66.3287C95.6841 66.8913 96.0002 67.6544 96.0002 68.45V76.64C95.9923 81.7722 93.95 86.6919 90.321 90.3208C86.692 93.9498 81.7724 95.9921 76.6402 96Z" fill="#313e47"/>
    <path d="M3 30.55C2.20435 30.55 1.44129 30.2339 0.87868 29.6713C0.31607 29.1087 0 28.3456 0 27.55L0 19.36C0.00793429 14.2278 2.05019 9.30816 5.67918 5.67918C9.30816 2.05019 14.2278 0.00793429 19.36 0H27.55C28.3456 0 29.1087 0.31607 29.6713 0.87868C30.2339 1.44129 30.55 2.20435 30.55 3C30.55 3.79565 30.2339 4.55871 29.6713 5.12132C29.1087 5.68393 28.3456 6 27.55 6H19.36C15.8183 6.00529 12.4232 7.41456 9.9189 9.9189C7.41456 12.4232 6.00529 15.8183 6 19.36V27.55C6 27.944 5.9224 28.3341 5.77164 28.698C5.62087 29.062 5.3999 29.3927 5.12132 29.6713C4.84274 29.9499 4.51203 30.1709 4.14805 30.3216C3.78407 30.4724 3.39397 30.55 3 30.55Z" fill="#313e47"/>
    <path d="M27.55 96H19.36C14.2278 95.9921 9.30816 93.9498 5.67918 90.3208C2.05019 86.6919 0.00793429 81.7722 0 76.64L0 68.45C0 67.6544 0.31607 66.8913 0.87868 66.3287C1.44129 65.7661 2.20435 65.45 3 65.45C3.79565 65.45 4.55871 65.7661 5.12132 66.3287C5.68393 66.8913 6 67.6544 6 68.45V76.64C6.00529 80.1817 7.41456 83.5768 9.9189 86.0811C12.4232 88.5855 15.8183 89.9947 19.36 90H27.55C28.3456 90 29.1087 90.3161 29.6713 90.8787C30.2339 91.4413 30.55 92.2044 30.55 93C30.55 93.7957 30.2339 94.5587 29.6713 95.1213C29.1087 95.6839 28.3456 96 27.55 96Z" fill="#313e47"/>
    <path d="M27.5502 35.64C27.0248 35.6404 26.5044 35.5373 26.0188 35.3365C25.5333 35.1358 25.092 34.8413 24.7202 34.47C24.5346 34.2829 24.3672 34.0787 24.2202 33.86C24.0774 33.641 23.9537 33.4101 23.8502 33.17C23.7554 32.9259 23.6785 32.6753 23.6202 32.42C23.527 31.9008 23.527 31.3692 23.6202 30.85C23.6771 30.5976 23.754 30.3502 23.8502 30.11C23.9494 29.8678 24.0734 29.6366 24.2202 29.42C24.5133 28.9803 24.8906 28.603 25.3302 28.31C25.548 28.1651 25.7791 28.0412 26.0202 27.94C26.262 27.8411 26.5134 27.7674 26.7702 27.72C27.4137 27.5926 28.0786 27.6254 28.7064 27.8154C29.3341 28.0055 29.9055 28.3471 30.3702 28.81C30.743 29.1818 31.0386 29.6236 31.2402 30.11C31.3407 30.3486 31.4177 30.5965 31.4702 30.85C31.5769 31.3679 31.5769 31.9021 31.4702 32.42C31.4166 32.6765 31.3396 32.9275 31.2402 33.17C31.1408 33.412 31.0168 33.6432 30.8702 33.86C30.7264 34.081 30.5587 34.2855 30.3702 34.47C30.1887 34.6547 29.9875 34.819 29.7702 34.96C29.5535 35.1066 29.3223 35.2305 29.0802 35.33C28.8378 35.4293 28.5867 35.5063 28.3302 35.56C28.0734 35.6113 27.8122 35.6381 27.5502 35.64Z" fill="#313e47"/>
    <path d="M68.4502 35.64C68.1882 35.6381 67.9271 35.6113 67.6702 35.56C67.4133 35.5078 67.1622 35.4307 66.9202 35.33C66.6782 35.2306 66.447 35.1066 66.2302 34.96C66.013 34.819 65.8118 34.6547 65.6302 34.47C65.2571 34.0991 64.9608 33.6582 64.7583 33.1725C64.5558 32.6869 64.4511 32.1661 64.4502 31.64C64.4516 31.3747 64.4783 31.1102 64.5302 30.85C64.5827 30.5965 64.6598 30.3486 64.7602 30.11C64.8615 29.8688 64.9853 29.6378 65.1302 29.42C65.2715 29.1971 65.4394 28.9923 65.6302 28.81C65.8116 28.6222 66.0128 28.4545 66.2302 28.31C66.4492 28.1672 66.6801 28.0434 66.9202 27.94C67.1638 27.8438 67.4146 27.7669 67.6702 27.71C68.1888 27.6101 68.7216 27.6101 69.2402 27.71C69.4926 27.7669 69.74 27.8438 69.9802 27.94C70.2224 28.0391 70.4536 28.1631 70.6702 28.31C70.8908 28.4544 71.0953 28.622 71.2802 28.81C71.4653 28.9975 71.6327 29.2017 71.7802 29.42C71.9251 29.6378 72.0489 29.8688 72.1502 30.11C72.2477 30.3488 72.3214 30.5967 72.3702 30.85C72.427 31.1094 72.4538 31.3745 72.4502 31.64C72.4502 32.7009 72.0288 33.7183 71.2786 34.4684C70.5285 35.2186 69.5111 35.64 68.4502 35.64Z" fill="#313e47"/>
    <path d="M43.9098 55.09H39.8198C39.0242 55.09 38.2611 54.7739 37.6985 54.2113C37.1359 53.6487 36.8198 52.8857 36.8198 52.09C36.8198 51.2944 37.1359 50.5313 37.6985 49.9687C38.2611 49.4061 39.0242 49.09 39.8198 49.09H43.9098C44.1989 49.09 44.4762 48.9752 44.6806 48.7708C44.885 48.5663 44.9998 48.2891 44.9998 48V31.64C44.9998 30.8444 45.3159 30.0813 45.8785 29.5187C46.4411 28.9561 47.2042 28.64 47.9998 28.64C48.7955 28.64 49.5585 28.9561 50.1211 29.5187C50.6838 30.0813 50.9998 30.8444 50.9998 31.64V48C50.9972 49.8796 50.2493 51.6814 48.9203 53.0105C47.5912 54.3395 45.7894 55.0874 43.9098 55.09Z" fill="#313e47"/>
    <path d="M47.9999 75.25C43.1905 75.2615 38.482 73.8715 34.4499 71.25L34.0899 71C33.7257 70.8017 33.4066 70.5301 33.1526 70.2022C32.8987 69.8744 32.7155 69.4975 32.6146 69.0953C32.5137 68.6931 32.4973 68.2743 32.5663 67.8654C32.6354 67.4565 32.7885 67.0664 33.016 66.7197C33.2434 66.3729 33.5403 66.0771 33.8878 65.8509C34.2354 65.6247 34.6261 65.473 35.0352 65.4054C35.4443 65.3377 35.863 65.3557 36.2649 65.458C36.6667 65.5604 37.043 65.7449 37.3699 66L37.7299 66.24C40.8387 68.2684 44.4796 69.3283 48.1913 69.2856C51.9031 69.2429 55.5186 68.0994 58.5799 66C58.9082 65.7781 59.277 65.623 59.6653 65.5436C60.0535 65.4642 60.4536 65.462 60.8427 65.5372C61.2317 65.6124 61.6022 65.7636 61.9329 65.9819C62.2635 66.2003 62.548 66.4817 62.7699 66.81C62.9918 67.1383 63.1469 67.5071 63.2263 67.8954C63.3057 68.2836 63.3079 68.6837 63.2327 69.0728C63.1575 69.4618 63.0064 69.8323 62.788 70.163C62.5696 70.4936 62.2882 70.7781 61.9599 71C57.84 73.7886 52.9748 75.2698 47.9999 75.25Z" fill="#313e47"/>
    </svg>
`;
  const handleLogin = async () => {
    try {
      const response = await axios.post("http://67.207.72.73/users/login", {
        phone: phoneNumber,
        password,
      });
      if (response.data.status === 200) {
        const access_token = response.data.access_token.token;
        const refresh_token = response.data.refresh_token.token;
        const accessExpirationTime = response.data.access_token.expires;
        const refreshExpirationTime = response.data.refresh_token.expires;
        const userId = response.data.userId;
        await SecureStore.setItemAsync("userId", userId.toString())
        await SecureStore.setItemAsync("access_token", access_token);
        await SecureStore.setItemAsync("refresh_token", refresh_token);
        await SecureStore.setItemAsync(
          "access_expiration_time",
          accessExpirationTime.toString()
        );
        setStatus('home');
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <View style={tw`flex-1 bg-[#eaebed] items-center justify-center h-[100%]`}>
      <SvgXml xml={svgImage} style={tw`mb-[100px]`} />
      <TextInput
        style={tw`bg-[#fff] text-[#000] pl-[17px] text-[18px] mb-[15px] rounded-xl w-[85%] h-[8%] `}
        placeholder="Mobile Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholderTextColor="#313e49"
        keyboardType="phone-pad"
        autoCapitalize="none"
      />
      <TextInput
        style={tw`bg-[#fff] text-[#313e47] pl-[17px] text-[18px] mb-[25px] rounded-xl w-[85%] h-[8%] `}
        placeholder="Password"
        placeholderTextColor="#313e47"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={tw`justify-center items-center bg-[#313e47] mb-[1rem] rounded-xl w-[85%] h-[8%]`}
        onPress={handleLogin}
        title="Login"
      >
        <Text style={tw`text-[#fff] text-[23px]`}>Sign In</Text>
      </TouchableOpacity>
      <View style={tw`flex flex-row items-center justify-between w-[85%]`}>
        {/* <Text style={tw`ml-[3px] text-[#313e47]`}>Remember me</Text> */}
        <Text style={tw`text-[#313e47]`}>Forgot Password?</Text>
      </View>
    </View>
  );
};

export default Login;
