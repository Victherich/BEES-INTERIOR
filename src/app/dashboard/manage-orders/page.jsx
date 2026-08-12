




"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import styled from "styled-components";
import Swal from "sweetalert2";
import {useRouter} from "next/navigation";

// 🎨 BEES INTERIOR THEME COLORS
const Blue = "#2563eb";
const Dark = "#0f172a";
const Border = "#e5eaf2";
const White = "#ffffff";
const Gold = "#D4AF37";
const TextMuted = "#475569";
const Danger = "#ef4444";
const Success = "#10b981";
const Warning = "#f59e0b";

// 🌟 Styled Components (Strict max 10px spacing/gaps/margins/padding rule)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${Dark};
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
`;

const HeaderBanner = styled.div`
  background: linear-gradient(135deg, ${Blue} 0%, ${Gold} 100%);
  color: ${White};
  padding: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.05);
`;

const ColorfulTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(90deg, #ffffff 0%, #fef08a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
`;

const ColorfulSub = styled.p`
  font-size: 0.95rem;
  margin: 0;
  color: #f8fafc;
  opacity: 0.95;
`;

const SearchContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
`;

const StyledInput = styled.input`
  border: 1px solid ${Border};
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 0.9rem;
  outline: none;
  color: ${Dark};
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  background: ${White};

  &:focus {
    border-color: ${Blue};
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 0 0;
`;

const ColorfulSectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, ${Blue} 0%, ${Gold} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const OrdersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 10px;
`;

const OrderCard = styled.div`
  background: ${White};
  border-radius: 10px;
  padding: 10px;
  border: 1px solid ${Border};
  border-left: 4px solid ${Gold};
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const OrderIdText = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: ${Dark};
`;

const OrderCustomer = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${TextMuted};
  font-weight: 600;
`;

const OrderEmail = styled.span`
  font-size: 0.75rem;
  color: ${TextMuted};
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const Badge = styled.span`
  background: ${(props) => 
    props.$variant === "danger" ? "rgba(239, 68, 68, 0.1)" : 
    props.$variant === "success" ? "rgba(16, 185, 129, 0.1)" : 
    props.$variant === "warning" ? "rgba(245, 158, 11, 0.1)" : 
    "rgba(37, 99, 235, 0.1)"
  };
  color: ${(props) => 
    props.$variant === "danger" ? Danger : 
    props.$variant === "success" ? Success : 
    props.$variant === "warning" ? Warning : 
    Blue
  };
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const OrderDetailsBox = styled.div`
  background: #f8fafc;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85rem;
  color: ${TextMuted};
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 5px;
`;

const ControlLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${Dark};
`;

const StyledSelect = styled.select`
  border: 1px solid ${Border};
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 0.85rem;
  outline: none;
  color: ${Dark};
  width: 100%;
  background: ${White};
  box-sizing: border-box;

  &:focus {
    border-color: ${Blue};
  }
`;

const LoadingContainer = styled.div`
  padding: 10px;
  text-align: center;
  color: ${Dark};
  font-weight: 600;
`;

const MoreDetailsButton = styled.button`
  margin-top: 5px;
  padding: 6px 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${White};
  background: ${Blue};
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "orders"));
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(list);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch orders.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newOrderStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        orderStatus: newOrderStatus,
        updatedAt: serverTimestamp(),
      });
      Swal.fire("Updated!", "Order status updated successfully.", "success");
      fetchOrders();
    } catch (error) {
      Swal.fire("Error", "Could not update order status.", "error");
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newPaymentStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        paymentStatus: newPaymentStatus,
        updatedAt: serverTimestamp(),
      });
      Swal.fire("Updated!", "Payment status updated successfully.", "success");
      fetchOrders();
    } catch (error) {
      Swal.fire("Error", "Could not update payment status.", "error");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const orderNoMatch = o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const docIdMatch = o.id?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const nameMatch = o.accountInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const emailMatch = o.accountInfo?.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    return orderNoMatch || docIdMatch || nameMatch || emailMatch;
  });

  if (loading) {
    return <LoadingContainer>Loading orders registry...</LoadingContainer>;
  }

  return (
    <Container>
      <HeaderBanner>
        <ColorfulTitle>Customer Orders Management 📦</ColorfulTitle>
        <ColorfulSub>Track client purchases, update fulfillment workflows, and verify transaction payments.</ColorfulSub>
      </HeaderBanner>

      <SearchContainer>
        <StyledInput 
          type="text" 
          placeholder="Search by order number, customer name, or email..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </SearchContainer>

      <ActionRow>
        <ColorfulSectionTitle>All Orders ({filteredOrders.length})</ColorfulSectionTitle>
      </ActionRow>

      {filteredOrders.length === 0 ? (
        <LoadingContainer>No matching orders found.</LoadingContainer>
      ) : (
        <OrdersGrid>
          {filteredOrders.map((order) => {
            const currentOrderStatus = order.orderStatus || "Pending";
            const currentPaymentStatus = order.paymentStatus || "Pending";
            const customerName = order.accountInfo?.name || "Valued Customer";
            const customerEmail = order.accountInfo?.email || "No Email Provided";
            const paymentType = order.paymentType || "ONLINE PAYMENT";
            const currency = order.currency || "NGN";
            const finalTotal = Number(order.finalTotal || 0).toLocaleString();
            const itemCount = order.items?.length || 0;

            return (
              <OrderCard key={order.id}>
                <CardHeader>
                  <OrderInfo>
                    <OrderIdText>{order.orderNumber || `Order #${order.id.slice(0, 8)}`}</OrderIdText>
                    <OrderCustomer>{customerName}</OrderCustomer>
                    <OrderEmail>{customerEmail}</OrderEmail>
                  </OrderInfo>
                  <BadgeContainer>
                    <Badge $variant={
                      currentOrderStatus.toLowerCase() === "delivered" ? "success" : 
                      currentOrderStatus.toLowerCase() === "cancelled" ? "danger" : "warning"
                    }>
                      {currentOrderStatus.toUpperCase()}
                    </Badge>
                    <Badge $variant={
                      currentPaymentStatus.toLowerCase() === "paid" ? "success" : 
                      currentPaymentStatus.toLowerCase() === "failed" ? "danger" : "warning"
                    }>
                      {currentPaymentStatus.toUpperCase()}
                    </Badge>
                  </BadgeContainer>
                </CardHeader>

                <OrderDetailsBox>
                  <span>Total: <strong>{currency} {finalTotal}</strong></span>
                  <span>Items: {itemCount} product(s)</span>
                  <span>Payment Type: <strong>{paymentType}</strong></span>
                </OrderDetailsBox>

                <ControlGroup>
                  <ControlLabel>Order Status</ControlLabel>
                  <StyledSelect 
                    value={currentOrderStatus} 
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </StyledSelect>
                </ControlGroup>

                <ControlGroup>
                  <ControlLabel>Payment Status</ControlLabel>
                  <StyledSelect 
                    value={currentPaymentStatus} 
                    onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </StyledSelect>
                </ControlGroup>
                <MoreDetailsButton onClick={() => router.push(`/dashboard/orders/${order.id}`)}>View Order Details</MoreDetailsButton>
              </OrderCard>
            );
          })}
        </OrdersGrid>
      )}
    </Container>
  );
}