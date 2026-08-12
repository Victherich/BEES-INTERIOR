'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartContext'; // Adjust import path as needed
import Swal from 'sweetalert2';
import { auth, db } from '@/firebaseConfig'; // Adjust to your actual Firebase config path
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// --- THEME & STYLES ---
const Primary = "#1E293B";
const Accent = "#2563EB";
const LightBg = "#F8FAFC";
const Border = "#E2E8F0";
const TextGray = "#64748B";
const Danger = "#EF4444";
const Success = "#10B981";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotalItems, cartSubtotal } = useCart();
  const [promoCode, setPromoCode] = useState("");
  // const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);


  // const shipping = cartSubtotal > 100 || cartSubtotal === 0 ? 0 : 15.0;
  // const total = cartSubtotal - discount + shipping;
  const total = cartSubtotal

//   const handleApplyPromo = (e) => {
//     e.preventDefault();
//     if (promoCode.trim().toUpperCase() === "SAVE10") {
//       setDiscount(cartSubtotal * 0.1);
//       setPromoApplied(true);
//     } else {
//       alert("Invalid Promo Code. Try 'SAVE10'");
//     }
//   };



// 1. Add user states


  // 2. Add your Firebase auth check listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        try {
          const userRef = doc(db, "users", authUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserData(userSnap.data());
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);




