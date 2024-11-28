'use client'

import { CustomFormLabel, CustomRadio, CustomSelect, CustomTextField } from "@/utils/fsms/fsm/mui-imports";
import { Button, Dialog, DialogContent, Box, FormControlLabel, MenuItem, RadioGroup, Table, TableBody, TableCell, TableRow, DialogProps, Grid, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { SelectItem } from "select";
import { sendHttpRequest } from "@/utils/fsms/common/apiUtils";
import { Row } from "./FreightPage";
import { TrVhclModal } from "@/app/components/popup/TrVhclModal";
import { HeadCell } from "table";
import TableDataGrid from "@/app/components/tables/CommDataGrid";
import UserAuthContext from "@/app/components/context/UserAuthContext";
import BuTrRegisModal from "./BuTrRegisModal";



// 목록 조회시 필요한 조건
type listSearchObj = {

    [key: string]: string | number // 인덱스 시그니처 추가
}

const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const dd = String(today.getDate()).padStart(2, '0');
    
    return `${yyyy}-${mm}-${dd}`;
};


//차량 조회용 
interface RowTrnsfrn {
    locgovCd?: string; // 시도+관할관청코드
    vonrNm?: string; // 차주성명
    vhclNo?: string; // 차량번호
    koiCd?: string; // 유종코드
    koiCdNm?: string; // 유종
    vhclTonCd?: string; // 톤수코드
    vhclTonCdNm?: string; // 톤수
    CRNO?: string; // 법인등록번호(원본)
    crnoS?: string; // 법인등록번호(복호화)
    vonrRrno?: string; // 주민등록번호(원본)
    vonrRrnoS?: string; // 주민등록번호(복호화)
    vonrRrnoSecure?: string; // 주민등록번호(별표)
    lcnsTpbizCd?: string; // 업종코드
    vhclSeCd?: string; // 차량구분코드
    vhclRegYmd?: string; // 차량등록일자
    YRIDNW?: string; // 연식
    LEN?: string; // 길이
    BT?: string; // 너비
    maxLoadQty?: string; // 최대적재수량
    vhclSttsCd?: string; // 차량상태코드
    vonrBrno?: string; // 차주사업자등록번호
    vhclPsnCd?: string; // 차량소유코드
    delYn?: string; // 삭제여부
    dscntYn?: string; // 할인여부
    souSourcSeCd?: string; // 원천소스구분코드
    bscInfoChgYn?: string; // 기본정보변경여부
    locgovAprvYn?: string; // 지자체승인여부
    rgtrId?: string; // 등록자아이디
    regDt?: string; // 등록일시
    mdfrId?: string; // 수정자아이디
    mdfcnDt?: string; // 수정일시
    locgovNm?: string; // 관할관청명
    prcsSttsCd?: string; // 처리상태코드

    prcsYmd?: string; // 추후에 추가 될 수 있음.
}


interface FormModalProps {
    size?: DialogProps['maxWidth'] | 'lg';
    buttonLabel?: string;
    title: string;
    isOpen: boolean
    setOpen: (isOpen: boolean) => void;
}

