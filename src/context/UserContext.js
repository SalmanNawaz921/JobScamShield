"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { message } from "antd";
import { verifyToken } from "@/lib/utils/verifyToken";

const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export const UserState = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const verifiedData = await verifyToken();
        if (!verifiedData.valid) {
          setUserData(null);
          return;
        }
        const { userData } = verifiedData;
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);

        if (error.response?.status === 401) {
          message.error("Session expired. Please login again.");
          router.push("/auth");
        } else {
          message.error("An error occurred. Please try again later.");
        }
      }
    };

    fetchUserData();
  }, []);

  //   // Get required credits for an action
  //   const getRequiredCredits = (action) => {
  //     const moduleData = modules.find((module) => module.value === action);
  //     return moduleData?.creditCost || 0;
  //   };

  //   // Deduct credits and update progress
  //   const deductCredits = async (action, targetWord = "") => {
  //     if (!userData?.id) return false;
  //     const requiredCredits = getRequiredCredits(action);
  //     if (userCredits < requiredCredits) {
  //       router.push("/no-credits");
  //       return false;
  //     }
  //     try {
  //       const creditData = await checkCredits(
  //         action,
  //         targetWord,
  //         Number(userCredits) - requiredCredits,
  //         requiredCredits
  //       );

  //       if (creditData.success) {
  //         setUserCredits(creditData.remainingCredits); // Update state
  //         setUserProgress(creditData.userData.deductedActions);
  //         return true;
  //       } else {
  //         message.error("Unable to deduct credits.");
  //         return false;
  //       }
  //     } catch (error) {
  //       console.error("Error deducting credits:", error);
  //       return false;
  //     }
  //   };

  //   // Reverse deducted credits
  //   const reverseCredits = async (action) => {
  //     const creditsToAddBack = getRequiredCredits(action);
  //     if (!userData?.id) return;

  //     try {
  //       const resp = await setCredits(creditsToAddBack, userData.id);
  //       if (resp.status === 200) {
  //         setUserCredits(resp.data.updatedCredits); // Ensure state updates
  //       } else {
  //         message.error("Failed to reverse credits.");
  //       }
  //     } catch (error) {
  //       console.error("Error refunding credits:", error);
  //     }
  //   };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        // userCredits,
        // setUserCredits,
        // userProgress,
        // setUserProgress,
        // getRequiredCredits,
        // deductCredits,
        // reverseCredits,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
