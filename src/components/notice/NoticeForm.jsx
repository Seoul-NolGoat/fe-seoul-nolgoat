import React, { useState, useEffect } from 'react';
import '../../pages/Notices.css';
import axiosInstance from '../../services/axiosInstance';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const NoticeForm = ({ notice, onCancel, userId }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    if (notice) {
      fetchNoticeDetails(notice.id); 
    }
  }, [notice]);

  const fetchNoticeDetails = (id) => {
    axiosInstance
      .get(`/notices/${id}`)
      .then((response) => {
        const { title, content, views } = response.data;
        setFormData({
          title,
          content,
          views,
        });
      })
      .catch((error) => {
        console.error('건의사항 세부 정보를 불러오는 중 에러 발생:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorChange = ({ text }) => {
    setFormData((prev) => ({
      ...prev,
      content: text,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (notice) {
      axiosInstance
        .put(`/notices/${notice.id}`, formData)
        .then(() => {
          alert('게시물이 수정되었습니다.');
          window.location.reload(); 
        })
        .catch((error) => {
          console.error('게시물 수정 중 에러 발생:', error);
        });
    } else {
      axiosInstance
        .post(`/notices`, formData)
        .then(() => {
          alert('게시물이 등록되었습니다.');
          window.location.reload(); 
        })
        .catch((error) => {
          console.error('게시물 작성 중 에러 발생:', error);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="notice-form">
      <h2>{notice ? '게시글 수정' : '게시글 작성'}</h2>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="제목"
        required
      />

      <MdEditor
        className='mdeditor'
        value={formData.content}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
        config={{
          view: {
            menu: true,
            md: true,
            html: true,
          },
          canView: {
            menu: true,
            md: true,
            html: true,
            fullScreen: true,
            hideMenu: true,
          },
        }}
      />

      <div className="notice-form-buttons">
        <button className="notice-cancel-button" type="button" onClick={onCancel}>취소</button>
        <button className="notice-button" type="submit">{notice ? '수정' : '등록'}</button>
      </div>
    </form>
  );
};

export default NoticeForm;