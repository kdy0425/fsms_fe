'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Logo from '@/fsm/layout/shared/logo/Logo'
import { FormControl } from '@mui/material'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CustomCheckbox from '@/components/forms/theme-elements/CustomCheckbox'
// import { ErrorStatus } from '@/utils/fsms/common/messageUtils'
import {
  useForm,
  useMessageActions,
  FieldConfig,
  CreatePageProps,
} from '@/utils/fsms/fsm/utils-imports'
import {
  PageContainer,
  CustomFormLabel,
  CustomTextField,
  Box,
  Button,
  Grid,
  FormHelperText,
  CustomRadio,
  RadioGroup,
  FormGroup,
  FormControlLabel,
} from '@/utils/fsms/fsm/mui-imports'
import { userSignup } from './actions'
import { CodeObj } from './_types/CodeObjList'

/** 페이지 제목 및 설명 정보 */
const pageInfo = {
  title: '회원가입',
  description: '유가보조금포털시스템 회원가입 화면',
}

/** 유효성 검사대상 Field */
const fieldConfig: FieldConfig[] = [
  {
    name: 'userNm',
    label: '사용자명',
    type: 'text',
    validation: { required: true },
  },
  {
    name: 'lgnId',
    label: '아이디',
    type: 'text',
    validation: { required: true, minLength: 5, maxLength: 20 },
  },
  {
    name: 'pswd',
    label: '비밀번호',
    type: 'password',
    validation: { required: true, pattern: 'password' },
  },
  {
    name: 'bzentyMngrYn',
    label: '업체관리자여부',
    type: 'radio',
    validation: { required: true, minLength: 1, maxLength: 1 },
  },
  {
    name: 'userTypeCds',
    label: '사용자유형',
    type: 'checkbox',
    validation: { required: true },
  },
]

