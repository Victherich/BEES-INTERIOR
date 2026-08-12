"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

// 🎨 BEES INTERIOR THEME COLORS
const Blue = "#2563eb";
const Dark = "#0f172a";
const Border = "#e5eaf2";
const White = "#ffffff";
const Gold = "#D4AF37";
const TextMuted = "#475569";
const Danger = "#ef4444";

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

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin: 10px 0 0 0;
  flex-wrap: wrap;
`;

const ColorfulSectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, ${Blue} 0%, ${Gold} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SearchInput = styled.input`
  border: 1px solid ${Border};
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 0.9rem;
  outline: none;
  color: ${Dark};
  width: 240px;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0;

  &:focus {
    border-color: ${Blue};
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, ${Blue} 0%, #1d4ed8 100%);
  color: ${White};
  border: none;
  border-radius: 8px;
  padding: 8px 10px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

// const ProductsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//   gap: 10px;

// `;

// const ProductCard = styled.div`
//   background: ${White};
//   border-radius: 10px;
//   padding: 10px;
//   border: 1px solid ${Border};
//   border-left: 4px solid ${Gold};
//   box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
//   cursor: pointer;
//   transition: transform 0.2s ease, box-shadow 0.2s ease;
//   max-width:250px;

//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
//   }

//   @media (max-width: 768px) {
  
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


const ProductImageContainer = styled.div`
  width: 100%;
  height: 150px;
  border-radius: 6px;
  overflow: hidden;
  background: ${Border};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProductName = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: ${Dark};
`;

const ProductAmount = styled.span`
  font-size: 0.95rem;
  font-weight: 800;
  color: ${Blue};
`;

const ProductStock = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${TextMuted};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: auto;
`;

const EditButton = styled.button`
  background: rgba(37, 99, 235, 0.1);
  color: ${Blue};
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: rgba(37, 99, 235, 0.2);
  }
`;

const DeleteButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  color: ${Danger};
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
  }
`;

const LoadingContainer = styled.div`
  padding: 10px;
  text-align: center;
  color: ${Dark};
  font-weight: 600;
`;

// 🌟 Custom Modal Components (Max 10px limit)
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 10px;
  box-sizing: border-box;
`;

const ModalContainer = styled.div`
  background: ${White};
  border-radius: 10px;
  padding: 10px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid ${Border};
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${Blue} 0%, ${Gold} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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

  &:focus {
    border-color: ${Blue};
  }
`;

const StyledTextarea = styled.textarea`
  border: 1px solid ${Border};
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 0.9rem;
  outline: none;
  color: ${Dark};
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  min-height: 60px;
  margin: 0;

  &:focus {
    border-color: ${Blue};
  }
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${TextMuted};
  cursor: pointer;
  margin: 0;
`;

// 🌟 Custom Styled 4-Slot Image Upload Grid
const ImageSlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const ImageSlotCard = styled.div`
  background: #f8fafc;
  border: 1px dashed ${Border};
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  position: relative;
  min-height: 100px;
  box-sizing: border-box;
`;

const SlotLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${TextMuted};
  text-align: center;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadButtonLabel = styled.label`
  background: ${Blue};
  color: ${White};
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 8px;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background: #1d4ed8;
  }
`;

const SlotPreviewWrapper = styled.div`
  width: 100%;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  border: 1px solid ${Border};
`;

const RemoveSlotButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(239, 68, 68, 0.9);
  color: ${White};
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &:hover {
    background: ${Danger};
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 5px;
`;

const CancelButton = styled.button`
  background: ${Border};
  color: ${TextMuted};
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #cbd5e1;
  }
`;

const SaveButton = styled.button`
  background: ${Blue};
  color: ${White};
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
`;


const ProductcategoryBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${Blue};
  background: rgba(37, 99, 235, 0.1);
  padding: 3px 8px;
  border-radius: 4px;
  width: fit-content;
