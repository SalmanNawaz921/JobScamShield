// theme/tailwind.theme.js
export const textColor = {
  primary: "!text-white",
  secondary: "!text-gray-300",
  link: "!text-purple-400 hover:text-purple-300 transition-colors",
  notice: "!text-yellow-100",
  alert: "!text-yellow-400",
  secure: "!text-green-400",
  footer: "!text-gray-400",
};

export const bgColor = {
  gradient: "!bg-gradient-to-br from-[#0b1120] to-[#111827]",

  // Glass form with stronger blur and border
  form: `
    !bg-gray-800/20 
    !backdrop-blur-lg 
    !border !border-white/10 
    !shadow-xl !shadow-blue-900/10
    hover:!bg-gray-800/30
    transition-all duration-300
  `,

  // Glass badge with subtle glow
  badge: `
    !bg-purple-600/80 
    !backdrop-blur-sm 
    !border !border-purple-400/30 
    !shadow-md !shadow-purple-500/20
  `,

  // Enhanced warning with glass effect
  warning: `
    !bg-yellow-900/40 
    !backdrop-blur-md 
    !border !border-yellow-600/20 
    !shadow-lg !shadow-yellow-700/10
  `,

  // Glass button with hover effects
  button: `
    !bg-gray-700/60 
    !backdrop-blur-sm 
    !border !border-white/10 
    hover:!bg-gray-600/70 
    hover:!border-white/20 
    !shadow-md !shadow-gray-800/30
    transition-all duration-200
  `,

  // Glass footer with light effect
  footer: `
    !bg-[#EDDDFF]/10 
    !backdrop-blur-xl 
    !border-t !border-white/20 
    !shadow-2xl !shadow-purple-500/5
  `,

  // New glass panel style
  panel: `
    !bg-gray-900/30 
    !backdrop-blur-md 
    !border !border-white/10 
    !rounded-xl 
    !shadow-lg !shadow-blue-900/20
  `,

  // New glass card style
  card: `
    !bg-white/5 
    !backdrop-blur-lg 
    !border !border-white/10 
    !rounded-2xl 
    !shadow-xl !shadow-blue-900/10
    hover:!bg-white/10 
    hover:!border-white/20
    transition-all duration-300
  `,
};

export const borderColor = {
  warning: "!border border-yellow-700",
  form: "!border border-gray-700",
  divider: "!border-t border-gray-600",
};

export const layout = {
  container: "!min-h-screen flex items-center justify-center p-16",
  card: "!w-full max-w-md space-y-8",
  section: "!py-12 px-4 sm:px-6 lg:px-8",
  fixedBadge: "!fixed bottom-4 right-4 flex items-center space-x-1 text-sm",
};

export const spacing = {
  mt6: "!mt-6",
  mt2: "!mt-2",
  mt4: "!mt-4",
  mt8: "!mt-8",
  p3: "!p-3",
  p8: "!p-8",
};

export const borderRadius = {
  lg: "!rounded-lg",
  xl: "!rounded-xl",
  md: "!rounded-md",
};

export const shadow = {
  badge: "!shadow-lg",
  card: "!shadow-2xl",
};

export const flex = {
  center: "!flex justify-center",
  itemsCenter: "!flex items-center",
};

export const font = {
  bold: "!font-bold",
  medium: "!font-medium",
};

export const textSize = {
  sm: "!text-sm",
  xs: "!text-xs",
  base: "!text-base",
  xl: "!text-2xl",
};
