'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '@/firebaseConfig';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';
import PaystackPop from "@paystack/inline-js";
import HostingTransactions from '@/components/HostingTransactions';

// --- Styled Components (Updated Modern Theme) ---

const Section = styled.section`
  padding: 24px 16px;
  max-width: 1280px;
  margin: 0 auto;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h2`
  color: #0f172a;
//   font-size: 1.875rem;
  font-weight: 700;
  text-align: left;
  margin-bottom: 2rem;
  letter-spacing: -0.025em;

  @media (min-width: 768px) {
    // font-size: 2.25rem;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  margin-bottom: 3rem;
`;

const Card = styled.div`
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 1.75rem;
  border-radius: 16px;
  text-align: left;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
    border-color: #cbd5e1;
  }
`;

const CardTitle = styled.h3`
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f1f5f9;
  word-break: break-word;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0;
  border-bottom: 1px solid #f8fafc;
  
  &:last-of-type {
    border-bottom: none;
    margin-bottom: 1rem;
  }
`;

const DetailLabel = styled.span`
  color: #64748b;
  font-weight: 500;
  font-size: 0.875rem;
  flex-shrink: 0;
  margin-right: 1rem;
`;

const DetailValue = styled.span`
  color: #334155;
  font-weight: 600;
  font-size: 0.875rem;
  text-align: right;
  word-break: break-word;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.5rem 0 0.75rem 0;
  border-bottom: 1px solid #f8fafc;
  margin-bottom: 0.5rem;
  width: 100%;
`;

const ListItemValue = styled.span`
  color: #475569;
  font-weight: 500;
  font-size: 0.85rem;
  background: #f8fafc;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #2563eb;
  color: white;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  margin-top: auto;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: #1d4ed8;
    box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const EmptyState = styled.p`
  text-align: center;
  grid-column: 1 / -1;
  color: #64748b;
  font-size: 1rem;
  padding: 3rem 0;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
`;

// --- Component ---

const HostingList = () => {
  const [hostings, setHostings] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 1️⃣ fetch hostings
  const fetchHostings = () => {
    (async () => {
      Swal.fire({
        title: 'Loading...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const qs = await getDocs(collection(db, 'hostings'));
        setHostings(qs.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {
        Swal.fire('Error', 'Could not fetch plans.', 'error');
      } finally {
        Swal.close();
      }
    })();
  };

  useEffect(() => {
    fetchHostings();
  }, []);

  // 2️⃣ handle renewal launch
  const renew = (item) => {
    if (!user || !user.email) {
      Swal.fire('Authentication Error', 'User email not found. Please log in again.', 'error');
      return;
    }
    const amountKobo = item.renewal_amount * 100;
    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: "pk_test_60e1f53bba7c80b60029bf611a26a66a9a22d4e4", 
      // key: "pk_live_afb3375b9a770a5a332904dcf1a26e77c2a5f170", 
      email: user.email,
      amount: amountKobo,
      metadata: { hostingId: item.id },
      onSuccess: async (tx) => await handlePaymentSuccess(item, tx),
      onCancel: () => Swal.fire('Cancelled', 'Payment cancelled.', 'info'),
      onError: (e) => Swal.fire('Error', e.message, 'error'),
    });
  };

  // 3️⃣ on successful payment
  const handlePaymentSuccess = async (item, tx) => {
    Swal.fire({
      title: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const itemRef = doc(db, 'hostings', item.id);

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const currentExpiryFromDB = item.expiry_date.toDate();
      currentExpiryFromDB.setHours(0, 0, 0, 0);

      let baseDateForRenewal;

      if (currentExpiryFromDB < now) {
        baseDateForRenewal = new Date(now);
      } else {
        baseDateForRenewal = new Date(currentExpiryFromDB);
      }

      baseDateForRenewal.setFullYear(baseDateForRenewal.getFullYear() + 1);
      const newExpiry = baseDateForRenewal;

      await updateDoc(itemRef, {
        expiry_date: newExpiry,
        status: 'active'
      });

      const txn = {
        hostingId: item.id,
        reference: tx.reference,
        amount: item.renewal_amount,
        currency: item.base_currency,
        description: 'hosting renewal',
        hosting_name: item.hosting_name,
        status: 'success',
        timestamp: new Date()
      };
      await addDoc(collection(db, 'transactions'), txn);

      Swal.fire({
        title: 'Success',
        text: 'Renewal successful! Your hosting has been extended.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        window.location.reload();
      });

    } catch (error) {
      console.error("Error during payment success processing:", error);
      Swal.fire('Error', 'There was an issue processing your renewal. Please contact support.', 'error');
    }
  };

  return (
    <Section>
      <Title>All Hosting Plans</Title>
      <Grid>
        {hostings.length > 0 ? (
          hostings.map((item) => (
            <Card key={item.id}>
              <CardTitle>{item.hosting_name?.toUpperCase() || 'N/A'}</CardTitle>
              
              <DetailRow>
                <DetailLabel>Duration:</DetailLabel>
                <DetailValue>{item.duration || 'N/A'}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Status:</DetailLabel>
                <DetailValue>{item.status || 'N/A'}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Start Date:</DetailLabel>
                <DetailValue>{item.start_date?.toDate().toLocaleDateString() || 'N/A'}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Expires On:</DetailLabel>
                <DetailValue>{item.expiry_date?.toDate().toLocaleDateString() || 'N/A'}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Amount:</DetailLabel>
                <DetailValue>{item.base_currency === 'NGN' ? '₦' : '$'}{item.amount || 'N/A'}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Renewal Amount:</DetailLabel>
                <DetailValue>{item.base_currency === 'NGN' ? '₦' : '$'}{item.renewal_amount || 'N/A'}</DetailValue>
              </DetailRow>

              {item.features && item.features.length > 0 && (
                <div style={{ width: '100%' }}>
                  <DetailLabel style={{ display: 'block', marginBottom: '0.25rem' }}>Features:</DetailLabel>
                  <ListContainer>
                    {item.features.map((f, idx) => (
                      <ListItemValue key={idx}>{f}</ListItemValue>
                    ))}
                  </ListContainer>
                </div>
              )}

              {item.addons && item.addons.length > 0 && (
                <div style={{ width: '100%' }}>
                  <DetailLabel style={{ display: 'block', marginBottom: '0.25rem' }}>Addons:</DetailLabel>
                  <ListContainer>
                    {item.addons.map((f, idx) => (
                      <ListItemValue key={idx}>{f}</ListItemValue>
                    ))}
                  </ListContainer>
                </div>
              )}

              <Button onClick={() => renew(item)}>Renew hosting</Button>
            </Card>
          ))
        ) : (
          <EmptyState>
            No hosting plans available.
          </EmptyState>
        )}
      </Grid>
      <HostingTransactions/>
    </Section>
  );
};

export default HostingList;