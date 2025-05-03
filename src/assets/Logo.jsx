import {
  bgColor,
  borderRadius,
  flex,
  font,
  shadow,
  spacing,
  textColor,
  textSize,
} from "@/app/theme/tailwind.theme";
import { LockKeyhole } from "lucide-react";

const Logo = ({ title, description }) => {
  return (
    <div className="text-center">
      <div className={flex.center}>
        <div
          className={`${bgColor.badge} ${spacing.p3} ${borderRadius.lg} ${shadow.badge}`}
        >
          <LockKeyhole className="h-8 w-8 text-white" />
        </div>
      </div>
      <h2
        className={`${spacing.mt6} ${textSize.xl} ${font.bold} ${textColor.primary}`}
      >
        {title ? title : "JobScamShield"}
      </h2>
      <p
        className={`${spacing.mt2} ${textSize.sm} ${textColor.secondary} mb-8`}
      >
        {description
          ? description
          : "Protect yourself from fraudulent job postings"}
      </p>
    </div>
  );
};

export default Logo;
