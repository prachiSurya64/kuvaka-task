import { useEffect, useState } from "react";
import { Typography, Form, Select, Input, Button, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import "../styles/chatRoom.css";

const { Title } = Typography;


const phoneSchema = z.object({
  countryCode: z.string().min(1, "Select country code"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be digits only"),
});

export default function LoginPage() {
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [validatingOtp, setValidatingOtp] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const navigate = useNavigate();
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const saveToStorage = useAuthStore((state) => state.saveToStorage);
  const [messageApi, contextHolder] = message.useMessage();

  // Phone number form
  const {
    control: phoneControl,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
    reset: resetPhoneForm,
  } = useForm({
    resolver: zodResolver(phoneSchema),
    mode: "onBlur",
  });

  // OTP form
  const {
    control: otpControl,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    reset: resetOtpForm,
    setValue: setOtpValue,
  } = useForm({
    resolver: zodResolver(otpSchema),
    mode: "onBlur",
    defaultValues: { otp: "" },
    shouldUnregister: true,
  });

  // Auto-fill OTP field when generated
  useEffect(() => {
    if (otpSent && generatedOtp) {
      setOtpValue("otp", generatedOtp, { shouldValidate: true });
    }
  }, [otpSent, generatedOtp, setOtpValue]);

  // Fetch countries
  useEffect(() => {
    async function fetchCountries() {
      setLoadingCountries(true);
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,idd,cca2,flags"
        );
        const data = await res.json();
        const list = data
          .map((c) => {
            const dialCode = c.idd?.root
              ? c.idd.suffixes
                ? c.idd.root + c.idd.suffixes[0]
                : c.idd.root
              : null;
            return dialCode
              ? {
                  code: c.cca2,
                  dialCode,
                  name: c.name.common,
                  flag: c.flag || "",
                }
              : null;
          })
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(list);
      } catch {
        messageApi.error("Failed to load country data");
      } finally {
        setLoadingCountries(false);
      }
    }
    fetchCountries();
  }, [messageApi]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // OTP generator
  function generateRandomOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  function onSendOtp(data) {
    setSendingOtp(true);
    setError("");
    const newOtp = generateRandomOtp();
    setGeneratedOtp(newOtp);

    setTimeout(() => {
      setSendingOtp(false);
      setOtpSent(true);
      setTimer(30);
      resetOtpForm({ otp: newOtp });
      messageApi.success(`OTP sent to ${data.countryCode} ${data.phoneNumber}`);
      alert(`Sent OTP (Please copy this otp): ${newOtp}\n(For now, this OTP is only for task purpose, please understand. Thanks)`);
    }, 1500);
  }

  // function onValidateOtp(data) {
  //   setValidatingOtp(true);
  //   setError("");
  //   setTimeout(() => {
  //     setValidatingOtp(false);
  //     if (data.otp === generatedOtp) {
  //       setLoggedIn(true);
  //       saveToStorage();
  //       messageApi.success("Logged in successfully");
  //       resetOtpForm();
  //       resetPhoneForm();
  //       setOtpSent(false);
  //       setGeneratedOtp("");
  //       navigate("/dashboard");
  //     } else {
  //       setError("Invalid OTP");
  //       messageApi.error("Invalid OTP");
  //     }
  //   }, 1500);
  // }
  function onValidateOtp(data) {
    setValidatingOtp(true);
    setError("");
  
    setTimeout(() => {
      setValidatingOtp(false);
  
      if (!data.otp) {
        setError("Please enter OTP");
        messageApi.error("Please enter OTP");
        return;
      }
  
      if (data.otp !== generatedOtp) {
        setError("Incorrect OTP");
        messageApi.error("Incorrect OTP");
        return;
      }
  
      // ✅ Correct OTP
      setLoggedIn(true);
      saveToStorage();
      messageApi.success("Logged in successfully");
      resetOtpForm();
      resetPhoneForm();
      setOtpSent(false);
      setGeneratedOtp("");
      navigate("/dashboard");
    }, 1500);
  }
  
  return (
    <div className="login-container" role="main">
      <Title level={3} className="login-title">
        Gemini Chat Login
      </Title>
      {contextHolder}

      {!otpSent ? (
        <Form onFinish={handlePhoneSubmit(onSendOtp)} layout="vertical">
          <Form.Item
            label="Country Code"
            validateStatus={phoneErrors.countryCode ? "error" : ""}
            help={phoneErrors.countryCode?.message}
          >
            <Controller
              name="countryCode"
              control={phoneControl}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select country code"
                  optionFilterProp="children"
                  loading={loadingCountries}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {countries.map((c) => (
                    <Select.Option key={c.code} value={c.dialCode}>
                      {c.flag} {c.name} ({c.dialCode})
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            validateStatus={phoneErrors.phoneNumber ? "error" : ""}
            help={phoneErrors.phoneNumber?.message}
          >
            <Controller
              name="phoneNumber"
              control={phoneControl}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter phone number"
                  type="tel"
                  maxLength={10}
                  onPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault(); 
                    }
                  }}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, "");
                    field.onChange(cleaned);
                  }}
                />
              )}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={sendingOtp} block>
            Send OTP
          </Button>
        </Form>
      ) : (
        // <Form onFinish={handleOtpSubmit(onValidateOtp)} layout="vertical">
        //   <Form.Item
        //     label="Enter OTP"
        //     validateStatus={error || otpErrors.otp ? "error" : ""}
        //     help={error || otpErrors.otp?.message}
        //   >
        //     <Controller
        //       name="otp"
        //       control={otpControl}
        //       render={({ field }) => (
        //         <Input
        //           {...field}
        //           placeholder="6-digit OTP"
        //           maxLength={6}
        //           type="tel"
        //           aria-invalid={!!error || !!otpErrors.otp}
        //           aria-describedby="otp-error"
        //           value={field.newOtp}
        //           onChange={(e) => field.onChange(e.target.value)}
        //         />
        //       )}
        //     /> 
        //   </Form.Item>
        //   <Button
        //     type="primary"
        //     htmlType="submit"
        //     loading={validatingOtp}
        //     block
        //   >
        //     Validate OTP
        //   </Button>

        //   <Button
        //     type="link"
        //     onClick={() => {
        //       setOtpSent(false);
        //       setError("");
        //     }}
        //     disabled={timer > 0}
        //   >
        //     Resend OTP {timer > 0 ? `(${timer}s)` : ""}
        //   </Button>
        // </Form>

        <Form onFinish={handleOtpSubmit(onValidateOtp)} layout="vertical">
  <Form.Item
    label="Enter OTP"
    validateStatus={error || otpErrors.otp ? "error" : ""}
    help={error || otpErrors.otp?.message}
  >
    <Controller
      name="otp"
      control={otpControl}
      render={({ field }) => (
        <Input
          {...field}
          placeholder="6-digit OTP"
          maxLength={6}
          type="tel"
          // aria-invalid={!!error || !!otpErrors.otp}
          aria-describedby="otp-error"
          // setGeneratedOtp(newOtp)
          value={generatedOtp}
          onChange={(e) => {
            // Remove non-digits
            const cleaned = e.target.value.replace(/\D/g, "");
            field.onChange(cleaned);
            setError("");
          }}
        />
      )}
    />
  </Form.Item>

  <Button
    type="primary"
    htmlType="submit"
    loading={validatingOtp}
    block
    disabled={!otpControl._formValues?.otp}
  >
    Validate OTP
  </Button>

  <Button
    type="link"
    onClick={() => {
      setOtpSent(false);
      setError("");
    }}
    disabled={timer > 0}
  >
    Resend OTP {timer > 0 ? `(${timer}s)` : ""}
  </Button>
</Form>

      )}
    </div>
  );
}
