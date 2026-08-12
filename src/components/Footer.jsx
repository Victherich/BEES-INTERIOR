

"use client";

import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

/* ================= COLORS ================= */

const Blue = "#2563eb";
const Dark = "#0f172a";
const Border = "#e5eaf2";
const White = "#ffffff";
const Gold = "#D4AF37";
const TextMuted = "#64748b";

/* ================= FOOTER STYLES ================= */

const FooterContainer = styled.footer`
  background: ${Dark};
  color: ${White};
  border-top: 1px solid ${Border};
  font-family: inherit;
  position: relative;
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 10px;

  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 10px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const FooterCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Logo = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: ${White};
  display: flex;
  align-items: center;
  gap: 4px;

  span {
    background: linear-gradient(135deg, ${Blue} 0%, ${Gold} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const FooterText = styled.p`
  color: ${TextMuted};
  font-size: 0.9rem;
  line-height: 1.6;
`;

const ColTitle = styled.h4`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${White};
  letter-spacing: 0.5px;
  margin-bottom: 0px;
`;

const FooterLink = styled(Link)`
  color: ${TextMuted};
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  width: fit-content;

  &:hover {
    color: ${Blue};
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${TextMuted};
  font-size: 0.9rem;

  span {
    color: rgba(255, 255, 255, 0.5);
  }
`;
const SocialIconsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

const SocialIconLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${TextMuted};
  transition: all 0.2s ease;

  &:hover {
    background: ${Blue};
    color: ${White};
    border-color: ${Blue};
    transform: translateY(-2px);
  }

  svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }
`;

const BottomBar = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: ${TextMuted};
  font-size: 0.85rem;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 10px;

  a {
    color: ${TextMuted};
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.2s ease;

    &:hover {
      color: ${Blue};
    }
  }
`;

/* ================= FLOATING WHATSAPP ================= */

const WhatsAppFloat = styled.a`
  position: fixed;
  bottom: 1%;
  right: 1%;
  z-index: 300;
  background-color: #25d366;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
  }
`;

/* ================= COMPONENT ================= */

export default function Footer() {
  const currentYear = new Date().getFullYear();



  return (
    <>
      <FooterContainer>
        <FooterInner>
          {/* Col 1: Brand Info */}
          <FooterCol>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <img src="/logo.jpeg" alt="Bees Interior Logo" style={{ height: "50px", marginBottom: "10px", borderRadius: "10px" }} />  
              <Logo>
                Bees<span>Interior</span>
              </Logo>
            </Link>
            <FooterText>
              Transforming spaces into timeless masterpieces. Discover luxury interior designs, curated store items, and professional execution tailored to your lifestyle.
            </FooterText>
          </FooterCol>

          {/* Col 2: Quick Links */}
          <FooterCol>
            <ColTitle>Quick Links</ColTitle>
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/store">Store</FooterLink>
            <FooterLink href="/blogs">Blogs</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterCol>

          {/* Col 3: Contact & Support */}
          <FooterCol>
            <ColTitle>Get in Touch</ColTitle>
            <ContactInfo>
              <p>Email: <span>beesinterior@gmail.com</span></p>
              <p>Phone: <span>+234 812 549 4597</span></p>
              <p>Location: <span>24 Oseni street, Anthony Village Lagos state Nigeria</span></p>
            </ContactInfo>
          </FooterCol>

 {/* Col 4: Social Media */}
          <FooterCol>
            <ColTitle>Connect With Us</ColTitle>
            <FooterText>
              Follow us on social media for daily design inspiration and project updates.
            </FooterText>
            <SocialIconsContainer>
              {/* Instagram */}
              <SocialIconLink 
                href="https://www.instagram.com/accessoriesbybees?igsh=MThycjkydHV4bHR1Yw==" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </SocialIconLink>
            </SocialIconsContainer>
          </FooterCol>

        {/* Bottom Bar */}
        <BottomBar>
          <Copyright>
            &copy; {currentYear} Bees Interior. All rights reserved.
          </Copyright>
          <LegalLinks>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-conditions">Terms & Conditions</Link>
          </LegalLinks>
        </BottomBar>
        </FooterInner>
      </FooterContainer>

      {/* Floating WhatsApp Icon */}
      <WhatsAppFloat 
        href="https://wa.me/2348125494597" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          width={20}
          height={20}
        />
      </WhatsAppFloat>
    </>
  );
}