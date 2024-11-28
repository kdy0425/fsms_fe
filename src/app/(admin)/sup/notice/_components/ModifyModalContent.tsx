import React, { useContext, useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControlLabel,
    MenuItem,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from '@mui/material';
import { CustomFormLabel, CustomRadio, CustomSelect, CustomTextField } from '@/utils/fsms/fsm/mui-imports';
import { CustomFile, Row } from '../page';
import { SelectItem } from 'select';
import { getCodesByGroupNm } from '@/utils/fsms/common/code/getCode';
import UserAuthContext from '@/app/components/context/UserAuthContext';
import { sendHttpRequest } from '@/utils/fsms/common/apiUtils';
import { getDateTimeString } from '@/utils/fsms/common/util';
export interface ModalFormProps {
    isEditMode: boolean;
    formData: Row;
    onFormDataChange: (name: string, value: string) => void;
    onFileChange: (files: File[]) => void;
    onFileDown: (file: CustomFile) => void;
    onFileDelete: (file: CustomFile) => Promise<boolean>
}

// export interface File {
//     atchSn?: string;  //첨부일련번호
//     bbscttSn?: string; //게시글일련번호
//     fileSize?: string; //파일용량
//     lgcFileNm?: string; //논리파일명
//     mdfcnDt?: string; //수정일시
//     mdfrId?: string; //수정자아이디
//     physFileNm?: string; // 물리파일명
//     regDt?: string; // 등록일시
//     rgtrId?: string;  // 등록자아이디
// }
const ModifyModalContent: React.FC<ModalFormProps> = ({
    isEditMode,
    formData,
    onFormDataChange,
    onFileChange,
    onFileDown,
    onFileDelete
}) => {
    const [leadCnCode, setNotiCode] = useState<SelectItem[]>([]);
    const [relateTaskSeCode, setWorkCode] = useState<SelectItem[]>([]);
    const [existingFiles, setExistingFiles] = useState<CustomFile[]>(formData.fileList || []);
    const [newFiles, setNewFiles] = useState<File[]>([]);

    useEffect(() => {
        const fetchCodes = async () => {
            const noti: SelectItem[] = [];
            const work: SelectItem[] = [];
            const notiRes = await getCodesByGroupNm('112');
            const workRes = await getCodesByGroupNm('117');
            notiRes?.forEach((code: any) => noti.push({ label: code['cdKornNm'], value: code['cdNm'] }));
            workRes?.forEach((code: any) => work.push({ label: code['cdKornNm'], value: code['cdNm'] }));
            setNotiCode(noti);
            setWorkCode(work);
        };
        fetchCodes();
    }, []);

    const handleParamChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!isEditMode) return;
        const { name, value } = event.target;
        onFormDataChange(name, value);
    };
   // 신규 파일 삭제 핸들러
    const handleFileRemove = (index: number) => {
        const updatedFiles = newFiles.filter((_, i) => i !== index);
        setNewFiles(updatedFiles);
        onFileChange(updatedFiles); // 부모로 업데이트된 파일 목록 전달
    };
    const handleDeleteFile = async (file: CustomFile) => {
        const isDeleted = await onFileDelete(file); // 삭제 결과를 boolean으로 받음
        if (isDeleted) {
            setExistingFiles((prevFiles) =>
                prevFiles.filter((existingFile) => existingFile.atchSn !== file.atchSn)
            );
            alert('파일이 성공적으로 삭제되었습니다.');
        } else {
            alert('파일 삭제에 실패했습니다.');
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isEditMode) return;
        const files = event.target.files;
        if (files) {
            const fileArray = Array.from(files);
            // Validate file size (10MB) and count (3 files maximum)
            const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
            const MAX_FILES = 3;
            const validFiles = fileArray.filter((file) => {
                if (file.size > MAX_FILE_SIZE) {
                    alert(`${file.name} 파일이 10MB를 초과하여 업로드할 수 없습니다.`);
                    return false;
                }
                return true;
            });
            if (validFiles.length + newFiles.length > MAX_FILES) {
                alert(`첨부파일은 최대 ${MAX_FILES}개까지만 등록 가능합니다.`);
                return;
            }
            const updatedFiles = [...newFiles, ...validFiles];
            setNewFiles(updatedFiles);
            onFileChange(updatedFiles); // 부모로 파일 전달
        }
    };

    return (
        <Box sx={{ maxWidth: 'fullWidth', margin: '0 auto' }}>
            <TableContainer style={{ margin: '16px 0 4em 0' }}>
                <Table aria-labelledby="tableTitle" style={{ tableLayout: 'fixed', width: '100%' }}>
                    <TableBody>
                        <TableRow>
                            <TableCell style={{ width: '150px', verticalAlign: 'middle' }}>
                            {isEditMode ? <span className="required-text" >*</span> : null}공지구분
                            </TableCell>
                            <TableCell style={{ width: 'calc(50% - 150px)', textAlign: 'left' }}>
                            {!isEditMode ?
                                leadCnCode.find((option) => option.value === formData.leadCnCd)?.label || '-' // label 값 표시
                                    : 
                                    <CustomSelect
                                    id="modal-select-comCdYn"
                                    name="leadCnCd"
                                    value={formData.leadCnCd ?? ''}
                                    onChange={handleParamChange}
                                    variant="outlined"
                                    disabled={!isEditMode} // 수정 모드가 아니면 비활성화
                                    fullWidth
                                >
                                    {leadCnCode.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </CustomSelect>
                                    
                                    }
                            </TableCell>
                            <TableCell style={{ width: '150px', verticalAlign: 'middle' }}>
                            {isEditMode ? <span className="required-text" >*</span> : null}업무구분
                            </TableCell>
                            <TableCell style={{ width: 'calc(50% - 150px)', textAlign: 'left' }}>

                            {!isEditMode ? 
                             relateTaskSeCode.find((option) => option.value === formData.relateTaskSeCd)?.label || '-' // label 값 표시
                                :
                                <CustomSelect
                                    id="modal-select-comCdYn"
                                    name="relateTaskSeCd"
                                    value={formData.relateTaskSeCd ?? ''}
                                    onChange={handleParamChange}
                                    variant="outlined"
                                    disabled={!isEditMode} // 수정 모드가 아니면 비활성화
                                    fullWidth
                                >
                                    {relateTaskSeCode.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </CustomSelect>
                                }
                            </TableCell>
                        </TableRow>
                        {isEditMode ?  
                        <TableRow>
                            <TableCell style={{ width: '150px', verticalAlign: 'middle' }}>
                            {isEditMode ? <span className="required-text" >*</span> : null}팝업여부
                            </TableCell>
                            <TableCell colSpan={3} style={{ textAlign: 'left' }}>
                                <Box display="flex" alignItems="center">
                                    <RadioGroup
                                                row
                                                id="modal-radio-useYn"
                                                name="popupNtcYn"
                                                value={formData.popupNtcYn}
                                                onChange={handleParamChange}
                                                className="mui-custom-radio-group"
                                                style={{ marginRight: '16px' }}
                                            >
                                            <FormControlLabel
                                                control={<CustomRadio id="chk_Y" name="popupNtcYn" value="Y" />}
                                                label="사용"
                                            />
                                            <FormControlLabel
                                                control={<CustomRadio id="chk_N" name="popupNtcYn" value="N" />}
                                                label="미사용"
                                            />
                                    </RadioGroup>
                                    {/* 팝업 기간 */}
                                    {formData.popupNtcYn === 'Y' && (
                                    <Box display="flex" alignItems="center">
                                        <CustomTextField
                                            type="date"
                                            id="ft-date-start"
                                            name="popupBgngYmd"
                                            value={getDateTimeString(formData.popupBgngYmd as string,'date')?.dateString ?? ''}
                                            onChange={handleParamChange}
                                            disabled={!isEditMode}
                                            style={{ marginRight: '8px' }}
                                            />
                                        ~
                                        <CustomTextField
                                            type="date"
                                            id="ft-date-end"
                                            name="popupEndYmd"
                                            value={getDateTimeString(formData.popupEndYmd  as string,'date')?.dateString ?? ''}
                                            onChange={handleParamChange}
                                            disabled={!isEditMode}
                                            style={{ marginRight: '8px' }}
                                            />
                                    </Box>
                                    )}
                                </Box>
                        </TableCell>
                        </TableRow>
                        :  null}
                        <TableRow>
                    
                            <TableCell style={{ width: '150px', verticalAlign: 'middle' }}>
                            {isEditMode ? <span className="required-text" >*</span> : null}제목
                            </TableCell>
                            
                            <TableCell colSpan={3} style={{ textAlign: 'left' }}>
                            {!isEditMode ?
                                    formData.oriTtl :
                                <CustomTextField
                                    type="text"
                                    id="modal-ttl"
                                    name="oriTtl"
                                    onChange={handleParamChange}
                                    value={formData.oriTtl ?? ''}
                                    disabled={!isEditMode}
                                    fullWidth
                                />
                            }
                            </TableCell>
                       
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ width: '150px', verticalAlign: 'middle' }}>
                            {isEditMode ? <span className="required-text" >*</span> : null}내용
                            </TableCell>
                            <TableCell colSpan={3} style={{ textAlign: 'left' }}>
                            {!isEditMode ? (
                                 <div
                                 style={{
                                     whiteSpace: 'pre-line', // 줄바꿈 유지
                                     width: '100%', // CustomTextField와 동일한 폭
                                     minHeight: '120px', // CustomTextField와 동일한 높이
                                     border: '1px solid #ccc', // 일관된 테두리
                                     borderRadius: '4px', // CustomTextField와 같은 테두리
                                     padding: '8px', // CustomTextField와 같은 내부 여백
                                     boxSizing: 'border-box', // 패딩 포함
                                 }}
                             >
                                    {formData.cn}
                                </div>
                            ) :
                                <CustomTextField
                                    type="text"
                                    id="modal-cn"
                                    name="cn"
                                    onChange={handleParamChange}
                                    value={formData.cn ?? ''}
                                    disabled={!isEditMode}
                                    fullWidth
                                    multiline
                                    rows={20} //  
                                    />
                            }
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>첨부파일</TableCell>
                            <TableCell colSpan={3}>
                                {isEditMode && (
                                    <input
                                        type="file"
                                        name="fileList"
                                        multiple
                                        onChange={handleFileChange}
                                        style={{ display: 'block' }}
                                    />
                                )}
                                <Box sx={{ mt: 1 }}>
                                    {/* 기존 파일 */}
                                    {existingFiles.map((file, index) => (
                                        <Box key={`existing-${index}`} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px', border: '1px solid #ddd', marginBottom: '4px', borderRadius: '4px' }}>
                                            <span>{file.lgcFileNm}</span>
                                            {isEditMode ? (
                                                <Button variant="contained" color="error" size="small" onClick={() => handleDeleteFile(file)}>
                                                    삭제
                                                </Button>
                                            ) : null} 
                                            {!isEditMode ? (
                                                <Button variant="contained" color="primary" size="small" onClick={() => onFileDown(file)}>
                                                    다운로드
                                                </Button>
                                            ) : null} 
                                        </Box>
                                    ))}
                                    {/* 신규 파일 */}
                                    {newFiles.map((file, index) => (
                                        <Box key={`new-${index}`} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px', border: '1px solid #ddd', marginBottom: '4px', borderRadius: '4px' }}>
                                            <span>{file.name}</span>
                                            <Button variant="contained" color="error" size="small" onClick={() => handleFileRemove(index)}>
                                                삭제
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
export default ModifyModalContent;