`;



// 🔹 Compression utility function
const compressImage = (file, maxSizeKB = 100) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file provided"));

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const scaleSize = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;

        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let quality = 0.7;

        const compressLoop = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("Compression failed"));

              const sizeKB = blob.size / 1024;
              if (sizeKB <= maxSizeKB || quality <= 0.1) {
                resolve(blob);
              } else {
                quality -= 0.1;
                compressLoop();
              }
            },
            "image/jpeg",
            quality
          );
        };

        compressLoop();
      };

      img.onerror = () => reject(new Error("Image load failed"));
    };

    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsDataURL(file);
  });
};

export default function ProductsCrudPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Modal State Controls
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form states
  const [form, setForm] = useState({
    name: "",
    description: "",
    amount: "",
    quantity: "",
    neverFinishes: false,
    categoryId: "", // 📁 added category reference
  });

  // 4 individual slots for files and previews
  const [imageFiles, setImageFiles] = useState([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState(["", "", "", ""]);
  // Keep track of pre-existing Cloudinary URL strings when editing
  const [existingImageUrls, setExistingImageUrls] = useState(["", "", "", ""]);
// 📁 Add categories state
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
const [sortOrder, setSortOrder] = useState(""); // "" | "low-high" | "high-low"


  // Fetch categories from Firestore
  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(list);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories(); // 📁 Call this on mount
  }, []);






  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "products"));
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(list);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch products.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSlotFileChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    newPreviews[index] = URL.createObjectURL(file);
    setImagePreviews(newPreviews);

    // Clear old existing URL for this slot if replacing
    const newExisting = [...existingImageUrls];
    newExisting[index] = "";
    setExistingImageUrls(newExisting);

    e.target.value = ""; // Reset input
  };

  const handleRemoveSlot = (index) => {
    const newFiles = [...imageFiles];
    newFiles[index] = null;
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    newPreviews[index] = "";
    setImagePreviews(newPreviews);

    const newExisting = [...existingImageUrls];
    newExisting[index] = "";
    setExistingImageUrls(newExisting);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (!form.name || !form.amount) {
        return Swal.fire({
          icon: "warning",
          text: "Please provide product name and amount.",
        });
      }

      // First image slot is compulsory
      if (!imageFiles[0] && !existingImageUrls[0]) {
        return Swal.fire({
          icon: "warning",
          text: "The first image is compulsory. Please select an image for Slot 1.",
        });
      }

      Swal.fire({
        text: "Processing...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      let finalImageUrls = [];

      for (let i = 0; i < 4; i++) {
        if (imageFiles[i]) {
          // Compress to max 100kb
          const compressedBlob = await compressImage(imageFiles[i], 100);

          const data = new FormData();
          data.append("file", compressedBlob, `product_${i}.jpg`);
          data.append("upload_preset", "bees_interior");
          data.append("folder", "products");

          const res = await fetch(
            "https://api.cloudinary.com/v1_1/aqxyleoh/image/upload",
            {
              method: "POST",
              body: data,
            }
          );

          const result = await res.json();

          if (!res.ok) {
            throw new Error(result.error?.message || `Image upload failed for slot ${i + 1}`);
          }

          finalImageUrls.push(result.secure_url);
        } else if (existingImageUrls[i]) {
          finalImageUrls.push(existingImageUrls[i]);
        }
      }

      const payload = {
        name: form.name,
        description: form.description,
        amount: Number(form.amount),
        quantity: form.neverFinishes ? 0 : Number(form.quantity || 0),
        neverFinishes: form.neverFinishes,
        images: finalImageUrls,
        image: finalImageUrls[0] || "", // Main primary thumbnail is the 1st image
        categoryId: form.categoryId,
      };

      if (editingId) {
        await updateDoc(doc(db, "products", editingId), payload);
      } else {
        await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }

      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Saved!",
        timer: 1500,
        showConfirmButton: false,
      });

      // Reset modal state
      setShowModal(false);
      setForm({ name: "", description: "", amount: "", quantity: "", neverFinishes: false });
      setImageFiles([null, null, null, null]);
      setImagePreviews(["", "", "", ""]);
      setExistingImageUrls(["", "", "", ""]);
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: error.message || "Try again.",
      });
    }
  };

  const handleEdit = (item, e) => {
    e.stopPropagation(); // Prevent card navigation click
    const itemImages = item.images || (item.image ? [item.image] : []);
    
    setForm({
      name: item.name || "",
      description: item.description || "",
      amount: item.amount || "",
      quantity: item.quantity || "",
      neverFinishes: item.neverFinishes || false,
      categoryId: item.categoryId || item.category || "",
    });
    setEditingId(item.id);

    const slotUrls = ["", "", "", ""];
    const slotPreviews = ["", "", "", ""];
    itemImages.forEach((url, idx) => {
      if (idx < 4) {
        slotUrls[idx] = url;
        slotPreviews[idx] = url;
      }
    });

    setExistingImageUrls(slotUrls);
    setImagePreviews(slotPreviews);
    setImageFiles([null, null, null, null]);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent card navigation click
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: Danger,
      cancelButtonColor: TextMuted,
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteDoc(doc(db, "products", id));
      Swal.fire("Deleted!", "", "success");
      fetchProducts();
    } catch (error) {
      Swal.fire("Error", "Could not delete product.", "error");
    }
  };

  // const filteredData = products.filter((item) =>
  //   item.name?.toLowerCase().includes(search.toLowerCase())
  // );

  const filteredData = products
  .filter((item) => {
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "" || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  })
  .sort((a, b) => {
    if (sortOrder === "low-high") return Number(a.amount || 0) - Number(b.amount || 0);
    if (sortOrder === "high-low") return Number(b.amount || 0) - Number(a.amount || 0);
    return 0;
  });



// Helper to get category name by ID
const getCategoryName = (catId) => {
  const found = categories.find((cat) => cat.id === catId);
  return found ? (found.name || found.title) : "Uncategorized";
};

  

  if (loading) {
    return <LoadingContainer>Loading products...</LoadingContainer>;
  }

  return (
    <Container>
      <HeaderBanner>
        <ColorfulTitle>Product Management 🛍️</ColorfulTitle>
        <ColorfulSub>Manage inventory items, upload compressed product visuals, and track quantities.</ColorfulSub>
      </HeaderBanner>

      <ActionRow>
        <ColorfulSectionTitle>Inventory ({filteredData.length})</ColorfulSectionTitle>
        {/* <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <SearchInput
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <PrimaryButton onClick={() => {
            setEditingId(null);
            setForm({ name: "", description: "", amount: "", quantity: "", neverFinishes: false });
            setImageFiles([null, null, null, null]);
            setImagePreviews(["", "", "", ""]);
            setExistingImageUrls(["", "", "", ""]);
            setShowModal(true);
          }}>
            <span>+ Add Product</span>
          </PrimaryButton>
        </div> */}

<div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
  <SearchInput
    type="text"
    placeholder="Search by product name..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    style={{
      border: `1px solid ${Border}`,
      borderRadius: "8px",
      padding: "8px 10px",
      fontSize: "0.9rem",
      outline: "none",
      color: Dark,
      background: White,
      boxSizing: "border-box",
      margin: 0,
    }}
  >
    <option value="">All Categories</option>
    {categories.map((cat) => (
      <option key={cat.id} value={cat.id}>
        {cat.name || cat.title}
      </option>
    ))}
  </select>
  <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
    style={{
      border: `1px solid ${Border}`,
      borderRadius: "8px",
      padding: "8px 10px",
      fontSize: "0.9rem",
      outline: "none",
      color: Dark,
      background: White,
      boxSizing: "border-box",
      margin: 0,
    }}
  >
    <option value="">Sort by Price</option>
    <option value="low-high">Price: Low to High</option>
    <option value="high-low">Price: High to Low</option>
  </select>
 <PrimaryButton onClick={() => {
            setEditingId(null);
            setForm({ name: "", description: "", amount: "", quantity: "", neverFinishes: false });
            setImageFiles([null, null, null, null]);
            setImagePreviews(["", "", "", ""]);
            setExistingImageUrls(["", "", "", ""]);
            setShowModal(true);
          }}>
            <span>+ Add Product</span>
          </PrimaryButton>
</div>

      </ActionRow>

      {filteredData.length === 0 ? (
        <LoadingContainer>No products found.</LoadingContainer>
      ) : (
        <ProductsGrid>
          {filteredData.map((item) => {
            const displayImg = item.images?.[0] || item.image || "https://placehold.co/400x300?text=No+Image";
            return (
              <ProductCard key={item.id} onClick={() => router.push(`/productdetail/${item.id}`)}>
                <ProductImageContainer>
                  <ProductImage src={displayImg} alt={item.name} />
                </ProductImageContainer>
                <ProductInfo>
                  <ProductName>
    {item.name ? item.name.charAt(0).toUpperCase() + item.name.slice(1) : ""}
  </ProductName>
                 {/* 📁 Display the category name here with the first letter capitalized */}
  <ProductcategoryBadge>
    {(() => {
      const name = getCategoryName(item.categoryId);
      return name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
    })()}
  </ProductcategoryBadge>
                 <ProductAmount>₦{Number(item.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</ProductAmount>
                  <ProductStock>
                    {item.neverFinishes ? "∞ In Unlimited Stock" : `Stock: ${item.quantity ?? 0}`}
                  </ProductStock>
                </ProductInfo>
                <ButtonGroup>
                  <EditButton onClick={(e) => handleEdit(item, e)}>Edit</EditButton>
                  <DeleteButton onClick={(e) => handleDelete(item.id, e)}>Delete</DeleteButton>
                </ButtonGroup>
              </ProductCard>
            );
          })}
        </ProductsGrid>
      )}

      {/* 🌟 Add/Edit Product Modal */}
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{editingId ? "Edit Product" : "Create New Product"}</ModalTitle>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "10px", margin: 0 }}>
              <StyledInput
                type="text"
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

            {/* 📁 Category Selection Dropdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "700", color: Dark }}>
                  Product Category (Required)
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  required
                  style={{
                    border: `1px solid ${Border}`,
                    borderRadius: "6px",
                    padding: "8px 10px",
                    fontSize: "0.9rem",
                    outline: "none",
                    color: Dark,
                    background: White,
                    width: "100%",
                    boxSizing: "border-box",
                    margin: 0,
                  }}
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name || cat.title}
                    </option>
                  ))}
                </select>
              </div>

              <StyledTextarea
                placeholder="Product Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <StyledInput
                type="number"
                placeholder="Amount (₦)"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
              
              {!form.neverFinishes && (
                <StyledInput
                  type="number"
                  placeholder="Quantity"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
              )}

              <CheckboxRow>
                <input
                  type="checkbox"
                  checked={form.neverFinishes}
                  onChange={(e) => setForm({ ...form, neverFinishes: e.target.checked })}
                />
                Product does not finish (Unlimited Stock)
              </CheckboxRow>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: Dark }}>
                  Product Images (Max 4 slots, compressed to 100kb max each):
                </span>

                <ImageSlotsGrid>
                  {[0, 1, 2, 3].map((slotIndex) => {
                    const hasImage = imagePreviews[slotIndex] !== "";
                    const isMain = slotIndex === 0;

                    return (
                      <ImageSlotCard key={slotIndex}>
                        <SlotLabel>
                          {isMain ? "Main Image (Required)" : `Image ${slotIndex + 1} (Optional)`}
                        </SlotLabel>

                        {hasImage ? (
                          <SlotPreviewWrapper>
                            <ProductImage src={imagePreviews[slotIndex]} alt={`Slot ${slotIndex + 1}`} />
                            <RemoveSlotButton type="button" onClick={() => handleRemoveSlot(slotIndex)}>
                              ✕
                            </RemoveSlotButton>
                          </SlotPreviewWrapper>
                        ) : (
                          <>
                            <HiddenFileInput
                              id={`slot-file-${slotIndex}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSlotFileChange(slotIndex, e)}
                            />
                            <UploadButtonLabel htmlFor={`slot-file-${slotIndex}`}>
                              Select Image
                            </UploadButtonLabel>
                          </>
                        )}
                      </ImageSlotCard>
                    );
                  })}
                </ImageSlotsGrid>
              </div>

              <ModalActions>
                <CancelButton type="button" onClick={() => setShowModal(false)}>Cancel</CancelButton>
                <SaveButton type="submit">{editingId ? "Save Changes" : "Create Product"}</SaveButton>
              </ModalActions>
            </form>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
}