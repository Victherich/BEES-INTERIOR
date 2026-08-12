'use client'

import React, {useEffect, useState } from "react";
import Swal from "sweetalert2";
import styled, { keyframes } from "styled-components";
import { useAppContext } from "./Context";

// === Animations ===
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float3d = keyframes`
  0%, 100% {
    transform: translateY(0px);
    filter: brightness(1);
  }
  50% {
    transform: translateY(-2px);
    filter: brightness(1.05);
  }
`;

// === Styled Components (Max spacing/gaps/padding/margins capped at 10px) ===
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  width: 100%;
  height: 100vh;
  padding: 10px;
`;

const ModalBox = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 10px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 86, 179, 0.2);
  border: 1px solid rgba(0, 86, 179, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Spinner = styled.div`
  border: 3px solid #f4f8ff;
  border-top: 3px solid #0056b3;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  margin: 0 auto;
  animation: ${spin} 1s linear infinite;
`;

const HeaderTitle = styled.h2`
  font-size: 1.5rem;
  color: #0056b3;
  margin: 0;
  font-weight: 700;
  text-decoration: underline;
`;

const InstructionText = styled.h3`
  font-size: 1.5rem;
  color: #333333;
  margin: 0;
  font-weight: 600;
  line-height: 1.3;
`;

const SubInstruction = styled.p`
  font-size: 1.5rem;
  color: #666666;
  margin: 0;
  font-weight: 500;
`;

const Countdown = styled.div`
  font-size: 1rem;
  color: #0056b3;
  font-weight: 800;
  margin: 0;
  background: #f4f8ff;
  padding: 6px 10px;
  border-radius: 8px;
`;

const Message = styled.div`
  font-size: 0.75rem;
  color: #555555;
  margin: 0;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  line-height: 1.3;
`;

const StyledVerifyButton = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 800;
  color: white;
  font-size: 14px;

  background: linear-gradient(
    270deg,
    #0056b3,
    #00c6ff,
    #0056b3
  );

  background-size: 600% 600%;

  box-shadow:
    0 4px 0 #003a80,
    0 6px 12px rgba(0, 0, 0, 0.2),
    0 -1px 6px rgba(255, 255, 255, 0.15) inset;

  animation:
    ${gradientShift} 6s ease infinite,
    ${float3d} 2.5s ease-in-out infinite;

  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -75%;
    width: 50%;
    height: 100%;
    background: rgba(255, 255, 255, 0.25);
    transform: skewX(-20deg);
    transition: 0.5s;
  }

  &:hover {
    transform: scale(1.02) translateY(-2px);
    box-shadow:
      0 6px 0 #003a80,
      0 10px 18px rgba(0, 0, 0, 0.25),
      0 -1px 8px rgba(255, 255, 255, 0.2) inset;
    animation-play-state: paused;
  }

  &:hover::before {
    left: 130%;
  }

  &:active {
    transform: translateY(2px) scale(0.98);
    box-shadow:
      0 2px 0 #003a80,
      0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    animation: none;
  }
`;

const CancelButton = styled.button`
  background-color: #f1f3f5;
  color: #495057;
  border: 1px solid #ced4da;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 700;
  transition: all 0.2s ease-in-out;
  width: 100%;
  margin: 0;

  &:hover {
    background-color: #e9ecef;
    color: #212529;
  }

  &:active {
    transform: scale(0.98);
  }
`;

// === Component ===
const PaymentInProgressModal = ({ onCancel }) => {
  const { startPaymentPolling1, setPaymentSession } = useAppContext();
  const [timeLeft, setTimeLeft] = useState(200);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "We are trying to verify if you have paid.",
    "Please ensure that you actually made the payment from your bank app.",
    "Please ensure that the payment was successful.",
    "Your payment seems not to have reached us yet.",
    "After long waiting and this persists, you can cancel the payment and contact our support team and also check with your bank, your payment seem not to have reached us.",
  ];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          return 200;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update message every 20 seconds
  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 20000);
    return () => clearInterval(messageTimer);
  }, [messages.length]);

  // Auto refresh after 200 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 200 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyPayment = () => {
    try {
      const savedData = localStorage.getItem("pendingTransaction");
      if (!savedData) {
        Swal.fire({
          icon: "warning",
          text: "Verification number not found. Please initiate the payment again.",
        });
        return;
      }

      const parsed = JSON.parse(savedData);
      const verificationNumber = parsed?.transaction?.metadata?.custom_payment_verification_number;

      if (!verificationNumber) {
        Swal.fire({
          icon: "warning",
          text: "Verification number metadata missing. Please initiate the payment again.",
        });
        return;
      }

      startPaymentPolling1(verificationNumber);
    } catch (err) {
      console.error("Error reading verification number from localStorage:", err);
      Swal.fire({
        icon: "error",
        text: "Could not retrieve transaction metadata. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Cancel Payment?",
      text: "Are you sure you want to cancel this payment? Your progress will be lost. You can contact support if you encounter issues.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0056b3",
      confirmButtonText: "Yes, cancel it",
    }).then((result) => {
      if (result.isConfirmed) {
        setPaymentSession(false);
        localStorage.removeItem("pendingTransaction");
        Swal.fire("Cancelled", "Payment session cleared.", "success");
        if (onCancel) onCancel();
      }
    });
  };

  return (
    <Overlay>
      <ModalBox>
        <Spinner />
        <HeaderTitle>
          You started a Payment Process...
        </HeaderTitle>

        <InstructionText>If you have paid, Click the I HAVE PAID button below</InstructionText>

        <StyledVerifyButton onClick={handleVerifyPayment}>
          I HAVE PAID
        </StyledVerifyButton>

        <Countdown>⏳ {timeLeft}s</Countdown>
        <Message>
          <span>{messages[messageIndex]}</span>
        </Message>

        <SubInstruction>If you have not paid, or not yet ready, click CANCEL below</SubInstruction>

        <CancelButton onClick={handleCancel}>CANCEL</CancelButton>
      </ModalBox>
    </Overlay>
  );
};

export default PaymentInProgressModal;