'use client'

// API
import React, { useState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
// Custom API
import {
  useForm,
  getAuthInfo,
  toQueryString,
  useMessageActions,
  getMessage,
  sendFormDataWithJwt,
  FieldConfig,
  CreatePageProps,
  AuthInfo,
} from '@/utils/fsms/fsm/utils-imports'
// MUI
import {
  dropzoneText,
  previewText,
  filesLimit,
  maxFileSize,
  showAlerts,
  getDropRejectMessage,
  getFileLimitExceedMessage,
  getFileRemovedMessage,
  acceptedFileTypes,
  acceptedFileExtensions,
  DropzoneArea,
  Breadcrumb,
  PageContainer,
  BlankCard,
  ContentsExplanation,
  ContentsExplanationText,
  CustomFormLabel,
  CustomTextField,
  Box,
  Button,
  CardContent,
  Typography,
  Divider,
  Grid,
} from '@/utils/fsms/fsm/mui-imports'
import { ApiResponse, ApiError, getCombinedErrorMessage } from '@/types/message'

// 페이지의 제목,설명 등의 정보
const pageInfo = {
  title: `Post 등록`,
  description: `Post 등록 화면`,
  messageType: `create`,
}

// 제목 밑에 메뉴 구조 표시
const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: pageInfo.title,
  },
]

//유효성 검사할 field
const fieldConfig: FieldConfig[] = [
  {
    name: 'ttl',
    label: '제목',
    type: 'text',
    validation: { required: true, minLength: 3, maxLength: 200 },
  },
  {
    name: 'cn',
    label: '내용',
    type: 'textarea',
    validation: { required: true, minLength: 1, maxLength: 4000 },
  },
]

type CustomFileObject = {
  file: File // 파일 객체
  fileClsfNm: string // 첨부파일의 그룹 분류
}

