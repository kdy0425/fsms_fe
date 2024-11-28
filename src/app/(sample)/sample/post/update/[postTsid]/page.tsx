'use client'

// Built-in API
import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// Custom API
import {
  useForm,
  toQueryString,
  useMessageActions,
  getMessage,
  sendHttpRequest,
  sendFormDataWithJwt,
  FieldConfig,
  UpdatePageProps,
  PostData,
  FetchOneData,
  FileInfo,
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
  ContentsExplanationRejectText,
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
  title: `Post 수정`,
  description: `Post 수정 화면`,
  messageType: `update`,
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

const UpdatePage = ({ params, searchParams }: UpdatePageProps) => {
  const router = useRouter()
  // 공통 Validation 및 Messaging 처리를 위한 커스텀 Hooks 선언 시작
  const formRef = useRef<HTMLFormElement>(null)
  const { errors, isSubmitting, handleSubmit, getInputProps } = useForm(
    fieldConfig,
    formRef,
  )
  const { setMessage } = useMessageActions()
  // 공통 Validation 및 Messaging 처리를 위한 커스텀 Hooks 선언 끝
  // 게시글과 첨부파일을 포함한 데이터 state
  const [data, setData] = useState<PostData | undefined>(undefined)
  // 첨부파일 관리를 위한 state 선언 시작
  const seenFilesA = useRef<Set<string>>(new Set()) // 첨부파일A 중복 체크를 위한 외부 상태 변수
  const seenFilesB = useRef<Set<string>>(new Set()) // 첨부파일B 중복 체크를 위한 외부 상태 변수
  const [fileObjectsA, setFileObjectsA] = useState<File[]>([]) // 새로 추가될 첨부파일 A의 파일 객체 배열
  const [fileObjectsB, setFileObjectsB] = useState<File[]>([]) // 새로 추가될 첨부파일 B의 파일 객체 배열
  const [backupFilesA, setBackupFilesA] = useState<FileInfo[]>([]) // 서버에 저장된 첨부파일A의 파일 목록
  const [backupFilesB, setBackupFilesB] = useState<FileInfo[]>([]) // 서버에 저장된 첨부파일B의 파일 목록
  const [deletedFileList, setDeletedFileList] = useState<string[]>([]) // 사용자가 삭제한 파일의 Tsid(서버에 저장된 파일만 Tsid 존재)
  // 첨부파일 관리를 위한 state 선언 끝
  const [isLoading, setIsLoading] = useState<boolean>(true) // 데이터 로딩 상태 식별을 위한 state

  const qString: string = toQueryString(searchParams ?? {}) // 목록 화면에서 넘어오는 Query parameters

  useEffect(() => {
    // 수정 페이지에 접속했을 때 필요한 데이터 가져오기
    async function loadInitalData() {
      if (params && !!params.postTsid) {
        try {
          // 기존 Post Data 불러오기 시작
          const endpoint = `/sample/posts/${params?.postTsid}`
          const initialData = await sendHttpRequest('GET', endpoint, null, true)
          // 잘못된 postTsid로 접근했을 경우 목록 화면으로 리다이렉션
          if (
            initialData.resultType === 'error' &&
            initialData.status === 404
          ) {
            alert(initialData.message)
            router.push(`/sample/post/list${qString}`)
          } else {
            setData(initialData.data)
            // const fileA: FileInfo[] = initialData.data.files.filter(
            //   (file) => file.fileClsfNm === 'A',
            // )
            // const fileB: FileInfo[] = initialData.data.files.filter(
            //   (file) => file.fileClsfNm === 'B',
            // )
            // setBackupFilesA(fileA) // 서버에 저장된 파일 목록 저장
            // setBackupFilesB(fileB) // 서버에 저장된 파일 목록 저장
            // 기존 Post Data 불러오기 끝
          }
          // 기존 Post File 불러오기 끝
        } catch (error) {
          const errorMessage = getMessage(`${pageInfo.messageType}.error`)
          setMessage(errorMessage)
        } finally {
          setIsLoading(false) // 데이터 로드 완료 후 로딩 상태 false
        }
      }
    }

    // 초기 로딩 함수 호출
    loadInitalData()
  }, [])

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

  const compareFiles = (
    newFiles: File[], // 새 파일 배열
    existingFiles: FileInfo[], // 기존 파일 배열
  ): File[] => {
    // 기존 파일의 식별자를 Set으로 변환
    const existingFileIdentifiers = new Set(
      existingFiles.map((file) => `${file.fileNm}-${file.fileSize}`),
    )

    // 새 파일 배열에서 기존 파일과 중복된 파일을 필터링
    const uniqueFiles = newFiles.filter((file: File) => {
      const identifier: string = `${file.name}-${file.size}`
      return !existingFileIdentifiers.has(identifier)
    })

    return uniqueFiles
  }

  // 파일 변경 이벤트 핸들러
  const handleFilesChange = (newFiles: File[], fileClsfNm: string) => {
    if (fileClsfNm === 'A') {
      setFileObjectsA(newFiles)
    } else if (fileClsfNm === 'B') {
      setFileObjectsB(newFiles)
    }
  }

  // 게시글 입력을 반영하는 이벤트 핸들러
  const handleInputChange = (field: string, value: string) => {
    setData((prevData) => {
      if (prevData === undefined) {
        // `prevData`가 `undefined`일 때는 기본값을 설정합니다.
        return {
          ttl: '',
          cn: '',
          postTsid: '',
          telgmLen: 0,
          regYmd: '',
          sbmsnYn: '',
          rgtrNm: '',
          files: [],
        }
      } else {
        // `prevData`가 정의되어 있을 때는 기존 상태를 업데이트합니다.
        return {
          ...prevData,
          [field]: value,
        }
      }
    })
  }

  // 삭제된 파일 관리 이벤트 핸들러
  const handleFileDelete = (fileTsid: string) => {
    setDeletedFileList((prev) => {
      if (prev.includes(fileTsid)) {
        // 이미 삭제 상태인 경우 파일 삭제 배열에서 제거
        return prev.filter((tsid) => tsid !== fileTsid)
      } else {
        // 삭제 상태가 아닌 경우 파일 삭제 배열에 추가
        return [...prev, fileTsid]
      }
    })
  }

  // 임시저장 이벤트 핸들러
  const onTempSaveSubmit = async (formData: FormData) => {
    if (!isSubmitting) {
      const inProgressMessage = getMessage(`${pageInfo.messageType}.inProgress`)

      setMessage(inProgressMessage)
    }

    if (formRef.current) {
      const endpoint = `/sample/posts/${params?.postTsid}`
      const telgmLen = data?.telgmLen ?? 10 // data.telgmLen가 undefined일 경우 10을 기본값으로 설정
      formData.append('telgmLen', telgmLen.toString()) // number를 string으로 변환
      // 중복 필터링 시작
      // 같은 배열 안에서 중복 필터링
      let uniqueFilesA: File[] = filterDuplicateFiles(fileObjectsA, seenFilesA)
      let uniqueFilesB: File[] = filterDuplicateFiles(fileObjectsB, seenFilesB)
      // 기존 파일과 중복 필터링
      uniqueFilesA = compareFiles(uniqueFilesA, backupFilesA)
      uniqueFilesB = compareFiles(uniqueFilesB, backupFilesB)
      // 중복 필터링 끝

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

      // FormData에 삭제된 파일 TSID 추가 시작
      deletedFileList.forEach((deletedFileTsid, index) => {
        formData.append(
          `fileReqstDtos[0].delFileTsids[${index}]`,
          deletedFileTsid,
        )
      })
      // FormData에 삭제된 파일 TSID 추가 끝

      try {
        // Post 임시저장 시작
        const postResponseData: ApiResponse = await sendFormDataWithJwt(
          'PUT',
          endpoint,
          formData,
          true,
        )
        setMessage({
          resultType: postResponseData.resultType,
          status: postResponseData.status,
          message: postResponseData.message,
        })
        setFileObjectsA([]) // 첨부파일 A 파일 객체 배열 초기화
        setFileObjectsB([]) // 첨부파일 B 파일 객체 배열 초기화
        setDeletedFileList([]) // 삭제된 파일 목록 초기화
        router.push(
          `/sample/post/view/${postResponseData.data.postTsid}${qString}`,
        )
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
    if (!isSubmitting) {
      const inProgressMessage = getMessage(`${pageInfo.messageType}.inProgress`)

      setMessage(inProgressMessage)
    }

    // 제출 여부가 N인 경우에만 제출 가능
    if (formRef.current && data?.sbmsnYn === 'N') {
      // Post의 Header, Body 준비
      let endpoint = `/sample/posts/submit/${params?.postTsid}`
      const telgmLen = data?.telgmLen ?? 10 // data.telgmLen가 undefined일 경우 10을 기본값으로 설정
      formData.append('telgmLen', telgmLen.toString()) // number를 string으로 변환
      // 중복 필터링 시작
      // 같은 배열 안에서 중복 필터링
      let uniqueFilesA: File[] = filterDuplicateFiles(fileObjectsA, seenFilesA)
      let uniqueFilesB: File[] = filterDuplicateFiles(fileObjectsB, seenFilesB)
      // 기존 파일과 중복 필터링
      uniqueFilesA = compareFiles(uniqueFilesA, backupFilesA)
      uniqueFilesB = compareFiles(uniqueFilesB, backupFilesB)
      // 중복 필터링 끝

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

      // FormData에 삭제된 파일 TSID 추가 시작
      deletedFileList.forEach((deletedFileTsid, index) => {
        formData.append(
          `fileReqstDtos[0].delFileTsids[${index}]`,
          deletedFileTsid,
        )
      })
      // FormData에 삭제된 파일 TSID 추가 끝

      try {
        // Post 제출 시작
        const postResponseData = await sendFormDataWithJwt(
          'PUT',
          endpoint,
          formData,
          true,
        )
        setMessage({
          resultType: postResponseData.resultType,
          status: postResponseData.status,
          message: postResponseData.message,
        })
        setFileObjectsA([]) // 첨부파일 A 파일 객체 배열 초기화
        setFileObjectsB([]) // 첨부파일 B 파일 객체 배열 초기화
        setDeletedFileList([]) // 삭제된 파일 목록 초기화
        router.push(
          `/sample/post/view/${postResponseData.data.postTsid}${qString}`,
        )
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
    router.push(`/sample/post/view/${params?.postTsid}${qString}`)
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

  // 삭제 버튼 이벤트 핸들러
  const deleteBtnHandler = async () => {
    if (confirm('삭제하시겠습니까?')) {
      try {
        // Post 삭제 시작
        const endpoint = `/sample/posts/${params?.postTsid}`
        const deleteTempPostResponseData: ApiResponse = await sendHttpRequest(
          'DELETE',
          endpoint,
          null,
          true,
        )
        setMessage({
          resultType: deleteTempPostResponseData.resultType,
          status: deleteTempPostResponseData.status,
          message: deleteTempPostResponseData.message,
        })
        router.push(`/sample/post/list${qString}`)
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
    }
  }

  if (isLoading) {
    return <></>
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
                  {'제목 '}
                  {data?.sbmsnYn === 'N' && (
                    <span className="required-text">*</span>
                  )}
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
                  // 오버라이드하여 defaultValue를 무시하고 value를 사용
                  {...{
                    ...getInputProps(
                      fieldConfig.find((field) => field.name === 'ttl')!,
                    ),
                    defaultValue: undefined, // defaultValue 제거
                    value: data?.ttl ?? '',
                    onChange: (e: React.ChangeEvent<HTMLFormElement>) =>
                      handleInputChange('ttl', e.target.value),
                  }}
                  inputProps={{
                    readOnly: data?.sbmsnYn === 'Y' ? true : undefined,
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
                  htmlFor="cn"
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
                  fullWidth
                  helperText={errors.cn}
                  error={!!errors.cn}
                  // 오버라이드하여 defaultValue를 무시하고 value를 사용
                  {...{
                    ...getInputProps(
                      fieldConfig.find((field) => field.name === 'cn')!,
                    ),
                    defaultValue: undefined, // defaultValue 제거
                    value: data?.cn ?? '',
                    onChange: (e: React.ChangeEvent<HTMLFormElement>) =>
                      handleInputChange('cn', e.target.value),
                  }}
                  inputProps={{
                    readOnly: data?.sbmsnYn === 'Y' ? true : undefined,
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
                <div className="file-dropzone-wrapper">
                  <DropzoneArea
                    key="fileA"
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
                    fileObjects={fileObjectsA} // 파일 정보를 관리할 파일 객체 배열 state
                    onChange={(newFileObjects: File[]) =>
                      handleFilesChange(newFileObjects, 'A')
                    }
                  />
                </div>
                <p>허용되는 파일 형식: {acceptedFileExtensions.join(', ')}</p>
              </Grid>
              {backupFilesA.length > 0 ? (
                <>
                  <Grid
                    item
                    xs={12}
                    sm={3}
                    display="flex"
                    alignItems="center"
                  />
                  <Grid item xs={12} sm={9} display="flex" alignItems="center">
                    <div className="form-list">
                      {backupFilesA.map((file) => {
                        // 파일 크기를 MB로 변환
                        const fileSizeInMB = file.fileSize / 1024 / 1024
                        // 소수점 2자리까지 반올림 처리
                        const roundedFileSizeInMB =
                          Math.round(fileSizeInMB * 100) / 100
                        // 해당 파일의 삭제 상태 찾기
                        const fileDeleteState = deletedFileList.includes(
                          file.fileTsid,
                        )

                        return (
                          <div key={file.fileTsid} className="form-inline">
                            <div className="form-group">
                              <Typography
                                gutterBottom
                                variant="h6"
                                fontWeight={600}
                                color="inherit"
                                sx={{
                                  textDecoration: fileDeleteState
                                    ? 'line-through'
                                    : 'none',
                                }}
                              >
                                {`${file.fileNm} (${roundedFileSizeInMB} MB)`}
                              </Typography>
                            </div>
                            <div className="input-group">
                              <Button
                                type="button"
                                variant="contained"
                                color={fileDeleteState ? 'success' : 'error'}
                                onClick={() => handleFileDelete(file.fileTsid)}
                              >
                                {fileDeleteState ? '삭제취소' : '파일삭제'}
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </Grid>
                </>
              ) : null}
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
                <div className="file-dropzone-wrapper">
                  <DropzoneArea
                    key="fileB"
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
                    fileObjects={fileObjectsB} // 파일 정보를 관리할 파일 객체 배열 state
                    onChange={(newFileObjects) =>
                      handleFilesChange(newFileObjects, 'B')
                    }
                  />
                </div>
                <p>허용되는 파일 형식: {acceptedFileExtensions.join(', ')}</p>
              </Grid>
              {backupFilesB.length > 0 ? (
                <>
                  <Grid
                    item
                    xs={12}
                    sm={3}
                    display="flex"
                    alignItems="center"
                  />
                  <Grid item xs={12} sm={9} display="flex" alignItems="center">
                    <div className="form-list">
                      {backupFilesB.map((file) => {
                        // 파일 크기를 MB로 변환
                        const fileSizeInMB = file.fileSize / 1024 / 1024
                        // 소수점 2자리까지 반올림 처리
                        const roundedFileSizeInMB =
                          Math.round(fileSizeInMB * 100) / 100
                        // 해당 파일의 삭제 상태 찾기
                        const fileDeleteState = deletedFileList.includes(
                          file.fileTsid,
                        )
                        return (
                          <div key={file.fileTsid} className="form-inline">
                            <div className="form-group">
                              <Typography
                                gutterBottom
                                variant="h6"
                                fontWeight={600}
                                color="inherit"
                                sx={{
                                  textDecoration: fileDeleteState
                                    ? 'line-through'
                                    : 'none',
                                }}
                              >
                                {`${file.fileNm} (${roundedFileSizeInMB} MB)`}
                              </Typography>
                            </div>
                            <div className="input-group">
                              <Button
                                type="button"
                                variant="contained"
                                color={fileDeleteState ? 'success' : 'error'}
                                onClick={() => handleFileDelete(file.fileTsid)}
                              >
                                {fileDeleteState ? '삭제취소' : '파일삭제'}
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </Grid>
                </>
              ) : null}
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
                <Typography key="author" variant="subtitle1" fontWeight={600}>
                  {data?.rgtrNm}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </BlankCard>
        {/* 컨텐츠 설명 시작*/}
        <ContentsExplanation
          textEx={
            data?.sbmsnYn === 'N'
              ? ContentsExplanationText
              : ContentsExplanationRejectText
          }
          className="required-text"
        />
        {/* 컨텐츠 설명 끝*/}
        {/* 등록, 취소 버튼 시작 */}
        <Box className="table-bottom-button-group">
          <div className="button-right-align">
            {data?.sbmsnYn === 'N' && (
              <>
                {/* 삭제 버튼 시작 */}
                <Button
                  variant="contained"
                  color="red"
                  onClick={deleteBtnHandler}
                >
                  삭제
                </Button>
                {/* 삭제 버튼 끝 */}
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
              </>
            )}
            {/* 취소 버튼 시작 */}
            <Button
              variant="contained"
              color="dark"
              disabled={isSubmitting}
              type="button"
              onClick={handleCancleClick}
            >
              {isSubmitting ? '저장중...' : '취소'}
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

export default UpdatePage
