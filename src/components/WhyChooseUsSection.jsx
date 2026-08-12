import React from 'react';
import styled from 'styled-components';
import { Fade, Zoom } from 'react-awesome-reveal';

// --- THEME & STYLES ---
const primaryGold = '#D4AF37';
const primaryBlue = '#1E3A8A';
const goldGradient = 'linear-gradient(135deg, #FFDF73 0%, #D4AF37 50%, #AA7C11 100%)';
const blueGradient = 'linear-gradient(135deg, #3B82F6 0%, #1E3A8A 50%, #0F172A 100%)';

const WhyChooseSection = styled.section`
  background: #FFFFFF;
  padding: 20px 15px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(226, 232, 240, 0.8);
  max-width: 1440px;
  margin: 0 auto;
  box-sizing: border-box;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  padding: 0 10px;
`;

const SectionTitle = styled.h2`
  font-size: 26px;
  font-weight: 800;
  background: ${blueGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const SectionSubtitle = styled.p`
  font-size: 13px;
  color: #64748B;
  margin: 6px 0 0 0;
  line-height: 1.5;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;

  @media(max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media(max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: #F8FAFC;
  border-radius: 6px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  height: 100%;
  box-sizing: border-box;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    background: #FFFFFF;
    box-shadow: 0 8px 20px rgba(30, 58, 138, 0.06);
  }
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${goldGradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #0F172A;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
`;

const FeatureTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${primaryBlue};
  margin: 0;
`;

const FeatureDesc = styled.p`
  font-size: 12px;
  color: #475569;
  margin: 0;
  line-height: 1.6;
`;

// --- DATA ---
const featuresData = [
  {
    icon: "💎",
    title: "Uncompromising Luxury",
    desc: "We source and craft only the finest materials, furniture, and bespoke accessories to deliver elite environments."
  },
  {
    icon: "🎯",
    title: "Bespoke Design Solutions",
    desc: "Every space is uniquely tailored to reflect your personal taste, functional lifestyle, and distinct architectural style."
  },
  {
    icon: "⏱️",
    title: "Precision Execution",
    desc: "From initial concept planning to the grand final reveal, we manage timelines and meticulous details seamlessly."
  },
  {
    icon: "🤝",
    title: "Dedicated Client Care",
    desc: "Our expert design consultants work closely with you at every step, ensuring absolute satisfaction and transparency."
  }
];

// --- COMPONENT EXPORT ---
export default function WhyChooseUsSection() {
  return (
    <WhyChooseSection>
      <Fade direction="up" triggerOnce>
        <SectionHeader>
          <SectionTitle>Why Choose Bees Interior</SectionTitle>
          <SectionSubtitle>
            We combine creativity, craftsmanship, and elite luxury accessories to redefine your world.
          </SectionSubtitle>
        </SectionHeader>
      </Fade>

      <FeaturesGrid>
        {featuresData.map((item, idx) => (
          <Zoom delay={idx * 80} triggerOnce key={idx} style={{ display: 'contents' }}>
            <FeatureCard>
              <IconWrapper>{item.icon}</IconWrapper>
              <FeatureTitle>{item.title}</FeatureTitle>
              <FeatureDesc>{item.desc}</FeatureDesc>
            </FeatureCard>
          </Zoom>
        ))}
      </FeaturesGrid>
    </WhyChooseSection>
  );
}