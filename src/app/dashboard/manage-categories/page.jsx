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
  where,
  writeBatch
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
    gap:10px;
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

const SearchContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
`;

export default function CategoriesCrudPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State Controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [titleInput, setTitleInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "categories"));
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(list);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch categories.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setTitleInput("");
    setDescInput("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat.id);
    setTitleInput(cat.title);
    setDescInput(cat.description || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTitleInput("");
    setDescInput("");
    setEditingId(null);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!titleInput.trim()) {
      Swal.fire("Validation", "Please enter a category title.", "warning");
      return;
    }

    try {
      if (editingId) {
        const docRef = doc(db, "categories", editingId);
        await updateDoc(docRef, {
          title: titleInput,
          description: descInput,
        });
        Swal.fire("Updated!", "Category updated successfully.", "success");
      } else {
        await addDoc(collection(db, "categories"), {
          title: titleInput,
          description: descInput,
          createdAt: serverTimestamp(),
        });
        Swal.fire("Success!", "Category added successfully.", "success");
      }
      closeModal();
      fetchCategories();
    } catch (error) {
      Swal.fire("Error", "Could not save category.", "error");
    }
  };

  // const handleDeleteCategory = async (id) => {
  //   const result = await Swal.fire({
  //     title: "Are you sure?",
  //     text: "This action cannot be undone!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: Danger,
  //     cancelButtonColor: TextMuted,
  //     confirmButtonText: "Yes, delete it!",
  //   });

  //   if (result.isConfirmed) {
  //     try {
  //       await deleteDoc(doc(db, "categories", id));
  //       Swal.fire("Deleted!", "Category has been removed.", "success");
  //       fetchCategories();
  //     } catch (error) {
  //       Swal.fire("Error", "Could not delete category.", "error");
  //     }
  //   }
  // };



const handleDeleteCategory = async (categoryToDelete) => {
    try {
      // 1. Check if any products use this category
      const productsQuery = query(collection(db, "products"), where("categoryId", "==", categoryToDelete.id));
      const productsSnapshot = await getDocs(productsQuery);

      if (!productsSnapshot.empty) {
        // 2. Build options for alternative categories
        const categoryOptions = categories
          .filter(cat => cat.id !== categoryToDelete.id)
          .reduce((acc, cat) => {
            acc[cat.id] = cat.title;
            return acc;
          }, { "uncategorized": "Move to Uncategorized" });

        // 3. Prompt admin where to move the products
        const { value: targetChoice } = await Swal.fire({
          title: "Category Contains Products!",
          text: `There are ${productsSnapshot.size} product(s) in "${categoryToDelete.title}". Where should these products go before deletion?`,
          input: "select",
          inputOptions: categoryOptions,
          inputPlaceholder: "Select a fallback category",
          showCancelButton: true,
          confirmButtonText: "Proceed & Reassign",
          confirmButtonColor: Blue,
          cancelButtonColor: TextMuted,
        });

        if (!targetChoice) return; // Cancelled by user

        // 4. Batch update products and delete category
        const batch = writeBatch(db);

        productsSnapshot.forEach((productDoc) => {
          batch.update(productDoc.ref, { 
            categoryId: targetChoice === "uncategorized" ? null : targetChoice,
            categoryName: targetChoice === "uncategorized" ? "Uncategorized" : categoryOptions[targetChoice]
          });
        });

        const categoryRef = doc(db, "categories", categoryToDelete.id);
        batch.delete(categoryRef);

        await batch.commit();
        Swal.fire("Success!", "Category deleted and products safely reassigned.", "success");
        fetchCategories();
        return;
      }

      // 5. Standard delete if no products are linked
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: Danger,
        cancelButtonColor: TextMuted,
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, "categories", categoryToDelete.id));
        Swal.fire("Deleted!", "Category has been removed.", "success");
        fetchCategories();
      }
    } catch (error) {
      Swal.fire("Error", "Could not delete category.", "error");
    }
  };



  const filteredCategories = categories.filter((cat) =>
  cat.title.toLowerCase().includes(searchQuery.toLowerCase())
);

  if (loading) {
    return <LoadingContainer>Loading categories...</LoadingContainer>;
  }

  return (
    <Container>
      <HeaderBanner>
        <ColorfulTitle>Product Categories Management 🛋️</ColorfulTitle>
        <ColorfulSub>Organize your luxury interior collections, add new design categories, and manage inventory layouts.</ColorfulSub>
      </HeaderBanner>

      <ActionRow>
        <ColorfulSectionTitle>All Categories ({categories.length})</ColorfulSectionTitle>
     
    <StyledInput 
      type="text" 
      placeholder="Search categories by name..." 
      value={searchQuery} 
      onChange={(e) => setSearchQuery(e.target.value)} 
      style={{maxWidth: "250px", marginRight: "10px"}}
    />

        <PrimaryButton onClick={openAddModal}>
          <span>+ Add Category</span>
        </PrimaryButton>
      </ActionRow>

      {filteredCategories.length === 0 ? (
        <LoadingContainer>No categories found. Click "+ Add Category" to create one.</LoadingContainer>
      ) : (
        <CategoriesGrid>
          {filteredCategories.map((cat) => (
            <CategoryCard key={cat.id}>
              <CardHeader>
  <CategoryName>
    {cat.title ? cat.title.charAt(0).toUpperCase() + cat.title.slice(1) : ""}
  </CategoryName>
</CardHeader>
<CategoryDesc>
  {(() => {
    const desc = cat.description || "No description provided.";
    return desc ? desc.charAt(0).toUpperCase() + desc.slice(1) : "";
  })()}
</CategoryDesc>
              <ButtonGroup>
                <EditButton onClick={() => openEditModal(cat)}>Edit</EditButton>
                <DeleteButton onClick={() => handleDeleteCategory(cat)}>Delete</DeleteButton>
              </ButtonGroup>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      )}

      {/* 🌟 Custom Form Modal */}
      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{editingId ? "Edit Category" : "Create New Category"}</ModalTitle>
            <form onSubmit={handleSaveCategory} style={{ display: "flex", flexDirection: "column", gap: "10px", margin: 0 }}>
              <StyledInput 
                type="text" 
                placeholder="Category Title" 
                value={titleInput} 
                onChange={(e) => setTitleInput(e.target.value)} 
                required 
              />
              <StyledTextarea 
                placeholder="Category Description" 
                value={descInput} 
                onChange={(e) => setDescInput(e.target.value)} 
              />
              <ModalActions>
                <CancelButton type="button" onClick={closeModal}>Cancel</CancelButton>
                <SaveButton type="submit">{editingId ? "Save Changes" : "Create Category"}</SaveButton>
              </ModalActions>
            </form>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
}