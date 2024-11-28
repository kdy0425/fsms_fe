import React, { useState } from "react";
import {
  Button,
  Box,
} from "@mui/material";
import { CustomFormLabel } from "@/utils/fsms/fsm/mui-imports";
import { sendHttpRequest } from "@/utils/fsms/common/apiUtils";
import { getExcelFile, getToday } from "@/utils/fsms/common/comm";
import { Row } from "./FreightPage";

interface BuTrRegisModal {
  handleClose: () => void;
}

export default function BuTrRegisModal(props: BuTrRegisModal) {
    const { handleClose } = props;

    const [downRow, setDownRow] = useState<Row[]>([]); // Change type to Row[]

    const createBatchTrnsfrnRequ = async (rows: Row[]) => {
    try {
        if (!rows || rows.length === 0) {
        alert("저장하려면 데이터가 필요합니다.");
        return;
        }

        const endpoint = `/fsm/stn/lttm/tr/createLgovTrnsfrnRequst`;

        const body = rows.map((row) => ({
        vhclNo: row.vhclNo,
        exsLocgovCd: row.exsLocgovCd,
        chgLocgovCd: row.chgLocgovCd,
        }));

        const userConfirm = confirm("화물 차량 일괄 전입등록을 하시겠습니까?");
        if (!userConfirm) return;

        const response = await sendHttpRequest("POST", endpoint, { list: body }, true, {
        cache: "no-store",
        });

        if (response?.resultType === "success" && response?.data) {
        alert("화물 차량 전입 일괄 등록되었습니다.");
        handleClose();
        } else {
        alert("등록에 실패했습니다. 다시 시도하세요.");
        }
        } catch (error) {
            console.error("Error posting data:", error);
        }
    };

    const excelDownload = async () => {
    const endpoint = `/fsm/stn/lttm/tr/getExcelLgovTrnsfrnSample`;
    getExcelFile(endpoint, `샘플파일_${getToday()}.xlsx`);
    };

    return (
    <>
    <Box className="table-bottom-button-group">
        <CustomFormLabel className="input-label-display">
        <h2>전입일괄등록</h2>
        </CustomFormLabel>
        <div className="button-right-align">
        <Button variant="contained" type="button" color="primary" onClick={excelDownload}>
            샘플파일 다운로드
        </Button>
        <Button variant="contained" type="button" color="primary">
            엑셀 업로드
        </Button>
        <Button
            variant="contained"
            type="button"
            color="primary"
            onClick={() => createBatchTrnsfrnRequ(downRow)}
        >
            저장
        </Button>
        <Button onClick={handleClose}>닫기</Button>
        </div>
        {/* Add table or display for uploaded data */}
        <Box></Box>
    </Box>
    </>
);
}
