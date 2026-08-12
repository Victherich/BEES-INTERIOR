// "use client";

// import styled from "styled-components";
// import Image from "next/image";
// import Link from "next/link";

// /* ================= COLORS ================= */

// const Blue = "#2563eb";
// const Dark = "#0f172a";
// const Border = "#e5eaf2";
// const White = "#ffffff";
// const Gold = "#D4AF37";
// const TextMuted = "#64748b";
// const LightBg = "#f8fafc";

// /* ================= STYLED COMPONENTS ================= */

// const PageContainer = styled.div`
//   font-family: inherit;
//   color: ${Dark};
//   background: ${White};
//   overflow-x: hidden;
// `;

// /* --- Hero Section --- */
// const HeroSection = styled.section`
//   position: relative;
//   height: 60vh;
//   min-height: 450px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   text-align: center;
//   background: ${Dark};
//   overflow: hidden;

//   &::after {
//     content: "";
//     position: absolute;
//     inset: 0;
//     background: rgba(15, 23, 42, 0.65);
//     z-index: 1;
//   }
// `;

// const HeroImageWrapper = styled.div`
//   position: absolute;
//   inset: 0;
//   z-index: 0;
// `;

// const HeroContent = styled.div`
//   position: relative;
//   z-index: 2;
//   max-width: 800px;
//   padding: 0 1.5rem;
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
// `;

// const HeroTitle = styled.h1`
//   font-size: clamp(2.5rem, 5vw, 4rem);
//   font-weight: 800;
//   color: ${White};
//   letter-spacing: -0.5px;

//   span {
//     background: linear-gradient(135deg, ${Blue} 0%, ${Gold} 100%);
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//   }
// `;

// const HeroSubtitle = styled.p`
//   font-size: clamp(1rem, 2vw, 1.2rem);
//   color: ${Border};
//   line-height: 1.6;
// `;

// /* --- Story Section --- */
// const StorySection = styled.section`
//   max-width: 1200px;
//   margin: auto;
//   padding: 6rem 1.5rem;
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 4rem;
//   align-items: center;

//   @media (max-width: 968px) {
//     grid-template-columns: 1fr;
//     gap: 3rem;
//     padding: 4rem 1.5rem;
//   }
// `;

// const StoryTextContent = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 1.5rem;
// `;

// const SectionTag = styled.span`
//   font-size: 0.85rem;
//   font-weight: 700;
//   text-transform: uppercase;
//   letter-spacing: 1.5px;
//   color: ${Blue};
// `;

// const SectionTitle = styled.h2`
//   font-size: clamp(2rem, 3.5vw, 2.75rem);
//   font-weight: 800;
//   line-height: 1.2;
//   color: ${Dark};
// `;

// const Paragraph = styled.p`
//   color: ${TextMuted};
//   font-size: 1.05rem;
//   line-height: 1.8;
// `;

// const StoryImagesGrid = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 1.5rem;
//   position: relative;

//   .img-box {
//     position: relative;
//     border-radius: 12px;
//     overflow: hidden;
//     box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);

//     &:nth-child(1) {
//       height: 350px;
//     }

//     &:nth-child(2) {
//       height: 350px;
//       transform: translateY(3rem);
//     }
//   }

//   @media (max-width: 968px) {
//     .img-box:nth-child(2) {
//       transform: translateY(0);
//     }
//   }
// `;

// /* --- Values Section --- */
// const ValuesSection = styled.section`
//   background: ${LightBg};
//   padding: 6rem 1.5rem;
//   border-top: 1px solid ${Border};
//   border-bottom: 1px solid ${Border};
// `;

// const ValuesContainer = styled.div`
//   max-width: 1200px;
//   margin: auto;
//   display: flex;
//   flex-direction: column;
//   gap: 4rem;
// `;

// const ValuesHeader = styled.div`
//   text-align: center;
//   max-width: 600px;
//   margin: auto;
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
// `;

// const ValuesGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 2rem;

//   @media (max-width: 968px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const ValueCard = styled.div`
//   background: ${White};
//   padding: 2.5rem 2rem;
//   border-radius: 12px;
//   border: 1px solid ${Border};
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
//   box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
//   transition: transform 0.3s ease, box-shadow 0.3s ease;

//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
//   }
// `;

// const ValueIcon = styled.div`
//   width: 50px;
//   height: 50px;
//   border-radius: 8px;
//   background: rgba(37, 99, 235, 0.1);
//   color: ${Blue};
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 1.5rem;
//   font-weight: 700;
// `;

