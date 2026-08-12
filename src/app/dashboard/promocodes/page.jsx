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
  serverTimestamp,
  query,
  where
} from "firebase/firestore";
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
  margin: 10px 0 0 0;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const ColorfulSectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, ${Blue} 0%, ${Gold} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 10px;
`;

const CategoryCard = styled.div`
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
  align-items: center;
`;

const CategoryName = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: ${Dark};
`;

const CategoryDesc = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${TextMuted};
  word-break: break-word;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 5px;
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

// 🌟 Custom Modal Styled Components (Strict max 10px limit)
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
  max-width: 400px;
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

const StyledSelect = styled.select`
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
  min-height: 70px;
  margin: 0;

  &:focus {
    border-color: ${Blue};
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

export default function PromoCodesCrudPage() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State Controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const [discountType, setDiscountType] = useState("percentage"); // 'percentage' or 'fixed'
  const [discountValue, setDiscountValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "promoCodes"));
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPromoCodes(list);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch promo codes.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setCodeInput("");
    setDiscountType("percentage");
    setDiscountValue("");
    setIsModalOpen(true);
  };

  const openEditModal = (promo) => {
    setEditingId(promo.id);
    setCodeInput(promo.code || "");
    setDiscountType(promo.discountType || "percentage");
    setDiscountValue(promo.discountValue?.toString() || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCodeInput("");
    setDiscountType("percentage");
    setDiscountValue("");
    setEditingId(null);
  };

  const handleSavePromoCode = async (e) => {
    e.preventDefault();
    if (!codeInput.trim() || !discountValue) {
      Swal.fire("Validation", "Please fill in all required fields.", "warning");
      return;
    }

    try {
      const payload = {
        code: codeInput.trim().toUpperCase(),
        discountType,
        discountValue: parseFloat(discountValue),
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        const docRef = doc(db, "promoCodes", editingId);
        await updateDoc(docRef, payload);
        Swal.fire("Updated!", "Promo code updated successfully.", "success");
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, "promoCodes"), payload);
        Swal.fire("Success!", "Promo code created successfully.", "success");
      }
      closeModal();
      fetchPromoCodes();
    } catch (error) {
      Swal.fire("Error", "Could not save promo code.", "error");
    }
  };

  const handleDeletePromoCode = async (promoToDelete) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `This will permanently delete promo code "${promoToDelete.code}". This action cannot be undone!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: Danger,
        cancelButtonColor: TextMuted,
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, "promoCodes", promoToDelete.id));
        Swal.fire("Deleted!", "Promo code has been removed.", "success");
        fetchPromoCodes();
      }
    } catch (error) {
      Swal.fire("Error", "Could not delete promo code.", "error");
    }
  };

  const filteredPromoCodes = promoCodes.filter((promo) =>
    promo.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingContainer>Loading promo codes...</LoadingContainer>;
  }

  return (
    <Container>
      <HeaderBanner>
        <ColorfulTitle>Promo Codes Management 🎟️</ColorfulTitle>
        <ColorfulSub>Create, modify, and manage discount promo codes for your luxury interior store.</ColorfulSub>
      </HeaderBanner>

      <ActionRow>
        <ColorfulSectionTitle>All Promo Codes ({promoCodes.length})</ColorfulSectionTitle>
        
        <StyledInput 
          type="text" 
          placeholder="Search promo codes..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          style={{ maxWidth: "250px", marginRight: "10px" }}
        />

        <PrimaryButton onClick={openAddModal}>
          <span>+ Add Promo Code</span>
        </PrimaryButton>
      </ActionRow>

      {filteredPromoCodes.length === 0 ? (
        <LoadingContainer>No promo codes found. Click "+ Add Promo Code" to create one.</LoadingContainer>
      ) : (
        <CategoriesGrid>
          {filteredPromoCodes.map((promo) => (
            <CategoryCard key={promo.id}>
              <CardHeader>
                <CategoryName>{promo.code}</CategoryName>
              </CardHeader>
              <CategoryDesc>
                <strong>Type:</strong> {promo.discountType === 'percentage' ? 'Percentage (%)' : 'Fixed Amount (₦)'}<br />
                <strong>Value:</strong> {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `₦${promo.discountValue?.toLocaleString()}`}
              </CategoryDesc>
              <ButtonGroup>
                <EditButton onClick={() => openEditModal(promo)}>Edit</EditButton>
                <DeleteButton onClick={() => handleDeletePromoCode(promo)}>Delete</DeleteButton>
              </ButtonGroup>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      )}

      {/* 🌟 Custom Form Modal */}
      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{editingId ? "Edit Promo Code" : "Create New Promo Code"}</ModalTitle>
            <form onSubmit={handleSavePromoCode} style={{ display: "flex", flexDirection: "column", gap: "10px", margin: 0 }}>
              <StyledInput 
                type="text" 
                placeholder="Promo Code String (e.g. SUMMER25)" 
                value={codeInput} 
                onChange={(e) => setCodeInput(e.target.value)} 
                required 
              />
              <StyledSelect value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₦)</option>
              </StyledSelect>
              <StyledInput 
                type="number" 
                step="any"
                placeholder={discountType === 'percentage' ? 'Discount Value (e.g. 10)' : 'Discount Value (e.g. 5000)'} 
                value={discountValue} 
                onChange={(e) => setDiscountValue(e.target.value)} 
                required 
              />
              <ModalActions>
                <CancelButton type="button" onClick={closeModal}>Cancel</CancelButton>
                <SaveButton type="submit">{editingId ? "Save Changes" : "Create Code"}</SaveButton>
              </ModalActions>
            </form>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
}