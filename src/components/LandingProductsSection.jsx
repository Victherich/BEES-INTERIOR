'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Zoom } from 'react-awesome-reveal';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' if you are on Next.js App Router
// import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import {auth, db } from "@/firebaseConfig"; // Update this import to match your project's Firebase config path
import { collection, getDocs, doc, setDoc, deleteDoc, query, where, orderBy, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";



// --- THEME & STYLES ---
const primaryGold = '#D4AF37';
const primaryBlue = '#1E3A8A';
const goldGradient = 'linear-gradient(135deg, #FFDF73 0%, #D4AF37 50%, #AA7C11 100%)';
const blueGradient = 'linear-gradient(135deg, #3B82F6 0%, #1E3A8A 50%, #0F172A 100%)';

// 🎨 BEES INTERIOR THEME COLORS
const Blue = "#2563eb";
const Dark = "#0f172a";
const Border = "#e5eaf2";
const White = "#ffffff";
const Gold = "#D4AF37";
const TextMuted = "#475569";
const Danger = "#ef4444";

const ProductsSection = styled.section`
  background: #FFFFFF;
  padding: 15px 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(226, 232, 240, 0.8);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 10px;
  padding: 0 10px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  background: ${blueGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const SectionSubtitle = styled.p`
  font-size: 13px;
  color: #64748B;
  margin: 4px 0 0 0;
`;

// const ProductsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 15px;
 
//   max-width: 1200px;
//   margin: 0 auto;
//   width: 100%;
//   box-sizing: border-box;

//   /* Maintain a max width of 250px and center when there is exactly 1 product */
//   & > * {
//     ${({ $itemCount }) => $itemCount === 1 && `
//       grid-column: 1 / -1;
//       max-width: 250px;
//       margin: 0 auto;
//       width: 100%;
//     `}
//   }

//   @media(max-width: 768px) {
//     grid-template-columns: repeat(2, 1fr);
//   }
// `;

// const ProductCard = styled.div`
//   background: #F8FAFC;
//   border-radius: 6px;
//   border: 1px solid rgba(212, 175, 55, 0.2);
//   padding: 10px;
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
//   box-shadow: 0 4px 12px rgba(0,0,0,0.02);
//   height: 100%;
//   box-sizing: border-box;
//   transition: background 0.2s ease;

//   &:hover {
//     background: #FFFFFF;
//   }
// `;


const ProductsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center; /* Centers cards if there's an odd number, use flex-start if you want them left-aligned */
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 4px; /* Adjust or set to 0px for zero space between cards */
  }
`;

const ProductCard = styled.div`

  border-radius: 10px;
  padding: 10px;
  border: 1px solid ${Border};
  border-left: 4px solid ${Gold};
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  /* 📏 Enforce strict sizing and max-width */
  width: 100%;
  max-width: 250px;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
  }

  @media (max-width: 768px) {
    padding: 8px;
    gap: 6px;
    /* Calculates exact 50% width minus half of your mobile gap so exactly 2 fit per row */
    max-width: calc(50% - 2px); 
  }
`;


const CardImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 140px;

  @media (max-width: 768px) {
    height: 120px;
  }
`;

const CardLoveIcon = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid ${Border};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background: ${White};
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 4px;

  @media (max-width: 768px) {
  height: 120px; /* Slightly smaller height for mobile */
  }
`;

const ProductTag = styled.span`
  font-size: 10px;
  color: ${primaryGold};
  font-weight: 700;
  text-transform: uppercase;
`;

const ProductTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: ${primaryBlue};
  margin: 0;
`;

const ProductPriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;

  @media(max-width: 768px) {
  flex-direction: column;
  gap:5px;
  }
`;

const PriceText = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: #0F172A;
`;

const AddButton = styled.button`
  background: ${blueGradient};
  color: #FFFFFF;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(30, 58, 138, 0.3);

  &:hover {
    opacity: 0.9;
  }
`;

const ViewMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const ViewMoreButton = styled.button`
  background: ${goldGradient};
  color: #0F172A;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
  }
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 13px;
  color: #64748B;
  padding: 20px;
`;

