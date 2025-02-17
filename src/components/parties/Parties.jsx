import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { formatToDate, formatTimeAgo } from '../../utils/DateFormatter';

const Parties = ({ onPartyClick, onCreateParty, partyType = 'all' }) => {
  const [parties, setParties] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [districtFilter, setDistrictFilter] = useState(null);
  const [sortOption, setSortOption] = useState('createdDate');
  const [loading, setLoading] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const observerTarget = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setParties([]);
    setPage(0);
    setHasMore(true);
    fetchParties(0, true);
  }, [statusFilter, districtFilter, sortOption, partyType]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, page, loading]);

  const fetchParties = async (pageNum, isNewSearch = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      let endpoint = '/parties';
      let params = {};
  
      switch(partyType) {
        case 'all':
          params = {
            status: statusFilter,
            district: districtFilter,
            sortField: sortOption,
            page: pageNum,
            size: 10,
          };
          break;
        case 'joined':
          endpoint = '/parties/me/joined';
          params = {
            page: pageNum,
            size: 10,
          };
          break;
        case 'my':
          endpoint = '/parties/me/created';
          params = {
            page: pageNum,
            size: 10,
          };
          break;
      }
      
      const response = await axiosInstance.get(endpoint, { params });
      
      if (isNewSearch) {
        setParties(response.data.content);
      } else {
        setParties(prev => [...prev, ...response.data.content]);
      }
      
      setHasMore(!response.data.last);
    } catch (error) {
      console.error('Failed to fetch parties:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!hasMore || loading) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    fetchParties(nextPage);
  };

  return (
    <Container ref={containerRef}>
      {partyType === 'all' && (
        <FiltersSection>
          <FilterGroup>
            <SortButtons>
              <SortButton
                active={statusFilter === null}
                onClick={() => setStatusFilter(null)}
              >
                전체
              </SortButton>
              <SortButton
                active={statusFilter === 'opened'}
                onClick={() => setStatusFilter('opened')}
              >
                모집중
              </SortButton>
              <SortButton
                active={statusFilter === 'closed'}
                onClick={() => setStatusFilter('closed')}
              >
                마감
              </SortButton>
            </SortButtons>

            <SortButtons>
              <SortButton
                active={sortOption === 'createdDate'}
                onClick={() => setSortOption('createdDate')}
              >
                최신순
              </SortButton>
              <SortButton
                active={sortOption === 'meetingDate'}
                onClick={() => setSortOption('meetingDate')}
              >
                모임일순
              </SortButton>
            </SortButtons>

            <SelectBox
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value === "ALL" ? null : e.target.value)}
            >
              <Option value="ALL">전체 지역</Option>
              <Option value="GANGNAM_GU">강남구</Option>
              <Option value="GANGDONG_GU">강동구</Option>
              <Option value="GANGSEO_GU">강서구</Option>
              <Option value="GANGBUK_GU">강북구</Option>
              <Option value="GWANAK_GU">관악구</Option>
              <Option value="GWANGJIN_GU">광진구</Option>
              <Option value="GURO_GU">구로구</Option>
              <Option value="GEUMCHEON_GU">금천구</Option>
              <Option value="NOWON_GU">노원구</Option>
              <Option value="DOBONG_GU">도봉구</Option>
              <Option value="DONGDAEMUN_GU">동대문구</Option>
              <Option value="DONGJAK_GU">동작구</Option>
              <Option value="MAPO_GU">마포구</Option>
              <Option value="SEODAEMUN_GU">서대문구</Option>
              <Option value="SEOCHO_GU">서초구</Option>
              <Option value="SEONGDONG_GU">성동구</Option>
              <Option value="SEONGBUK_GU">성북구</Option>
              <Option value="SONGPA_GU">송파구</Option>
              <Option value="YANGCHEON_GU">양천구</Option>
              <Option value="YEONGDEUNGPO_GU">영등포구</Option>
              <Option value="YONGSAN_GU">용산구</Option>
              <Option value="EUNPYEONG_GU">은평구</Option>
              <Option value="JONGNO_GU">종로구</Option>
              <Option value="JUNG_GU">중구</Option>
              <Option value="JUNGNANG_GU">중랑구</Option>
            </SelectBox>
          </FilterGroup>
        </FiltersSection>
      )}

      <PartyList>
        {parties.length > 0 ? (
          <>
            {parties.map((party) => (
              <PartyCard 
                key={party.partyId} 
                closed={party.isClosed}
                onClick={() => onPartyClick(party.partyId)}
              >
                <PartyDetails>
                  <StatusBadge closed={party.closed}>
                    {party.closed ? '마감' : '모집중'}
                  </StatusBadge>
                  <PartyTitle>{party.title}</PartyTitle>
                </PartyDetails>

                <CardHeader>
                  <CardHeaderLeft>
                    <DetailItem>
                      <i className="fa-solid fa-map-marker-alt"></i>
                      {party.district}
                    </DetailItem>
                    <DetailItem>
                      <i className="fa-solid fa-calendar-alt"></i>
                      {formatToDate(party.meetingDate)}
                    </DetailItem>
                    <DetailItem>
                      <i className="fa-solid fa-users"></i>
                      {party.currentCount} / {party.maxCapacity}명
                    </DetailItem>
                  </CardHeaderLeft>
                  <DetailItem>
                    {partyType !== 'my' && (
                      <>{party.hostNickname} · </>
                    )}
                    {formatTimeAgo(party.createdDate)}
                  </DetailItem>
                </CardHeader>
              </PartyCard>
            ))}
            <LoadingTarget ref={observerTarget}>
              {loading && <LoadingSpinner>로딩 중...</LoadingSpinner>}
            </LoadingTarget>
          </>
        ) : (
          <EmptyMessage>
            {loading ? "로딩 중..." : "모임이 없습니다."}
          </EmptyMessage>
        )}
      </PartyList>

      <CreateButton containerWidth={containerWidth} onClick={onCreateParty}>
        <i className='fa-solid fa-plus'></i>
      </CreateButton>
    </Container>
  );
};