// const ValueTitle = styled.h3`
//   font-size: 1.25rem;
//   font-weight: 700;
//   color: ${Dark};
// `;

// const ValueDesc = styled.p`
//   color: ${TextMuted};
//   font-size: 0.95rem;
//   line-height: 1.6;
// `;

// /* --- Stats Banner --- */
// const StatsSection = styled.section`
//   max-width: 1200px;
//   margin: auto;
//   padding: 5rem 1.5rem;
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 2rem;
//   text-align: center;

//   @media (max-width: 768px) {
//     grid-template-columns: repeat(2, 1fr);
//     gap: 3rem;
//   }
// `;

// const StatItem = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
// `;

// const StatNumber = styled.h3`
//   font-size: clamp(2.5rem, 4vw, 3.5rem);
//   font-weight: 800;
//   color: ${Blue};
// `;

// const StatLabel = styled.p`
//   color: ${TextMuted};
//   font-size: 0.95rem;
//   font-weight: 600;
// `;

// /* --- CTA Section --- */
// const CtaSection = styled.section`
//   background: ${Dark};
//   color: ${White};
//   padding: 6rem 1.5rem;
//   text-align: center;
//   position: relative;
//   overflow: hidden;
// `;

// const CtaInner = styled.div`
//   max-width: 700px;
//   margin: auto;
//   display: flex;
//   flex-direction: column;
//   gap: 1.5rem;
//   position: relative;
//   z-index: 2;
// `;

// const CtaButton = styled(Link)`
//   display: inline-block;
//   background: ${Blue};
//   color: ${White};
//   padding: 0.9rem 2rem;
//   border-radius: 8px;
//   font-weight: 600;
//   text-decoration: none;
//   transition: opacity 0.2s ease, transform 0.2s ease;
//   width: fit-content;
//   margin: 1rem auto 0 auto;

//   &:hover {
//     opacity: 0.9;
//     transform: translateY(-2px);
//   }
// `;

// /* ================= COMPONENT ================= */

// export default function AboutPage() {
//   return (
//     <PageContainer>
//       {/* Hero Section */}
//       <HeroSection>
//         <HeroImageWrapper>
//           <Image
//             src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
//             alt="Luxury Interior Design"
//             fill
//             style={{ objectFit: "cover" }}
//             priority
//           />
//         </HeroImageWrapper>
//         <HeroContent>
//           <HeroTitle>
//             Crafting Spaces That <span>Inspire Life</span>
//           </HeroTitle>
//           <HeroSubtitle>
//             At Bees Interior, we transform architectural spaces into bespoke masterpieces of luxury, comfort, and timeless elegance.
//           </HeroSubtitle>
//         </HeroContent>
//       </HeroSection>

//       {/* Story Section */}
//       <StorySection>
//         <StoryTextContent>
//           <SectionTag>Our Story</SectionTag>
//           <SectionTitle>Redefining Modern Living Through Exceptional Design</SectionTitle>
//           <Paragraph>
//             Founded with a passion for sophisticated aesthetics and flawless functionality, Bees Interior has grown into a premier destination for high-end interior solutions. We believe that every room tells a story, and our mission is to bring your distinct vision to life.
//           </Paragraph>
//           <Paragraph>
//             From minimalist modern apartments to grand luxury estates, our multidisciplinary team of designers, artisans, and project managers coordinate seamlessly to deliver spaces that are as functional as they are breathtaking.
//           </Paragraph>
//         </StoryTextContent>

//         <StoryImagesGrid>
//           <div className="img-box">
//             <Image
//               src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
//               alt="Interior Showcase 1"
//               fill
//               style={{ objectFit: "cover" }}
//             />
//           </div>
//           <div className="img-box">
//             <Image
//               src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop"
//               alt="Interior Showcase 2"
//               fill
//               style={{ objectFit: "cover" }}
//             />
//           </div>
//         </StoryImagesGrid>
//       </StorySection>

//       {/* Values Section */}
//       <ValuesSection>
//         <ValuesContainer>
//           <ValuesHeader>
//             <SectionTag>Core Values</SectionTag>
//             <SectionTitle>What Drives Our Creative Vision</SectionTitle>
//           </ValuesHeader>

//           <ValuesGrid>
//             <ValueCard>
//               <ValueIcon>01</ValueIcon>
//               <ValueTitle>Uncompromising Quality</ValueTitle>
//               <ValueDesc>
//                 We source only the finest materials, furniture pieces, and decor elements to guarantee long-lasting luxury and enduring style.
//               </ValueDesc>
//             </ValueCard>

