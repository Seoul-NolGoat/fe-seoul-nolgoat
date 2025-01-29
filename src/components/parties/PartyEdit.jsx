import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from '../../services/axiosInstance';

const PartyEdit = ({ partyId, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(2);
  const [meetingDate, setMeetingDate] = useState("");
  const [administrativeDistrict, setAdministrativeDistrict] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPartyData();
  }, [partyId]);

  const fetchPartyData = async () => {
    try {
      const response = await axiosInstance.get(`/parties/${partyId}`);
      const partyData = response.data;
      
      setTitle(partyData.title);
      setContent(partyData.content);
      setMaxCapacity(partyData.maxCapacity);
      setMeetingDate(partyData.meetingDate);
      setAdministrativeDistrict(partyData.administrativeDistrict);
    } catch (err) {
      setError("파티 정보를 불러오는데 실패했습니다.");
    }
  };

  const handlePartyEdit = async (e) => {
    e.preventDefault();
  
    try {
      await axiosInstance.put(`/parties/${partyId}`, {
        title,
        content,
        maxCapacity,
        meetingDate,
        administrativeDistrict,
      });
      alert("파티가 성공적으로 수정되었습니다!"); 
      onCancel(); 
    } catch (err) {
      setError(err.response?.data?.message || "파티 수정에 실패했습니다.");
    }
  };

  return (
    <FormContainer>
      <FormTitle>파티 수정</FormTitle>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <form onSubmit={handlePartyEdit}>
        <FormField>
          <Label>제목</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={25}
            placeholder="파티의 제목을 입력하세요"
            required
          />
        </FormField>
        <FormField>
          <Label>내용</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={300}
            placeholder="파티에 대한 간단한 설명을 입력하세요"
            required
          ></Textarea>
        </FormField>
        <FormField>
          <Label>최대 참여 인원</Label>
          <CapacityInput
            type="number"
            value={maxCapacity}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 2 && value <= 30) setMaxCapacity(value);
            }}
            min={2}
            max={30}
            required
          />
        </FormField>
        <FormField>
          <Label>모임일</Label>
          <DateInput
            type="datetime-local"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            required
          />
        </FormField>
        <FormField>
          <Label>행정구</Label>
          <Select
            value={administrativeDistrict}
            onChange={(e) => setAdministrativeDistrict(e.target.value)}
            required
          >
            <Option value="" disabled>
              행정구를 선택하세요
            </Option>
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
          </Select>
        </FormField>
        <ButtonContainer>
          <Button onClick={onCancel}>
            취소
          </Button>
          <Button 
            backgroundColor="#0066CC" color="white" hoverColor="#0052a3"
            type="submit"
          >
            수정하기
          </Button>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  padding: 20px;
  font-family: "Nanum Gothic", sans-serif;
`;

const FormTitle = styled.h2`
  margin-top: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
`;

const ErrorMessage = styled.div`
  margin-bottom: 10px;
  color: red;
`;

const FormField = styled.div`
  margin-bottom: 15px;
  text-align: left;
`;

const Label = styled.label`
  margin: 0 0 5px 5px;
  display: block;
  font-size: 15px;
  font-weight: bold;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f7f7;
  color: #333;
  font-size: 15px;
  box-sizing: border-box;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f7f7;
  color: #333;
  font-size: 15px;
  box-sizing: border-box;
  resize: vertical;
`;

const CapacityInput = styled.input`
  width: 70px; 
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f7f7;
  color: #333;
  font-size: 15px;
  text-align: center;
  box-sizing: border-box;
`;

const DateInput = styled.input`
  width: 220px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f7f7;
  color: #333;
  font-size: 15px;
  box-sizing: border-box;
`;

const Select = styled.select`
  width: 220px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f7f7;
  color: #333;
  font-size: 15px;
  box-sizing: border-box;
  cursor: pointer;
`;

const Option = styled.option`
  font-size: 12px;
  color: #333;
`;

const ButtonContainer = styled.div`
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

export default PartyEdit;