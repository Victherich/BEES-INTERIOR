"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";
import styled from "styled-components";
import Swal from "sweetalert2";

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

// 🌟 Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: ${Dark};
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 5px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 5px;
    gap: 20px;
  }
`;

const HeaderBanner = styled.div`
  background: linear-gradient(135deg, ${Blue} 0%, ${Gold} 100%);
  color: ${White};
  padding: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const ColorfulTitle = styled.h1`
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(90deg, #ffffff 0%, #fef08a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: ${White};
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${White};
    color: ${Blue};
  }
`;

const ColorfulSub = styled.p`
  font-size: 0.9rem;
  margin: 0;
  color: #f8fafc;
  opacity: 0.95;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const GridContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 900px) {
    grid-template-columns: 2fr 1fr;
    gap: 20px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.div`
  background: ${White};
  border-radius: 12px;
  padding: 16px;
  border: 1px solid ${Border};
  border-top: 4px solid ${Blue};
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0;
  color: ${Blue};
  border-bottom: 2px solid ${Border};
  padding-bottom: 8px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Label = styled.span`
  font-size: 0.75rem;
  color: ${TextMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
`;

const Value = styled.span`
  font-size: 0.9rem;
  color: ${Dark};
  font-weight: 600;
  word-break: break-word;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
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
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border: 1px solid ${Border};
  border-radius: 8px;
  background: #f8fafc;
  cursor: pointer;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid ${Border};
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 70px;
    height: 70px;
  }
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
`;

const ProductName = styled.h4`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: ${Dark};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductMeta = styled.span`
  font-size: 0.8rem;
  color: ${TextMuted};
`;

const ProductPriceTag = styled.div`
  text-align: right;
  font-weight: 800;
  font-size: 0.95rem;
  color: ${Blue};
  white-space: nowrap;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: ${TextMuted};
  font-weight: 600;

  &.total {
    font-size: 1.15rem;
    color: ${Blue};
    font-weight: 800;
    border-top: 2px solid ${Border};
    padding-top: 10px;
    margin-top: 4px;
  }

  &.discount {
    color: ${Success};
  }
`;

const LoadingContainer = styled.div`
  padding: 60px;
  text-align: center;
  font-size: 1.1rem;
  color: ${Blue};
  font-weight: 700;