//             <ValueCard>
//               <ValueIcon>02</ValueIcon>
//               <ValueTitle>Bespoke Approach</ValueTitle>
//               <ValueDesc>
//                 No two clients are alike. Every design layout is meticulously tailored to match your personal taste, lifestyle, and spatial needs.
//               </ValueDesc>
//             </ValueCard>

//             <ValueCard>
//               <ValueIcon>03</ValueIcon>
//               <ValueTitle>Seamless Execution</ValueTitle>
//               <ValueDesc>
//                 From initial concept sketches to the final reveal, our team handles every logistics and execution detail with absolute precision.
//               </ValueDesc>
//             </ValueCard>
//           </ValuesGrid>
//         </ValuesContainer>
//       </ValuesSection>

//       {/* Stats Banner */}
//       <StatsSection>
//         <StatItem>
//           <StatNumber>10+</StatNumber>
//           <StatLabel>Years of Excellence</StatLabel>
//         </StatItem>
//         <StatItem>
//           <StatNumber>250+</StatNumber>
//           <StatLabel>Projects Completed</StatLabel>
//         </StatItem>
//         <StatItem>
//           <StatNumber>15+</StatNumber>
//           <StatLabel>Design Awards</StatLabel>
//         </StatItem>
//         <StatItem>
//           <StatNumber>100%</StatNumber>
//           <StatLabel>Client Satisfaction</StatLabel>
//         </StatItem>
//       </StatsSection>

//       {/* CTA Section */}
//       <CtaSection>
//         <CtaInner>
//           <SectionTag style={{ color: Gold }}>Let's Collaborate</SectionTag>
//           <SectionTitle style={{ color: White }}>Ready to Transform Your Space?</SectionTitle>
//           <Paragraph style={{ color: Border }}>
//             Get in touch with our expert design consultants today and take the first step toward your dream environment.
//           </Paragraph>
//           <CtaButton href="/contact">Start Your Project</CtaButton>
//         </CtaInner>
//       </CtaSection>
//     </PageContainer>
//   );
// }


"use client";

import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

/* ================= COLORS ================= */

const Blue = "#2563eb";
const Dark = "#0f172a";
const Border = "#e5eaf2";
const White = "#ffffff";
const Gold = "#D4AF37";
const TextMuted = "#64748b";
const LightBg = "#f8fafc";

/* ================= STYLED COMPONENTS ================= */

const PageContainer = styled.div`
  font-family: inherit;
  color: ${Dark};
  background: ${White};
  overflow-x: hidden;
`;

/* --- Hero Section --- */
const HeroSection = styled.section`
  position: relative;
  height: 60vh;
  min-height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: ${Dark};
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.65);
    z-index: 1;
  }
`;

const HeroImageWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: ${White};
  letter-spacing: -0.5px;

  span {
    background: linear-gradient(135deg, ${Blue} 0%, ${Gold} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: ${Border};
  line-height: 1.6;
`;

/* --- Story Section --- */
const StorySection = styled.section`
  max-width: 1200px;
  margin: auto;
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 10px;
  }
`;

const StoryTextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTag = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${Blue};
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 800;
  line-height: 1.2;
  color: ${Dark};
`;

const Paragraph = styled.p`
  color: ${TextMuted};
  font-size: 1.05rem;
  line-height: 1.8;
`;

const StoryImagesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  position: relative;

  .img-box {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);

    &:nth-child(1) {
      height: 350px;
    }

    &:nth-child(2) {
      height: 350px;
      transform: translateY(10px);
    }
  }

  @media (max-width: 968px) {
    .img-box:nth-child(2) {
      transform: translateY(0);
    }
  }
`;

/* --- Values Section --- */
const ValuesSection = styled.section`
  background: ${LightBg};
  padding: 10px;
  border-top: 1px solid ${Border};
  border-bottom: 1px solid ${Border};
`;

const ValuesContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ValuesHeader = styled.div`
  text-align: center;
  max-width: 600px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled.div`
  background: ${White};
  padding: 10px;
  border-radius: 10px;
  border: 1px solid ${Border};
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  }
`;

const ValueIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background: rgba(37, 99, 235, 0.1);
  color: ${Blue};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
`;

const ValueTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${Dark};
`;

const ValueDesc = styled.p`
  color: ${TextMuted};
  font-size: 0.95rem;
  line-height: 1.6;
`;

