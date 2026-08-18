"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Swal from "sweetalert2";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebaseConfig";

// 🎨 BEES INTERIOR THEME COLORS
const Blue = "#2563eb";
const Dark = "#0f172a";
const Border = "#e5eaf2";
const White = "#ffffff";
const Gold = "#D4AF37";
const TextMuted = "#475569";
const LightBg = "#f8fafc";

// 🌟 Styled Components (Matching the Auth layout & 10px spacing guidelines)
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${LightBg};
  padding: 10px;
`;

const AuthWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: 1000px;
  background: ${White};
  border-radius: 10px;
  border: 1px solid ${Border};
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BrandingSide = styled.div`
  background: ${Blue};
  color: ${White};
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.2) 0%, rgba(212, 175, 55, 0.2) 100%);
    z-index: 1;
  }
`;

const BrandingContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: auto 0;
`;

const BrandLogo = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: ${White};

  span {
    color: ${Gold};
  }
`;

const Headline = styled.h1`
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.5px;
`;

const Subtext = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${Border};
`;

const FormSide = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${TextMuted};
`;

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${Blue};
  text-align: left;
`;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${TextMuted};
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${Border};
  border-radius: 6px;
  font-size: 0.9rem;
  background: ${White};
  color: ${Dark};
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${Blue};
  }
`;

const Button = styled.button`
  width: 100%;
  background: linear-gradient(135deg, ${Blue} 0%, ${Gold} 100%);
  color: ${White};
  padding: 10px;
  font-size: 0.95rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  transition: opacity 0.2s ease, transform 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const LinkText = styled.p`
  margin-top: 10px;
  cursor: pointer;
  color: ${TextMuted};
  font-size: 0.9rem;
  text-align: center;

  span {
    color: ${Blue};
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// ✨ FORGOT PASSWORD COMPONENT (FIREBASE CLIENT SDK)
export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Please wait...",
      text: "Sending password reset link...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await sendPasswordResetEmail(auth, email);
      
      await Swal.fire({
        title:"Email Sent ✅",
        text:"A password reset link has been sent to your email. Please check your email or spam folder and reset your password then come back here and login with your new password",
        icon:"success",
        allowOutsideClick:false,
    });
      
      router.push("/login");
    } catch (error) {
      Swal.fire("Error ❌", error.message, "error");
    }
  };

  return (
    <PageContainer>
      <AuthWrapper>
        {/* Left Visual Branding Panel */}
        <BrandingSide>
          <BrandLogo>
            BEES <span>INTERIOR</span>
          </BrandLogo>
          <BrandingContent>
            <Headline>Recover Your Sanctuary</Headline>
            <Subtext>
              Don't worry, it happens. Enter your registered email address below and we'll send you instructions to reset your password.
            </Subtext>
          </BrandingContent>
          <div />
        </BrandingSide>

        {/* Right Form Panel */}
        <FormSide>
          <FormHeader>
            <Title>Forgot Password</Title>
          </FormHeader>

          <form onSubmit={handleSubmit}>
            <FormGrid>
              <InputGroup>
                <Label>Email Address</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>

              <Button type="submit">Send Reset Link</Button>

              <LinkText onClick={() => router.push("/login")}>
                Remembered your password? <span>Login</span>
              </LinkText>
            </FormGrid>
          </form>
        </FormSide>
      </AuthWrapper>
    </PageContainer>
  );
}