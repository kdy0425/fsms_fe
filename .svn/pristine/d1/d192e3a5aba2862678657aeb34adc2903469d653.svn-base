declare module 'table' {
  // id : 속성명
  // numeric : 숫자여부
  // disablePadding : padding 삭제 여부
  // label : 테이블 컬럼명 th 값
  // sortAt : 정렬 기능 on / off
  export interface HeadCell {
    disablePadding: boolean
    id: any
    label: string
    numeric: boolean
    sortAt?: boolean
    format?: string
    align?: string
    color? : boolean
    rowspan? : boolean
    button? : CustomButtonProps
    groupHeader?: boolean | false
    groupId?: string
  }

  export type Pageable = {
    pageNumber: number
    pageSize: number
    sort: string
  }

  export interface ButtonProps {
    label: string
    color: string
    onClick: Function
  }

  export interface CustomButtonProps {
    label: string
    color: "error" | "primary" | "secondary" | "info" | "success" | "warning" | "inherit"
    onClick: Function
  }
}