const handleCheckout = () => {
    if (user) {
      router.push('/dashboard/addressmanager');
    } else {
      Swal.fire({
        title: "Please Login to Proceed",
        text: "You need to be logged in to complete your checkout. If you don't have an account, please sign up.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login / Sign Up",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#2563EB",
        cancelButtonColor: "#64748B",
        background: "#ffffff",
        color: "#1E293B"
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login'); // Change to your login/signup route if different
        }
      });
    }
  };









  if (cart.length === 0) {
    return (
      <PageWrapper>
        <EmptyContainer>
          <EmptyIcon>🛒</EmptyIcon>
          <EmptyTitle>Your cart is empty</EmptyTitle>
          <EmptyText>Discover our products and add your favorites to the cart.</EmptyText>
          <ShopNowButton href="/store">Continue Shopping</ShopNowButton>
        </EmptyContainer>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <CartHeader>
        <Title>Shopping Cart</Title>
        <ItemCount>{cartTotalItems} items</ItemCount>
      </CartHeader>

      <CartContent>
        {/* Items List */}
        <ItemsList>
          {cart.map((item) => {
            const itemPrice = item.price || item.amount || 0;
            return (
              <CartCard key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}>
                <ItemImage src={item.image || "https://placehold.co/90x90?text=No+Image"} alt={item.name} />
                
                <ItemDetails>
                  <ItemName>{item.name}</ItemName>
                  {/* <ItemMeta>
                    {item.selectedColor && <span>Color: <strong>{item.selectedColor}</strong></span>}
                    {item.selectedSize && <span>Size: <strong>{item.selectedSize}</strong></span>}
                  </ItemMeta> */}
                  <ItemPrice>₦{itemPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</ItemPrice>
                </ItemDetails>

                <QuantityWrapper>
                  <QtyBtn onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, -1)}>-</QtyBtn>
                  <QtyDisplay>{item.quantity}</QtyDisplay>
                  <QtyBtn onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, 1)}>+</QtyBtn>
                </QuantityWrapper>

                <ItemTotal>₦{(itemPrice * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</ItemTotal>

                <RemoveButton onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)} title="Remove item">
                  &times;
                </RemoveButton>
              </CartCard>
            );
          })}

          <ClearCartButton onClick={clearCart}>Clear Cart</ClearCartButton>
        </ItemsList>

        {/* Order Summary */}
        <SummaryCard>
          <SummaryTitle>Cart Summary</SummaryTitle>
          
          <SummaryRow>
            <span>Subtotal</span>
            <span>₦{cartSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </SummaryRow>

          {promoApplied && (
            <SummaryRow style={{ color: Success }}>
              <span>Discount (10%)</span>
              <span>-₦{discount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </SummaryRow>
          )}

          {/* <SummaryRow>
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `₦${shipping.toFixed(2)}`}</span>
          </SummaryRow> */}

          <Divider />

          <SummaryRow total>
            <span>Total</span>
            <span>₦{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </SummaryRow>

          {/* <PromoForm onSubmit={handleApplyPromo}>
            <PromoInput 
              type="text" 
              placeholder="Promo Code (SAVE10)" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <PromoButton type="submit">Apply</PromoButton>
          </PromoForm> */}

          <CheckoutButton onClick={handleCheckout}>
  Proceed to Checkout
</CheckoutButton>
        </SummaryCard>
      </CartContent>
    </PageWrapper>
  );
}

/* --- Styled Components --- */
const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 5px; // Reduced padding for very small screens
  font-family: inherit;
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
`;

const CartHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 24px;
  border-bottom: 2px solid ${Border};
  padding-bottom: 12px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${Primary};
  margin: 0;
`;

const ItemCount = styled.span`
  color: ${TextGray};
  font-size: 1rem;
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CartCard = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr auto auto auto;
  align-items: center;
  gap: 16px;
  background: #fff;
  border: 1px solid ${Border};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  box-sizing: border-box;
  width: 100%;

  @media (max-width: 600px) {
    grid-template-columns: 70px 1fr;
    grid-template-rows: auto auto auto;
    gap: 10px;
    padding: 12px;
  }
`;

const ItemImage = styled.img`
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid ${Border};

  @media (max-width: 600px) {
    width: 70px;
    height: 70px;
    grid-row: span 2;
  }
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${Primary};
  margin: 0;
`;

const ItemMeta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 0.85rem;
  color: ${TextGray};
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: ${Primary};
  margin-top: 4px;
`;

const QuantityWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${Border};
  border-radius: 6px;
  overflow: hidden;
  background: ${LightBg};
  width: fit-content;

  @media (max-width: 600px) {
    grid-column: 2;
  }
`;

const QtyBtn = styled.button`
  background: transparent;
  border: none;
  padding: 4px 10px; // Slightly reduced padding to prevent overflow on 320px
  cursor: pointer;
  font-weight: 600;
  color: ${Primary};
  &:hover { background: ${Border}; }
`;

const QtyDisplay = styled.span`
  padding: 0 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${Primary};
`;

const ItemTotal = styled.div`
  font-weight: 700;
  font-size: 1.05rem;
  color: ${Primary};
  min-width: 70px;
  text-align: right;
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.4rem;
  color: ${TextGray};
  cursor: pointer;
  padding: 4px 8px;
  &:hover { color: ${Danger}; }
`;

const ClearCartButton = styled.button`
  align-self: flex-start;
  background: transparent;
  border: 1px solid ${Danger};
  color: ${Danger};
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  &:hover { background: ${Danger}; color: #fff; }
`;

const SummaryCard = styled.div`
  background: ${LightBg};
  border: 1px solid ${Border};
  border-radius: 12px;
  padding: 24px;
  height: fit-content;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
`;

const SummaryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${Primary};
  margin-bottom: 20px;
  margin-top: 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: ${props => props.total ? "1.15rem" : "0.95rem"};
  font-weight: ${props => props.total ? "700" : "500"};
  color: ${props => props.total ? Primary : TextGray};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${Border};
  margin: 16px 0;
`;

const PromoForm = styled.form`
  display: flex;
  gap: 8px;
  margin: 20px 0;
`;

const PromoInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid ${Border};
  border-radius: 6px;
  outline: none;
  font-size: 0.9rem;
  background: #fff;
  &:focus { border-color: ${Accent}; }
`;

const PromoButton = styled.button`
  background: ${Primary};
  color: #fff;
  border: none;
  padding: 0 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: ${Accent};
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #1D4ED8; }
`;

const EmptyContainer = styled.div`
  text-align: center;
  padding: 80px 20px;
  max-width: 500px;
  margin: 0 auto;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h2`
  font-size: 1.8rem;
  color: ${Primary};
  margin-bottom: 8px;
  margin-top: 0;
`;

const EmptyText = styled.p`
  color: ${TextGray};
  margin-bottom: 24px;
`;

const ShopNowButton = styled(Link)`
  display: inline-block;
  background: ${Accent};
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  &:hover { background: #1D4ED8; }
`;