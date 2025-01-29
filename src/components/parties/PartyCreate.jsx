import React, { useState } from "react";
import styled from "styled-components";
import axiosInstance from '../../services/axiosInstance';

const PartyCreate = ({ onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(2);
  const [meetingDate, setMeetingDate] = useState("");
  const [administrativeDistrict, setAdministrativeDistrict] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await axiosInstance.post("/parties", {
        title,
        content,
        maxCapacity,
        meetingDate,
        administrativeDistrict,
      });
      alert("파티가 성공적으로 생성되었습니다!"); 
      onCancel(); 
    } catch (err) {
      setError(err.response?.data?.message || "파티 생성에 실패했습니다.");
    }
  };

  return (
    <FormContainer>
      <FormTitle>파티 생성</FormTitle>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <form onSubmit={handleSubmit}>
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
        <SubmitButton type="submit">파티 만들기</SubmitButton>
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

const SubmitButton = styled.button`
  width: 90%;
  margin: 20px 0;
  padding: 12px;
  background-color: #0066CC;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
`;

export default PartyCreate;
