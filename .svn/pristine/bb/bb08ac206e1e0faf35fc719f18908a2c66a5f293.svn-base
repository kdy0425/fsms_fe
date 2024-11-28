'use client'

import {
  Box,
  Typography,
  CardContent,
  Button,
  Divider,
  Stack,
  Grid,
} from '@mui/material'
import { CustomFormLabel } from '@/utils/fsms/fsm/mui-imports'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

import Breadcrumb from '@/fsm/layout/shared/breadcrumb/Breadcrumb'
import PageContainer from '@/components/container/PageContainer'
import BlankCard from '@/components/shared/BlankCard'
import { FileList } from '@/components/files/FileList'

// utils
import { toQueryString } from '@/utils/fsms/utils'
import { sendHttpRequest } from '@/utils/fsms/common/apiUtils'

// types
import { PostObj, FetchOneData } from '@/types/fsms/fsm/fetchData'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: '상세조회',
  },
]

type viewParams = {
  params: {
    postTsid: string
  }
  searchParams: object
}

const ReadEX: React.FC<viewParams> = (props: viewParams) => {
  const qString: string = toQueryString(props.searchParams)
  const router = useRouter()

  const postObj: PostObj = {
    url: usePathname(),
    postTsid: props.params.postTsid,
    query: qString,
  }

  //페이지 목록데이터
  const [post, setPost] = useState<FetchOneData>()

  // 서버 액션을 통해 목록 데이터를 가져오는 비동기 작업
  useEffect(() => {
    async function loadPost(): Promise<void> {
      const data = await sendHttpRequest(
        'GET',
        `/sample/posts/${props.params.postTsid}`,
        null,
        true,
        { cache: 'no-store' },
      )
      if (data.resultType === 'error') alert(data.message)
      setPost(data)
    }
    loadPost()
  }, [])

  // 파일 존재 여부 체크
  const aFiles = post?.data?.files.filter((file) => file.fileClsfNm === 'A')
  const bFiles = post?.data?.files.filter((file) => file.fileClsfNm === 'B')

  let fileListElement: JSX.Element = <>로딩중</>
  if (post?.data?.files !== undefined && post?.data.files.length > 0) {
    fileListElement = (
      <>
        <Grid item xs={12} sm={3}>
          <CustomFormLabel
            htmlFor="fileB"
            sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
          >
            첨부파일 A
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9}>
          <div className="form-list">
            {aFiles && aFiles.length > 0 ? (
              post?.data.files.map((file, index) =>
                file.fileClsfNm === 'A' ? (
                  <FileList
                    key={'aGroup' + index}
                    fileInfo={file}
                    downloadUrl={'/sample/posts/files'}
                    imageView={false}
                  />
                ) : null,
              )
            ) : (
              <>-</>
            )}
          </div>
        </Grid>
        <Grid item xs={12} sm={3}>
          <CustomFormLabel
            htmlFor="fileB"
            sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
          >
            첨부파일 B
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9}>
          <div className="form-list">
            {bFiles && bFiles.length > 0 ? (
              post?.data.files.map((file, index) =>
                file.fileClsfNm === 'B' ? (
                  <FileList
                    key={'bGroup' + index}
                    fileInfo={file}
                    downloadUrl={'/sample/posts/files'}
                    imageView={false}
                  />
                ) : null,
              )
            ) : (
              <>-</>
            )}
          </div>
        </Grid>
      </>
    )
  } else {
    fileListElement = (
      <>
        <Grid item xs={12} sm={3}>
          <CustomFormLabel
            htmlFor="fileB"
            sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
          >
            첨부파일 A
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9}>
          -
        </Grid>
        <Grid item xs={12} sm={3}>
          <CustomFormLabel
            htmlFor="fileB"
            sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}
          >
            첨부파일 B
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9}>
          -
        </Grid>
      </>
    )
  }

  return (
    <PageContainer title="POST 상세조회" description="상세조회 페이지 가이드">
      {post ? (
        <>
          {/* breadcrumb */}
          <Breadcrumb title="POST 상세조회" items={BCrumb} />
          {/* end breadcrumb */}

          <BlankCard>
            <CardContent>
              <Box my={3}>
                <Typography
                  gutterBottom
                  variant="h1"
                  fontWeight={600}
                  color="inherit"
                  sx={{ textDecoration: 'none' }}
                >
                  {post.data?.ttl}
                </Typography>
              </Box>
              <Stack direction="row" gap={3} alignItems="center">
                <Stack direction="row" gap={1} alignItems="center">
                  진행상태 | {post.data?.sbmsnYn === 'Y' ? '제출' : '작성중'}
                </Stack>
                <Stack direction="row" gap={1} alignItems="center">
                  작성자 | {post.data?.rgtrNm}
                </Stack>

                <Stack direction="row" ml="auto" alignItems="center">
                  게시날짜 | {post.data?.regYmd}
                </Stack>
              </Stack>
            </CardContent>
            <Divider />
            <CardContent>
            <p style={{ whiteSpace: 'pre-wrap' }}>{post.data?.cn}</p>
            </CardContent>
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                {fileListElement}
              </Grid>
            </CardContent>
          </BlankCard>

          <Box className="table-bottom-button-group">
            <div className="button-right-align">
              {post.data?.sbmsnYn === 'N' ? (
                <Link href={`../update/${props.params.postTsid}${qString}`}>
                  <Button variant="contained" color="primary">
                    수정
                  </Button>
                </Link>
              ) : null}
              <Link href={`../list/${qString}`}>
                <Button variant="contained" color="dark">
                  목록으로 가기
                </Button>
              </Link>
            </div>
          </Box>
        </>
      ) : (
        <></>
      )}
    </PageContainer>
  )
}

export default ReadEX
