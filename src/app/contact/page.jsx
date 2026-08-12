"use client";

import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Sparkles, 
  CheckCircle, 
  Building2
} from "lucide-react";
import Swal from "sweetalert2";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components (Blue & Gold Theme & Maximum 10px Padding/Margin/Gap)
const ContactPageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  color: #0f172a;
  padding: 10px;
  
  @media (min-width: 640px) {
    padding: 10px;
  }
`;

const HeaderContainer = styled.div`
  max-width: 48rem;
  margin: 0 auto 10px auto;
  text-align: center;
  animation: ${fadeIn} 0.8s ease-out forwards;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 9999px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(217, 119, 6, 0.1));
  border: 1px solid rgba(217, 119, 6, 0.3);
  color: #1e40af;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const MainTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #0f172a;
  line-height: 1.2;
  margin-bottom: 8px;

  @media (min-width: 640px) {
    font-size: 2.75rem;
  }
`;

const HighlightSpan = styled.span`
  background: linear-gradient(135deg, #2563eb, #1d4ed8, #d97706, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.5;
  margin: 0;
`;

const ContentGrid = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1.25fr;
    gap: 10px;
  }
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, border-color 0.3s ease;

  &:hover {
    border-color: rgba(37, 99, 235, 0.4);
    transform: translateY(-2px);
  }
`;

const InfoCardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color:#1e40af;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #2563eb;
    width: 1.1rem;
    height: 1.1rem;
  }
`;

const ContactDetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(217, 119, 6, 0.1));
  color: #2563eb;
  flex-shrink: 0;

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  span:first-child {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  span:last-child {
    font-size: 0.9rem;
    color: #334155;
    font-weight: 500;
  }
`;

const FormColumn = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  @media (min-width: 640px) {
    padding: 10px;
  }
`;

const FormTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 4px;
`;

const FormSubtitle = styled.p`
  font-size: 0.9rem;
  color: #475569;
  margin-bottom: 10px;
`;

const FormGrid = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 500;
  color: #334155;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  background-color: #f8fafc !important;
  color: #0f172a !important;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  background-color: #f8fafc !important;
  color: #0f172a !important;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  outline: none;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border-radius: 8px;
  background: linear-gradient(135deg, #2563eb, #d97706);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
  transition: all 0.3s ease;
  margin-top: 4px;

  &:hover {
    background: linear-gradient(135deg, #1d4ed8, #b45309);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch('/api/send-contact-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      Swal.fire({
        title: "Message Sent Successfully!",
        text: "Thank you for reaching out to Bees Interior. One of our design consultants will get back to you shortly.",
        icon: "success",
        confirmButtonText: "Done",
        confirmButtonColor: "#2563eb",
        background: "#ffffff",
        color: "#0f172a"
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } else {
      throw new Error(data.error || 'Failed to send message.');
    }
  } catch (error) {
    console.error('Submission error:', error);
    Swal.fire({
      title: "Error!",
      text: "Something went wrong while sending your message. Please try again later.",
      icon: "error",
      confirmButtonText: "Okay",
      confirmButtonColor: "#2563eb",
    });
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <ContactPageWrapper>
      {/* Page Header */}
      <HeaderContainer>
        <Badge>
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Get In Touch With Us</span>
        </Badge>
        <MainTitle>
          Let’s Create Your <HighlightSpan>Dream Space</HighlightSpan> Together
        </MainTitle>
        <Subtitle>
          Whether you are looking to revamp a single room or commission a full-scale luxury architectural transformation, our expert team is ready to bring your vision to life.
        </Subtitle>
      </HeaderContainer>

      {/* Grid Content */}
      <ContentGrid>
        {/* Left Column: Contact Details & Office Info */}
        <InfoColumn>
          {/* Direct Contacts Card */}
          <InfoCard>
            <InfoCardTitle>
              <Building2 />
              Headquarters & Showroom
            </InfoCardTitle>

            <ContactDetailItem>
              <IconWrapper>
                <MapPin />
              </IconWrapper>
              <DetailContent>
                <span>Location</span>
                <span>24 Oseni street, Anthony Village Lagos state Nigeria</span>
              </DetailContent>
            </ContactDetailItem>

            <ContactDetailItem>
              <IconWrapper>
                <Phone />
              </IconWrapper>
              <DetailContent>
                <span>Direct Line</span>
                <span>+234 812 549 4597</span>
              </DetailContent>
            </ContactDetailItem>

            <ContactDetailItem>
              <IconWrapper>
                <Mail />
              </IconWrapper>
              <DetailContent>
                <span>Email Support</span>
                <span>beesinterior@gmail.com</span>
              </DetailContent>
            </ContactDetailItem>
          </InfoCard>

          {/* Operating Hours Card */}
          <InfoCard>
            <InfoCardTitle>
              <Clock />
              Working Hours
            </InfoCardTitle>

            <ContactDetailItem>
              <IconWrapper>
                <Clock />
              </IconWrapper>
              <DetailContent>
                <span>Monday — Friday</span>
                <span>9:00 AM – 6:00 PM (WAT)</span>
              </DetailContent>
            </ContactDetailItem>

            <ContactDetailItem>
              <IconWrapper>
                <CheckCircle />
              </IconWrapper>
              <DetailContent>
                <span>Saturday Consultations</span>
                <span>10:00 AM – 4:00 PM (By Appointment)</span>
              </DetailContent>
            </ContactDetailItem>
          </InfoCard>
        </InfoColumn>

        {/* Right Column: Interactive Consultation & Message Form */}
        <FormColumn>
          <FormTitle>Send Us a Message</FormTitle>
          <FormSubtitle>
            Fill out the form below and our client relations team will respond within 24 hours.
          </FormSubtitle>

          <FormGrid onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </InputGroup>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <InputGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234..."
                />
              </InputGroup>
            </div>

            <InputGroup>
              <Label htmlFor="message">Your Message</Label>
              <TextArea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your space, style preference, or project goals..."
              />
            </InputGroup>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Sending Message..."
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </SubmitButton>
          </FormGrid>
        </FormColumn>
      </ContentGrid>
    </ContactPageWrapper>
  );
}