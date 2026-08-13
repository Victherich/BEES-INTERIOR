


'use client'
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
// import { doc, getDoc, getDocs , serverTimestamp, addDoc, collection,} from 'firebase/firestore';
import { doc, getDoc, getDocs, serverTimestamp, addDoc, collection, query, where } from 'firebase/firestore';
import { useCart } from '@/components/CartContext'; // Import your Cart Context
import Swal from 'sweetalert2';
import { useAppContext } from '@/components/Context';

export default function OrderSummaryPage() {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart } = useCart(); // Consume from Cart Context

  // State
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0); // Default placeholder fee (₦5,000)

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {payWithPaystack} = useAppContext();

  // Auth Loader
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load Delivery Address from localStorage
  useEffect(() => {
    try {
      const storedAddress = localStorage.getItem('selectedAddress');
      if (storedAddress) {
        setDeliveryAddress(JSON.parse(storedAddress));
      }
    } catch (error) {
      console.error("Error reading selectedAddress from localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculations using cartSubtotal from context
  const finalTotal = Math.max(0, cartSubtotal + deliveryFee - discount);


  // // Promo Code Handler
  // const handleApplyPromo = (e) => {
  //   e.preventDefault();
  //   if (!promoCode.trim()) return;

  //   const code = promoCode.trim().toUpperCase();
  //   if (code === 'BEES10') {
  //     const disc = cartSubtotal * 0.10;
  //     setDiscount(disc);
  //     setAppliedPromo('BEES10 (10% Off)');
  //     Swal.fire('Success', 'Promo code applied successfully!', 'success');
  //   } else if (code === 'WELCOME5000') {
  //     setDiscount(5000);
  //     setAppliedPromo('WELCOME5000 (₦5,000 Off)');
  //     Swal.fire('Success', 'Promo code applied successfully!', 'success');
  //   } else {
  //     Swal.fire('Invalid Code', 'The promo code entered is invalid or expired.', 'error');
  //   }
  // };

  // 🌟 Dynamic Promo Code Handler (Connected to Firestore 'promoCodes')
const handleApplyPromo = async (e) => {
  e.preventDefault();
  if (!promoCodeInput.trim()) return;

  try {
    const codeFormatted = promoCodeInput.trim().toUpperCase();
    const q = query(collection(db, "promoCodes"), where("code", "==", codeFormatted));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      Swal.fire('Invalid Code', 'The promo code entered does not exist or has expired.', 'error');
      return;
    }

    const promoData = querySnapshot.docs[0].data();
    let calculatedDiscount = 0;

    if (promoData.discountType === 'percentage') {
      calculatedDiscount = (cartSubtotal * promoData.discountValue) / 100;
    } else {
      calculatedDiscount = promoData.discountValue;
    }

    setDiscount(calculatedDiscount);
    setAppliedPromo(`${promoData.code} (${promoData.discountType === 'percentage' ? `${promoData.discountValue}%` : `₦${promoData.discountValue.toLocaleString()}`} Off)`);
    
    Swal.fire('Success!', `Promo code "${promoData.code}" applied successfully!`, 'success');
    setPromoCodeInput('');
  } catch (error) {
    console.error("Error applying promo code:", error);
    Swal.fire('Error', 'Could not apply promo code. Please try again.', 'error');
  }
};

const handleRemovePromo = () => {
  setDiscount(0);
  setAppliedPromo(null);
  Swal.fire('Removed', 'Promo code has been removed.', 'info');
};






  const handlePayNow = () => {
    if (!deliveryAddress) {
      Swal.fire('Missing Address', 'Please select a delivery address before proceeding.', 'warning');
      router.push('/addresses');
      return;
    }

    if (cart.length === 0) {
      Swal.fire('Empty Cart', 'Your cart is empty.', 'warning');
      return;
    }

    const uniqueOrderNumber = `BEES-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 900 + 100)}`;

    const orderPayload = {
      orderNumber: uniqueOrderNumber,
      userId: currentUser ? currentUser.uid : 'guest',
      items: cart,
      deliveryAddress,
      subtotal: cartSubtotal,
      deliveryFee,
      discount,
      finalTotal,
      promoCode: appliedPromo,
      currency: 'NGN',
      accountInfo: {
        name: userData?.fullName || currentUser.displayName || 'Valued Customer',
        email: currentUser.email,
        phone: userData?.phone || currentUser.phoneNumber || 'Not provided'
      },
         paymentType: 'ONLINE PAYMENT',
        paymentStatus: 'Paid',
        orderStatus:'Pending',
        createdAt: serverTimestamp()
    };

    localStorage.setItem('pendingOrder', JSON.stringify(orderPayload));

    payWithPaystack(finalTotal, 'NGN');
    
    // Swal.fire({
    //   title: 'Proceeding to Payment',
    //   text: `Total amount: ₦${finalTotal.toLocaleString()}`,
    //   icon: 'info',
    //   confirmButtonText: 'Continue'
    // }).then(() => {
      
    // });
  };










// Pay on Delivery Handler with Swal Confirmation
  const handlePayOnDelivery = async () => {
    if (!deliveryAddress) {
      Swal.fire('Missing Address', 'Please select a delivery address before proceeding.', 'warning');
      router.push('/dashboard/addressmanager');
      return;
    }

    if (cart.length === 0) {
      Swal.fire('Empty Cart', 'Your cart is empty.', 'warning');
      return;
    }

    // Confirmation Modal
    const confirmResult = await Swal.fire({
      title: 'Confirm Pay on Delivery',
      text: `Are you sure you want to place this order with Pay on Delivery? Total: ₦${finalTotal.toLocaleString()}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Place Order'
    });

    if (!confirmResult.isConfirmed) {
      return; // Exit if user cancels
    }

    setIsSubmitting(true);
    Swal.fire({
      title: 'Processing Order...',
      text: 'Please wait while we process your order.',
      allowOutsideClick: false,
      showConfirmButton: false
    });
    Swal.showLoading();

    try {
      const buyerEmail = currentUser?.email || userData?.email || '';
      // const sellerEmail = 'victorndu393@gmail.com'; // Replace with your seller destination email
        const sellerEmail = 'beesinterior@gmail.com'; // Replace with your seller destination email
const uniqueOrderNumber = `BEES-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 900 + 100)}`;


      const orderPayload = {
        orderNumber: uniqueOrderNumber,
        userId: currentUser ? currentUser.uid : 'guest',
        items: cart,
        deliveryAddress,
        subtotal: cartSubtotal,
        deliveryFee,
        discount,
        finalTotal,
        promoCode: appliedPromo,
        currency: 'NGN',
        accountInfo: {
          name: userData?.fullName || currentUser?.displayName || 'Valued Customer',
          email: buyerEmail,
          phone: userData?.phone || currentUser?.phoneNumber || 'Not provided'
        },
        paymentType: 'PAYMENT ON DELIVERY',
        paymentStatus: 'Pending',
        orderStatus:'Pending',
        createdAt: serverTimestamp()
      };

      // 1. Save complete order payload to Firestore under "orders" collection
      const docRef = await addDoc(collection(db, "orders"), orderPayload);

      // 2. Send email payload to both seller and buyer
      await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: docRef.id,
          payload: orderPayload,
          recipients: [buyerEmail, sellerEmail].filter(Boolean)
        })
      }).catch((err) => {
        console.error("Error triggering email notification:", err);
      });

      // Clear local storage and cart state
      clearCart();
      localStorage.removeItem('selectedAddress');
      localStorage.removeItem('pendingOrder');

      await Swal.fire({
        title: 'Order Placed Successfully!',
        text: 'Your Pay on Delivery order has been placed. We have sent confirmation details to your email.',
        icon: 'success',
        confirmButtonText: 'View Orders'
      });

      router.push('/dashboard/myorders');

    } catch (error) {
      console.error("Error processing Pay on Delivery order:", error);
      Swal.fire('Error', 'Failed to place your order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
      Swal.close(); // Close the loading modal
    }
  };








  

  if (loading) {
    return <LoadingText>Loading Order Summary...</LoadingText>;
  }

  return (
    <Container>
      <PageTitle>Order Summary</PageTitle>

      <LayoutGrid>
        {/* Left Column: Details & Cart */}
        <MainContent>
          {/* Account Information */}
          <Card>
            <CardHeader>
              <h3>Account Information</h3>
            </CardHeader>
            <CardBody>
              {currentUser ? (
                <InfoGrid>
                  <div>
                    <Label>Name</Label>
                    <Value>{userData?.fullName || currentUser.displayName || 'Valued Customer'}</Value>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Value>{currentUser.email}</Value>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Value>{userData?.phone || currentUser.phoneNumber || 'Not provided'}</Value>
                  </div>
                </InfoGrid>
              ) : (
                <WarningText>Please log in to view account details.</WarningText>
              )}
            </CardBody>
          </Card>

          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <h3>Delivery Address</h3>
              <TextButton onClick={() => router.push('/dashboard/addressmanager')}>Change / Select</TextButton>
            </CardHeader>
            <CardBody>
              {deliveryAddress ? (
                <div>
                  <AddressName>{deliveryAddress.fullName}</AddressName>
                  <AddressText>{deliveryAddress.street}</AddressText>
                  <AddressText>{deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.postalCode}</AddressText>
                  <AddressText>{deliveryAddress.country}</AddressText>
                  <AddressText>Phone: {deliveryAddress.phone}</AddressText>
                </div>
              ) : (
                <EmptyStateBox>
                  <WarningText>No delivery address selected.</WarningText>
                  <ActionButton onClick={() => router.push('/addresses')}>Select Address</ActionButton>
                </EmptyStateBox>
              )}
            </CardBody>
          </Card>

          {/* Cart Items from Context */}
          <Card>
            <CardHeader>
              <h3>Cart Items ({cart.length}) <span>(◀ Scroll▶)</span></h3>
            </CardHeader>
            <CardBody style={{ padding: 0 }}>
              {cart.length === 0 ? (
                <EmptyCartText>Your cart is empty.</EmptyCartText>
              ) : (
                <TableResponsiveWrapper>
                  <CartTable>
                    <thead>
                      <tr>
                        <th>Item</th>

                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {cart.map((item, index) => {
                        const itemPrice = Number(item.price || item.amount || 0);
                        const itemTotal = itemPrice * Number(item.quantity || 1);
                        return (
                          <tr key={`${item.id}-${item.selectedColor || ''}-${item.selectedSize || ''}-${index}`}>
                            <td>
                              <ItemInfo>
                                {item.image && <ItemImg src={item.image} alt={item.name || item.title} />}
                                <div>
                                  <ItemName>{item.name || item.title}</ItemName>
                                </div>
                              </ItemInfo>
                            </td>
                            <td>₦{itemPrice.toLocaleString()}</td>
                            <td>{item.quantity}</td>
                            <td>₦{itemTotal.toLocaleString()}</td>
                          </tr>
                        );
                      })} */}
                      {cart.map((item, index) => {
  const itemPrice = Number(item.price || item.amount || 0);
  const itemTotal = itemPrice * Number(item.quantity || 1);
  return (
    <tr key={`${item.id}-${item.selectedColor || ''}-${item.selectedSize || ''}-${index}`}>
      <td>
        <ItemInfo>
          {item.image && <ItemImg src={item.image} alt={item.name || item.title} />}
          <div>
            <ItemName>{item.name || item.title}</ItemName>
            <p style={{fontSize:'0.6rem'}}>ID: {item.id}</p>
          </div>
        </ItemInfo>
      </td>

      <td>₦{itemPrice.toLocaleString()}</td>
      <td>{item.quantity}</td>
      <td>₦{itemTotal.toLocaleString()}</td>
    </tr>
  );
})}
                    </tbody>
                  </CartTable>
                </TableResponsiveWrapper>
              )}
            </CardBody>
          </Card>
        </MainContent>

        {/* Right Column: Pricing & Checkout */}
        <Sidebar>
          {/* <SummaryCard>
            <h3>Order Totals</h3>
            
            <SummaryRow>
              <span>Subtotal</span>
              <span>₦{cartSubtotal.toLocaleString()}</span>
            </SummaryRow>

            <SummaryRow>
              <span>Delivery Fee</span>
              <span>₦{deliveryFee.toLocaleString()}</span>
            </SummaryRow>

            {discount > 0 && (
              <SummaryRow discount>
                <span>Discount ({appliedPromo})</span>
                <span>-₦{discount.toLocaleString()}</span>
              </SummaryRow>
            )}

            <Divider />

            <TotalRow>
              <span>Final Total</span>
              <span>₦{finalTotal.toLocaleString()}</span>
            </TotalRow>

            
            <PromoForm onSubmit={handleApplyPromo}>
              <PromoInput 
                type="text" 
                placeholder="Enter promo code" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <ApplyButton type="submit">Apply</ApplyButton>
            </PromoForm>

            <PayNowButton onClick={handlePayNow} disabled={cart.length === 0 || !deliveryAddress}>
              PAY NOW (₦{finalTotal.toLocaleString()})
            </PayNowButton>
            <PayOnDeliveryButton onClick={handlePayOnDelivery} disabled={cart.length === 0 || !deliveryAddress || isSubmitting}>
              {isSubmitting ? 'Processing Order...' : 'PAY ON DELIVERY'}
            </PayOnDeliveryButton>
          </SummaryCard> */}

<SummaryCard>
  <h3>Order Totals</h3>
  
  <SummaryRow>
    <span>Subtotal</span>
    <span>₦{cartSubtotal.toLocaleString()}</span>
  </SummaryRow>

  <SummaryRow>
    <span>Delivery Fee</span>
    <span>₦{deliveryFee.toLocaleString()}</span>
  </SummaryRow>

  {/* Only show discount row if active */}
  {discount > 0 && (
    <SummaryRow discount>
      <span>Discount ({appliedPromo})</span>
      <span>-₦{discount.toLocaleString()}</span>
    </SummaryRow>
  )}

  <Divider />

  <TotalRow>
    <span>Final Total</span>
    <span>₦{Math.max(0, cartSubtotal + deliveryFee - discount).toLocaleString()}</span>
  </TotalRow>

  {/* Promo Code Input Form or Applied Badge */}
  {!appliedPromo ? (
    <PromoForm onSubmit={handleApplyPromo}>
      <PromoInput 
        type="text" 
        placeholder="Enter promo code" 
        value={promoCodeInput}
        onChange={(e) => setPromoCodeInput(e.target.value)}
      />
      <ApplyButton type="submit">Apply</ApplyButton>
    </PromoForm>
  ) : (
    <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "8px 12px", borderRadius: "6px" }}>
      <span style={{ fontSize: "0.85rem", color: "#16a34a", fontWeight: "600" }}>🎟️ {appliedPromo}</span>
      <TextButton type="button" onClick={handleRemovePromo} style={{ color: "#dc2626" }}>Remove</TextButton>
    </div>
  )}

    <PayNowButton onClick={handlePayNow} disabled={cart.length === 0 || !deliveryAddress}>
              PAY NOW (₦{finalTotal.toLocaleString()})
            </PayNowButton>
            <PayOnDeliveryButton onClick={handlePayOnDelivery} disabled={cart.length === 0 || !deliveryAddress || isSubmitting}>
              {isSubmitting ? 'Processing Order...' : 'PAY ON DELIVERY'}
            </PayOnDeliveryButton>
</SummaryCard>
          
        </Sidebar>
      </LayoutGrid>
    </Container>
  );
}

// --- Styled Components (Bees Interior Theme: #2563eb Blue & Gold #D4AF37) ---

const Container = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 10px;
  box-sizing: border-box;
  color: #1a1a1a;
  width: 100%;
  overflow-x: hidden;

  @media (min-width: 768px) {
    margin: 40px auto;
    padding: 0 20px;
  }
`;

const PageTitle = styled.h2`
  font-size: 1.5rem;
  color: #2563eb;
  font-weight: 800;
  margin-bottom: 16px;
  border-bottom: 2px solid #D4AF37;
  padding-bottom: 8px;

  @media (min-width: 768px) {
    font-size: 2rem;
    margin-bottom: 24px;
    padding-bottom: 12px;
  }
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 380px;
    gap: 24px;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0; /* Prevents grid items from overflowing */

  @media (min-width: 768px) {
    gap: 20px;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e2e2e2;
  border-top: 4px solid #2563eb;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.03);
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
`;

const CardHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: #fbfbfb;
  border-bottom: 1px solid #eee;

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #2563eb;
    font-weight: 700;

  
  }

    span {
      display:none;
      font-size: 0.75rem;
      @media (max-width: 480px) {
      display:inline;
      }

  @media (min-width: 768px) {
    padding: 16px 20px;
    h3 {
      font-size: 1.1rem;
    }
  }
`;

const CardBody = styled.div`
  padding: 14px;
  box-sizing: border-box;
  width: 100%;

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
  }
`;

const Label = styled.span`
  display: block;
  font-size: 0.75rem;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
`;

const Value = styled.span`
  font-size: 0.9rem;
  color: #222;
  font-weight: 600;
  word-break: break-word;
`;

const AddressName = styled.h4`
  margin: 0 0 4px 0;
  font-size: 1rem;
  color: #2563eb;
  font-weight: 700;
`;

const AddressText = styled.p`
  margin: 2px 0;
  font-size: 0.85rem;
  color: #555;
  word-break: break-word;
`;

const TextButton = styled.button`
  background: transparent;
  color: #2563eb;
  border: none;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: underline;
    color: #D4AF37;
  }
`;

const ActionButton = styled.button`
  background: #2563eb;
  color: #ffffff;
  border: 1px solid #D4AF37;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    background: #D4AF37;
    color: #2563eb;
  }
`;

const EmptyStateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;

const WarningText = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  word-break: break-word;
`;

const EmptyCartText = styled.p`
  padding: 20px;
  text-align: center;
  color: #666;
  margin: 0;
`;

const TableResponsiveWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const CartTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;
  min-width: 280px;

  th {
    background: #f4f6f9;
    color: #333;
    padding: 10px 12px;
    font-weight: 600;
    border-bottom: 1px solid #e2e2e2;
    white-space: nowrap;
  }

  td {
    padding: 10px 12px;
    border-bottom: 1px solid #eee;
    color: #444;
    vertical-align: middle;
    white-space: nowrap;
  }

  @media (min-width: 768px) {
    font-size: 0.9rem;
    th, td {
      padding: 12px 16px;
    }
  }
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ItemImg = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

const ItemName = styled.span`
  font-weight: 600;
  color: #1a1a1a;
  display: block;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: 768px) {
    max-width: none;
    white-space: normal;
  }
`;

const SummaryCard = styled.div`
  background: #ffffff;
  border: 1px solid #D4AF37;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.05);
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 900px) {
    position: sticky;
    top: 20px;
    padding: 24px;
  }

  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 1.1rem;
    color: #2563eb;
    font-weight: 700;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 8px;

    @media (min-width: 768px) {
      font-size: 1.2rem;
      margin-bottom: 20px;
      padding-bottom: 10px;
    }
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: ${props => props.discount ? '#2e7d32' : '#555'};
  font-weight: ${props => props.discount ? '600' : '400'};

  @media (min-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 12px;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e2e2e2;
  margin: 12px 0;

  @media (min-width: 768px) {
    margin: 16px 0;
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 800;
  color: #2563eb;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }
`;

const PromoForm = styled.form`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    margin-bottom: 20px;
  }
`;

const PromoInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.9rem;
  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const ApplyButton = styled.button`
  background: #333;
  color: #fff;
  border: none;
  padding: 0 14px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background: #2563eb;
  }
`;

const PayNowButton = styled.button`
  width: 100%;
  background: #2563eb;
  color: #ffffff;
  border: 2px solid #D4AF37;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:hover {
    background: #D4AF37;
    color: #2563eb;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 14px;
    font-size: 1rem;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  padding: 60px;
  font-size: 1.1rem;
  color: #2563eb;
  font-weight: 600;
`;

const PayOnDeliveryButton = styled.button`
  width: 100%;
  background: #ffffff;
  color: #2563eb;
  border: 2px solid #2563eb;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:hover {
    background: #2563eb;
    color: #ffffff;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 14px;
    font-size: 1rem;
    margin-top: 12px;
  }
`;