const CreatePage = ({ searchParams }: CreatePageProps) => {
  const router = useRouter()
  // 공통 Validation 및 Messaging 처리를 위한 커스텀 Hooks 선언 시작
  const formRef = useRef<HTMLFormElement>(null)
  const { errors, isSubmitting, handleSubmit, getInputProps } = useForm(
    fieldConfig,
    formRef,
  )
  const [authInfo, setAuthInfo] = useState<AuthInfo>()
  // 첨부파일 관리를 위한 state 선언 시작
  const seenFilesA = useRef<Set<string>>(new Set()) // 첨부파일A 중복 체크를 위한 외부 상태 변수
  const seenFilesB = useRef<Set<string>>(new Set()) // 첨부파일B 중복 체크를 위한 외부 상태 변수
  const [fileObjectsA, setFileObjectsA] = useState<File[]>([]) // 파일분류이름 A의 파일 객체 배열 상태
  const [fileObjectsB, setFileObjectsB] = useState<File[]>([]) // 파일분류이름 B의 파일 객체 배열 상태
  // 첨부파일 관리를 위한 state 선언 끝
  const { pending } = useFormStatus()
  const { setMessage } = useMessageActions()

  useEffect(() => {
    async function loadFuntion() {
      setAuthInfo(await getAuthInfo())
    }
    loadFuntion()
  }, [])

  // 파일 변경 이벤트 핸들러
  const handleFilesChange = (newFiles: File[], fileClsfNm: string) => {
    if (fileClsfNm === 'A') {
      setFileObjectsA(newFiles)
    } else if (fileClsfNm === 'B') {
      setFileObjectsB(newFiles)
    }
  }

  // 중복 파일을 필터링하는 함수
  // 파일 객체 배열과 useRef로 생성한 Set<string>을 매개변수로 받음
  const filterDuplicateFiles = (
    files: File[],
    seenFiles: React.MutableRefObject<Set<string>>,
  ): File[] => {
    // 파일의 고유성을 파일 이름과 크기로 식별
    return files.filter((file: File): boolean => {
      const identifier: string = `${file.name}-${file.size}`
      if (seenFiles.current.has(identifier)) {
        return false
      } else {
        seenFiles.current.add(identifier)
        return true
      }
    })
  }

  // 임시저장 이벤트 핸들러
  const onTempSaveSubmit = async (formData: FormData) => {
    // 진행 중 메시지 출력 시작
    if (!pending) {
      const inProgressMessage = getMessage(`${pageInfo.messageType}.inProgress`)
      setMessage(inProgressMessage)
    }
    // 진행 중 메시지 출력 종료

    if (formRef.current) {
      const endpoint = `/sample/posts`
      // FormData 데이터 추가 시작
      formData.append('telgmLen', '10')
      // 중복 필터링
      const uniqueFilesA: File[] = filterDuplicateFiles(
        fileObjectsA,
        seenFilesA,
      )
      const uniqueFilesB: File[] = filterDuplicateFiles(
        fileObjectsB,
        seenFilesB,
      )
      // 파일 배열 합치기
      // 파일을 그룹화하기 위해 하나의 배열로 합쳐서 인덱스 번호를 공유하게 한다.
      const allFiles: CustomFileObject[] = [
        // map 메서드로 각 파일을 객체로 변환하고, 해당 객체에 파일과 파일분류이름을 포함한다.
        // 스프레드 연산자(...)를 사용하여 두 배열을 합친다.
        ...uniqueFilesA.map((file: File) => ({ file, fileClsfNm: 'A' })),
        ...uniqueFilesB.map((file: File) => ({ file, fileClsfNm: 'B' })),
      ]

      // 파일 추가
      // formData는 File[] 타입의 배열을 추가할 수 없고 stirng, Blob(File 등) 타입의 값을 기대한다.
      // 따라서 File[]을 동일한 key 값의 File 객체로 처리해야 한다.
      allFiles.forEach(({ file, fileClsfNm }, index) => {
        formData.append(`fileReqstDtos[${index}].fileClsfNm`, fileClsfNm)
        formData.append(`fileReqstDtos[${index}].files`, file)
      })
      // FormData 데이터 추가 끝

      try {
        // Post 임시저장 시작
        const postResponseData: ApiResponse = await sendFormDataWithJwt(
          'POST',
          endpoint,
          formData,
          true,
        )
        setMessage({
          resultType: postResponseData.resultType,
          status: postResponseData.status,
          message: postResponseData.message,
        })
        router.push(`/sample/post/view/${postResponseData.data.postTsid}`)
        // Post 임시저장 끝
      } catch (error) {
        if (error instanceof ApiError) {
          switch (error.resultType) {
            case 'fail':
              //유효성검사 오류
              setMessage({
                resultType: 'error',
                status: error.status,
                message: getCombinedErrorMessage(error),
              })
              break
            case 'error':
              // 'error'는 서버 측 오류
              setMessage({
                resultType: 'error',
                status: error.status,
                message: error.message,
              })
              break
          }
        }
      }
    } else {
      const errorMessage = getMessage(`${pageInfo.messageType}.error`)
      setMessage(errorMessage)
    }
  }

  // 제출 이벤트 핸들러
  const onSubmitSubmit = async (formData: FormData) => {
    // 진행 중 메시지 출력 시작
    if (!pending) {
      const inProgressMessage = getMessage(`${pageInfo.messageType}.inProgress`)
      setMessage(inProgressMessage)
    }
    // 진행 중 메시지 출력 종료

    if (formRef.current) {
      const endpoint = `/sample/posts/submit`
      // FormData 데이터 추가 시작
      formData.append('telgmLen', '10')
      // 중복 필터링
      const uniqueFilesA: File[] = filterDuplicateFiles(
        fileObjectsA,
        seenFilesA,
      )
      const uniqueFilesB: File[] = filterDuplicateFiles(
        fileObjectsB,
        seenFilesB,
      )
      // 파일 배열 합치기
      // 파일을 그룹화하기 위해 하나의 배열로 합쳐서 인덱스 번호를 공유하게 한다.
      const allFiles = [
        // map 메서드로 각 파일을 객체로 변환하고, 해당 객체에 파일과 파일분류이름을 포함한다.
        // 스프레드 연산자(...)를 사용하여 두 배열을 합친다.
        ...uniqueFilesA.map((file) => ({ file, fileClsfNm: 'A' })),
        ...uniqueFilesB.map((file) => ({ file, fileClsfNm: 'B' })),
      ]
      // 파일 추가
      // formData는 File[] 타입의 배열을 추가할 수 없고 stirng, Blob(File 등) 타입의 값을 기대한다.
      // 따라서 File[]을 동일한 key 값의 File 객체로 처리해야 한다.
      allFiles.forEach(({ file, fileClsfNm }, index) => {
        formData.append(`fileReqstDtos[${index}].fileClsfNm`, fileClsfNm)
        formData.append(`fileReqstDtos[${index}].files`, file)
      })
      // FormData 데이터 추가 끝

      try {
        // Post 제출 시작
        const postResponseData = await sendFormDataWithJwt(
          'POST',
          endpoint,
          formData,
          true,
        )
        setMessage({
          resultType: postResponseData.resultType,
          status: postResponseData.status,
          message: postResponseData.message,
        })
        router.push(`/sample/post/view/${postResponseData.data.postTsid}`)
        // Post 제출 끝
      } catch (error) {
        if (error instanceof ApiError) {
          switch (error.resultType) {
            case 'fail':
              //유효성검사 오류
              setMessage({
                resultType: 'error',
                status: error.status,
                message: getCombinedErrorMessage(error),
              })
              break
            case 'error':
              // 'error'는 서버 측 오류
              setMessage({
                resultType: 'error',
                status: error.status,
                message: error.message,
              })
              break
          }
        }
      }
    } else {
      const errorMessage = getMessage(`${pageInfo.messageType}.error`)
      setMessage(errorMessage)
    }
  }

  // 취소 버튼 이벤트 핸들러
  const handleCancleClick = () => {
    // searchParams가 undefined일 가능성이 있으므로 if문을 사용하여 타입 가드

    if (searchParams) {
      const qString = toQueryString(searchParams)
      router.push(`/sample/post/list${qString}`)
    }
  }

  // form의 submit 이벤트를 담당하는 이벤트 핸들러
  // event의 nativeEvent가 가진 각 button의 name 속성으로 실행할 이벤트 핸들러를 구분한다.
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement

    if (submitter.name === 'tempSave') {
      handleSubmit(onTempSaveSubmit)(e)
    } else if (submitter.name === 'finalSubmit') {
      handleSubmit(onSubmitSubmit)(e)
    }
  }

  return (
    <PageContainer title={pageInfo.title} description={pageInfo.description}>
      {/* breadcrumb */}
      <Breadcrumb title={pageInfo.title} items={BCrumb} />
      {/* end breadcrumb */}

      {/* form 시작 */}
      <form ref={formRef} onSubmit={handleFormSubmit}>
        <BlankCard>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3} display="flex" alignItems="center">
                <CustomFormLabel
                  htmlFor="ttl"
                  sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
                >
                  제목 <span className="required-text">*</span>
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={9}>
                <CustomTextField
                  id="ttl"
                  className="required"
                  variant="outlined"
                  fullWidth
                  helperText={errors.ttl}
                  error={!!errors.ttl}
                  {...getInputProps(
                    fieldConfig.find((field) => field.name === 'ttl')!,
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
                  htmlFor="cn"
                  id="cn-label"
                  sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
                >
                  내용 <span className="required-text">*</span>
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={9}>
                <CustomTextField
                  id="cn"
                  className="required"
                  multiline
                  rows={4}
                  variant="outlined"
                  {...getInputProps(
                    fieldConfig.find((field) => field.name === 'cn')!,
                  )}
                  fullWidth
                  helperText={errors.cn}
                  error={!!errors.cn}
                  inputProps={{
                    'aria-labelledby': 'cn-label',
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>

          <Divider />

          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3} display="flex" alignItems="center">
                <CustomFormLabel
                  htmlFor="fileA"
                  sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
                >
                  첨부파일 A
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={9}>
                <DropzoneArea
                  dropzoneText={dropzoneText} // 드롭존에 표시할 텍스트 설정
                  acceptedFiles={acceptedFileTypes} // 허용할 파일 확장자 설정
                  filesLimit={filesLimit} // 파일 개수 제한 설정
                  maxFileSize={maxFileSize} // 최대 파일 크기 설정
                  getDropRejectMessage={getDropRejectMessage} // 파일이 거부되었을 때 메시지 설정
                  getFileLimitExceedMessage={getFileLimitExceedMessage} // 파일 개수 제한에 걸렸을 때 메시지
                  getFileRemovedMessage={getFileRemovedMessage} // 파일을 삭제했을 때 메시지
                  showPreviewsInDropzone={true} // 미리보기 표시(드롭존 내부)
                  showFileNames={true} // 파일 이름 표시(드롭존 내부)
                  previewText={previewText} // 미리보기 영역에 표시할 텍스트 설정
                  showAlerts={showAlerts} // 알림 메시지를 출력할 범위 설정
                  fileObjects={fileObjectsA}
                  onChange={(fileObjects) =>
                    handleFilesChange(fileObjects, 'A')
                  }
                />
                <p>허용되는 파일 형식: {acceptedFileExtensions.join(', ')}</p>
              </Grid>
            </Grid>
          </CardContent>

          <Divider />

          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3} display="flex" alignItems="center">
                <CustomFormLabel
                  htmlFor="fileB"
                  sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
                >
                  첨부파일 B
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={9}>
                <DropzoneArea
                  dropzoneText={dropzoneText} // 드롭존에 표시할 텍스트 설정
                  acceptedFiles={acceptedFileTypes} // 허용할 파일 확장자 설정
                  filesLimit={filesLimit} // 파일 개수 제한 설정
                  maxFileSize={maxFileSize} // 최대 파일 크기 설정
                  getDropRejectMessage={getDropRejectMessage} // 파일이 거부되었을 때 메시지 설정
                  getFileLimitExceedMessage={getFileLimitExceedMessage} // 파일 개수 제한에 걸렸을 때 메시지
                  getFileRemovedMessage={getFileRemovedMessage} // 파일을 삭제했을 때 메시지
                  showPreviewsInDropzone={true} // 미리보기 표시(드롭존 내부)
                  showFileNames={true} // 파일 이름 표시(드롭존 내부)
                  previewText={previewText} // 미리보기 영역에 표시할 텍스트 설정
                  showAlerts={showAlerts} // 알림 메시지를 출력할 범위 설정
                  fileObjects={fileObjectsB}
                  onChange={(fileObjects) =>
                    handleFilesChange(fileObjects, 'B')
                  }
                />
                <p>허용되는 파일 형식: {acceptedFileExtensions.join(', ')}</p>
              </Grid>
            </Grid>
          </CardContent>

          <Divider />

          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3} display="flex" alignItems="center">
                <CustomFormLabel
                  htmlFor="author"
                  sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
                >
                  작성자
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={9}>
                <Typography id="author" variant="subtitle1" fontWeight={600}>
                  {authInfo?.isLoggedIn && authInfo.authSttus?.userNm}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </BlankCard>
        {/* 컨텐츠 설명 시작*/}
        <ContentsExplanation
          textEx={ContentsExplanationText}
          className="required-text"
        />
        {/* 컨텐츠 설명 끝*/}
        {/* 등록, 취소 버튼 시작 */}
        <Box className="table-bottom-button-group">
          <div className="button-right-align">
            {/* 임시저장 버튼 시작 */}
            <Button
              variant="contained"
              color="dark"
              disabled={isSubmitting}
              type="submit"
              name="tempSave"
            >
              {isSubmitting ? '진행중...' : '임시저장'}
            </Button>
            {/* 임시저장 버튼 끝 */}
            {/* 제출 버튼 시작 */}
            <Button
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              type="submit"
              name="finalSubmit"
            >
              {isSubmitting ? '진행중...' : '제출'}
            </Button>
            {/* 제출 버튼 끝 */}
            {/* 취소 버튼 시작 */}
            <Button
              variant="contained"
              color="dark"
              disabled={isSubmitting}
              type="button"
              onClick={handleCancleClick}
            >
              {isSubmitting ? '진행중...' : '취소'}
            </Button>
            {/* 취소 버튼 끝 */}
          </div>
        </Box>
        {/* 등록, 취소 버튼 끝 */}
      </form>
      {/* form 끝 */}
    </PageContainer>
  )
}

export default CreatePage