const Container = styled.div`
  margin: 0 auto;
  padding: 20px 20px 0 20px;
`;

const FiltersSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 24px;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
`;

const SortButtons = styled.div`
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #fafafa;
  display: flex;
  gap: 8px;
`;

const SortButton = styled.button`
  padding: 3px;
  border-radius: 20px;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px; 
  font-size: 12px;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')}; 
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: transparent; 
  color: ${(props) => (props.active ? '#333' : '#888')};
  position: relative;

  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${(props) =>
      props.active ? '#33cc33' : '#cccccc'};
  }
`;

const SelectBox = styled.select`
  width: 100px;
  padding: 8px; 
  border: none;
  border-radius: 5px;
  font-size: 12px;
  color: #333;
  background-color: #fafafa;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #0066CC;
  }
`;

const Option = styled.option`
  font-size: 12px;
  color: #333;
`;

const CreateButton = styled.button`
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  position: fixed;
  bottom: 80px;
  left: calc(50% + ${props => props.containerWidth / 2}px - 65px);
  background-color: #0066CC;
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PartyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PartyCard = styled.div`
  padding: 10px 12px 8px;
  border-radius: 7px;
  border: 1px solid ${(props) => (props.closed ? '#eee' : '#e6f0ff')};
  background-color: ${(props) => (props.closed ? '#fafafa' : 'white')};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${(props) => (props.closed ? '#ddd' : '#0066CC')};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

const CardHeader = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  i {
    color: #888;
  }
`;

const CardHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusBadge = styled.span`
  height: 17.5px;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${(props) => (props.closed ? '#f5f5f5' : '#EBF5FF')};
  color: ${(props) => (props.closed ? '#666' : '#0066CC')};
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
`;

const PartyTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: left;
  display: inline-flex;
  align-items: center;
`;

const PartyDetails = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const DetailItem = styled.div`
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;

  &:last-child {
    margin-left: auto;
  }
`;

const EmptyMessage = styled.div`
  padding: 48px 0;
  text-align: center;
  color: #666;
  font-size: 16px;
`;

const LoadingTarget = styled.div`
  width: 100%;
  height: 20px;
  margin: 20px 0 0;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  color: #666;
  font-size: 14px;
`;

export default Parties;