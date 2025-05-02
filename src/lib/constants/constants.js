export const menuItems = [
  {
    key: 1,
    label: "Home",
    url: "/",
  },
  {
    key: 2,
    label: "About",
    url: "/about",
  },
  {
    key: 3,
    label: "Contact",
    url: "/contact",
  },
];
export const registerFormFields = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "Enter your first name",
    required: true,
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Enter your last name",
    required: true,
  },
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "Enter your username",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm your password",
    required: true,
  },
];
export const signInFormFields = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
];
export const forgotPasswordFormFields = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
];
export const resetPasswordFormFields = [
  {
    name: "newPassword",
    label: "New Password",
    type: "password",
    placeholder: "Enter your new password",
    required: true,
  },
  {
    name: "confirmNewPassword",
    label: "Confirm New Password",
    type: "password",
    placeholder: "Confirm your new password",
    required: true,
  },
];
export const verifyEmailFormFields = [
  {
    name: "verificationCode",
    label: "Verification Code",
    type: "otp",
    placeholder: "Enter the verification code from your authenticator app",
    required: true,
  },
];
