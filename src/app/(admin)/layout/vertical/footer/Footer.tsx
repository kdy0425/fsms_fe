import * as React from 'react'; 
import Link from "next/link";
import Image from "next/image";
import { Button } from '@mui/material';

const selectData = [
  {
    value: '',
    label: '선택해주세요.',
  },
  {
    value: '1',
    label: '선택1',
  },
  {
    value: '2',
    label: '선택2',
  },
];

const Footer = () => {

   // Select
   const [select, setSelect] = React.useState('');
   const handleChangeSelect = (event: any) => {
     setSelect(event.target.value);
   };

  return (
    <footer id="footer" className="page-footer">
      <div className="page-footer-link">	
        <ul className="page-footer-info">		
          <li><Link href="#" className="textB">개인정보처리방침</Link></li>		
          <li><Link href="#">저작권정책</Link></li>		
          <li><Link href="#">공공데이터 이용정책</Link></li>		
          <li><Link href="#">문서 보기 프로그램 내려받기</Link></li>		
          <li><Link href="#">이용안내</Link></li>		
          <li><Link href="#">자주찾는 질문</Link></li>		
          <li><Link href="#">정부·지자체 조직도</Link></li>	
        </ul>
      </div>
      <div className="page-footer-inner">
        <div className="page-footer-logo">
          <Image
            src="/images/logos/logo_footer.png"
            alt="국토부 로고"
            height={42}
            width={144}
            priority
          />
        </div>
        <div className="page-footer-container">
          <div className="company-info">
            <span className="address">(우)30103 세종특별자치시 도움6로 11 국토교통부 교통서비스정책과</span>
            <span className="tel"><span className="tel-title">민원대표전화 1588-0001(유료)</span>(평일 09시~18시)</span>
          </div>		
          <span className="copyright">COPYRIGHT(C) Ministry of Land. Intrastructure and Transport. ALL RIGHTS RESERVED.</span>
        </div>	
        <div className="page-family-site">		
          <select
            id="ft-fname-select-01"
            className="custom-default-select"
            value={select}
            onChange={handleChangeSelect}
          >
            {selectData.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>		
          <Button variant="contained" color="dark" title="새창으로 열림">관련사이트 이동</Button>
        </div>
      </div>
		</footer>
  );
};

export default Footer;