const SignupPage: React.FC<CreatePageProps> = () => {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const { setMessage } = useMessageActions()
  const { errors, isSubmitting, handleSubmit, getInputProps } = useForm(
    fieldConfig,
    formRef,
  )

  const [userTypeCdList, setUserTypeCdList] = useState({ data: [] })

  /* 사용자유형 코드 호출 useEffect() */
  useEffect(() => {
    const getUserTypeCdList = async () => {
      try {
        const response = await fetch('/api/common/code/cds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cdGroupNm: 'user_type_cd',
            upCdNms: 'USR002',
          }),
        })

        const data = await response.json()

        if (data.resultType === 'error') alert(data.message)

        setUserTypeCdList(data)
      } catch (error) {
        console.log(error)
      }
    }

    getUserTypeCdList()
  }, [])

  const onSubmit = async (formData: FormData) => {
    const result = await userSignup(null, formData)
    if (result.error) {
      const statusCode = result.error.status
      // const errorStatus = Object.values(ErrorStatus).find(
      //   (s) => s.status === statusCode,
      // )

      // if (errorStatus) {
      //   setMessage(errorStatus) // 전역 상태로 메시지 설정
      // }
    } else {
      alert('회원가입이 완료되었습니다. 로그인해 주시기 바랍니다.')
      router.push('/user/login')
    }
  }

  return (
    <PageContainer title={pageInfo.title} description={pageInfo.description}>
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: '100vh' }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={5}
            xl={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '450px' }}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>

              {/* Form - 시작 */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <Typography
                  variant="subtitle1"
                  textAlign="center"
                  color="textSecondary"
                  mb={1}
                >
                  사용자 정보를 입력하세요.
                </Typography>

                <Box>
                  {/* 사용자 정보 입력 영역 - 시작 */}
                  <Stack mb={3}>
                    {/* 사용자명(userNm) - 시작 */}
                    <div className="form-group">
                      <CustomFormLabel htmlFor="userNm">
                        사용자명 <span className="required-text">*</span>
                      </CustomFormLabel>
                      <CustomTextField
                        id="userNm"
                        className="mui-custom-textarea required"
                        variant="outlined"
                        fullWidth
                        {...getInputProps(
                          fieldConfig.find((field) => field.name === 'userNm')!,
                        )}
                        helperText={errors.userNm}
                        error={!!errors.userNm}
                      />
                    </div>
                    {/* 사용자명(userNm) - 끝 */}

                    {/* 로그인아이디(lgnId) - 시작 */}
                    <div className="form-group">
                      <CustomFormLabel htmlFor="lgnId">
                        아이디 <span className="required-text">*</span>
                      </CustomFormLabel>
                      <CustomTextField
                        id="lgnId"
                        className="mui-custom-textarea required"
                        variant="outlined"
                        fullWidth
                        {...getInputProps(
                          fieldConfig.find((field) => field.name === 'lgnId')!,
                        )}
                        helperText={errors.lgnId}
                        error={!!errors.lgnId}
                      />
                    </div>
                    {/* 로그인아이디(lgnId) - 끝 */}

                    {/* 비밀번호(pswd) - 시작 */}
                    <div className="form-group">
                      <CustomFormLabel htmlFor="pswd">
                        비밀번호 <span className="required-text">*</span>
                      </CustomFormLabel>
                      <CustomTextField
                        id="pswd"
                        className="mui-custom-textarea required"
                        type="password"
                        variant="outlined"
                        fullWidth
                        {...getInputProps(
                          fieldConfig.find((field) => field.name === 'pswd')!,
                        )}
                        helperText={errors.pswd}
                        error={!!errors.pswd}
                      />
                    </div>
                    {/* 비밀번호(pswd) - 끝 */}

                    {/* 업체관리자여부(bzentyMngrYn) - 시작 */}
                    <div className="form-group">
                      <FormControl component="fieldset">
                        <CustomFormLabel htmlFor="bzentyMngrYn">
                          업체관리자여부{' '}
                          <span className="required-text">*</span>
                        </CustomFormLabel>
                        <RadioGroup
                          row
                          id="bzentyMngrYn"
                          aria-label="bzentyMngrYn"
                          className="mui-custom-radio-group required"
                          {...getInputProps(
                            fieldConfig.find(
                              (field) => field.name === 'bzentyMngrYn',
                            )!,
                          )}
                        >
                          &nbsp;{/* TO-DO:: 추후 디자인 요청 필요 */}
                          <FormControlLabel
                            control={
                              <CustomRadio
                                id="bzentyMngrYn_Y"
                                name="bzentyMngrYn"
                                value="Y"
                              />
                            }
                            label="Y"
                          />
                          <FormControlLabel
                            control={
                              <CustomRadio
                                id="bzentyMngrYn_N"
                                name="bzentyMngrYn"
                                value="N"
                              />
                            }
                            label="N"
                          />
                        </RadioGroup>
                        {errors.bzentyMngrYn && (
                          <FormHelperText error>
                            {errors.bzentyMngrYn}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                    {/* 업체관리자여부(bzentyMngrYn) - 끝 */}

                    {/* 사용자유형(userTypeCds) - 시작 */}
                    <div className="form-group">
                      <FormControl component="fieldset">
                        <CustomFormLabel htmlFor="userTypeCds">
                          사용자유형 <span className="required-text">*</span>
                        </CustomFormLabel>
                        <FormGroup
                          id="userTypeCds"
                          aria-label="userTypeCds"
                          className="mui-custom-checkbox-group required"
                        >
                          {userTypeCdList.data.map((codeObj: CodeObj) => (
                            <FormControlLabel
                              key={codeObj.cdNm}
                              control={
                                <CustomCheckbox
                                  id={`userTypeCds_${codeObj.cdNm}`}
                                  name="userTypeCds"
                                  value={codeObj.cdNm}
                                  onChange={(e) => {
                                    const checkboxes =
                                      formRef.current?.querySelectorAll<HTMLInputElement>(
                                        'input[name="userTypeCds"]:checked',
                                      )
                                    const values = checkboxes
                                      ? Array.from(checkboxes)
                                          .map((cb) => cb.value)
                                          .join(',')
                                      : ''

                                    getInputProps(
                                      fieldConfig.find(
                                        (field) => field.name === 'userTypeCds',
                                      )!,
                                    ).onChange({
                                      target: {
                                        name: 'userTypeCds',
                                        value: values,
                                      },
                                    } as React.ChangeEvent<HTMLInputElement>)
                                  }}
                                />
                              }
                              label={codeObj.cdKornNm}
                            />
                          ))}
                        </FormGroup>
                        {errors.userTypeCds && (
                          <FormHelperText error>
                            {errors.userTypeCds}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                    {/* 사용자유형(userTypeCds) - 끝 */}
                  </Stack>
                  {/* 사용자 정보 입력 영역 - 끝 */}

                  <Stack>
                    <Typography
                      variant="subtitle1"
                      textAlign="center"
                      color="textSecondary"
                      mb={1}
                    >
                      <span className="required-text">*</span> 는 필수입력
                      항목입니다.
                    </Typography>
                  </Stack>

                  <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    type="submit"
                  >
                    회원가입
                  </Button>
                </Box>

                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  mt={3}
                >
                  <Typography
                    component={Link}
                    href="/user/login"
                    fontWeight="500"
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                    }}
                  >
                    로그인 페이지 이동
                  </Typography>
                </Stack>
              </form>
              {/* Form - 끝 */}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  )
}

export default SignupPage