`;

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id; // Dynamic route segment: [id]

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          Swal.fire("Not Found", "Order does not exist in the database.", "error");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        Swal.fire("Error", "Failed to retrieve order details.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <LoadingContainer>Loading complete order information...</LoadingContainer>;
  }

  if (!order) {
    return (
      <Container>
        <LoadingContainer>
          Order not found.
          <br /><br />
          <BackButton onClick={() => router.back()}>Go Back</BackButton>
        </LoadingContainer>
      </Container>
    );
  }

  const account = order.accountInfo || {};
  const address = order.deliveryAddress || {};
  const items = order.items || [];
  const currency = order.currency || "NGN";

  const formattedDate = order.createdAt?.toDate 
    ? new Date(order.createdAt.toDate()).toLocaleString() 
    : "Recent";

  return (
    <Container>
      {/* Header Banner */}
      <HeaderBanner>
        <TopRow>
          <ColorfulTitle>{order.orderNumber || `Order #${order.id.slice(0, 8)}`}</ColorfulTitle>
          <BackButton onClick={() => router.back()}>← Back to Orders</BackButton>
        </TopRow>
        <ColorfulSub>Placed on: {formattedDate}</ColorfulSub>
      </HeaderBanner>

      <GridContent>
        {/* Left Column: Products & Totals */}
        <Column>
          {/* Products Card */}
          <Card>
            <CardTitle>Ordered Products ({items.length})</CardTitle>
            <ProductsList>
              {items.map((item, index) => {
                const price = Number(item.price || item.amount || 0);
                const qty = Number(item.quantity || 1);
                const itemTotal = price * qty;
                const imgSrc = item.image || item.img || item.imageUrl || "https://placehold.co/100x100?text=Product";

                return (
                  <ProductItem key={`${item.id || index}`} onClick={()=>router.push(`/productdetail/${item.id}`)}>
                    <ProductImage src={imgSrc} alt={item.name || item.title || "Product Image"} />
                    <ProductDetails>
                      <ProductName>{item.name || item.title || "Unnamed Product"}</ProductName>
                      <p style={{fontSize:'0.6rem'}}>ID: {item.id}</p>
                      <ProductMeta>Qty: {qty} × ₦{price.toLocaleString()}</ProductMeta>
                      {/* {item.selectedColor && <ProductMeta>Color: {item.selectedColor}</ProductMeta>} */}
                      {/* {item.selectedSize && <ProductMeta>Size: {item.selectedSize}</ProductMeta>} */}
                    </ProductDetails>
                    <ProductPriceTag>
                      ₦{itemTotal.toLocaleString()}
                    </ProductPriceTag>
                  </ProductItem>
                );
              })}
            </ProductsList>

            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <SummaryRow>
                <span>Subtotal</span>
                <span>{currency} {Number(order.subtotal || 0).toLocaleString()}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Delivery Fee</span>
                <span>{currency} {Number(order.deliveryFee || 0).toLocaleString()}</span>
              </SummaryRow>
              {order.discount > 0 && (
                <SummaryRow className="discount">
                  <span>Discount ({order.promoCode || "Promo"})</span>
                  <span>-{currency} {Number(order.discount || 0).toLocaleString()}</span>
                </SummaryRow>
              )}
              <SummaryRow className="total">
                <span>Final Total</span>
                <span>{currency} {Number(order.finalTotal || 0).toLocaleString()}</span>
              </SummaryRow>
            </div>
          </Card>
        </Column>

        {/* Right Column: Status, Account & Delivery Address */}
        <Column>
          {/* Status Card */}
          <Card>
            <CardTitle>Order Status & Payment</CardTitle>
            <InfoGrid>
              <InfoItem>
                <Label>Order Status</Label>
                <BadgeContainer>
                  <Badge $variant={
                    order.orderStatus?.toLowerCase() === "delivered" ? "success" : 
                    order.orderStatus?.toLowerCase() === "cancelled" ? "danger" : "warning"
                  }>
                    {order.orderStatus?.toUpperCase() || "PENDING"}
                  </Badge>
                </BadgeContainer>
              </InfoItem>
              <InfoItem>
                <Label>Payment Status</Label>
                <BadgeContainer>
                  <Badge $variant={
                    order.paymentStatus?.toLowerCase() === "paid" ? "success" : "warning"
                  }>
                    {order.paymentStatus?.toUpperCase() || "PENDING"}
                  </Badge>
                </BadgeContainer>
              </InfoItem>
            </InfoGrid>
            <InfoItem style={{ marginTop: "8px" }}>
              <Label>Payment Type</Label>
              <Value>{order.paymentType || "ONLINE PAYMENT"}</Value>
            </InfoItem>
          </Card>

          {/* Account Information Card */}
          <Card>
            <CardTitle>Customer Account</CardTitle>
            <InfoGrid>
              <InfoItem>
                <Label>Full Name</Label>
                <Value>{account.name || "Valued Customer"}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Email Address</Label>
                <Value>{account.email || "Not provided"}</Value>
              </InfoItem>
              <InfoItem style={{ gridColumn: "span 2" }}>
                <Label>Phone Number</Label>
                <Value>{account.phone || "Not provided"}</Value>
              </InfoItem>
            </InfoGrid>
          </Card>

          {/* Delivery Address Card */}
          <Card>
            <CardTitle>Delivery Address</CardTitle>
            <InfoGrid>
              <InfoItem style={{ gridColumn: "span 2" }}>
                <Label>Recipient Name</Label>
                <Value>{address.fullName || account.name || "Valued Customer"}</Value>
              </InfoItem>
              <InfoItem style={{ gridColumn: "span 2" }}>
                <Label>Street Address</Label>
                <Value>{address.street || address.address || "Not provided"}</Value>
              </InfoItem>
              <InfoItem>
                <Label>City / State</Label>
                <Value>{address.city ? `${address.city}, ${address.state}` : "Not provided"}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Postal Code / Country</Label>
                <Value>{address.country ? `${address.postalCode || ""} ${address.country}` : "Nigeria"}</Value>
              </InfoItem>
              <InfoItem style={{ gridColumn: "span 2" }}>
                <Label>Delivery Phone</Label>
                <Value>{address.phone || account.phone || "Not provided"}</Value>
              </InfoItem>
            </InfoGrid>
          </Card>
        </Column>
      </GridContent>
    </Container>
  );
}