export default function FormModal(props : FormModalProps) {
    const { buttonLabel, title, size, isOpen, setOpen} = props;
    const [selectedRowTrnsfrn, setSelectedRowTrnsfrn] = useState<RowTrnsfrn>()

    // const [params, setParams] = useState<listSearchObj>({
    // });

    const {authInfo} = useContext(UserAuthContext);
    const [radio, setRadio] = useState<string>();
    const [showNextModal, setShowNextModal] = useState<boolean>(false);
    // 
    const [showSearchModal, setShowSearchModal] = useState<boolean>(false);



    const handleClickOpen = () => {
        setOpen(true);
    };


    //모든 모달 닫힘.
    const handleClose = () => {
        setOpen(false);
        setShowNextModal(false); // Close the secondary modal as well when the main modal is closed
        setShowSearchModal(false);
    };


    // 창을 선택하는 라디오 동작
    const handleRadio = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target
        setRadio(value);
    }

    // 다음 모달 오픈
    const handleNextButtonClick = () => {
        setShowNextModal(true);
    };

    // 관할관청 전입 단건등록에서 차량 선택 
    const handleShowSearchModal = () => {
        setShowSearchModal(true);
    }


    //창을 닫을 때 선택된 요소도 undefined로 초기화
    const handleCloseandReset = () => {
        setSelectedRowTrnsfrn(undefined)
        handleClose()
    }




    
    // 행 클릭 시 호출되는 함수
    const handleRowClick = (selectedRowTrnsfrn: RowTrnsfrn) => {
        console.log('행 클릭시 호출되는 함수 selectRowTrnsfrn ',selectedRowTrnsfrn)
        setSelectedRowTrnsfrn(selectedRowTrnsfrn);  
    }

    // 저장 버튼 클릭시 호출되는 함수.  
    //vhclNo
    //exsLocgovCd
    //chgLocgovCd

    const createTrnsfrnRequ = async () => {
        try {
            let endpoint: string =  `/fsm/stn/lttm/tr/createLgovTrnsfrnRequst`;

            const exsLocgovCd = 'locgovCd' in authInfo && authInfo.locgovCd ?  authInfo?.locgovCd  :''  //전입관청
            const chgLocgovCd = selectedRowTrnsfrn?.locgovCd as string                                 //전출관청
            const vhclNo = selectedRowTrnsfrn?.vhclNo as string

            if(!(exsLocgovCd && exsLocgovCd !== '' &&  chgLocgovCd && chgLocgovCd !== '' && vhclNo && vhclNo != '')){
                alert('저장하려면 필수 전달 값을 빼먹으면 안 됩니다.');
                return 
            }
            let body = {
                exsLocgovCd: exsLocgovCd,
                chgLocgovCd: chgLocgovCd,
                vhclNo: vhclNo,
            }
            
            const userConfirm: boolean = confirm("화물 차량 전입등록을 하시겠습니까?");

            if(userConfirm) {
            const response = await sendHttpRequest('POST', endpoint, body, true, {
                cache: 'no-store'
            })
        
            if (response && response.resultType === 'success' && response.data) {
                setOpen(false);
                alert("보조금계좌정보가 등록되었습니다.");
            }
            } else {
            return ;
            }
        } catch(error) {
            console.error("Error Post Data : ", error);
        }
    }




    const handleStore = () => {
        // 전입 관청  (사용자의 관청)
        console.log('handleStore 메서드를 실행함')
        createTrnsfrnRequ()
    }

    return (
        <React.Fragment>
        { buttonLabel ?  
        <Button variant="outlined" onClick={handleClickOpen}>
            {buttonLabel}
        </Button> : ''
        }
        <Dialog
            fullWidth={false}
            maxWidth={size}
            open={isOpen}
            onClose={handleClose}
        >
            <DialogContent>
                <Box className='table-bottom-button-group'>
                    <CustomFormLabel className="input-label-display">
                    <h2>등록방법 선택</h2>
                    </CustomFormLabel>
                    <div className="button-right-align">
                        <Button variant="contained" type="button" color="primary" onClick={handleNextButtonClick}>
                            다음
                        </Button>
                        <Button onClick={handleClose}>
                            닫기
                        </Button>
                    </div>
                </Box>
                <Box
                    sx={{
                    border: "1px solid #d3d3d3",
                    borderRadius: "8px",
                    padding: "16px",
                    marginTop: "16px",
                    }}
                >
                    <div className="form-group" style={{ width: "inherit" }}>
                        <RadioGroup
                            name="useYn"
                            onChange={handleRadio}
                            value={radio} // 상태 변수를 value로 설정
                            className="mui-custom-radio-group"
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                    value="A"
                                    control={<CustomRadio />}
                                    label="관할관청 전입 단건등록"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                    value="B"
                                    control={<CustomRadio />}
                                    label="관할관청 전입 일괄등록"
                                    />
                                </Grid>
                            </Grid>
                        </RadioGroup>
                    </div>
                </Box>
            </DialogContent>
        </Dialog>


        {/*라디오 선택하고 다음 눌렀을 때 나오는 Dialog !!*/}
        <Dialog 
            fullWidth={true} // 모달을 전체 너비로 설정
            maxWidth="lg" // 두 번째 모달은 더 큰 크기로 설정
            open={showNextModal} 
            onClose={handleClose}>
            <DialogContent>
            <Box>
                {radio === "A" ? (
                    <div className="table-scrollable">
                    <Box className='table-bottom-button-group'>
                        <CustomFormLabel className="input-label-display">
                        <h2>전입방법</h2>
                        </CustomFormLabel>
                        <div className="button-right-align">
                            <Button variant="contained" type="button" color="primary" onClick={() => handleStore()}>
                                저장
                            </Button>
                            <Button onClick={handleCloseandReset}>
                                닫기
                            </Button>
                        </div>
                    </Box>

                    <table className="table table-bordered">
                    <caption>상세 내용 시작</caption>
                    <colgroup>
                        <col style={{ width: '100px' }} />
                        <col style={{ width: 'auto' }} />
                        <col style={{ width: '100px' }} />
                        <col style={{ width: 'auto' }} />
                        <col style={{ width: '100px' }} />
                        <col style={{ width: 'auto' }} />
                    </colgroup>
                    <tbody>
                    <tr>
                        <th className="td-head" scope="row">
                        차량번호
                        </th>
                        <td>{selectedRowTrnsfrn?.vhclNo ? (
                                selectedRowTrnsfrn.vhclNo
                            ) : (
                                ''
                            )}
                        <TrVhclModal 
                            buttonLabel={'선택'}  
                            title={'차량번호 조회'}  
                            url={'/fsm/stn/lttm/tr/getUserVhcle'} 
                            onRowClick={handleRowClick}>
                        </TrVhclModal>
                        </td>
                        <th className="td-head" scope="row">
                            관할관청
                        </th>
                        <td>{selectedRowTrnsfrn?.locgovNm
                            ? (
                                selectedRowTrnsfrn.locgovNm
                            ) : (
                                ''
                            )}
                        </td>
                        <th className="td-head" scope="row">
                        소유자명
                        </th>
                        <td>{selectedRowTrnsfrn?.vonrNm
                            ? (
                                selectedRowTrnsfrn.vonrNm
                            ) : (
                                ''
                            )}
                        </td>
                        <th className="td-head" scope="row">
                        주민등록번호
                        </th>
                        <td>{selectedRowTrnsfrn?.vonrRrno
                            ? (
                                selectedRowTrnsfrn.vonrRrno
                            ) : (
                                ''
                            )}
                        </td>
                        </tr>
                        <tr>
                        <th className="td-head" scope="row">
                        사업자등록번호 
                        </th>
                        <td>{selectedRowTrnsfrn?.vonrBrno
                            ? (
                                selectedRowTrnsfrn.vonrBrno
                            ) : (
                                ''
                            )}
                        </td>
                        <th className="td-head" scope="row">
                        유종
                        </th>
                        <td>{selectedRowTrnsfrn?.koiCdNm
                            ? (
                                selectedRowTrnsfrn.koiCdNm
                            ) : (
                                ''
                            )}
                        </td>
                        <th className="td-head" scope="row">
                        톤수
                        </th>
                        <td>{selectedRowTrnsfrn?.vhclTonCdNm
                            ? (
                                selectedRowTrnsfrn.vhclTonCdNm
                            ) : (
                                ''
                            )}
                        </td>
                        <th className="td-head" scope="row">
                        면허업종
                        </th>
                        <td>{selectedRowTrnsfrn?.lcnsTpbizCd
                            ? (
                                selectedRowTrnsfrn.lcnsTpbizCd
                            ) : (
                                ''
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th className="td-head" scope="row">
                        최종차량상태
                        </th>
                        <td>{selectedRowTrnsfrn?.vhclSttsCd
                            ? (
                                selectedRowTrnsfrn.vhclSttsCd
                            ) : (
                                ''
                            )}
                        </td>
                        <th className="td-head" scope="row">
                        차량소유구분
                        </th>
                        <td>{selectedRowTrnsfrn?.vhclPsnCd
                            ? (
                                selectedRowTrnsfrn.vhclPsnCd
                            ) : (
                                ''
                            )}
                        </td>
                        <th className="td-head" scope="row">
                        업체명
                        </th>
                        <td>{selectedRowTrnsfrn?.vonrNm
                            ? (
                                selectedRowTrnsfrn.vonrNm
                            ) : (
                                ''
                            )}
                        </td>
                        <th className="td-head" scope="row">

                        </th>
                        <td>{ ''}</td>
                        </tr>
                        <tr>
                        <th className="td-head" scope="row">
                        요청일자 
                        </th>
                        <td>
                        {getTodayDate()}
                        </td>
                        <th className="td-head" scope="row">
                        전출관청
                        </th>
                        <td>{selectedRowTrnsfrn?.locgovNm
                            ? (
                                selectedRowTrnsfrn.locgovNm
                            ) : (
                                ''
                            )}
                        </td>
                        <th className="td-head" scope="row">
                        전입관청
                        </th>
                        <td>
                        {'locgovCd' in authInfo && authInfo.locgovCd ?  authInfo?.locgovCd  :''} 
                            {/* 추후에 세션을 통해서 가져올 예정! */}
                        </td>
                        <th className="td-head" scope="row">
                        </th>
                        <td>
                            { ''}
                        </td>
                    </tr>
                    </tbody>
                    </table>
                </div>
                ) : (
                    <div className="table-scrollable">
                        <BuTrRegisModal handleClose={handleClose} />
                        
                    </div>
                
                )}
                <div className="button-right-align" style={{ marginTop: "16px" }}>
                {/* <Button onClick={handleClose}>닫기</Button> */}
                </div>
            </Box>
            </DialogContent>
        </Dialog>


        </React.Fragment>
    );
}