'use client'

import React, { useState, useEffect, useRef} from 'react'
import { createMenu } from './actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { listParamObj } from '@/types/fsms/fsm/listParamObj'
import { CodeObj } from '@/app/(no-layout)/(fsm)/user/signup/_types/CodeObjList'
import {
  useForm,
  getAuthInfo,
  AuthInfo,
  toQueryString,
  FieldConfig,
  CreatePageProps,
  useMessageActions,
  getMessage
} from '@/utils/fsms/fsm/utils-imports'
import {
  Breadcrumb,
  PageContainer,
  BlankCard,
  CustomFormLabel,
  CustomTextField,
  Box,
  Button,
  CardContent,
  Divider,
  Grid,
  FormHelperText,
  MenuItem,
  CustomSelect,
  CustomRadio,
  RadioGroup, 
  FormGroup, 
  FormControlLabel,
  Stack,
  Typography
} from '@/utils/fsms/fsm/mui-imports'
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox'

//select
const selectHttpData = [
  { value: 'GET', label: 'GET',},
  { value: 'POST', label: 'POST',},
  { value: 'PUT', label: 'PUT',},
  { value: 'DELETE', label: 'DELETE',},
];

const CreatePage: React.FC<CreatePageProps> = ({ searchParams }) => {
  const querys = useSearchParams(); // 쿼리스트링을 가져옴
  const router = useRouter()
  const allParams:listParamObj = Object.fromEntries(querys.entries()) // 쿼리스트링 값을 오브젝트 형식으로 담음
  const { setMessage } = useMessageActions();
  const formRef = useRef<HTMLFormElement>(null);
  const [authInfo, setAuthInfo] = useState<AuthInfo>()

  //로그인한 사람 정보 가져오기
  useEffect(() => {
    async function loadFuntion() {
      setAuthInfo(await getAuthInfo())
    }
    loadFuntion()
  }, [])

  //select
  const [selectHttp, setSelectHttpData] = useState<string>(selectHttpData[0].value);
  const selectHttpChange = (event: any) => {setSelectHttpData(event.target.value)}

  /* 메뉴유형 코드, 접근권한 코드, 사용자 유형 호출 useEffect() */
  const [menuTypeCodeList, setMenuTypeCodeList] = useState({ data: [] });
  const [menuAcsAuthrtCodeList, setMenuAcsAuthrtCodeList] = useState({ data: [] });
  const [userTypeCodeList, setUserTypeCodeList] = useState<{ data: CodeObj[] }>({ data: [] });
  const [menuTypeCd, setMenuTypeCd] = useState('');
  const [menuAcsAuthrtCd, setMenuAcsAuthrtCd] = useState('');
  const [selectedUserTypes, setSelectedUserTypes] = useState<string[]>([]);

  const fieldConfig: FieldConfig[] = [
    { name: 'menuNm', label: '메뉴명', type: 'text', validation: { required: true, minLength: 3, maxLength: 200}},
    { name: 'urlAddr', label: 'URL주소', type: 'text', validation: { required: true, min: 1, max: 2000 }},
    { name: 'menuSeq', label: '메뉴순서', type: 'number', validation: { required: true, min: 1 }},
    { name: 'menuTypeCd', label: '메뉴유형', type: 'select', validation: { required: true }},
    { name: 'httpDmndMethNm', label: 'HTTP요청메소드명', type: 'select', validation: { required: true }},
    { name: 'menuAcsAuthrtCd', label: '메뉴접근권한코드', type: 'select', validation: { required: true }},
    { name: 'npagYn', label: '새창여부', type: 'select', validation: { required: true }},
    { name: 'menuGroupCd', label: '메뉴그룹코드', type: 'text', validation: { required: true }},
  ];
  const { errors, isSubmitting, handleSubmit, getInputProps} = useForm(fieldConfig, formRef);
  const [duplicationError, setDuplicationError] = useState<string | null>(null);

  useEffect(() => {
    const cdGroupNms = ['menu_type_cd', 'menu_acs_authrt_cd', 'user_type_cd'];
    const getCodeObjLists = async () => {
      try {
        const results = await Promise.all(cdGroupNms.map(async (cdGroupNm) => {
          const response = await fetch('/api/common/code/cds', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cdGroupNm: cdGroupNm,
              upCdNms: cdGroupNm === 'user_type_cd' ? 'USR002' : '',
            }),
          });
          return await response.json();
        }));
        
      results.forEach((data, index) => {
        if (data.resultType === 'error') {
          alert(`Error for ${cdGroupNms[index]}: ${data.message}`);
        } else {
          switch(cdGroupNms[index]) {
            case 'menu_type_cd':
              setMenuTypeCodeList(data);
              if (data.data.length > 0) {
                setMenuTypeCd(data.data[0].cdNm);
              }
              break;
            case 'menu_acs_authrt_cd':
              setMenuAcsAuthrtCodeList(data);
              if (data.data.length > 0) {
                setMenuAcsAuthrtCd(data.data[0].cdNm);
              }
              break;
              case 'user_type_cd':
              setUserTypeCodeList(data);
              if (data.data.length > 0) {
                setSelectedUserTypes([]);
              }
              break;
            }
        }
      });
    } catch (error) {
      console.error('Error fetching code lists:', error);
    }
  };
    getCodeObjLists();
  }, []);

  const handleMenuTypeCdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMenuTypeCd(event.target.value);
  };
  const handleAcsAuthrtCdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMenuAcsAuthrtCd(event.target.value);
    if (event.target.value !== 'MAA001') {
      setSelectedUserTypes([]);
    }
  };

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedUserTypes((prev) => {
      const updatedUserTypes = checked
        ? [...prev, value]
        : prev.filter((type) => type !== value);
      return updatedUserTypes;
    });
  };

  let userTypeContent = null;
  if (menuAcsAuthrtCd === 'MAA001') {
    userTypeContent = (
      <CardContent>
        <Grid container spacing={3}>
        <Grid item xs={12} sm={3} display="flex" alignItems="center">
            <CustomFormLabel
              htmlFor="userTypeCd"
              sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
            >
              사용자 유형 <span className="required-text">*</span>
            </CustomFormLabel>
          </Grid>
          <Grid item xs={12} sm={9}>
          <FormGroup>
            {userTypeCodeList.data.map((codeObj: CodeObj) => (
                <FormControlLabel
                  key={codeObj.cdNm}
                  control={
                    <CustomCheckbox
                      name="userTypeCds"
                      value={codeObj.cdNm}
                      checked={selectedUserTypes.includes(codeObj.cdNm)}
                      onChange={handleUserTypeChange}
                    />
                  }
                  label={codeObj.cdKornNm}
                />
              ))}
          </FormGroup>
          <FormHelperText error>{errors.userTypeCds}</FormHelperText>
          </Grid>
        </Grid>
      </CardContent>
    );
  }

  // 취소 버튼 이벤트 핸들러
  function handleCancleClick() {
    if (searchParams) {
      const qString = toQueryString(searchParams)
      router.push(`/sample/admin/menu/sublist?cdNm=${qString}`)
    }
  }

  const onSubmit = async (formData: FormData) => {
    if (menuAcsAuthrtCd === 'MAA001' && selectedUserTypes.length === 0) {
      setMessage(getMessage('사용자 유형을 한 개 이상 선택해야 합니다.'));
      return;
    }
    setDuplicationError(null);
    const result = await createMenu(null, formData);
    if (result.error) {
      const statusCode = result.error.status;
      //const errorStatus = Object.values(ErrorStatus).find(s => s.status === statusCode)
      const errorMessage = result.error.message || '메뉴 생성 중 오류가 발생했습니다.';
      if (errorMessage.includes('데이터 충돌이 발생했습니다.')) {
        setDuplicationError('Y')
        setMessage(getMessage('입력한 HTTP 요청 메소드명과 URL 주소가 이미 존재합니다.'))
      }
  }  else if(result.success) {
      setMessage(getMessage('create.success'));
      router.push(`/sample/admin/menu/sublist?cdNm=${allParams.cdNm}&cdKornNm=${allParams.cdKornNm}`);
    }
  };

  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: `${allParams.cdKornNm} 쓰기`,
    },
  ];

  return (
    
    <PageContainer title={`${allParams.cdKornNm} 쓰기`} description={`${allParams.cdKornNm} 쓰기`}>
      <Breadcrumb title={`${allParams.cdKornNm} 쓰기`} items={BCrumb} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <BlankCard>
        <CardContent>
            <Grid container spacing={3}>
            <Grid item xs={12} sm={3} display="flex" alignItems="center">
                <CustomFormLabel
                  htmlFor="menuNm"
                  sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
                >
                  메뉴명 <span className="required-text">*</span>
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={9}>
                <CustomTextField
                  id="menuNm"
                  variant="outlined"
                  fullWidth
                  helperText={errors.menuNm}
                  error={!!errors.menuNm}
                  {...getInputProps(
                    fieldConfig.find((field) => field.name === 'menuNm')!,
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
        <CardContent>
            <Grid container spacing={3}>
            <Grid item xs={12} sm={3} display="flex" alignItems="center">
                <CustomFormLabel
                  htmlFor="urlAddr"
                  sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
                >
                  URL주소 <span className="required-text">*</span>
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={9}>
                <CustomTextField
                  id="urlAddr"
                  variant="outlined"
                  fullWidth
                  helperText={errors.urlAddr}
                  error={!!errors.urlAddr || !!duplicationError}
                  {...getInputProps(
                    fieldConfig.find((field) => field.name === 'urlAddr')!,
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3} display="flex" alignItems="center">
                <CustomFormLabel
                  htmlFor="menuTypeCd"
                  sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
                >
                  메뉴유형 <span className="required-text">*</span>
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={5}>
              <CustomSelect
                  id="menuTypeCd"
                  type="select"
                  {...getInputProps(
                    fieldConfig.find((field) => field.name === 'menuTypeCd')!,
                  )}
                  value={menuTypeCd}
                  variant="outlined"
                  fullWidth
                  error={!!errors.menuTypeCd}
                  onChange={handleMenuTypeCdChange}
                >
                  {menuTypeCodeList.data.map((codeObj: CodeObj) => (
                    <MenuItem key={codeObj.cdNm} value={codeObj.cdNm}>
                      {codeObj.cdKornNm}
                    </MenuItem>
                  ))}
                </CustomSelect>
                <FormHelperText error>{errors.menuTypeCd}</FormHelperText>
            </Grid>
              <Grid item xs={12} sm={1} display="flex" alignItems="center">
                <CustomFormLabel
                  htmlFor="menuSeq"
                  sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
                >
                  메뉴순서 <span className="required-text">*</span>
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  id="menuSeq"
                  type="number"
                  variant="outlined"
                  fullWidth
                  helperText={errors.menuSeq}
                  error={!!errors.menuSeq}
                  {...getInputProps(
                    fieldConfig.find((field) => field.name === 'menuSeq')!,
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardContent>
          <Grid container spacing={3}>
              <Grid item xs={12} sm={3} display="flex" alignItems="center">
                <CustomFormLabel
                  htmlFor="ft-selectHttp"
                  sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
                >
                  HTTP요청메소드명 <span className="required-text">*</span>
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={5}>
                <CustomSelect
                  id="ft-selectHttp"
                  type="select"
                  {...getInputProps(
                    fieldConfig.find((field) => field.name === 'httpDmndMethNm')!,
                    selectHttpChange
                  )}
                  value={selectHttp}
                  variant="outlined"
                  fullWidth
                  error={!!errors.httpDmndMethNm || !!duplicationError}
                >
                  {selectHttpData.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </CustomSelect>
                  <FormHelperText error>{errors.httpDmndMethNm}</FormHelperText>
              </Grid>
               <Grid item xs={12} sm={1} display="flex" alignItems="center">
                <CustomFormLabel
                  htmlFor="menuAcsAuthrtCd"
                  sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
                >
                  메뉴접근<br></br>권한코드 <span className="required-text">*</span>
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={3}>
              <CustomSelect
                id="menuAcsAuthrtCd"
                 type="select"
                 value={menuAcsAuthrtCd}
                {...getInputProps(
                  fieldConfig.find((field) => field.name === 'menuAcsAuthrtCd')!,
                )}
                name="menuAcsAuthrtCd"
                error={!!errors.menuAcsAuthrtCd}
                onChange={handleAcsAuthrtCdChange}
              >
                {menuAcsAuthrtCodeList.data.map((codeObj: CodeObj) => (
                    <MenuItem key={codeObj.cdNm} value={codeObj.cdNm}>
                      {codeObj.cdKornNm}
                    </MenuItem>
                  ))}
              </CustomSelect>
                <FormHelperText error>{errors.menuAcsAuthrtCd}</FormHelperText>
              </Grid> 
            </Grid>
          </CardContent>
          <Divider />
          <div>{userTypeContent}</div>
          <CardContent>
            <Grid container spacing={3}>
            <Grid item xs={12} sm={3} display="flex" alignItems="center">
                <CustomFormLabel
                  htmlFor="menuExpln"
                  sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
                >
                  메뉴설명
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={9}>
                <CustomTextField
                  id="menuExpln"
                  variant="outlined"
                  fullWidth
                  name ="menuExpln"
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3} display="flex" alignItems="center">
                <CustomFormLabel
                  htmlFor="npagYn"
                  sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
                >
                  새창여부 <span className="required-text">*</span>
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={5}>
              <FormGroup>
              <RadioGroup
                row
                id="npagYn"
                {...getInputProps(
                  fieldConfig.find((field) => field.name === 'npagYn')!,
                )}
              >
                <FormControlLabel
                  control={
                    <CustomRadio
                      id="npagYn_Y"
                      name="npagYn"
                      value="Y"
                    />
                  }
                  label="네"
                />
                <FormControlLabel
                  control={
                    <CustomRadio
                      id="npagYn_N"
                      name="npagYn"
                      value="N"
                    />
                  }
                  label="아니오"
                />
              </RadioGroup>
            </FormGroup>
            {errors.npagYn && <FormHelperText error>{errors.npagYn}</FormHelperText>}
            </Grid>
            </Grid>
                <input hidden id='menuGroupCd' name='menuGroupCd' value={allParams.cdNm}></input>
          </CardContent>
          <Divider />
        </BlankCard>
        <Stack>
            <Typography variant="subtitle1" textAlign="left" color="textSecondary" mb={1}>
              <span className="required-text">*</span> 는 필수입력 항목입니다.
            </Typography>
          </Stack>
          <Box className="table-bottom-button-group">
          <div className="button-right-align">
            <Button variant="contained" color="primary" disabled={isSubmitting} type="submit">
              저장
            </Button>
            <Button variant="contained" color="dark" disabled={isSubmitting} onClick={handleCancleClick}>
              취소
            </Button>
          </div>
          </Box>
      </form>
    </PageContainer>
  );
};

export default CreatePage