// --- COMPONENT EXPORT ---
export default function LandingProductsSection() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);

  // 1. Listen to authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch user's wishlist IDs
  useEffect(() => {
    async function fetchUserWishlist() {
      if (!currentUser) {
        setWishlistIds([]);
        return;
      }
      try {
        const q = query(collection(db, "wishlists"), where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        const ids = querySnapshot.docs.map(docSnap => docSnap.data().productId);
        setWishlistIds(ids);
      } catch (error) {
        console.error("Error fetching wishlist IDs:", error);
      }
    }
    fetchUserWishlist();
  }, [currentUser]);

  // 3. Toggle wishlist handler
  const handleToggleWishlist = async (e, productId) => {
    e.stopPropagation(); // prevent card router push

    if (!currentUser) {
      Swal.fire({ text: "Please log in to manage your wishlist.", icon: "warning", timer: 2500, showConfirmButton: false });
      return;
    }

    const isCurrentlyWishlisted = wishlistIds.includes(productId);
    const wishlistDocId = `${currentUser.uid}_${productId}`;
    const wishlistRef = doc(db, "wishlists", wishlistDocId);

    // Optimistic update
    if (isCurrentlyWishlisted) {
      setWishlistIds(wishlistIds.filter(id => id !== productId));
    } else {
      setWishlistIds([...wishlistIds, productId]);
    }

    try {
      if (isCurrentlyWishlisted) {
        await deleteDoc(wishlistRef);
        Swal.fire({ text: "Removed from wishlist!", icon: "info", timer: 1500, showConfirmButton: false });
      } else {
        await setDoc(wishlistRef, {
          userId: currentUser.uid,
          productId: productId,
          addedAt: new Date()
        });
        Swal.fire({ text: "Saved to wishlist!", icon: "success", timer: 1500, showConfirmButton: false });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      // Revert on failure
      if (isCurrentlyWishlisted) {
        setWishlistIds([...wishlistIds, productId]);
      } else {
        setWishlistIds(wishlistIds.filter(id => id !== productId));
      }
      Swal.fire({ text: "Failed to update wishlist.", icon: "error", timer: 2000, showConfirmButton: false });
    }
  };

useEffect(() => {
    let intervalId = null;

    const fetchLastProducts = async () => {
      try {
        // Fetch up to the last 8 products ordered by creation time
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(8));
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // If results are found, update products, stop loading, and clear the interval
        if (list.length > 0) {
          setProducts(list);
          setLoading(false);
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      } catch (error) {
        console.error("Failed to fetch landing products:", error);
      }
    };

    // Initial fetch call
    setLoading(true);
    fetchLastProducts();

    // Set up polling every 10 seconds (10000ms) until results are found
    intervalId = setInterval(() => {
      fetchLastProducts();
    }, 10000);

    // Cleanup interval on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);



  if (loading) {
    return (
      <ProductsSection>
        <SectionHeader>
          <SectionTitle>Shop Our Curated Luxury Accessories</SectionTitle>
          <SectionSubtitle>Shop premium home decor, furniture, and accent pieces.</SectionSubtitle>
        </SectionHeader>
        <LoadingText>Loading products...</LoadingText>
      </ProductsSection>
    );
  }

  // If no products exist in Firestore, you can optionally show a fallback or empty view
  if (products.length === 0) {
    return (
      <ProductsSection>
        <SectionHeader>
          <SectionTitle>Shop Our Curated Luxury Accessories</SectionTitle>
          <SectionSubtitle>Shop premium home decor, furniture, and accent pieces.</SectionSubtitle>
        </SectionHeader>
        <LoadingText>No products available yet.</LoadingText>
      </ProductsSection>
    );
  }

  return (
    <ProductsSection>
      <SectionHeader>
          <SectionTitle style={{ textDecoration: 'underline' }}>WELCOME TO OUR STORE</SectionTitle>
        <SectionTitle style={{ fontSize: '1rem', marginTop:'20px' }}>Shop Our Curated Luxury Accessories</SectionTitle>
        <SectionSubtitle>Shop premium home decor, furniture, and accent pieces.</SectionSubtitle>
      </SectionHeader>

<ProductsGrid $itemCount={products.length}>
        {products.map((product, idx) => {
          const displayImg = product.images?.[0] || product.image || "https://placehold.co/400x300?text=No+Image";
          const productPrice = Number(product.amount || 0);
          const isWishlisted = wishlistIds.includes(product.id);

          return (
            <Zoom delay={idx * 50} triggerOnce key={product.id} style={{ display: 'contents' }}>
              <ProductCard onClick={() => router.push(`/productdetail/${product.id}`)}>
                <CardImageWrapper>
                  <CardLoveIcon 
                    onClick={(e) => handleToggleWishlist(e, product.id)}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    {isWishlisted ? (
                      <span style={{ color: "#ef4444", fontSize: "14px" }}>❤️</span>
                    ) : (
                      <span style={{ color: Dark, fontSize: "14px" }}>🤍</span>
                    )}
                  </CardLoveIcon>
                  <CardImage src={displayImg} alt={product.name} />
                </CardImageWrapper>

                {/* <ProductTag>{product.category || "Decor"}</ProductTag> */}
                <ProductTitle>
                  {product.name ? product.name.charAt(0).toUpperCase() + product.name.slice(1) : ""}
                </ProductTitle>
                <ProductPriceRow>
                  <PriceText>
                    ₦{productPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </PriceText>
                  <AddButton onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/productdetail/${product.id}`);
                  }}>View</AddButton>
                </ProductPriceRow>
              </ProductCard>
            </Zoom>

          );
        })}
      </ProductsGrid>

      <ViewMoreContainer>
        <ViewMoreButton onClick={() => router.push('/store')}>
          View More Products →
        </ViewMoreButton>
      </ViewMoreContainer>
    </ProductsSection>
  );
}