/* --- Stats Banner --- */
const StatsSection = styled.section`
  max-width: 1200px;
  margin: auto;
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  text-align: center;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StatNumber = styled.h3`
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 800;
  color: ${Blue};
`;

const StatLabel = styled.p`
  color: ${TextMuted};
  font-size: 0.95rem;
  font-weight: 600;
`;

/* --- CTA Section --- */
const CtaSection = styled.section`
  background: ${Dark};
  color: ${White};
  padding: 10px;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const CtaInner = styled.div`
  max-width: 700px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  z-index: 2;
`;

const CtaButton = styled(Link)`
  display: inline-block;
  background: ${Blue};
  color: ${White};
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  width: fit-content;
  margin: 10px auto 0 auto;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

/* ================= COMPONENT ================= */

export default function AboutPage() {
  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroImageWrapper>
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
            alt="Luxury Interior Design"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </HeroImageWrapper>
        <HeroContent>
          <HeroTitle>
            Crafting Spaces That <span>Inspire Life</span>
          </HeroTitle>
          <HeroSubtitle>
            At Bees Interior, we transform architectural spaces into bespoke masterpieces of luxury, comfort, and timeless elegance.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Story Section */}
      <StorySection>
        <StoryTextContent>
          <SectionTag>Our Story</SectionTag>
          <SectionTitle>Redefining Modern Living Through Exceptional Design</SectionTitle>
          <Paragraph>
            Founded with a passion for sophisticated aesthetics and flawless functionality, Bees Interior has grown into a premier destination for high-end interior solutions. We believe that every room tells a story, and our mission is to bring your distinct vision to life.
          </Paragraph>
          <Paragraph>
            From minimalist modern apartments to grand luxury estates, our multidisciplinary team of designers, artisans, and project managers coordinate seamlessly to deliver spaces that are as functional as they are breathtaking.
          </Paragraph>
        </StoryTextContent>

        <StoryImagesGrid>
          <div className="img-box">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
              alt="Interior Showcase 1"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="img-box">
            <Image
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop"
              alt="Interior Showcase 2"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </StoryImagesGrid>
      </StorySection>

      {/* Values Section */}
      <ValuesSection>
        <ValuesContainer>
          <ValuesHeader>
            <SectionTag>Core Values</SectionTag>
            <SectionTitle>What Drives Our Creative Vision</SectionTitle>
          </ValuesHeader>

          <ValuesGrid>
            <ValueCard>
              <ValueIcon>01</ValueIcon>
              <ValueTitle>Uncompromising Quality</ValueTitle>
              <ValueDesc>
                We source only the finest materials, furniture pieces, and decor elements to guarantee long-lasting luxury and enduring style.
              </ValueDesc>
            </ValueCard>

            <ValueCard>
              <ValueIcon>02</ValueIcon>
              <ValueTitle>Bespoke Approach</ValueTitle>
              <ValueDesc>
                No two clients are alike. Every design layout is meticulously tailored to match your personal taste, lifestyle, and spatial needs.
              </ValueDesc>
            </ValueCard>

            <ValueCard>
              <ValueIcon>03</ValueIcon>
              <ValueTitle>Seamless Execution</ValueTitle>
              <ValueDesc>
                From initial concept sketches to the final reveal, our team handles every logistics and execution detail with absolute precision.
              </ValueDesc>
            </ValueCard>
          </ValuesGrid>
        </ValuesContainer>
      </ValuesSection>

      {/* Stats Banner */}
      <StatsSection>
        <StatItem>
          <StatNumber>10+</StatNumber>
          <StatLabel>Years of Excellence</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>250+</StatNumber>
          <StatLabel>Projects Completed</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>15+</StatNumber>
          <StatLabel>Design Awards</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>100%</StatNumber>
          <StatLabel>Client Satisfaction</StatLabel>
        </StatItem>
      </StatsSection>

      {/* CTA Section */}
      <CtaSection>
        <CtaInner>
          <SectionTag style={{ color: Gold }}>Let's Collaborate</SectionTag>
          <SectionTitle style={{ color: White }}>Ready to Transform Your Space?</SectionTitle>
          <Paragraph style={{ color: Border }}>
            Get in touch with our expert design consultants today and take the first step toward your dream environment.
          </Paragraph>
          <CtaButton href="/contact">Start Your Project</CtaButton>
        </CtaInner>
      </CtaSection>
    </PageContainer>
  );
}