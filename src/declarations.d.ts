import { AwsWafCaptcha, AwsWafIntegration } from "components/Captcha/types";

declare global {
  interface Window {
    AwsWafIntegration: AwsWafIntegration;
    AwsWafCaptcha: AwsWafCaptcha;
  }
}
