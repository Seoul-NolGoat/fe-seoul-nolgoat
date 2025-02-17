import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../services/axiosInstance';
import { UserContext } from '../../contexts/UserContext'; 
import { formatToKoreanDate, formatTimeAgo } from '../DateFormatter';
import moreIcon from '../../assets/store-detail-icons/three-dots.png';

const PartyDetail = ({ partyId, onBack, onEdit }) => {
  const [partyDetails, setPartyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [activeCommentOptions, setActiveCommentOptions] = useState(null);
  const { userProfile } = useContext(UserContext); 

  useEffect(() => {
    fetchPartyDetails();
  }, [partyId]);

  const fetchPartyDetails = async () => {
    try {
      const response = await axiosInstance.get(`/parties/${partyId}`);
      setPartyDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch party details:', error);
      setLoading(false);
      onBack();
    }
  };

  const handleJoinParty = async () => {
    try {
      await axiosInstance.post(`/parties/${partyId}/join`);
      alert("파티에 성공적으로 참여하였습니다");
      fetchPartyDetails();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      alert(errorMessage);
    }
  };

  const handleLeaveParty = async () => {
    const confirmLeave = window.confirm("정말로 파티에서 나가시겠습니까?");
    if (!confirmLeave) return; 
  
    try {
      await axiosInstance.delete(`/parties/${partyId}/participants/me`);
      alert("파티에서 성공적으로 나갔습니다.");
      fetchPartyDetails(); 
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      alert(errorMessage);
    }
  };

  const handleCloseParty = async () => {
    const confirmClose = window.confirm("정말로 파티를 마감하시겠습니까?");
    if (!confirmClose) return; 
  
    try {
      await axiosInstance.post(`/parties/${partyId}`);
      alert("파티가 성공적으로 마감되었습니다.");
      fetchPartyDetails(); 
    } catch (error) {
      const errorMessage = error.response?.data?.message || "파티 마감에 실패했습니다.";
      alert(errorMessage);
    }
  };

  const handleDeleteParty = async () => {
    const confirmClose = window.confirm("정말로 파티를 삭제제하시겠습니까?");
    if (!confirmClose) return; 
  
    try {
      await axiosInstance.delete(`/parties/${partyId}`);
      alert("파티가 성공적으로 삭제되었습니다.");
      onBack();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "파티 삭제에 실패했습니다.";
      alert(errorMessage);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
  
    try {
      await axiosInstance.post(`/comments/parties/${partyId}`, {
        content: commentContent
      });
      setCommentContent(''); 
      fetchPartyDetails(); 
    } catch (error) {
      const errorMessage = error.response?.data?.message || '댓글 작성에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm('댓글을 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`/comments/${commentId}`);
        fetchPartyDetails();
      } catch (error) {
        const errorMessage = error.response?.data?.message || '댓글 작성에 실패했습니다.';
        alert(errorMessage);
      }
    }
  };

  const handleBanParticipant = async (userId) => {
    const confirmBan = window.confirm("정말로 이 참여자를 추방하시겠습니까?");
    if (!confirmBan) return;
  
    try {
      await axiosInstance.delete(`/parties/${partyId}/participants/${userId}`);
      alert("참여자가 성공적으로 추방되었습니다.");
      fetchPartyDetails();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "참여자 추방에 실패했습니다.";
      alert(errorMessage);
    }
  };

  const toggleCommentOptions = (commentId) => {
    setActiveCommentOptions((prev) => (prev === commentId ? null : commentId));
  };

  if (loading) return <LoadingContainer>loading...</LoadingContainer>;
  if (!partyDetails) return null;

  return (
    <Container>
      <ContentSection>
        <PartyTitle>
          {partyDetails.title}
          <StatusBadge closed={partyDetails.closed}>
            {partyDetails.closed ? '마감' : '모집중'}
          </StatusBadge>
        </PartyTitle>

        <DetailGrid>
          <DetailItem>
            <i className="fa-solid fa-map-marker-alt"></i>
            {partyDetails.district}
          </DetailItem>
          <DetailItem>
            <i className="fa-solid fa-calendar-alt"></i>
            {formatToKoreanDate(partyDetails.meetingDate)}
          </DetailItem>
          <DetailItem>
            <i className="fa-solid fa-users"></i>
            {partyDetails.currentCount} / {partyDetails.maxCapacity}명
          </DetailItem>
        </DetailGrid>

        <PartyDescription>{partyDetails.content}</PartyDescription>

        <HostSection>
          <ParticipantsContainer>
            <ParticipantCardInline>
              <ParticipantImage 
                src={partyDetails.hostProfileImage || '/default-profile.png'} 
                alt={partyDetails.hostNickname} 
              />
              <CrownIcon className="fa-solid fa-crown" />
              <HostName>{partyDetails.hostNickname}</HostName>
            </ParticipantCardInline>
            {partyDetails.participants.map(participant => (
              <ParticipantCardInline key={participant.participantUserId}>
                <ParticipantImage 
                  src={participant.participantProfileImage || '/default-profile.png'} 
                  alt={participant.participantNickname} 
                />
                {(partyDetails.host && !partyDetails.closed) && (
                  <BanIcon 
                    className="fa-solid fa-ban" 
                    onClick={() => handleBanParticipant(participant.participantUserId)}
                  />
                )}
                <ParticipantName>{participant.participantNickname}</ParticipantName>
              </ParticipantCardInline>
            ))}
          </ParticipantsContainer>
        </HostSection>

        {partyDetails.host ? (
          <HostButtons>
            {!partyDetails.closed && (
              <>
                <Button onClick={onEdit}>  
                  수정하기
                </Button>
                <Button onClick={handleCloseParty}>
                  마감하기
                </Button>
              </>
            )}
            <Button 
              backgroundColor="#ff4d4d" color="white" hoverColor="#cc0000" 
              onClick={handleDeleteParty}
            >
              삭제하기
            </Button>
          </HostButtons>
        ) : (
          <>
            {!partyDetails.closed && (
              <ParticipantButtons>
                {partyDetails.participant ? (
                  <Button 
                    backgroundColor="#ff4d4d" color="white" hoverColor="#cc0000"
                    onClick={handleLeaveParty}
                  >
                    모임 나가기
                  </Button>
                ) : (
                  <Button 
                    backgroundColor="#0066CC" color="white" hoverColor="#005bb5" 
                    onClick={handleJoinParty}
                  >
                    모임 참여하기
                  </Button>
                )}
              </ParticipantButtons>
            )}
          </>
        )}
      </ContentSection>

      <Divider />

      <CommentForm onSubmit={handleCommentSubmit}>
        <CommentTextArea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="댓글을 입력해주세요..."
        />
        <CommentSubmitButton 
          type="submit"
          backgroundColor="#0066CC"
          color="white"
          hoverColor="#005bb5"
        >
        <i className="fa-solid fa-paper-plane"></i>
        </CommentSubmitButton>
      </CommentForm>
      <CommentSection>
        {partyDetails.comments.length > 0 ? (
          partyDetails.comments.map(comment => (
            <CommentItem key={comment.commentId}>
              <CommentProfileImage src={comment.writerProfileImage} alt={comment.writerNickname} />
              <CommentContent>
                <CommentHeader>
                  <CommentNickname>{comment.writerNickname}</CommentNickname>
                  <Separator/>
                  <CommentDate>{formatTimeAgo(comment.createdDate)}</CommentDate>
                </CommentHeader>
                {(userProfile.userId === comment.writerId && !comment.isDeleted) && (
                  <CommentOptions>
                    <MoreIcon
                      src={moreIcon}
                      alt="More options"
                      onClick={() => toggleCommentOptions(comment.commentId)}
                    />
                    {activeCommentOptions === comment.commentId && (
                      <CommentOptionsMenu>
                        <DeleteReviewButton onClick={() => handleDeleteComment(comment.commentId)}>삭제</DeleteReviewButton>
                      </CommentOptionsMenu>
                    )}
                  </CommentOptions>
                )}
                {comment.isDeleted ? (
                  <DeletedCommentText>{comment.content}</DeletedCommentText>
                ) : (
                  <CommentText>{comment.content}</CommentText>
                )}
              </CommentContent>
            </CommentItem>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </CommentSection>
    </Container>
  );
};

const Container = styled.div`
  margin: 0 auto;
  position: relative;
`;

const ContentSection = styled.div`
  padding: 20px;
`;

const PartyTitle = styled.div`
  margin: 10px 0;
  font-size: 20px;
  font-weight: 700;
  text-align: left;
`;

const StatusBadge = styled.span`
  margin-left: 10px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => (props.closed ? '#f5f5f5' : '#EBF5FF')};
  color: ${(props) => (props.closed ? '#666' : '#0066CC')};
`;

const DetailGrid = styled.div`
  margin: 20px 8px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
`;

const HostSection = styled.div`
  margin-bottom: 20px;
`;

const HostName = styled.span`
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: #007bff;
`;

const ParticipantsContainer = styled.div`
  padding: 10px 0;
  display: flex;
  gap: 8px;
  overflow-x: auto;

  scrollbar-width: none; /* Firefox에서 스크롤바 숨기기 */
  -ms-overflow-style: none; /* IE에서 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari에서 스크롤바 숨기기 */
  }
`;

const ParticipantCardInline = styled.div`
  min-width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const ParticipantImage = styled.img`
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
  border-radius: 50%;
  object-fit: cover;
`;

const CrownIcon = styled.i`
  padding: 3px 2px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 14px;
  color: gold;
  background-color: #ffffff;
`;

const BanIcon = styled.i`
  padding: 2px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 14px;
  color: red;
  background-color: #ffffff;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const ParticipantName = styled.span`
  font-size: 12px;
  text-align: center;
`;

const PartyDescription = styled.p`
  margin: 25px 0;
  text-align: left;
  line-height: 1.6;
  color: #333;
`;

const HostButtons = styled.div`
  padding: 20px 3px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const ParticipantButtons = styled.div`
  padding: 20px 3px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const Button = styled.button`
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => props.backgroundColor || '#f1f1f1'};
  color: ${(props) => props.color || '#333'};
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s ease;
  cursor: pointer;
  flex: 1;

  &:hover {
    background-color: ${(props) => props.hoverColor || '#cfcfcf'};
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 48px 0;
  color: #666;
  font-size: 16px;
`;

const Divider = styled.div`
  width: 100%;
  height: 13px; 
  margin: 10px 0; 
  background-color: #f8f9fa; 
`;

const CommentForm = styled.form`
  padding: 20px;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: -1px;
  z-index: 100;
  background-color: #fff;
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

const CommentTextArea = styled.textarea`
  height: 23px;
  padding: 8px;
  border: 1px solid #ececec;
  border-radius: 4px;
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  overflow-y: auto;
  background-color: #f8f8f8;
  font-family: "Nanum Gothic", sans-serif;

  &:focus {
    height: 65px;
    outline: none;
    border-color: #333;
  }
`;

const CommentSubmitButton = styled.button`
  width: 35px;
  height: 35px;
  margin-top: 3px;
  border: none;
  border-radius: 50%;
  background-color: ${props => props.backgroundColor || '#0066CC'};
  color: ${props => props.color || 'white'};
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${props => props.hoverColor || '#005bb5'};
  }

  i {
    font-size: 15px;
  }
`;

const CommentSection = styled.div`
  margin: 10px 0px;
  padding: 0px 20px;
`;

const CommentItem = styled.div`
  margin-bottom: 5px;
  padding: 8px 0px;
  display: flex;
  align-items: flex-start;
  position: relative;

  &:last-child {
    border-bottom: none;
  }
`;

const CommentProfileImage = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 15px;
  border-radius: 50%;
`;

const CommentContent = styled.div`
  flex: 1;
  text-align: left; 
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
`;

const CommentNickname = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
`;

const Separator = styled.span`
  width: 1px;
  height: 11px;
  margin: 0 8px; 
  background-color: #ccc; 
`;

const CommentDate = styled.span`
  margin-bottom: 2px;
  font-size: 0.8rem; 
  color: #999; 
`;

const CommentText = styled.p`
  margin: 8px 0;
  text-align: left; 
  white-space: pre-wrap;
`;

const CommentOptions = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const MoreIcon = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const CommentOptionsMenu = styled.div`
  position: absolute;
  left: -60px;
  top: -3px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  z-index: 1;
`;

const DeleteReviewButton = styled.button`
  width: 55px;
  padding: 5px 10px;
  border: none;
  background-color: transparent;
  color: #f00;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #f8f8f8;
    border-radius: 5px;
  }
`;

const DeletedCommentText = styled.div`
  padding: 8px 0;
  color: #999;
  font-style: italic;
  font-size: 14px;
  text-align: left;
`;

export default PartyDetail;
