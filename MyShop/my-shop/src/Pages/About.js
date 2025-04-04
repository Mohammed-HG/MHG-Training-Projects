import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 175vh;
  background: linear-gradient(120deg, #2c3e50, #34495e);
  padding: 20px;
  font-family: 'Roboto', sans-serif;
`;

const AboutBox = styled.div`
  background: #1c2833;
  padding: 50px 200px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 1080px;
  animation: fadeIn 1s ease-in-out;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #ecf0f1;
`;

const Subtitle = styled.h3`
  text-align: center;
  margin-bottom: 15px;
  color: #95a5a6;
`;

const Paragraph = styled.p`
  text-align: center;
  margin-bottom: 5px; /* Reduced margin to keep paragraphs closer */
  color: #bdc3c7;
  line-height: 2.6;
`;

const List = styled.ul`
  text-align: center;
  margin-bottom: 20px;
  color: #bdc3c7;
  line-height: 1.6;
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
  padding-left: 1.2em;
  text-indent: -1.2em;
  &:before {
    content: "•";
    color: #95a5a6;
    padding-right: 10px;
  }
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: #95a5a6;
  margin: 40px 0; /* Adds space around the divider */
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #ecf0f1;
  font-size: 1.5rem;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    color: #8e44ad;
  }

  &:focus {
    outline: none;
  }
`;

const About = () => {
  const navigate = useNavigate();

  return (
    <Container dir='rtl'>
      <BackButton onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </BackButton>
      <AboutBox>
        <Title>متجر لعرض منتجات الاسر المنتجة</Title>
        
        <Paragraph>مرحبًا بكم في متر الأسر المنتجة، هنا يتم عرض جميع الاصناف المقدمه من عمل الأسر في مكان واحد.</Paragraph>
        <Divider/>

        <Subtitle>مميزات مشروع الأسر المنتجة:</Subtitle>
        <List>
          <ListItem>تشجيع الاقتصاد المحلي: يساهم المشروع في تعزيز الاقتصاد المحلي من خلال دعم المنتجات المصنوعة محليًا.يوفر فرص عمل للأسر في المجتمع، مما يسهم في تقليل معدلات البطالة.</ListItem>
          <ListItem> تمكين الأسر: يمنح المشروع الأسر فرصة لاستخدام مهاراتهم ومواهبهم في تحقيق دخل إضافي.يعزز من الثقة بالنفس والاستقلالية المالية لدى أفراد الأسرة.</ListItem>
          <ListItem>تنوع المنتجات: يتيح المشروع فرصة لتقديم مجموعة متنوعة من المنتجات التي تلبي احتياجات ورغبات المستهلكين.يمكن أن تشمل المنتجات المشغولات اليدوية، الأطعمة التقليدية، الملابس، وغيرها الكثير</ListItem>
          <ListItem>الحفاظ على التراث الثقافي: يعزز المشروع من الحفاظ على الحرف اليدوية والتقاليد الثقافية من خلال تشجيع إنتاج المنتجات التقليدية.يساهم في تعزيز الهوية الثقافية وتعليم الأجيال القادمة عن التراث.</ListItem>
          <ListItem>الاستدامة البيئية: يشجع المشروع على استخدام المواد الخام المحلية والمتجددة في الإنتاج.يساهم في تقليل البصمة الكربونية من خلال تقليل الحاجة إلى نقل المنتجات من أماكن بعيدة.</ListItem>
          <ListItem>تعزيز الروابط الاجتماعية: يسهم المشروع في تعزيز الروابط الاجتماعية بين أفراد المجتمع من خلال التعاون والعمل الجماعي.يمكن أن يوفر فرصًا للتعليم والتدريب والتبادل الثقافي بين الأسر.</ListItem>
          <ListItem>جودة المنتجات: تقديم منتجات ذات جودة عالية وفريدة من نوعها يمكن أن يميز المشروع عن المنتجات التجارية الأخرى.التركيز على التفاصيل والدقة في العمل يعزز من ثقة المستهلكين في المنتجات.
</ListItem>
        </List>

        <Divider/>

        <Paragraph>Mohammed Alghareeb (MHG)</Paragraph> 
        <Paragraph>الرقم التدريبي: 443236035</Paragraph> 
        <Paragraph> 443236035@tvtc.edu.sa</Paragraph>

      </AboutBox>

      <Divider/>
      <Subtitle>Copyright / حقوق الطبع والنشر</Subtitle>
        <Paragraph>
          © 2025 All rights reserved. (MHG) متجر الاسر المنتجة. جميع الحقوق محفوظة
        </Paragraph>
    </Container>
  );
};

export default About;