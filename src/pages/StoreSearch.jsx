import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'; 
import axiosInstance from '../services/axiosInstance';
import kakaoIcon from '../assets/route-result-icons/kakao.png';
import nolgoatIcon from '../assets/route-result-icons/nolgoat.png';

const StoreSearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false); // 검색 여부 (NoResultsMessage 메세지 위해서)
  const observerTarget = useRef(null);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setIsSearched(true);
      const response = await axiosInstance.get(
        `/stores/search?searchInput=${searchInput}&page=0&size=10`
      );
      setResults(response.data.content);
      setPage(1);
      setHasMore(!response.data.last);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/stores/search?searchInput=${searchInput}&page=${page}&size=10`
      );
      setResults((prevResults) => [...prevResults, ...response.data.content]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(!response.data.last);
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
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
  }, [hasMore, page, searchInput]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container>
      <SearchContainer>
        <SearchBar isFocused={isFocused}>
          <SearchInput
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="가게 이름을 입력하세요"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
          />
          <SearchButton onClick={handleSearch}>
            <i className="fa-solid fa-magnifying-glass" />
          </SearchButton>
        </SearchBar>
      </SearchContainer>
      <SearchResultContainer>
        {results.length === 0 && isSearched ? (
          <NoResultsMessage>검색 결과가 없습니다</NoResultsMessage>
        ) : (
          <>
            {results.map((store) => (
              <StoreItem key={store.id} to={`/store/${store.id}`}>
                <StoreInfoRow>
                  <StoreName>{store.name}</StoreName>
                  <Category>{store.category}</Category>
                </StoreInfoRow>
                <Ratings>
                  <span>
                    <img src={kakaoIcon} alt="Kakao Icon" />
                    {store.kakaoAverageGrade.toFixed(1)}
                  </span>
                  <span>
                    <img src={nolgoatIcon} alt="Nolgoat Icon" />
                    {store.nolgoatAverageGrade.toFixed(1)}
                  </span>
                </Ratings>
                <Address>{store.roadAddress}</Address>
                <PhoneNumber href={`tel:${store.phoneNumber}`}>{store.phoneNumber}</PhoneNumber>
              </StoreItem>
            ))}
            <LoadingTarget ref={observerTarget}>
              {isLoading && <LoadingSpinner>로딩 중...</LoadingSpinner>}
            </LoadingTarget>
          </>
        )}
      </SearchResultContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 0px auto 0;
  padding: 0px;
  font-family: 'Nanum Gothic', sans-serif;
  box-sizing: border-box;
`;

const SearchContainer = styled.div`
  position: fixed; 
  top: 50px;
  z-index: 100;
  width: 100%;
  max-width: 600px;
  margin: 0px auto 0;
  padding: 15px 20px 20px;
  border-bottom: 0.5px solid #a0a0a0;
  background-color: #ffffff;
  font-family: 'Nanum Gothic', sans-serif;
  box-sizing: border-box;
`;

const SearchResultContainer = styled.div`
  width: 100%;
  height: calc(100vh - 200px);
  margin-top: 85px;
  padding: 0 20px;
  box-sizing: border-box;
  overflow-y: auto;
`;

const SearchBar = styled.div`
  width: 100%;
  max-width: 800px;
  border: 1.5px solid #007bff;
  border-radius: 10px;
  align-items: center;
  display: flex;
  overflow: hidden;
  background-color: #fff;
  box-sizing: border-box;
  box-shadow: ${(props) => (props.isFocused ? '0 4px 10px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0)')};
  transition: box-shadow 0.3s ease;
`;

const SearchInput = styled.input`
  margin: 0;
  padding: 10px 18px;
  border: none;
  border-radius: 30px 0 0 30px;
  outline: none;
  font-size: 17px;
  box-sizing: border-box;
  color: #333;
  flex: 1;

  &::placeholder {
    color: #aaa;
  }
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 0 30px 30px 0;
  color: #fff;
  outline: none;
  flex-shrink: 0;
  background-color: #fff;
  box-sizing: border-box;
  cursor: pointer;

  i {
    font-size: 20px;
    color: #007bff;
  }
`;

const StoreItem = styled(Link)`
  padding: 12px 3px;
  border-bottom: 1px solid #ddd;
  text-decoration: none; 
  color: inherit; 
  transition: background-color 0.2s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    background-color: #f8f9fa; 
  }
`;

const StoreInfoRow = styled.div`
  margin-bottom: 5px;
  display: flex;
  align-items: center;
`;

const StoreName = styled.div`
  font-size: 16px;
  font-weight: 600;
  text-align: left;
`;

const Category = styled.div`
  margin-left: 10px;
  color: #888;
  font-size: 12px;
  text-align: left;
`;

const Address = styled.div`
  margin-top: 5px;
  font-size: 13px;
  color: #666;
  text-align: left;
`;

const PhoneNumber = styled.a`
  margin-top: 5px;
  font-size: 14px;
  color: #007bff;
  text-decoration: none;
  text-align: left;

  &:hover {
    text-decoration: underline;
  }
`;

const Ratings = styled.div`
  margin-top: 5px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #f15b5b;
  font-weight: bold;

  & > span {
    margin-right: 10px;
    display: flex;
    align-items: center;
  }

  img {
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }
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

const NoResultsMessage = styled.div`
  width: 100%;
  margin-top: 20px;
  text-align: center;
  font-size: 15px;
  color: #666;
`;

export default StoreSearch;