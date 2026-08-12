


'use client'
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db, auth } from '@/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  updateDoc,
  getDocs, 
  deleteDoc, 
  doc, 
  getDoc,
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function AddressManager({ onSelectAddress }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria',
    isDefault: false
  });

  // Listen to Firebase Auth state
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
          console.log(error);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const activeUserId = currentUser?.uid;

  const fetchAddresses = async () => {
    if (!activeUserId) return;
    try {
      setLoading(true);
      const q = query(collection(db, 'addresses'), where('userId', '==', activeUserId));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAddresses(list);
      
      const defaultAddr = list.find(a => a.isDefault);
      if (defaultAddr && !selectedId) {
        setSelectedId(defaultAddr.id);
      }
    } catch (error) {
      console.error("Error fetching addresses: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeUserId) {
      fetchAddresses();
    }
  }, [activeUserId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Nigeria',
      isDefault: false
    });
    setShowForm(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingId(addr.id);
    setFormData({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'Nigeria',
      isDefault: !!addr.isDefault
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeUserId) return;
    try {
      if (editingId) {
        // Update existing address
        const addressRef = doc(db, 'addresses', editingId);
        await updateDoc(addressRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Add new address
        await addDoc(collection(db, 'addresses'), {
          ...formData,
          userId: activeUserId,
          createdAt: serverTimestamp()
        });
      }

      setFormData({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Nigeria',
        isDefault: false
      });
      setEditingId(null);
      setShowForm(false);
      fetchAddresses();
    } catch (error) {
      console.error("Error saving address: ", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      await deleteDoc(doc(db, 'addresses', id));
      if (selectedId === id) {
        setSelectedId(null);
      }
      fetchAddresses();
      Swal.fire(
        'Deleted!',
        'Your address has been deleted.',
        'success'
      );
    } catch (error) {
      console.error("Error deleting address: ", error);
      Swal.fire(
        'Error!',
        'Failed to delete the address. Please try again.',
        'error'
      );
    }
  };

const handleUseAddress = (addr) => {
    try {
      localStorage.setItem('selectedAddress', JSON.stringify(addr));
      setSelectedId(addr.id);
      if (onSelectAddress) {
        onSelectAddress(addr);
      }
      router.push('/dashboard/order-summary'); // Adjust the route path as needed for your application
    } catch (error) {
      console.error("Error saving selected address to localStorage:", error);
    }
  };

  if (loadingAuth) {
    return <LoadingText>Loading user session...</LoadingText>;
  }

  if (!activeUserId) {
    return <LoadingText>Please log in to manage your addresses.</LoadingText>;
  }

  if (loading) return <LoadingText>Loading addresses...</LoadingText>;

  return (
    <Container>
      <HeaderRow>
        <h3>Select your Delivery Address</h3>
        {!showForm && (
          <PrimaryButton onClick={handleOpenAdd}>+ Add New Address</PrimaryButton>
        )}
      </HeaderRow>

      {showForm && (
        <AddressForm onSubmit={handleSubmit}>
          <h4>{editingId ? 'Edit Delivery Address' : 'Add New Delivery Address'}</h4>
          <FormGrid>
            <Input 
              type="text" 
              name="fullName" 
              placeholder="Full Name" 
              value={formData.fullName} 
              onChange={handleChange} 
              required 
            />
            <Input 
              type="tel" 
              name="phone" 
              placeholder="Phone Number" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
            />
            <Input 
              type="text" 
              name="street" 
              placeholder="Street Address (e.g. 15 Admiralty Way)" 
              value={formData.street} 
              onChange={handleChange} 
              required 
              style={{ gridColumn: '1 / -1' }}
            />
            <Input 
              type="text" 
              name="city" 
              placeholder="City" 
              value={formData.city} 
              onChange={handleChange} 
              required 
            />
            <Input 
              type="text" 
              name="state" 
              placeholder="State/Province" 
              value={formData.state} 
              onChange={handleChange} 
              required 
            />
            <Input 
              type="text" 
              name="postalCode" 
              placeholder="Postal Code (Optional)" 
              value={formData.postalCode} 
              onChange={handleChange} 
            />
            <Input 
              type="text" 
              name="country" 
              placeholder="Country" 
              value={formData.country} 
              onChange={handleChange} 
              required 
            />
          </FormGrid>
          <br/>
          {/* <CheckboxLabel>
            <input 
              type="checkbox" 
              name="isDefault" 
              checked={formData.isDefault} 
              onChange={handleChange} 
            />
            Set as default shipping address
          </CheckboxLabel> */}
          <ButtonRow>
            <PrimaryButton type="submit">{editingId ? 'Update Address' : 'Save Address'}</PrimaryButton>
            <SecondaryButton type="button" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</SecondaryButton>
          </ButtonRow>
        </AddressForm>
      )}

      <AddressGrid>
        {addresses.length === 0 ? (
          !showForm && (
            <EmptyContainer>
              <EmptyText>
                No saved addresses found. Please add an address to continue.
              </EmptyText>
              <PrimaryButton onClick={handleOpenAdd}>+ Add New Address</PrimaryButton>
            </EmptyContainer>
          )
        ) : (
          addresses.map((addr) => (
            <AddressCard 
              key={addr.id} 
              selected={selectedId === addr.id}
            >
              {addr.isDefault && <DefaultBadge>Default</DefaultBadge>}
              <AddrName>{addr.fullName}</AddrName>
              <AddrText>{addr.street}</AddrText>
              <AddrText>{addr.city}, {addr.state} {addr.postalCode}</AddrText>
              <AddrText>{addr.country}</AddrText>
              <AddrText>Phone: {addr.phone}</AddrText>

              <CardActions>
                <ActionGroup>
                  <EditBtn type="button" onClick={() => handleOpenEdit(addr)}>
                    Edit
                  </EditBtn>
                  <DeleteBtn type="button" onClick={() => handleDelete(addr.id)}>
                    Delete
                  </DeleteBtn>
                </ActionGroup>
                
                <UseAddressButton 
                  selected={selectedId === addr.id}
                  type="button" 
                  onClick={() => handleUseAddress(addr)}
                >
                  USE THIS ADDRESS
                </UseAddressButton>
              </CardActions>
            </AddressCard>
          ))
        )}
      </AddressGrid>
    </Container>
  );
}

// --- Styled Components (Bees Interior Theme with #2563eb Blue & Gold) ---

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  color: #1a1a1a;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 2px solid #D4AF37; /* Gold accent */
  padding-bottom: 12px;

  h3 {
    margin: 0;
    font-size: 1.35rem;
    color: #2563eb; /* Primary Blue */
    font-weight: 700;
    letter-spacing: 0.5px;
  }
`;

const PrimaryButton = styled.button`
  background: #2563eb; /* Primary Blue */
  color: #ffffff; 
  border: 1px solid #D4AF37;
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover { 
    background: #D4AF37; 
    color: #2563eb;
  }
`;

const SecondaryButton = styled.button`
  background: #f4f4f4;
  color: #333;
  border: 1px solid #ccc;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #e5e5e5; }
`;

const AddressForm = styled.form`
  background: #ffffff;
  border: 1px solid #D4AF37; /* Gold accent border */
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 28px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.05);

  h4 {
    margin-top: 0;
    margin-bottom: 18px;
    font-size: 1.15rem;
    color: #2563eb;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  font-size: 0.95rem;
  width: 100%;
  box-sizing: border-box;
  background: #fafafa;
  color: #1a1a1a;
  &:focus { 
    outline: none; 
    border-color: #2563eb; 
    box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.3);
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 18px 0;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
`;

const AddressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
`;

const AddressCard = styled.div`
  background: #ffffff;
  border: 2px solid ${props => props.selected ? '#2563eb' : '#e2e2e2'};
  border-top: 4px solid ${props => props.selected ? '#D4AF37' : '#2563eb'};
  border-radius: 8px;
  padding: 20px;
  position: relative;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.03);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    border-color: #2563eb;
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.15);
  }
`;

const DefaultBadge = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  background: #fcf8e3;
  color: #8a6d3b;
  border: 1px solid #faebcc;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
`;

const AddrName = styled.h4`
  margin: 0 0 8px 0;
  font-size: 1.05rem;
  color: #2563eb;
  font-weight: 700;
`;

const AddrText = styled.p`
  margin: 4px 0;
  font-size: 0.9rem;
  color: #555555;
`;

const CardActions = styled.div`
  margin-top: 18px;
  padding-top: 12px;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const EditBtn = styled.button`
  background: transparent;
  color: #2563eb;
  border: none;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 600;
  padding: 0;
  &:hover { text-decoration: underline; }
`;

const DeleteBtn = styled.button`
  background: transparent;
  color: #a94442;
  border: none;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 600;
  padding: 0;
  &:hover { text-decoration: underline; }
`;

const UseAddressButton = styled.button`
  width: 100%;
  background: #2563eb;
  color: #ffffff;
  border: 1px solid #D4AF37;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: #D4AF37;
   
  }
`;

const LoadingText = styled.p`
  color: #2563eb;
  font-size: 0.95rem;
  font-weight: 500;
`;

const EmptyContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
  gap: 20px;
`;

const EmptyText = styled.p`
  color: #2563eb;
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
`;