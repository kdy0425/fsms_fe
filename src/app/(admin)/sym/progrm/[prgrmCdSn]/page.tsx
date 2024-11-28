'use client'
import PageContainer from '@/app/components/container/PageContainer'
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Row } from '../page'
import { CustomTextField } from '@/utils/fsms/fsm/mui-imports'
import { getCodesByGroupNm } from '@/utils/fsms/common/code/getCode'
import { SelectItem } from 'select'
import { sendHttpRequest } from '@/utils/fsms/common/apiUtils'
import { useRouter } from 'next/navigation'

interface DetailPageProps {
  data: Row
}

const DetailPage = (props: DetailPageProps) => {
  const router = useRouter();
  const { data } = props;
  const [httpMethodItems, setHttpMethodItems] = useState<SelectItem[]>([]);
  const [useYnItems, setUseYnItems] = useState<SelectItem[]>([]);

  const [params, setParams] = useState<Row>({
    prgrmCdSn: "",
    prgrmNm: "",
    urlAddr: "",
    httpDmndMethNm: "",
    useYn: "",
    prhibtRsnCn: "",
    useNm: ""
  });

  useEffect(() => {
    // HTTP요청메소드 코드그룹 세팅
    getCodesByGroupNm('787').then((res) => {
      if(res) {
        let httpMethodCodes: SelectItem[] = [];

        res.map((code: any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm']
          } 

          httpMethodCodes.push(item);
        })

        setHttpMethodItems(httpMethodCodes);
      }
    })

    // 사용여부 코드그룹 세팅
    getCodesByGroupNm('103').then((res) => {
      if(res) {
        let useYnCodes: SelectItem[] = [];

        res.map((code: any) => {
          let item: SelectItem = {
            label: code['cdKornNm'],
            value: code['cdNm']
          } 

          useYnCodes.push(item);
        })
        setUseYnItems(useYnCodes);
      }
    })
    
    if(data) {
      setParams(data);
    }
  }, [])

  // select item 불러온 뒤 초기값 세팅
  useEffect(() => {
    if(httpMethodItems.length > 0) {
      setParams((prev) => ({...prev, httpDmndMethNm: httpMethodItems[0].value}));
    }
    
    if(useYnItems.length > 0) {
      setParams((prev) => ({...prev, useYn: useYnItems[0].value}));
    }
  }, [httpMethodItems, useYnItems])

  const handleParamChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setParams((prev) => ({...prev, [name]: value}));
  }

  const createProgrm = async () => {
    try {
      let endpoint: string = `/fsm/sym/progrm/cm/createProgrm`
      let body = {
        prgrmNm: params.prgrmNm,
        urlAddr: params.urlAddr,
        useYn: params.useYn,
        prhibtRsnCn: params.prhibtRsnCn,
        httpDmndMethNm: params.httpDmndMethNm
      }

      if(!params.prgrmNm || params.prgrmNm == '') {
        alert('프로그램명은 필수값입니다.');
        return;
      }

      if(!params.urlAddr || params.urlAddr == '') {
        alert("URL주소는 필수값입니다.");
        return;
      }

      const userConfirm = confirm("프로그램을 저장하시겠습니까?");

      if(userConfirm) {
        const response = await sendHttpRequest('POST', endpoint, body, true, {
          cache: "no-store",
        })

        if(response && response.resultType === 'success') {
          alert("프로그램이 저장되었습니다.");
          router.push("/sym/progrm");
        }
      }


    }catch(error) {
      console.error('Error creating data:', error)
    }
  }

  return (
    <PageContainer title="프로그램관리 신규" description='프로그램관리 신규'>
      <Box>
        <TableContainer>
          <Table>
            <TableBody>
            <TableRow>
              <TableCell className='table-title-column' style={{minWidth:'300px', width:'25%'}}>
                <span className="required-text">*</span>프로그램명
              </TableCell>
              <TableCell colSpan={3}>
                <CustomTextField name="prgrmNm" value={params.prgrmNm} onChange={handleParamChange} required fullWidth />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className='table-title-column' >
                <span className="required-text" >*</span>URL주소
              </TableCell>
              <TableCell colSpan={3}>
                <CustomTextField name="urlAddr" value={params.urlAddr} onChange={handleParamChange} required fullWidth />
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className='table-title-column'>
                HTTP요청메소드명
              </TableCell>
              <TableCell>
                <select
                  name="httpDmndMethNm"
                  className="custom-default-select"
                  value={params.httpDmndMethNm}
                  onChange={handleParamChange}
                  style={{width:'100%'}}
                >
                  {httpMethodItems.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </TableCell>

              <TableCell className='table-title-column' style={{minWidth:'300px', width:'25%'}}>
                사용여부
              </TableCell>
              <TableCell>
                <select
                  name="useYn"
                  className="custom-default-select"
                  value={params.useYn}
                  onChange={handleParamChange}
                  style={{width:'100%'}}
                >
                   {useYnItems.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className='table-title-column'>
                미사용사유
              </TableCell>
              <TableCell colSpan={3}>
                <CustomTextField name="prhibtRsnCn" value={params.prhibtRsnCn} onChange={handleParamChange} fullWidth />
              </TableCell>
            </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box className="table-bottom-button-group">
          <div className="button-right-align">
            <Button variant="contained" color="primary" onClick={createProgrm}>저장</Button>
            <Button variant="contained" color="primary">취소</Button>
          </div>
        </Box>
      </Box>
    </PageContainer>
  )
}

export default DetailPage;