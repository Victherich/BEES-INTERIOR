"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Swal from "sweetalert2";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";

// 🎨 BEES INTERIOR THEME COLORS
const Blue = "#2563eb";
const Dark = "#0f172a";
const Border = "#e5eaf2";
const White = "#ffffff";
const Gold = "#D4AF37";
const TextMuted = "#475569"; // Softer, lighter shade for form text instead of pitch black
const LightBg = "#f8fafc";

// 🌟 Styled Components
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
  background: ${Blue}; // Changed from dark to normal button blue
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
  color: ${TextMuted}; // Applied softer text color across the form
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  grid-column: ${(props) => (props.$full ? "span 2" : "span 1")};

  @media (max-width: 500px) {
    grid-column: span 1;
  }
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${TextMuted}; // Adjusted form label color from pure black to softer tone
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

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const EyeButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  color: ${Blue};
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.85rem;
  line-height: 1.4;
  color: ${TextMuted};
  grid-column: span 2;

  @media (max-width: 500px) {
    grid-column: span 1;
  }
`;

const Checkbox = styled.input`
  margin-top: 2px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: ${Blue};
`;

const PolicyText = styled.span`
  text-align: left;
  a {
    color: ${Blue};
    font-weight: 600;
    text-decoration: underline;

    &:hover {
      color: ${Dark};
    }
  }
`;

const Button = styled.button`
  grid-column: span 2;
  width: 100%;
  background: linear-gradient(135deg, ${Blue} 0%, ${Gold} 100%); // Gold and blue gradient button
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

  @media (max-width: 500px) {
    grid-column: span 1;
  }
`;

const LinkText = styled.p`
  grid-column: span 2;
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

  @media (max-width: 500px) {
    grid-column: span 1;
  }
`;

// ✨ SIGNUP COMPONENT
export default function UserSignup() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer", // Hidden role field set by default, never displayed to user
  });
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.email !== form.confirmEmail) {
      return Swal.fire("Error", "Emails do not match", "error");
    }

    if (form.password !== form.confirmPassword) {
      return Swal.fire("Error", "Passwords do not match", "error");
    }

    if (!agreed) {
      return Swal.fire(
        "Required",
        "You must agree to the Terms & Privacy Policy to continue",
        "warning"
      );
    }

    Swal.fire({
      title: "Please wait...",
      text: "Setting up your Bees Interior account...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const { name, email, phone, password, role } = form;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        phone,
        role, // Stored safely in Firestore backend
        createdAt: new Date(),
      });

      Swal.fire("Success 🎉", "Welcome to Bees Interior! Your account is ready.", "success");
      router.push("/login");
    } catch (err) {
      Swal.fire("Error ❌", err.message, "error");
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
            <Headline>Design Your Dream Space</Headline>
            <Subtext>
              Join our exclusive interior ecosystem to track consultations, curate luxury home products, and experience sophisticated living.
            </Subtext>
          </BrandingContent>
          <div /> {/* Spacer */}
        </BrandingSide>

        {/* Right Form Panel */}
        <FormSide>
          <FormHeader>
            <Title>Create Account</Title>
          </FormHeader>

          <form onSubmit={handleSubmit}>
            <FormGrid>
              <InputGroup $full>
                <Label>Full Name</Label>
                <Input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
              </InputGroup>

              <InputGroup>
                <Label>Email Address</Label>
                <Input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
              </InputGroup>

              <InputGroup>
                <Label>Confirm Email</Label>
                <Input name="confirmEmail" type="email" placeholder="john@example.com" value={form.confirmEmail} onChange={handleChange} required />
              </InputGroup>

              <InputGroup $full>
                <Label>Phone Number</Label>
                <Input name="phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange} required />
              </InputGroup>

              <InputGroup>
                <Label>Password</Label>
                <PasswordWrapper>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <EyeButton type="button" onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? "Hide" : "Show"}
                  </EyeButton>
                </PasswordWrapper>
              </InputGroup>

              <InputGroup>
                <Label>Confirm Password</Label>
                <PasswordWrapper>
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <EyeButton type="button" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                    {showConfirmPassword ? "Hide" : "Show"}
                  </EyeButton>
                </PasswordWrapper>
              </InputGroup>

              <CheckboxWrapper>
                <Checkbox
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <PolicyText>
                  I agree to the{" "}
                  <a href="/terms-conditions" target="_blank" rel="noopener noreferrer">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>
                </PolicyText>
              </CheckboxWrapper>

              <Button type="submit">Create Account</Button>

              <LinkText onClick={() => router.push("/login")}>
                Already have an account? <span>Login</span>
              </LinkText>
            </FormGrid>
          </form>
        </FormSide>
      </AuthWrapper>
    </PageContainer>
  );
}