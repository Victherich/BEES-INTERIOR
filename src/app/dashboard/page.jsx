"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebaseConfig";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

// 🎨 BEES INTERIOR THEME COLORS (Strictly matching the theme system)
const Blue = "#2563eb";
const Dark = "#0f172a";
const Border = "#e5eaf2";
const White = "#ffffff";
const Gold = "#D4AF37";
const TextMuted = "#475569";
const LightBg = "#f8fafc";

// 🌟 Styled Components (Strict max 10px spacing/gaps/margins/padding rule)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${Dark};
  width: 100%;
`;

const GreetingBanner = styled.div`
  background: linear-gradient(135deg, ${Blue} 0%, ${Gold} 100%);
  color: ${White};
  padding: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.05);
`;

const Greeting = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin: 0;
`;

const SubGreeting = styled.p`
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${Blue};
  margin: 10px 0 0 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
`;

const StatCard = styled.div`
  background: ${White};
  border-radius: 10px;
  padding: 10px;
  border: 1px solid ${Border};
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StatLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${TextMuted};
`;

const StatValue = styled.span`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${Dark};
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
`;

const MenuCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "clickable",
})`
  background: ${White};
  border-radius: 10px;
  padding: 10px;
  border: 1px solid ${Border};
  border-left: 4px solid ${Blue};
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;

  &:hover {
    transform: ${(props) => (props.clickable ? "translateY(-2px)" : "none")};
    border-color: ${Blue};
    box-shadow: 0 6px 15px rgba(37, 99, 235, 0.08);
  }
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MenuTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  // color: ${Dark};
  color:#333;
`;

const MenuDesc = styled.p`
  margin: 0;
  font-size: 0.7rem;
  color: ${TextMuted};
`;

const MenuIcon = styled.span`
  font-size: 1.5rem;
`;

const SectionHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 0 0;
`;

const ActionTextLink = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${Blue};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const RecentOrdersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 10px;
`;

const OrderCard = styled.div`
  background: ${White};
  border-radius: 10px;
  padding: 10px;
  border: 1px solid ${Border};
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
`;

const OrderId = styled.span`
  font-size: 0.9rem;
  font-weight: 800;
  color: ${Dark};
`;

const OrderStatus = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${(props) => (props.$status === "Delivered" ? "rgba(16, 185, 129, 0.1)" : "rgba(37, 99, 235, 0.1)")};
  color: ${(props) => (props.$status === "Delivered" ? "#10b981" : Blue)};
`;

const OrderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.85rem;
  color: ${TextMuted};
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 10px;
`;

const DetailCard = styled.div`
  background: ${White};
  border-radius: 10px;
  padding: 10px;
  border: 1px solid ${Border};
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DetailTitle = styled.h3`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: ${Dark};
`;

const DetailValue = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${TextMuted};
  word-break: break-all;
`;

const LoadingContainer = styled.div`
  padding: 10px;
  text-align: center;
  color: ${Dark};
  font-weight: 600;
`;

const DashboardHome = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);




