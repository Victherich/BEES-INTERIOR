



"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, auth } from "@/firebaseConfig"; // Update this import to match your project's Firebase config path
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";




/* ================= COLORS ================= */

const Blue = "#2563eb";
const Dark = "#0f172a";
const Border = "#e5eaf2";
const White = "#ffffff";
const Gold = "#D4AF37";
const TextMuted = "#64748b";
const LightBg = "#f8fafc";
const blueGradient = "linear-gradient(135deg, #3B82F6 0%, #1E3A8A 50%, #0F172A 100%)";

/* ================= STYLED COMPONENTS ================= */

const PageContainer = styled.div`
  font-family: inherit;
  color: ${Dark};
  background: ${White};
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

/* --- Store Hero Banner --- */
const StoreHero = styled.section`
  position: relative;
  height: 45vh;
  min-height: 380px;
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
    background: rgba(15, 23, 42, 0.6);
    z-index: 1;
  }
`;

const HeroImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${White};
  letter-spacing: -0.5px;
  margin: 0;

  @media (max-width: 768px) {
  font-size: 2rem;
  }


  span {
    background: linear-gradient(135deg, ${Blue} 0%, ${Gold} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(0.95rem, 1.8vw, 1.15rem);
  color: ${Border};
  line-height: 1.6;
  margin: 0;
`;



const SearchInput = styled.input`
  width: 100%;
  max-width: 500px;
  padding: 14px 20px;
  border-radius: 10px;
  border: 2px solid ${Gold}; /* Elegant gold border */
  background: #FFFFFF; /* Pure white background */
  color: ${Dark}; /* Dark text for high contrast */
  font-size: 1rem;
  font-weight: 500;
  outline: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); /* Strong shadow for depth */
  transition: all 0.25s ease;

  &::placeholder {
    color: #64748B; /* Muted gray for placeholder */
  }

  &:focus {
    border-color: ${Blue};
    box-shadow: 0 10px 35px rgba(37, 99, 235, 0.25);
  }
`;

/* --- Main Layout Container --- */
const StoreLayout = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 20px 10px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;
  align-items: start;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

/* --- Categories Sidebar --- */
const Sidebar = styled.aside`
  background: ${LightBg};
  border: 1px solid ${Border};
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 968px) {
    padding: 10px;
    background: transparent;
    border: none;
    box-shadow: none;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${Dark};
  border-bottom: 1px solid ${Border};
  padding-bottom: 10px;
  margin: 0;

  @media (max-width: 968px) {
    // display: none;
  }
`;

// const CategoryList = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 8px;

//   @media (max-width: 968px) {
//     flex-direction: row;
//     flex-wrap: nowrap;
//     gap: 8px;
//   }
// `;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 968px) {
    display: none; /* Hide side-scrolling buttons on mobile in favor of the dropdown select */
  }
`;

const CategoryButton = styled.button`
  background: ${(props) => (props.$active ? Blue : "transparent")};
  color: ${(props) => (props.$active ? White : Dark)};
  border: 1px solid ${(props) => (props.$active ? Blue : Border)};
  padding: 10px;
  border-radius: 6px;
  text-align: left;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${(props) => (props.$active ? Blue : "rgba(37, 99, 235, 0.05)")};
    border-color: ${Blue};
  }
`;

/* --- Products Section --- */
const ProductsWrapper = styled.main`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StoreControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${LightBg};
  border: 1px solid ${Border};
  border-radius: 10px;
  padding: 12px 16px;

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
`;

const ResultsCount = styled.p`
  font-size: 0.95rem;
  color: ${TextMuted};
  font-weight: 600;
  margin: 0;

  span {
    color: ${Dark};
  }
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${Border};
  background: ${White};
  color: ${Dark};
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${Blue};
  }
`;

const ProductsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const ProductCard = styled.div`
  background: ${White};
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
    max-width: calc(50% - 2px);
  }
`;


const CardImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 140px;
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
`;

const ProductTag = styled.span`
  font-size: 10px;
  color: ${Gold};
  font-weight: 700;
  text-transform: uppercase;
`;

const ProductTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: #1E3A8A;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductPriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  @media (max-width: 768px) {
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

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 13px;
  color: ${TextMuted};
  grid-column: 1 / -1;
`;



/* --- Mobile Category Select Dropdown --- */
const MobileCategorySelect = styled.select`
  display: none;
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${Border};
  background: ${White};
  color: ${Dark};
  font-size: 0.95rem;
  font-weight: 600;
  outline: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:focus {
    border-color: ${Blue};
  }

  @media (max-width: 968px) {
    display: block;

  }
