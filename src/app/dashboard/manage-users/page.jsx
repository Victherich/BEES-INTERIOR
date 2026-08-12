"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc, 
  serverTimestamp 
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
const Success = "#10b981";

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

const SearchContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
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
  background: ${White};

  &:focus {
    border-color: ${Blue};
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 0 0;
`;

const ColorfulSectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, ${Blue} 0%, ${Gold} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 10px;
`;

const UserCard = styled.div`
  background: ${White};
  border-radius: 10px;
  padding: 10px;
  border: 1px solid ${Border};
  border-left: 4px solid ${(props) => (props.$isSuspended ? Danger : props.$isAdmin ? Gold : Blue)};
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: ${Dark};
`;

const UserEmail = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${TextMuted};
  word-break: break-word;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 5px;
`;

const Badge = styled.span`
  background: ${(props) => (props.$variant === "danger" ? "rgba(239, 68, 68, 0.1)" : props.$variant === "gold" ? "rgba(212, 175, 55, 0.15)" : "rgba(37, 99, 235, 0.1)")};
  color: ${(props) => (props.$variant === "danger" ? Danger : props.$variant === "gold" ? "#854d0e" : Blue)};
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 5px;
`;

const AdminButton = styled.button`
  background: rgba(212, 175, 55, 0.15);
  color: #854d0e;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: rgba(212, 175, 55, 0.3);
  }
`;

const SuspendButton = styled.button`
  background: ${(props) => (props.$isSuspended ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)")};
  color: ${(props) => (props.$isSuspended ? Success : Danger)};
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.$isSuspended ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)")};
  }
`;

const LoadingContainer = styled.div`
  padding: 10px;
  text-align: center;
  color: ${Dark};
  font-weight: 600;
`;

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "users"));
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(list);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch users.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleAdmin = async (user) => {
    const newAdminStatus = !user.isAdmin;
    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        isAdmin: newAdminStatus,
        updatedAt: serverTimestamp(),
      });
      Swal.fire("Updated!", `User role updated successfully.`, "success");
      fetchUsers();
    } catch (error) {
      Swal.fire("Error", "Could not update user role.", "error");
    }
  };

  const handleToggleSuspend = async (user) => {
    const newSuspendStatus = !user.isSuspended;
    const actionText = newSuspendStatus ? "suspend" : "activate";
    
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${actionText} this user account?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: newSuspendStatus ? Danger : Success,
      cancelButtonColor: TextMuted,
      confirmButtonText: `Yes, ${actionText} it!`,
    });

    if (result.isConfirmed) {
      try {
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, {
          isSuspended: newSuspendStatus,
          updatedAt: serverTimestamp(),
        });
        Swal.fire("Success!", `User account has been ${actionText}ed.`, "success");
        fetchUsers();
      } catch (error) {
        Swal.fire("Error", `Could not ${actionText} user account.`, "error");
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    const nameMatch = u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const emailMatch = u.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    return nameMatch || emailMatch;
  });

  if (loading) {
    return <LoadingContainer>Loading users directory...</LoadingContainer>;
  }

  return (
    <Container>
      <HeaderBanner>
        <ColorfulTitle>User Accounts Management 👥</ColorfulTitle>
        <ColorfulSub>Monitor platform members, assign administrative privileges, and manage account statuses.</ColorfulSub>
      </HeaderBanner>

      <SearchContainer>
        <StyledInput 
          type="text" 
          placeholder="Search users by name or email..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </SearchContainer>

      <ActionRow>
        <ColorfulSectionTitle>Registered Users ({filteredUsers.length})</ColorfulSectionTitle>
      </ActionRow>

      {filteredUsers.length === 0 ? (
        <LoadingContainer>No matching users found.</LoadingContainer>
      ) : (
        <UsersGrid>
          {filteredUsers.map((user) => (
            <UserCard key={user.id} $isAdmin={user.isAdmin} $isSuspended={user.isSuspended}>
              <CardHeader>
                <UserInfo>
                  <UserName>{user.name || "Unnamed User"}</UserName>
                  <UserEmail>{user.email || "No email provided"}</UserEmail>
                </UserInfo>
                <BadgeContainer>
                  {user.isSuspended && <Badge $variant="danger">Suspended</Badge>}
                  {user.isAdmin && <Badge $variant="gold">Admin</Badge>}
                  {!user.isAdmin && !user.isSuspended && <Badge>Active</Badge>}
                </BadgeContainer>
              </CardHeader>
              
              <ButtonGroup>
                <AdminButton onClick={() => handleToggleAdmin(user)}>
                  {user.isAdmin ? "Remove Admin" : "Make Admin"}
                </AdminButton>
                <SuspendButton 
                  $isSuspended={user.isSuspended} 
                  onClick={() => handleToggleSuspend(user)}
                >
                  {user.isSuspended ? "Activate" : "Suspend"}
                </SuspendButton>
              </ButtonGroup>
            </UserCard>
          ))}
        </UsersGrid>
      )}
    </Container>
  );
}