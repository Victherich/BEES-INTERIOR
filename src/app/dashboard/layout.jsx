

"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Swal from "sweetalert2";
import { usePathname } from "next/navigation";

// 🎨 BEES INTERIOR THEME COLORS
const Blue = "#2563eb";
const Dark = "#0f172a";
const Border = "#e5eaf2";
const White = "#ffffff";
const Gold = "#D4AF37";
const TextMuted = "#475569";
const LightBg = "#f8fafc";

/* ---------------- LAYOUT WRAPPER ---------------- */
const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  background: ${LightBg};
  font-family: inherit;
`;

/* ---------------- SIDEBAR ---------------- */
const Sidebar = styled.div`
  width: 260px;
  background: ${White};
  border-right: 1px solid ${Border};
  color: ${Dark};
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: 0.35s ease;
  z-index: 200;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: ${(props) => (props.$open ? "0" : "-260px")};
    height: 100vh;
    box-shadow: ${(props) => (props.$open ? "4px 0 15px rgba(15, 23, 42, 0.1)" : "none")};
  }
`;

const SidebarTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BrandLogo = styled.h2`
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: ${Dark};
  padding: 10px 0;
  border-bottom: 1px solid ${Border};
  margin-bottom: 10px;

  span {
    color: ${Gold};
  }
`;

const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MenuItem = styled.div`
  padding: 10px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${(props) => (props.$active ? White : TextMuted)};
  background: ${(props) => (props.$active ? Blue : "transparent")};
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$active ? Blue : LightBg)};
    color: ${(props) => (props.$active ? White : Dark)};
  }
`;

const LogoutButton = styled.div`
  padding: 10px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }
`;

/* ---------------- MAIN CONTENT AREA ---------------- */
const MainContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Topbar = styled.header`
  height: 10px;
  background: ${White};
  border-bottom: 1px solid ${Border};
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const TopbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TopbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Content = styled.main`
  flex: 1;
  padding: 10px;
  background: ${LightBg};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

/* ---------------- OVERLAY (click-away) ---------------- */
const Overlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${(props) => (props.$open ? "block" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(15, 23, 42, 0.4);
    z-index: 150;
  }
`;

/* ---------------- HAMBURGER ---------------- */
const Hamburger = styled.button`
  width: 40px;
  height: 40px;
  background: ${White};
  border: 1px solid ${Border};
  border-radius: 6px;
  color: ${Dark};
  font-size: 1.2rem;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${Blue};
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

/* ---------------- HOME BUTTON ---------------- */
const HomeButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: ${White};
  color: ${Dark};
  border: 1px solid ${Border};
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${Blue};
    color: ${Blue};
  }
`;

/* ---------------- LOADING STATE ---------------- */
const LoadingWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${LightBg};
  color: ${Dark};
  font-size: 1.1rem;
  font-weight: 600;
`;

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showHomeButton = pathname !== "/dashboard";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      }
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <LoadingWrapper>
        <p>Loading dashboard...</p>
      </LoadingWrapper>
    );
  }

  /* ---------------- SIGN OUT ---------------- */
  const signOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be signed out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: Blue,
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Sign Out",
    }).then((result) => {
      if (result.isConfirmed) {
        auth.signOut();
        Swal.fire("Signed Out", "You have been logged out successfully.", "success");
        router.push("/login");
      }
    });
  };

  /* ---------------- CLOSE SIDEBAR ON MOBILE ---------------- */
  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <LayoutWrapper>
      {/* CLICK-AWAY OVERLAY */}
      <Overlay $open={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      {/* SIDEBAR */}
      <Sidebar $open={sidebarOpen}>
        <SidebarTop>
          <BrandLogo>
            BEES <span>INTERIOR</span>
          </BrandLogo>

          <NavLinks>
            <MenuItem
              $active={pathname === "/dashboard"}
              onClick={() => {
                router.push("/dashboard");
                closeSidebar();
              }}
            >
              📊 My Dashboard
            </MenuItem>
          
          </NavLinks>
        </SidebarTop>

        <LogoutButton
          onClick={() => {
            signOut();
            closeSidebar();
          }}
        >
          🚪 Sign Out
        </LogoutButton>
      </Sidebar>

      {/* MAIN CONTENT AREA */}
      <MainContentArea>
        {/* TOPBAR */}
        <Topbar>
          <TopbarLeft>
            <Hamburger onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </Hamburger>
          </TopbarLeft>
{/* 
          <TopbarRight>
            {showHomeButton && (
              <HomeButton
                onClick={() => {
                  router.push("/dashboard");
                  closeSidebar();
                }}
                title="Return to Dashboard"
              >
                🏠
              </HomeButton>
            )}
          </TopbarRight> */}
        </Topbar>

        {/* CONTENT */}
        <Content onClick={closeSidebar}>
          {children}
        </Content>
      </MainContentArea>
    </LayoutWrapper>
  );
}