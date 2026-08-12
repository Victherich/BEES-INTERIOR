'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import Swal from 'sweetalert2';

// --- Styled Components (Updated Modern Theme) ---

const Section = styled.section`
  padding: 3rem 1rem;
  max-width: 1280px;
  margin: 0 auto;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
`;

const Title = styled.h2`
  color: #0f172a;
//   font-size: 1rem;
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
    margin-bottom: 0.5rem;
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

const StatusIndicator = styled(DetailValue)`
  color: ${({ status }) => {
    const s = status?.toLowerCase();
    return s === 'completed' || s === 'success' ? '#16a34a' :
           s === 'pending' ? '#d97706' :
           s === 'failed' ? '#dc2626' : '#334155';
  }};
  background: ${({ status }) => {
    const s = status?.toLowerCase();
    return s === 'completed' || s === 'success' ? '#f0fdf4' :
           s === 'pending' ? '#fffbeb' :
           s === 'failed' ? '#fef2f2' : '#f8fafc';
  }};
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.8rem;
  border: 1px solid ${({ status }) => {
    const s = status?.toLowerCase();
    return s === 'completed' || s === 'success' ? '#bbf7d0' :
           s === 'pending' ? '#fde68a' :
           s === 'failed' ? '#fecaca' : '#e2e8f0';
  }};
`;

const NoDataMessage = styled.p`
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

const HostingTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    Swal.fire({
      title: 'Loading Transactions...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const transactionsQuery = query(
      collection(db, 'transactions'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      transactionsQuery,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTransactions(data);
        Swal.close();
      },
      (error) => {
        console.error('Error fetching transactions:', error);
        Swal.fire('Error', 'Failed to fetch transactions.', 'error');
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <Section>
      <Title>Hosting Transactions</Title>
      <Grid>
        {transactions.length > 0 ? (
          transactions.map((item) => (
            <Card key={item.id}>
              <CardTitle>
                {item.transaction_id?.toUpperCase() || item.reference?.toUpperCase() || 'TRANSACTION'}
              </CardTitle>
              
              <DetailRow>
                <DetailLabel>Reference:</DetailLabel>
                <DetailValue>{item.reference || 'N/A'}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Amount:</DetailLabel>
                <DetailValue>{item.currency === 'NGN' ? '₦' : '$'}{item.amount || 'N/A'}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Status:</DetailLabel>
                <StatusIndicator status={item.status}>
                  {item.status?.toUpperCase() || 'N/A'}
                </StatusIndicator>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Date:</DetailLabel>
                <DetailValue>{item.timestamp?.toDate().toLocaleString() || 'N/A'}</DetailValue>
              </DetailRow>

              {item.description && (
                <DetailRow>
                  <DetailLabel>Description:</DetailLabel>
                  <DetailValue>{item.description}</DetailValue>
                </DetailRow>
              )}

              <DetailRow>
                <DetailLabel>Hosting ID:</DetailLabel>
                <DetailValue>{item.hostingId || 'N/A'}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Hosting Name:</DetailLabel>
                <DetailValue>{item.hosting_name || 'N/A'}</DetailValue>
              </DetailRow>
            </Card>
          ))
        ) : (
          <NoDataMessage>
            No transactions found.
          </NoDataMessage>
        )}
      </Grid>
    </Section>
  );
};

export default HostingTransactions;