`;




/* ================= COMPONENT ================= */

export default function StorePage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Holds category docs: [{id, title, description}]
  const [activeCategoryId, setActiveCategoryId] = useState("all"); // "all" or category document ID
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);

  // Fetch products and categories from Firestore
useEffect(() => {
    async function fetchStoreData() {
      try {
        setLoading(true);

        // Fetch products and categories simultaneously
        const [productsSnapshot, categoriesSnapshot] = await Promise.all([
          getDocs(collection(db, "products")),
          getDocs(collection(db, "categories")),
        ]);

        // Process products
        const fetchedProducts = productsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Untitled Product",
            categoryId: data.categoryId || "", // Matches the category ID field
            amount: Number(data.amount) || 0,
            images: data.images || [],
            image: data.image || "",
            createdAt: data.createdAt,
          };
        });

        // Process categories
        const fetchedCategories = categoriesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "Untitled Category",
            description: data.description || "",
          };
        });

        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching store data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStoreData();
  }, []);



  // Filter products by category and name search query
// Filter products by active category ID and search query
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      activeCategoryId === "all" || item.categoryId === activeCategoryId;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products by price and name
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.amount - b.amount;
    if (sortBy === "price-high") return b.amount - a.amount;
    if (sortBy === "title") return a.name.localeCompare(b.name);
    return 0; // featured/default
  });






  // 1. Listen to authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch user's wishlist IDs whenever currentUser changes
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

  // 3. Toggle wishlist handler for store cards
  const handleToggleWishlist = async (e, productId) => {
    e.stopPropagation(); // prevent card click / router push

    if (!currentUser) {
      Swal.fire({ text: "Please log in to manage your wishlist.", icon: "warning", timer: 2500, showConfirmButton: false });
      return;
    }

    const isCurrentlyWishlisted = wishlistIds.includes(productId);
    const wishlistDocId = `${currentUser.uid}_${productId}`;
    const wishlistRef = doc(db, "wishlists", wishlistDocId);

    // Optimistic UI update
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
      // Revert state on failure
      if (isCurrentlyWishlisted) {
        setWishlistIds([...wishlistIds, productId]);
      } else {
        setWishlistIds(wishlistIds.filter(id => id !== productId));
      }
      Swal.fire({ text: "Failed to update wishlist.", icon: "error", timer: 2000, showConfirmButton: false });
    }
  };



  return (
    <PageContainer>
      {/* Store Hero Banner with Search Bar */}
      <StoreHero>
        <HeroImage
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
          alt="Bees Interior Luxury Store"
        />
        <HeroContent>
          <HeroTitle>
            Welcome to Our Store<br/> <span>Shop Our Collections</span>
          </HeroTitle>
          <HeroSubtitle>
            Explore premium accessories, bespoke lighting, and premium decor elements designed to transform your living spaces.
          </HeroSubtitle>
          <SearchInput
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </HeroContent>
      </StoreHero>

      {/* Main Layout */}
      <StoreLayout>
        {/* Categories Sidebar */}
       {/* Categories Sidebar */}
        <Sidebar>
          <SidebarTitle>Categories</SidebarTitle>

          {/* Mobile Dropdown Select */}
          <MobileCategorySelect
            value={activeCategoryId}
            onChange={(e) => setActiveCategoryId(e.target.value)}
          >
            <option value="all">All Items</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title.charAt(0).toUpperCase() + cat.title.slice(1)}
              </option>
            ))}
          </MobileCategorySelect>

          {/* Desktop Sidebar Button List */}
          <CategoryList>
            <CategoryButton
              $active={activeCategoryId === "all"}
              onClick={() => setActiveCategoryId("all")}
            >
              All Items
            </CategoryButton>

            {categories.map((cat) => (
              <CategoryButton
                key={cat.id}
                $active={activeCategoryId === cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
              >
                {cat.title.charAt(0).toUpperCase() + cat.title.slice(1)}
              </CategoryButton>
            ))}
          </CategoryList>
        </Sidebar>

        {/* Products Section */}
        <ProductsWrapper>
          {/* Controls Bar */}
          <StoreControls>
            <ResultsCount>
              Showing <span>{sortedProducts.length}</span> curated items
            </ResultsCount>
            <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title">Name: A to Z</option>
            </SortSelect>
          </StoreControls>

          {/* Grid */}
          <ProductsGrid>
            {loading ? (
              <LoadingText>Loading curated collections...</LoadingText>
            ) : sortedProducts.length === 0 ? (
              <LoadingText>No products found matching your criteria.</LoadingText>
            ) : (
            sortedProducts.map((product) => {
                const displayImg = product.images?.[0] || product.image || "https://placehold.co/400x300?text=No+Image";
                const productPrice = Number(product.amount || 0);
                const isWishlisted = wishlistIds.includes(product.id);

                return (
                  <ProductCard
                    key={product.id}
                    onClick={() => router.push(`/productdetail/${product.id}`)}
                  >
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
                      }}>
                        View
                      </AddButton>
                    </ProductPriceRow>
                  </ProductCard>
                );
              })
            )}
          </ProductsGrid>
        </ProductsWrapper>
      </StoreLayout>
    </PageContainer>
  );
}