// 📝 Function to handle editing the phone number
  const handleEditPhone = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const { value: newPhone } = await Swal.fire({
      title: "Edit Phone Number",
      input: "text",
      inputLabel: "Enter your new phone number",
      inputValue: userData?.phone || "",
      showCancelButton: true,
      confirmButtonColor: Blue,
      cancelButtonColor: TextMuted,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    if (newPhone) {
      try {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, { phone: newPhone });
        setUserData((prev) => ({ ...prev, phone: newPhone }));
        Swal.fire("Updated!", "Your phone number has been updated.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to update phone number.", "error");
      }
    }
  };




  if (loading) {
    return (
      <LoadingContainer>
        <h2>Loading dashboard...</h2>
      </LoadingContainer>
    );
  }

  if (!userData) {
    return (
      <LoadingContainer>
        <h2>No user data found.</h2>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      {/* Welcome Banner */}
      <GreetingBanner>
        <Greeting>Welcome back, {userData.role==='admin'?"ADMIN:":''} {userData.name || userData.email} 👋</Greeting>
        <SubGreeting>
          Manage your luxury interior orders, track design consultations, and explore our exclusive store catalog.
        </SubGreeting>
      </GreetingBanner>

       {/* E-Commerce Quick Actions / Navigation */}
      {userData.role==='admin' && (
        <SectionTitle>ADMIN Actions</SectionTitle>
      )}
      {userData.role==='admin'&&<MenuGrid>
           <MenuCard clickable onClick={() => router.push("/dashboard/manage-categories")}>
          <MenuContent>
            <MenuTitle>Manage Product Categories</MenuTitle>
            <MenuDesc>Create, View, Update and Delete product categories</MenuDesc>
          </MenuContent>
          <MenuIcon>🛍️</MenuIcon>
        </MenuCard>
        <MenuCard clickable onClick={() => router.push("/dashboard/manage-products")}>
          <MenuContent>
            <MenuTitle>Manage Products</MenuTitle>
            <MenuDesc>Create, View, Update and Delete products</MenuDesc>
          </MenuContent>
          <MenuIcon>🛍️</MenuIcon>
        </MenuCard>

        <MenuCard clickable onClick={() => router.push("/dashboard/manage-orders")}>
          <MenuContent>
            <MenuTitle>Manage Orders</MenuTitle>
            <MenuDesc>View and manage customer orders</MenuDesc>
          </MenuContent>
          <MenuIcon>📦</MenuIcon>
        </MenuCard>

        <MenuCard clickable onClick={() => router.push("/dashboard/manage-users")}>
          <MenuContent>
            <MenuTitle>Manage Users</MenuTitle>
            <MenuDesc>View and manage customer information</MenuDesc>
          </MenuContent>
          <MenuIcon>🛋️</MenuIcon>
        </MenuCard>

         <MenuCard clickable onClick={() => router.push("/dashboard/promocodes")}>
          <MenuContent>
            <MenuTitle>Manage Promo Codes</MenuTitle>
            <MenuDesc>View and manage promo codes</MenuDesc>
          </MenuContent>
          <MenuIcon>💥</MenuIcon>
        </MenuCard>

        <MenuCard clickable onClick={() => router.push("/dashboard/analytics")}>
          <MenuContent>
            <MenuTitle>Analytics</MenuTitle>
            <MenuDesc>View store performance metrics</MenuDesc>
          </MenuContent>
          <MenuIcon>📈</MenuIcon>
        </MenuCard>

        <MenuCard clickable onClick={() => router.push("/dashboard/hostinglist")}>
          <MenuContent>
            <MenuTitle>Manage Hosting</MenuTitle>
            <MenuDesc>View and manage hosting services</MenuDesc>
          </MenuContent>
          <MenuIcon>🌐</MenuIcon>
        </MenuCard>

      </MenuGrid>}

      {/* E-Commerce Metrics / Quick Stats */}
      {/* <SectionTitle>Store Overview</SectionTitle>
      <StatsGrid>
        <StatCard>
          <StatLabel>Active Orders</StatLabel>
          <StatValue>2</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Wishlist Items</StatLabel>
          <StatValue>5</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>My Cart Items</StatLabel>
          <StatValue>1 Item</StatValue>
        </StatCard>
     
      </StatsGrid> */}

      {/* E-Commerce Quick Actions / Navigation */}
      <SectionTitle>Customer Actions</SectionTitle>
      <MenuGrid>
        <MenuCard clickable onClick={() => router.push("/dashboard/myorders")}>
          <MenuContent>
            <MenuTitle>My Orders</MenuTitle>
            <MenuDesc>Track shipping & delivery status</MenuDesc>
          </MenuContent>
          <MenuIcon>🛍️</MenuIcon>
        </MenuCard>

        <MenuCard clickable onClick={() => router.push("/dashboard/mywishlist")}>
          <MenuContent>
            <MenuTitle>My Wishlist</MenuTitle>
            <MenuDesc>View saved items & special offers</MenuDesc>
          </MenuContent>
          <MenuIcon>📦</MenuIcon>
        </MenuCard>

        {/* <MenuCard clickable  onClick={() => router.push("/dashboard/addressmanager")}>
          <MenuContent>
            <MenuTitle>My Addresses</MenuTitle>
            <MenuDesc>View and manage your saved addresses</MenuDesc>
          </MenuContent>
          <MenuIcon>🛋️</MenuIcon>
        </MenuCard> */}

      </MenuGrid>

      {/* Recent Orders Section */}
      {/* <SectionHeaderRow>
        <SectionTitle style={{ margin: 0 }}>Recent Orders</SectionTitle>
        <ActionTextLink onClick={() => Swal.fire("All Orders", "Viewing complete order history.", "info")}>
          View All
        </ActionTextLink>
      </SectionHeaderRow> */}
      {/* <RecentOrdersGrid>
        <OrderCard>
          <OrderHeader>
            <OrderId>#BS-89421</OrderId>
            <OrderStatus $status="Processing">Processing</OrderStatus>
          </OrderHeader>
          <OrderDetails>
            <span>Items: Velvet Armchair (x1), Gold Accent Table (x1)</span>
            <span>Total: $1,450.00</span>
            <span style={{ color: Blue, fontWeight: "600", cursor: "pointer" }} onClick={() => Swal.fire("Tracking", "Order is currently being crafted in our workshop.", "info")}>
              Track Shipment ➔
            </span>
          </OrderDetails>
        </OrderCard>

        <OrderCard>
          <OrderHeader>
            <OrderId>#BS-88310</OrderId>
            <OrderStatus $status="Delivered">Delivered</OrderStatus>
          </OrderHeader>
          <OrderDetails>
            <span>Items: Minimalist Marble Pendant Light (x2)</span>
            <span>Total: $680.00</span>
            <span style={{ color: Blue, fontWeight: "600", cursor: "pointer" }} onClick={() => Swal.fire("Invoice", "Downloading official receipt...", "success")}>
              Download Invoice ➔
            </span>
          </OrderDetails>
        </OrderCard>
      </RecentOrdersGrid> */}

      {/* Primary User Details */}
      <SectionTitle>Your Account Details</SectionTitle>
      <DetailsGrid>
        <DetailCard>
          <DetailTitle>Full Name</DetailTitle>
          <DetailValue>{userData.name}</DetailValue>
        </DetailCard>

        <DetailCard>
          <DetailTitle>Email Address</DetailTitle>
          <DetailValue>{userData.email}</DetailValue>
        </DetailCard>
<DetailCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <DetailTitle>Phone Number</DetailTitle>
            <ActionTextLink onClick={handleEditPhone}>Edit</ActionTextLink>
          </div>
          <DetailValue>{userData.phone || "Not provided"}</DetailValue>
        </DetailCard>
      </DetailsGrid>
    </Container>
  );
};

export default DashboardHome;